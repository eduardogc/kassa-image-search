import { createHash } from 'node:crypto';
import OpenAI from 'openai';
import type { ImageAnalysis } from '../types';
import { DEFAULT_ATTRIBUTE_KEYS } from '../types';
import { getConfig } from '../config';
import { getValidCategories, getValidTypes } from './catalog';

let cachedClient: OpenAI | null = null;
let cachedClientApiKey = '';

function getClient(apiKey: string): OpenAI {
    if (!cachedClient || cachedClientApiKey !== apiKey) {
        cachedClient = new OpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey });
        cachedClientApiKey = apiKey;
    }
    return cachedClient;
}

let cachedSystemPrompt: string | null = null;

export function invalidatePromptCache(): void {
    cachedSystemPrompt = null;
}

function getSystemPrompt(): string {
    if (cachedSystemPrompt) return cachedSystemPrompt;

    const categories = getValidCategories();
    const types = getValidTypes();
    const attrKeys = DEFAULT_ATTRIBUTE_KEYS;

    cachedSystemPrompt = `You are a furniture identification expert. Respond with valid JSON only — no markdown, no explanation.

Categories (use EXACTLY one): ${categories.join(', ')}
Types (use EXACTLY one): ${types.join(', ')}

User Query Override: if the user explicitly mentions an attribute (color, material, style, price), use their value — not the image. For any attribute the user did NOT mention, derive it from the image as normal.
Price constraint (e.g. "under $500") → extract as "maxPrice" number.

JSON schema: {"category":string,"type":string,${attrKeys.map((k) => `"${k}":string`).join(',')},"searchTerms":string[],"confidence":number,"maxPrice":number|null}`;

    return cachedSystemPrompt;
}

const analysisCache = new Map<string, ImageAnalysis>();
const CACHE_MAX_SIZE = 128;

function cacheKey(imageBase64: string, query: string | undefined): string {
    return createHash('sha1').update(imageBase64).update(query ?? '').digest('hex');
}

function storeInCache(key: string, value: ImageAnalysis): void {
    if (analysisCache.size >= CACHE_MAX_SIZE) {
        analysisCache.delete(analysisCache.keys().next().value!);
    }
    analysisCache.set(key, value);
}

export async function analyzeImage(
    imageBase64: string,
    mimeType: string,
    apiKey: string,
    userQuery?: string,
): Promise<ImageAnalysis> {
    const key = cacheKey(imageBase64, userQuery);
    const cached = analysisCache.get(key);
    if (cached) return cached;

    const config = getConfig();
    const client = getClient(apiKey);

    const userMessage = userQuery
        ? `Analyze this furniture image. The user also specified: "${userQuery}". For any attribute the user explicitly mentioned (color, material, style, price), use their value — not the image. For everything else, use what you see in the image.`
        : 'Analyze this furniture image.';

    const response = await client.chat.completions.create({
        model: config.model,
        messages: [
            { role: 'system', content: getSystemPrompt() },
            {
                role: 'user',
                content: [
                    { type: 'text', text: userMessage },
                    { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
                ],
            },
        ],
        temperature: 0.1,
        max_tokens: 200,
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '';
    const jsonStr = raw.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');

    try {
        const parsed = JSON.parse(jsonStr);

        const categories = getValidCategories();
        const types = getValidTypes();

        const attributes: Record<string, string> = {};
        for (const key of DEFAULT_ATTRIBUTE_KEYS) {
            if (parsed[key]) attributes[key] = String(parsed[key]);
        }

        const result: ImageAnalysis = {
            category: String(parsed.category ?? ''),
            type: String(parsed.type ?? ''),
            searchTerms: Array.isArray(parsed.searchTerms) ? parsed.searchTerms : [],
            confidence: Number(parsed.confidence ?? 0),
            attributes,
        };

        if (parsed.maxPrice && typeof parsed.maxPrice === 'number' && parsed.maxPrice > 0) {
            result.maxPrice = parsed.maxPrice;
        }

        if (!categories.includes(result.category)) result.confidence = Math.min(result.confidence, 0.5);
        if (!types.includes(result.type)) result.confidence = Math.min(result.confidence, 0.5);

        storeInCache(key, result);
        return result;
    } catch {
        throw new Error(`Failed to parse AI response: ${raw.slice(0, 200)}`);
    }
}

import OpenAI from 'openai';
import type { ImageAnalysis } from '../types';
import { DEFAULT_ATTRIBUTE_KEYS } from '../types';
import { getConfig } from '../config';
import { getValidCategories, getValidTypes } from './catalog';

/**
 * Build the system prompt dynamically using categories/types from the catalog
 * and the configurable attribute keys.
 */
function buildSystemPrompt(): string {
    const categories = getValidCategories();
    const types = getValidTypes();
    const attrKeys = DEFAULT_ATTRIBUTE_KEYS;

    return `You are a furniture identification expert. Analyze the provided image and extract structured attributes about the furniture item shown.

You MUST respond with valid JSON only — no markdown, no explanation.

Use EXACTLY one of these categories:
${categories.join(', ')}

Use EXACTLY one of these types:
${types.join(', ')}

If the image does not show a recognizable furniture item, set confidence to 0 and use your best guess.

Response schema:
{
  "category": string,     // one of the valid categories above
  "type": string,         // one of the valid types above
${attrKeys.map((k) => `  "${k}": string,`).join('\n')}
  "searchTerms": string[],// 2-4 descriptive search phrases for finding similar items
  "confidence": number    // 0-1, how confident you are this is a furniture item
}`;
}

export async function analyzeImage(
    imageBase64: string,
    mimeType: string,
    apiKey: string,
    userQuery?: string,
): Promise<ImageAnalysis> {
    const config = getConfig();

    const client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey,
    });

    const userMessage = userQuery
        ? `Analyze this furniture image. The user also specified: "${userQuery}". Factor this into your analysis — it may indicate preferences for style, color, material, price range, or specific features.`
        : 'Analyze this furniture image and extract its attributes.';

    const response = await client.chat.completions.create({
        model: config.model,
        messages: [
            { role: 'system', content: buildSystemPrompt() },
            {
                role: 'user',
                content: [
                    { type: 'text', text: userMessage },
                    {
                        type: 'image_url',
                        image_url: { url: `data:${mimeType};base64,${imageBase64}` },
                    },
                ],
            },
        ],
        temperature: 0.1,
        max_tokens: 500,
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '';

    // Strip markdown fences if present
    const jsonStr = raw.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');

    try {
        const parsed = JSON.parse(jsonStr);

        // Extract core fields + collect remaining keys into `attributes`
        const categories = getValidCategories();
        const types = getValidTypes();

        const attributes: Record<string, string> = {};
        for (const key of DEFAULT_ATTRIBUTE_KEYS) {
            if (parsed[key]) {
                attributes[key] = String(parsed[key]);
            }
        }

        const result: ImageAnalysis = {
            category: String(parsed.category ?? ''),
            type: String(parsed.type ?? ''),
            searchTerms: Array.isArray(parsed.searchTerms) ? parsed.searchTerms : [],
            confidence: Number(parsed.confidence ?? 0),
            attributes,
        };

        // Validate category/type against actual catalog values
        if (!categories.includes(result.category)) {
            result.confidence = Math.min(result.confidence, 0.5);
        }
        if (!types.includes(result.type)) {
            result.confidence = Math.min(result.confidence, 0.5);
        }

        return result;
    } catch {
        throw new Error(`Failed to parse AI response: ${raw.slice(0, 200)}`);
    }
}

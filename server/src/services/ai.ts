import OpenAI from 'openai';
import { VALID_CATEGORIES, VALID_TYPES, type ImageAnalysis } from '../types.js';
import { getConfig } from '../config.js';

const SYSTEM_PROMPT = `You are a furniture identification expert. Analyze the provided image and extract structured attributes about the furniture item shown.

You MUST respond with valid JSON only — no markdown, no explanation.

Use EXACTLY one of these categories:
${VALID_CATEGORIES.join(', ')}

Use EXACTLY one of these types:
${VALID_TYPES.join(', ')}

If the image does not show a recognizable furniture item, set confidence to 0 and use your best guess.

Response schema:
{
  "category": string,     // one of the valid categories above
  "type": string,         // one of the valid types above
  "style": string,        // e.g. "mid-century", "scandinavian", "industrial", "modern", "rustic"
  "material": string,     // e.g. "wood", "metal", "leather", "fabric", "glass"
  "color": string,        // primary color
  "searchTerms": string[],// 2-4 descriptive search phrases for finding similar items
  "confidence": number    // 0-1, how confident you are this is a furniture item
}`;

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
            { role: 'system', content: SYSTEM_PROMPT },
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
        const parsed = JSON.parse(jsonStr) as ImageAnalysis;

        // Validate category/type against known values
        if (!VALID_CATEGORIES.includes(parsed.category as typeof VALID_CATEGORIES[number])) {
            parsed.confidence = Math.min(parsed.confidence, 0.5);
        }
        if (!VALID_TYPES.includes(parsed.type as typeof VALID_TYPES[number])) {
            parsed.confidence = Math.min(parsed.confidence, 0.5);
        }

        return parsed;
    } catch {
        throw new Error(`Failed to parse AI response: ${raw.slice(0, 200)}`);
    }
}

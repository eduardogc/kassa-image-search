import type { FastifyInstance } from 'fastify';
import { analyzeImage } from '../services/ai.js';
import { textSearch, categoryTypeSearch, categorySearch } from '../services/catalog.js';
import { rankResults } from '../services/ranker.js';
import { getConfig } from '../config.js';
import type { SearchResponse } from '../types.js';

export async function searchRoutes(app: FastifyInstance): Promise<void> {
    app.post('/api/search', async (request, reply) => {
        const start = Date.now();

        let imageBase64: string | undefined;
        let mimeType = 'image/jpeg';
        let apiKey: string | undefined;
        let query: string | undefined;

        // Collect all parts regardless of order
        for await (const part of request.parts()) {
            if (part.type === 'file' && part.fieldname === 'file') {
                const partToBuffer = await part.toBuffer();
                imageBase64 = partToBuffer.toString('base64');
                mimeType = part.mimetype || mimeType;
            } else if (part.type === 'field') {
                if (part.fieldname === 'apiKey') apiKey = part.value as string;
                if (part.fieldname === 'query') query = part.value as string;
            }
        }

        if (!imageBase64 || imageBase64.length === 0) {
            console.error('Search Route Error: No valid image file was consumed in the multipart payload.', { bytesReceived: imageBase64?.length });
            return reply.status(400).send({ error: 'No valid image data provided in the file field. (If you copied this curl from Chrome, the binary data was omitted!).' });
        }
        if (!apiKey) {
            console.error('Search Route Error: API key was not found in the multipart form fields.');
            return reply.status(400).send({ error: 'API key is required' });
        }

        try {
            // Phase 1: AI analysis
            const analysis = await analyzeImage(imageBase64, mimeType, apiKey, query);

            // Phase 2: Multi-strategy retrieval
            const config = getConfig();
            const fetchLimit = config.maxResults * 3; // over-fetch for ranking

            // Build search terms combining AI analysis + user query
            const searchTerms = [...analysis.searchTerms];
            if (query) searchTerms.push(query);

            // Run queries in parallel
            const [textResults, catTypeResults, catResults] = await Promise.all([
                textSearch(searchTerms, fetchLimit),
                categoryTypeSearch(analysis.category, analysis.type, fetchLimit),
                categorySearch(analysis.category, fetchLimit),
            ]);

            // Phase 3: Rank and merge
            const results = rankResults(textResults, catTypeResults, catResults, analysis, config);
            const totalCandidates = new Set([
                ...textResults.map((r) => r.product._id),
                ...catTypeResults.map((r) => r.product._id),
                ...catResults.map((r) => r.product._id),
            ]).size;

            const response: SearchResponse = {
                results,
                analysis,
                totalCandidates,
                searchTimeMs: Date.now() - start,
            };

            return reply.send(response);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error('Search pipeline error:', message);
            const status = (err as { status?: number }).status ?? 500;
            return reply.status(status).send({ error: message });
        }
    });
}

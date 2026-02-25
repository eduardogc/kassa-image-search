import type { FastifyInstance } from 'fastify';
import { analyzeImage } from '../services/ai';
import { textSearch, categoryTypeSearch, categorySearch } from '../services/catalog';
import { rankResults } from '../services/ranker';
import { getConfig } from '../config';
import type { SearchResponse } from '../types';

export async function searchRoutes(app: FastifyInstance): Promise<void> {
    app.post('/api/search', async (request, reply) => {
        const start = Date.now();

        let imageBase64: string | undefined;
        let mimeType = 'image/jpeg';
        let apiKey: string | undefined;
        let query: string | undefined;

        for await (const part of request.parts()) {
            if (part.type === 'file' && part.fieldname === 'file') {
                const buffer = await part.toBuffer();
                imageBase64 = buffer.toString('base64');
                mimeType = part.mimetype || mimeType;
            } else if (part.type === 'field') {
                if (part.fieldname === 'apiKey') apiKey = part.value as string;
                if (part.fieldname === 'query') query = part.value as string;
            }
        }

        if (!imageBase64 || imageBase64.length === 0) {
            return reply.status(400).send({ error: 'No valid image provided.' });
        }
        if (!apiKey) {
            return reply.status(400).send({ error: 'API key is required.' });
        }

        try {
            const config = getConfig();
            const fetchLimit = config.maxResults * 3;

            // Phase 1: AI analysis — runs first, DB queries depend on its output
            const analysis = await analyzeImage(imageBase64, mimeType, apiKey, query);

            const searchTerms = [...analysis.searchTerms];
            if (query) searchTerms.push(query);

            // Phase 2: 3 parallel DB queries
            const [textResults, catTypeResults, catResults] = await Promise.all([
                textSearch(searchTerms, fetchLimit, analysis.maxPrice),
                categoryTypeSearch(analysis.category, analysis.type, fetchLimit, analysis.maxPrice),
                categorySearch(analysis.category, fetchLimit, analysis.maxPrice),
            ]);

            // Phase 3: Rank — deduplication happens inside, reuse that count
            const { results, totalCandidates } = rankResults(
                textResults, catTypeResults, catResults, analysis, config, query,
            );

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

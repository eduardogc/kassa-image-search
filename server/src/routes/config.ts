import type { FastifyInstance } from 'fastify';
import { getConfig, updateConfig } from '../config.js';
import type { RankingConfig } from '../types.js';

export async function configRoutes(app: FastifyInstance): Promise<void> {
    app.get('/api/config', async (_request, reply) => {
        return reply.send(getConfig());
    });

    app.put('/api/config', async (request, reply) => {
        const body = request.body as Partial<RankingConfig>;
        const updated = updateConfig(body);
        return reply.send(updated);
    });

    app.get('/api/health', async (_request, reply) => {
        return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
    });
}

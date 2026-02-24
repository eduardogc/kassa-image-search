import { describe, it, expect, beforeAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { configRoutes } from '../config';

describe('Config Routes', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = Fastify();
        await app.register(configRoutes);
    });

    it('GET /api/config should return the current config', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/config'
        });

        expect(response.statusCode).toBe(200);
        const config = JSON.parse(response.payload);
        expect(config).toHaveProperty('weights');
        expect(config.weights).toHaveProperty('text');
    });

    it('PUT /api/config should ignore invalid data and return 200', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: '/api/config',
            payload: { invalidKey: 123 }
        });

        expect(response.statusCode).toBe(200);
    });
});

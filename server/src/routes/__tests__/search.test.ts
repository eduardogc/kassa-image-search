import { describe, it, expect, beforeAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { searchRoutes } from '../search';
import multipart from '@fastify/multipart';

describe('Search Routes', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = Fastify();
        await app.register(multipart);
        await app.register(searchRoutes);
    });

    it('should return 406 if no valid multipart content type is provided', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/search'
        });

        expect(response.statusCode).toBe(406);
    });
});

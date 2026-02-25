import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { connectDB, disconnectDB } from './services/catalog';
import { searchRoutes } from './routes/search';
import { configRoutes } from './routes/config';

const PORT = parseInt(process.env.PORT || '3001', 10);

async function main() {
    const app = Fastify({ logger: true });

    await app.register(cors, { origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] });
    await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

    await app.register(searchRoutes);
    await app.register(configRoutes);

    await connectDB();

    const shutdown = async () => {
        await app.close();
        await disconnectDB();
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    await app.listen({ port: PORT, host: '0.0.0.0' });
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

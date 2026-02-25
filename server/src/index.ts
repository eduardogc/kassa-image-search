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

    // Plugins
    await app.register(cors, {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });
    await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

    // Routes
    await app.register(searchRoutes);
    await app.register(configRoutes);

    // Connect to MongoDB before starting
    await connectDB();

    // Graceful shutdown
    const shutdown = async () => {
        await app.close();
        await disconnectDB();
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Start
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${PORT}`);
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

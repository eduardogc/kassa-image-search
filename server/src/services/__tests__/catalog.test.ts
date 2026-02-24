import { describe, it, expect } from 'vitest';
import { connectDB, textSearch } from '../catalog';

describe('Catalog Service', () => {
    it('defines exports correctly', async () => {
        expect(connectDB).toBeDefined();
        expect(textSearch).toBeDefined();
    });
});

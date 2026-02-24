/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchByImage, getConfig, updateConfig } from '../api';

// Mock the global fetch
window.fetch = vi.fn();

describe('API Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('searchByImage sends a POST request with formData', async () => {
        const mockResponse = { results: [] };
        (window.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const result = await searchByImage(file, 'query');

        expect(window.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/search'),
            expect.objectContaining({ method: 'POST' })
        );
        expect(result).toEqual(mockResponse);
    });

    it('getConfig fetches configuration', async () => {
        const mockResponse = { weights: { text: 0.5 } };
        (window.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await getConfig();
        expect(window.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/config'));
        expect(result).toEqual(mockResponse);
    });
});

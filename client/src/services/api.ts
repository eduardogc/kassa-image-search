import type { SearchResponse, RankingConfig } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE;

export async function searchByImage(
    file: File,
    apiKey: string,
    query?: string,
): Promise<SearchResponse> {
    const form = new FormData();
    form.append('file', file);
    form.append('apiKey', apiKey);
    if (query) form.append('query', query);

    const res = await fetch(`${API_BASE}/api/search`, {
        method: 'POST',
        body: form,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `Search failed: ${res.status}`);
    }

    return res.json();
}

export async function getConfig(): Promise<RankingConfig> {
    const res = await fetch(`${API_BASE}/api/config`);
    if (!res.ok) throw new Error('Failed to load config');
    return res.json();
}

export async function updateConfig(config: Partial<RankingConfig>): Promise<RankingConfig> {
    const res = await fetch(`${API_BASE}/api/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Failed to update config');
    return res.json();
}

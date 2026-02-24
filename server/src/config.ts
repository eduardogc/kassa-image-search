import type { RankingConfig } from './types.js';

// In-memory config — admin-tunable at runtime, never persisted to disk
let config: RankingConfig = {
    weights: {
        text: 0.4,
        category: 0.3,
        type: 0.2,
        style: 0.1,
    },
    maxResults: 20,
    minScore: 0.05,
    model: 'google/gemini-2.0-flash-exp:free',
};

export function getConfig(): RankingConfig {
    return { ...config, weights: { ...config.weights } };
}

export function updateConfig(partial: Partial<RankingConfig>): RankingConfig {
    if (partial.weights) {
        config.weights = { ...config.weights, ...partial.weights };
    }
    if (partial.maxResults !== undefined) config.maxResults = partial.maxResults;
    if (partial.minScore !== undefined) config.minScore = partial.minScore;
    if (partial.model !== undefined) config.model = partial.model;
    return getConfig();
}

import type { RankingConfig } from './types';

const config: RankingConfig = {
    weights: {
        text: 0.15,
        category: 0.30,
        type: 0.20,
        style: 0.15,
        query: 0.20,
    },
    maxResults: 20,
    minScore: 0.1,
    model: 'google/gemini-2.5-flash-lite',
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

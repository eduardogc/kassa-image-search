import type { RankingConfig } from './types';

// In-memory config — admin-tunable at runtime, never persisted to disk
const config: RankingConfig = {
    weights: {
        text: 0.25,      // Semantic keyword relevance from MongoDB $text index — useful but noisy
        category: 0.35,   // Exact category match (e.g. "Sofas") — most reliable structural signal
        type: 0.25,       // Exact type match (e.g. "Sectional Sofa") — important for precision
        style: 0.15,      // Heuristic: AI-detected style/material/color found in product text
    },
    maxResults: 20,
    minScore: 0.1,        // Filters out low-confidence results; raise to 0.2+ for stricter matching
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

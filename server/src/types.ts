// ── Shared types for the search pipeline ──

export interface ImageAnalysis {
    category: string;
    type: string;
    searchTerms: string[];
    confidence: number;
    /** Extensible attributes (style, material, color, and any future ones) */
    attributes: Record<string, string>;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    price: number;
    width: number;
    height: number;
    depth: number;
}

export interface ScoredProduct extends Product {
    score: number;
    signals: ScoreSignals;
}

export interface ScoreSignals {
    textScore: number;
    categoryMatch: boolean;
    typeMatch: boolean;
    styleMatch: number;
}

export interface SearchRequest {
    apiKey: string;
    query?: string;
}

export interface SearchResponse {
    results: ScoredProduct[];
    analysis: ImageAnalysis;
    totalCandidates: number;
    searchTimeMs: number;
}

export interface RankingConfig {
    weights: {
        text: number;
        category: number;
        type: number;
        style: number;
    };
    maxResults: number;
    minScore: number;
    model: string;
}

/** Default attribute keys to extract from the AI vision model */
export const DEFAULT_ATTRIBUTE_KEYS = ['style', 'material', 'color'] as const;

// Shared types matching server types

export interface ImageAnalysis {
    category: string;
    type: string;
    style: string;
    material: string;
    color: string;
    searchTerms: string[];
    confidence: number;
}

export interface ScoreSignals {
    textScore: number;
    categoryMatch: boolean;
    typeMatch: boolean;
    styleMatch: number;
}

export interface ScoredProduct {
    _id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    price: number;
    width: number;
    height: number;
    depth: number;
    score: number;
    signals: ScoreSignals;
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

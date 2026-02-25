import type { ImageAnalysis, ScoredProduct, ScoreSignals, RankingConfig } from '../types';
import type { CatalogResult } from './catalog';

interface RankResults {
    results: ScoredProduct[];
    totalCandidates: number;
}

export function rankResults(
    textResults: CatalogResult[],
    categoryTypeResults: CatalogResult[],
    categoryResults: CatalogResult[],
    analysis: ImageAnalysis,
    config: RankingConfig,
    userQuery?: string,
): RankResults {
    const productMap = new Map<string, { product: CatalogResult['product']; textScore: number }>();

    for (const result of [...textResults, ...categoryTypeResults, ...categoryResults]) {
        const existing = productMap.get(result.product._id);
        if (!existing || result.textScore > existing.textScore) {
            productMap.set(result.product._id, { product: result.product, textScore: result.textScore });
        }
    }

    const totalCandidates = productMap.size;
    const maxTextScore = Math.max(1, ...Array.from(productMap.values()).map((r) => r.textScore));
    const queryTerms = tokenizeQuery(userQuery);

    const scored: ScoredProduct[] = [];
    for (const { product, textScore } of productMap.values()) {
        const signals: ScoreSignals = {
            textScore: maxTextScore > 0 ? textScore / maxTextScore : 0,
            categoryMatch: product.category.toLowerCase() === analysis.category.toLowerCase(),
            typeMatch: product.type.toLowerCase() === analysis.type.toLowerCase(),
            styleMatch: computeStyleMatch(product, analysis),
            queryMatch: computeQueryMatch(product, queryTerms, analysis.maxPrice),
        };

        const score =
            config.weights.text * signals.textScore +
            config.weights.category * (signals.categoryMatch ? 1 : 0) +
            config.weights.type * (signals.typeMatch ? 1 : 0) +
            config.weights.style * signals.styleMatch +
            config.weights.query * signals.queryMatch;

        if (score >= config.minScore) {
            scored.push({ ...product, score: Math.round(score * 1000) / 1000, signals });
        }
    }

    scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    return { results: scored.slice(0, config.maxResults), totalCandidates };
}

function computeStyleMatch(product: CatalogResult['product'], analysis: ImageAnalysis): number {
    const text = `${product.title} ${product.description}`.toLowerCase();
    const keywords = Object.values(analysis.attributes).filter(Boolean).map((k) => k.toLowerCase());

    if (keywords.length === 0) return 0;
    const matches = keywords.filter((kw) => text.includes(kw)).length;
    return matches / keywords.length;
}

function computeQueryMatch(product: CatalogResult['product'], queryTerms: string[], maxPrice?: number): number {
    if (queryTerms.length === 0 && !maxPrice) return 0;

    const signals: number[] = [];

    if (queryTerms.length > 0) {
        const text = `${product.title} ${product.description}`.toLowerCase();
        const termMatches = queryTerms.filter((term) => text.includes(term)).length;
        signals.push(termMatches / queryTerms.length);
    }

    if (maxPrice) {
        signals.push(product.price <= maxPrice ? 1 : 0);
    }

    return signals.reduce((sum, s) => sum + s, 0) / signals.length;
}

const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'is', 'it', 'i', 'my', 'me', 'want', 'need', 'like', 'looking', 'something',
]);

function tokenizeQuery(query?: string): string[] {
    if (!query) return [];

    const cleaned = query
        .replace(/\b(under|below|less\s+than|up\s+to|max|budget)\s*\$?\d+/gi, '')
        .replace(/\$\d+/g, '')
        .toLowerCase()
        .trim();

    return cleaned
        .split(/\s+/)
        .map((w) => w.replace(/[^a-z]/g, ''))
        .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

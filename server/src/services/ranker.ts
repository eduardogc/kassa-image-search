import type { ImageAnalysis, ScoredProduct, ScoreSignals, RankingConfig } from '../types';
import type { CatalogResult } from './catalog';

/**
 * Merge results from multiple query strategies, deduplicate, score, and rank.
 */
export function rankResults(
    textResults: CatalogResult[],
    categoryTypeResults: CatalogResult[],
    categoryResults: CatalogResult[],
    analysis: ImageAnalysis,
    config: RankingConfig,
): ScoredProduct[] {
    // Deduplicate by _id, keeping the best textScore
    const productMap = new Map<string, { product: CatalogResult['product']; textScore: number }>();

    for (const result of [...textResults, ...categoryTypeResults, ...categoryResults]) {
        const existing = productMap.get(result.product._id);
        if (!existing || result.textScore > existing.textScore) {
            productMap.set(result.product._id, {
                product: result.product,
                textScore: result.textScore,
            });
        }
    }

    // Normalize text scores
    const maxTextScore = Math.max(1, ...Array.from(productMap.values()).map((r) => r.textScore));

    // Score each product
    const scored: ScoredProduct[] = [];
    for (const { product, textScore } of productMap.values()) {
        const signals: ScoreSignals = {
            textScore: maxTextScore > 0 ? textScore / maxTextScore : 0,
            categoryMatch: product.category.toLowerCase() === analysis.category.toLowerCase(),
            typeMatch: product.type.toLowerCase() === analysis.type.toLowerCase(),
            styleMatch: computeStyleMatch(product, analysis),
        };

        const score =
            config.weights.text * signals.textScore +
            config.weights.category * (signals.categoryMatch ? 1 : 0) +
            config.weights.type * (signals.typeMatch ? 1 : 0) +
            config.weights.style * signals.styleMatch;

        if (score >= config.minScore) {
            scored.push({ ...product, score: Math.round(score * 1000) / 1000, signals });
        }
    }

    // Sort descending by score, then by title for deterministic ordering
    scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

    return scored.slice(0, config.maxResults);
}

/**
 * Heuristic style match: checks if the AI-detected attributes
 * appear in the product title or description.
 */
function computeStyleMatch(
    product: CatalogResult['product'],
    analysis: ImageAnalysis,
): number {
    const text = `${product.title} ${product.description}`.toLowerCase();
    const keywords = Object.values(analysis.attributes)
        .filter(Boolean)
        .map((k) => k.toLowerCase());

    if (keywords.length === 0) return 0;

    const matches = keywords.filter((kw) => text.includes(kw)).length;
    return matches / keywords.length;
}

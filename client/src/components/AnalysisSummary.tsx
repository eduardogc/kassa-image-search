import type { ImageAnalysis, SearchResponse } from '../types';
import * as s from './AnalysisSummary.styles';

export interface AnalysisSummaryProps {
    analysis: ImageAnalysis;
    meta: SearchResponse;
}

export function AnalysisSummary({ analysis, meta }: AnalysisSummaryProps) {
    return (
        <div className={s.analysisSummary}>
            <h4>AI Analysis</h4>
            <div className={s.analysisGrid}>
                <span className={s.analysisLabel}>Category</span>
                <span className={s.analysisValue}>{analysis.category}</span>
                <span className={s.analysisLabel}>Type</span>
                <span className={s.analysisValue}>{analysis.type}</span>
                {Object.entries(analysis.attributes || {}).map(([key, value]) => (
                    <span key={key}>
                        <span className={s.analysisLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span className={s.analysisValue}>{value}</span>
                    </span>
                ))}
                {analysis.maxPrice && (
                    <>
                        <span className={s.analysisLabel}>Max Price</span>
                        <span className={s.analysisValue}>${analysis.maxPrice}</span>
                    </>
                )}
                <span className={s.analysisLabel}>Confidence</span>
                <span className={s.analysisValue}>{(analysis.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className={s.metaInfo}>
                {meta.totalCandidates} candidates → {meta.results.length} results in {meta.searchTimeMs}ms
            </div>
        </div>
    );
}

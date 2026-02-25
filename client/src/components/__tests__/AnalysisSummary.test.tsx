import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalysisSummary } from '../AnalysisSummary';
import type { ImageAnalysis, SearchResponse } from '../../types';

function makeAnalysis(overrides: Partial<ImageAnalysis> = {}): ImageAnalysis {
    return {
        category: 'Coffee Tables',
        type: 'Round Coffee Table',
        searchTerms: ['round coffee table', 'mid-century'],
        confidence: 0.95,
        attributes: { style: 'Mid-Century Modern', material: 'Wood', color: 'Black' },
        ...overrides,
    };
}

function makeMeta(overrides: Partial<SearchResponse> = {}): SearchResponse {
    return {
        results: [],
        analysis: makeAnalysis(),
        totalCandidates: 42,
        searchTimeMs: 320,
        ...overrides,
    };
}

describe('AnalysisSummary', () => {
    it('renders category and type', () => {
        render(<AnalysisSummary analysis={makeAnalysis()} meta={makeMeta()} />);
        expect(screen.getByText('Coffee Tables')).toBeTruthy();
        expect(screen.getByText('Round Coffee Table')).toBeTruthy();
    });

    it('renders dynamic attributes', () => {
        render(<AnalysisSummary analysis={makeAnalysis()} meta={makeMeta()} />);
        expect(screen.getByText('Style')).toBeTruthy();
        expect(screen.getByText('Mid-Century Modern')).toBeTruthy();
        expect(screen.getByText('Material')).toBeTruthy();
        expect(screen.getByText('Wood')).toBeTruthy();
        expect(screen.getByText('Color')).toBeTruthy();
        expect(screen.getByText('Black')).toBeTruthy();
    });

    it('renders confidence as percentage', () => {
        render(<AnalysisSummary analysis={makeAnalysis({ confidence: 0.85 })} meta={makeMeta()} />);
        expect(screen.getByText('85%')).toBeTruthy();
    });

    it('renders maxPrice when present', () => {
        render(<AnalysisSummary analysis={makeAnalysis({ maxPrice: 500 })} meta={makeMeta()} />);
        expect(screen.getByText('Max Price')).toBeTruthy();
        expect(screen.getByText('$500')).toBeTruthy();
    });

    it('does not render max price row when absent', () => {
        render(<AnalysisSummary analysis={makeAnalysis({ maxPrice: undefined })} meta={makeMeta()} />);
        expect(screen.queryByText('Max Price')).toBeNull();
    });

    it('renders meta stats with candidates, results count and search time', () => {
        const meta = makeMeta({ totalCandidates: 120, searchTimeMs: 450, results: [{} as never, {} as never] });
        render(<AnalysisSummary analysis={makeAnalysis()} meta={meta} />);
        expect(screen.getByText(/120 candidates/)).toBeTruthy();
        expect(screen.getByText(/2 results/)).toBeTruthy();
        expect(screen.getByText(/450ms/)).toBeTruthy();
    });

    it('renders empty attributes without crashing', () => {
        render(<AnalysisSummary analysis={makeAnalysis({ attributes: {} })} meta={makeMeta()} />);
        expect(screen.getByText('Coffee Tables')).toBeTruthy();
    });
});

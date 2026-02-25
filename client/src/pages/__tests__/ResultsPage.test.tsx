import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ResultsPage } from '../ResultsPage';
import { useStore } from '../../store';

vi.mock('../../store', () => ({
    useStore: vi.fn(),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function wrapper({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
    );
}

describe('ResultsPage component', () => {
    it('redirects to home if no search result is present in store', () => {
        (useStore as any).mockReturnValue({
            searchResult: null,
            openrouterApiKey: 'test-key',
            searchQuery: '',
            setSearchQuery: vi.fn(),
            setSearchResult: vi.fn(),
        });
        const { container } = render(<ResultsPage />, { wrapper });
        expect(container.innerHTML).toBe('');
    });

    it('renders results if they exist', () => {
        (useStore as any).mockReturnValue({
            searchResult: { results: [], analysis: { category: '', type: '', searchTerms: [], confidence: 0, attributes: {} }, totalCandidates: 0, searchTimeMs: 0 },
            openrouterApiKey: 'test-key',
            searchQuery: 'a chair',
            setSearchQuery: vi.fn(),
            setSearchResult: vi.fn(),
        });

        render(<ResultsPage />, { wrapper });
        expect(screen.getByText(/No matches found/i)).toBeInTheDocument();
        expect(screen.getByText(/Additional user prompt/i)).toBeInTheDocument();
    });
});

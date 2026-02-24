import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ResultsPage } from '../ResultsPage';
import { useStore } from '../../store';

// Mock Zustand
vi.mock('../../store', () => ({
    useStore: vi.fn(),
}));

describe('ResultsPage component', () => {
    it('redirects to home if no search result is present in store', () => {
        (useStore as any).mockReturnValue({
            searchResult: null,
            openrouterApiKey: 'test-key',
        });
        const { container } = render(<BrowserRouter><ResultsPage /></BrowserRouter>);
        expect(container.innerHTML).toBe(''); // Indicates redirect execution out of component tree
    });

    it('renders results if they exist', () => {
        (useStore as any).mockReturnValue({
            searchResult: { results: [], analysis: {}, totalCandidates: 0, searchTimeMs: 0 },
            openrouterApiKey: 'test-key',
            searchQuery: 'a chair',
            setSearchQuery: vi.fn(),
        });

        render(<BrowserRouter><ResultsPage /></BrowserRouter>);
        expect(screen.getByText(/No matches found/i)).toBeInTheDocument();
        expect(screen.getByText(/Additional user prompt/i)).toBeInTheDocument();
    });
});

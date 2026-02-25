import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from '../HomePage';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function wrapper({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
    );
}

describe('HomePage component', () => {
    it('renders the layout structure properly', () => {
        render(<HomePage />, { wrapper });
        expect(screen.getByText(/Find visually similar products in seconds/i)).toBeInTheDocument();
        expect(screen.getByText(/Additional user prompt/i)).toBeInTheDocument();
        expect(screen.getByText(/Drop a furniture image here/i)).toBeInTheDocument();
    });
});

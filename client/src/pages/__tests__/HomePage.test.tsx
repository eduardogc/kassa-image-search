import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';

describe('HomePage component', () => {
    it('renders the layout structure properly', () => {
        render(<BrowserRouter><HomePage /></BrowserRouter>);
        expect(screen.getByText(/Find visually similar products in seconds/i)).toBeInTheDocument();
        expect(screen.getByText(/Additional user prompt/i)).toBeInTheDocument();
        expect(screen.getByText(/Drop a furniture image here/i)).toBeInTheDocument();
    });
});

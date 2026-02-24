import { describe, it, expect } from 'vitest';
import { ProductCard } from '../ProductCard';
import { render, screen } from '@testing-library/react';

describe('ProductCard component', () => {
    it('renders the product details properly', () => {
        const product = {
            _id: '123',
            id: '123',
            store: 'Awesome Store',
            brand: 'Best Brand',
            title: 'Cool Product',
            description: 'Test Description',
            category: 'Chairs',
            type: 'Side Chair',
            price: 10.00,
            imageUrl: 'http://test.image/png',
            productUrl: 'http://test.url',
            score: 0.9,
            signals: { textScore: 0.5, categoryMatch: true, typeMatch: true, styleMatch: 0.8 },
            width: 10,
            height: 20,
            depth: 30
        } as any;

        render(<ProductCard product={product} rank={1} />);

        expect(screen.getByText('Cool Product')).toBeInTheDocument();
        expect(screen.getByText('Chairs')).toBeInTheDocument();
        expect(screen.getByText('Side Chair')).toBeInTheDocument();
        expect(screen.getByText(/10.00/)).toBeInTheDocument();
        expect(screen.getByText(/10 × 20 × 30 cm/)).toBeInTheDocument();
    });
});

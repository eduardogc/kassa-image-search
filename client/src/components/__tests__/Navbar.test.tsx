import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../Navbar';

function renderNavbar(initialPath = '/') {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Navbar />
        </MemoryRouter>,
    );
}

describe('Navbar', () => {
    it('renders the brand name', () => {
        renderNavbar();
        expect(screen.getByText('Kassa')).toBeTruthy();
    });

    it('renders Search and Admin links', () => {
        renderNavbar();
        expect(screen.getByRole('link', { name: 'Search' })).toBeTruthy();
        expect(screen.getByRole('link', { name: 'Admin' })).toBeTruthy();
    });

    it('Search link points to /', () => {
        renderNavbar();
        expect(screen.getByRole('link', { name: 'Search' }).getAttribute('href')).toBe('/');
    });

    it('Admin link points to /admin', () => {
        renderNavbar();
        expect(screen.getByRole('link', { name: 'Admin' }).getAttribute('href')).toBe('/admin');
    });

    it('applies active class to Search link on / route', () => {
        renderNavbar('/');
        const searchLink = screen.getByRole('link', { name: 'Search' });
        const adminLink = screen.getByRole('link', { name: 'Admin' });
        expect(searchLink.className).not.toBe(adminLink.className);
    });

    it('applies active class to Admin link on /admin route', () => {
        renderNavbar('/admin');
        const searchLink = screen.getByRole('link', { name: 'Search' });
        const adminLink = screen.getByRole('link', { name: 'Admin' });
        expect(adminLink.className).not.toBe(searchLink.className);
    });
});

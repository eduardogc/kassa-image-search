// ── Shared types for the search pipeline ──

export interface ImageAnalysis {
    category: string;
    type: string;
    style: string;
    material: string;
    color: string;
    searchTerms: string[];
    confidence: number;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    price: number;
    width: number;
    height: number;
    depth: number;
}

export interface ScoredProduct extends Product {
    score: number;
    signals: ScoreSignals;
}

export interface ScoreSignals {
    textScore: number;
    categoryMatch: boolean;
    typeMatch: boolean;
    styleMatch: number;
}

export interface SearchRequest {
    apiKey: string;
    query?: string;
}

export interface SearchResponse {
    results: ScoredProduct[];
    analysis: ImageAnalysis;
    totalCandidates: number;
    searchTimeMs: number;
}

export interface RankingConfig {
    weights: {
        text: number;
        category: number;
        type: number;
        style: number;
    };
    maxResults: number;
    minScore: number;
    model: string;
}

// Valid catalog values (from DB exploration)
export const VALID_CATEGORIES = [
    'Beds', 'Benches', 'Bookshelves', 'Cabinets', 'Chairs',
    'Coffee Tables', 'Desks', 'Dressers', 'Lighting', 'Nightstands',
    'Ottomans', 'Sofas', 'TV Stands', 'Tables', 'Wardrobes',
] as const;

export const VALID_TYPES = [
    'Accent Chair', 'Armchair', 'Bar Cabinet', 'Bench Ottoman',
    'Bunk Bed', 'Canopy Bed', 'Chandelier', 'Chesterfield Sofa',
    'Console Table', 'Corner Bookshelf', 'Corner TV Stand',
    'Corner Wardrobe', 'Daybed', 'Desk Lamp', 'Dining Bench',
    'Dining Chair', 'Dining Table', 'Display Cabinet', 'Double Dresser',
    'Entertainment Center', 'Entryway Bench', 'Executive Desk',
    'Extendable Table', 'Filing Cabinet', 'Floating TV Stand',
    'Floor Lamp', 'Futon', 'Garden Bench', 'Hinged Door Wardrobe',
    'L-Shaped Desk', 'Ladder Shelf', 'Lift-Top Coffee Table',
    'Loveseat', 'Low Profile TV Stand', 'Nesting Coffee Table',
    'Open Shelf Nightstand', 'Open Wardrobe', 'Pendant Light',
    'Platform Bed', 'Pouf', 'Recliner', 'Rectangular Coffee Table',
    'Rocking Chair', 'Round Coffee Table', 'Sectional Sofa',
    'Side Table', 'Single Drawer Nightstand', 'Sleeper Sofa',
    'Sliding Door Wardrobe', 'Standing Desk', 'Storage Bed',
    'Storage Bench', 'Storage Cabinet', 'Storage Ottoman',
    'Table Lamp', 'Tall Bookshelf', 'Tall Dresser', 'Tufted Ottoman',
    'Two Drawer Nightstand', 'Wide Bookshelf', 'Wide Dresser',
    'Writing Desk',
] as const;

import { type Collection, type Db, MongoClient, type WithId, type Document } from 'mongodb';
import type { Product } from '../types';

let client: MongoClient;
let db: Db;
let products: Collection;

export async function connectDB(): Promise<void> {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is required. Add it to server/.env');
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db('catalog');
    products = db.collection('products');
    // estimatedDocumentCount uses collection metadata — no collection scan
    console.log(`Connected to MongoDB — ~${await products.estimatedDocumentCount()} products`);

    // Pre-load catalog metadata for AI prompt construction
    await refreshCatalogMeta();
}

// ── Cached catalog metadata (loaded once at startup) ──

let cachedCategories: string[] = [];
let cachedTypes: string[] = [];

async function refreshCatalogMeta(): Promise<void> {
    // distinct() uses the compound index {category, type, price} via DISTINCT_SCAN — not a full collection scan
    cachedCategories = (await products.distinct('category')).sort();
    cachedTypes = (await products.distinct('type')).sort();
    console.log(`Catalog meta: ${cachedCategories.length} categories, ${cachedTypes.length} types`);
}

export function getValidCategories(): string[] {
    return cachedCategories;
}

export function getValidTypes(): string[] {
    return cachedTypes;
}

export async function disconnectDB(): Promise<void> {
    await client?.close();
}

interface CatalogResult {
    product: Product;
    textScore: number;
}

/**
 * Text search using the existing $text index (title weight=2, description weight=1)
 */
export async function textSearch(terms: string[], limit: number): Promise<CatalogResult[]> {
    const query = terms.join(' ');
    if (!query.trim()) return [];

    const docs = await products
        .find(
            { $text: { $search: query } },
            { projection: { score: { $meta: 'textScore' } } },
        )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .toArray();

    return docs.map(docToResult);
}

/**
 * Category + Type exact match using the compound index
 */
export async function categoryTypeSearch(
    category: string,
    type: string,
    limit: number,
): Promise<CatalogResult[]> {
    const docs = await products
        .find({ category, type })
        .limit(limit)
        .toArray();

    return docs.map((d) => ({ product: docToProduct(d), textScore: 0 }));
}

/**
 * Broader category-only search (fallback when type match is too narrow)
 */
export async function categorySearch(category: string, limit: number): Promise<CatalogResult[]> {
    const docs = await products
        .find({ category })
        .limit(limit)
        .toArray();

    return docs.map((d) => ({ product: docToProduct(d), textScore: 0 }));
}

// ── Helpers ──

function docToProduct(doc: WithId<Document>): Product {
    return {
        _id: doc._id.toString(),
        title: doc.title as string,
        description: doc.description as string,
        category: doc.category as string,
        type: doc.type as string,
        price: doc.price as number,
        width: doc.width as number,
        height: doc.height as number,
        depth: doc.depth as number,
    };
}

function docToResult(doc: WithId<Document>): CatalogResult {
    return {
        product: docToProduct(doc),
        textScore: (doc as Record<string, unknown>).score as number ?? 0,
    };
}

export type { CatalogResult };

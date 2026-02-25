import { type Collection, type Db, MongoClient, type WithId, type Document } from 'mongodb';
import type { Product } from '../types';
import { invalidatePromptCache } from './ai';

let client: MongoClient;
let db: Db;
let products: Collection;

let cachedCategories: string[] = [];
let cachedTypes: string[] = [];

const PRODUCT_FIELDS = {
    _id: 1, title: 1, description: 1, category: 1, type: 1,
    price: 1, width: 1, height: 1, depth: 1,
} as const;

export async function connectDB(): Promise<void> {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is required. Add it to server/.env');
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db('catalog');
    products = db.collection('products');
    console.log(`Connected to MongoDB — ~${await products.estimatedDocumentCount()} products`);

    cachedCategories = (await products.distinct('category')).sort();
    cachedTypes = (await products.distinct('type')).sort();
    console.log(`Catalog meta: ${cachedCategories.length} categories, ${cachedTypes.length} types`);

    invalidatePromptCache();
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

export async function textSearch(terms: string[], limit: number, maxPrice?: number): Promise<CatalogResult[]> {
    const query = terms.join(' ');
    if (!query.trim()) return [];

    const filter: Record<string, unknown> = { $text: { $search: query } };
    if (maxPrice) filter.price = { $lte: maxPrice };

    const docs = await products
        .find(filter, { projection: { ...PRODUCT_FIELDS, score: { $meta: 'textScore' } } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .toArray();

    return docs.map(docToResult);
}

export async function categoryTypeSearch(
    category: string,
    type: string,
    limit: number,
    maxPrice?: number,
): Promise<CatalogResult[]> {
    const filter: Record<string, unknown> = { category, type };
    if (maxPrice) filter.price = { $lte: maxPrice };

    const docs = await products
        .find(filter, { projection: PRODUCT_FIELDS })
        .limit(limit)
        .toArray();

    return docs.map((d) => ({ product: docToProduct(d), textScore: 0 }));
}

export async function categorySearch(category: string, limit: number, maxPrice?: number): Promise<CatalogResult[]> {
    const filter: Record<string, unknown> = { category };
    if (maxPrice) filter.price = { $lte: maxPrice };

    const docs = await products
        .find(filter, { projection: PRODUCT_FIELDS })
        .limit(limit)
        .toArray();

    return docs.map((d) => ({ product: docToProduct(d), textScore: 0 }));
}

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

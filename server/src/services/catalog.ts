import { type Collection, type Db, MongoClient, type WithId, type Document } from 'mongodb';
import type { Product, ImageAnalysis } from '../types.js';

const MONGO_URI = 'mongodb+srv://catalog-readonly:vcRvxWHQSKUEwd7V@catalog.sontifs.mongodb.net/catalog';

let client: MongoClient;
let db: Db;
let products: Collection;

export async function connectDB(): Promise<void> {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db('catalog');
    products = db.collection('products');
    console.log(`Connected to MongoDB — ${await products.countDocuments()} products`);
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

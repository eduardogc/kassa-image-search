# Kassa Image Search

Upload a furniture image → AI extracts structured attributes → MongoDB queries find matching products → results ranked by 5 configurable signals. Optionally refine with a natural-language query like "white, under $500".

## Quick Start

```bash
# Prerequisites: Node.js ≥ 18, an OpenRouter API key

# 1. Copy and configure environment variables
cp server/.env.example server/.env    # then edit MONGO_URI
cp client/.env.example client/.env    # defaults work for local dev

# 2. Install all dependencies
npm run install:all

# 3. Start both server and client
npm run dev
```

Open http://localhost:5173 → Admin (`/admin`) → paste your API key → Home (`/`) → upload & search.

### Environment Variables

| File | Variable | Required | Default |
|------|----------|----------|---------|
| `server/.env` | `MONGO_URI` | Yes | — |
| `client/.env` | `VITE_API_BASE` | No | `http://127.0.0.1:3001` |

> Both directories include a `.env.example` file. Copy it to `.env` and fill in your values.

---

## Architecture

```
Client (React + Vite + TS)  ──►  Server (Fastify + TS)  ──►  MongoDB (read-only)
         │                              │
    Zustand store                 OpenRouter API
    React Query hooks            (vision model)
```

### Client Stack
- **React + TypeScript + Vite** — SPA with 3 pages (Home, Results, Admin)
- **Emotion CSS** — styles extracted into `*.styles.tsx` files per component
- **Zustand** — client-side state (API key, search results, query)
- **React Query** — `useConfig`, `useSearch`, `useRefineSearch` hooks for all API calls
- **6 components**: Navbar, ImageUpload, ProductCard, AnalysisSummary, WeightSlider, ParamField

---

## Search Pipeline

### Phase 1 — AI Analysis

The uploaded image is sent to a vision model (default: Gemini 2.5 Flash Lite via OpenRouter) which extracts:

| Field | Source | Example |
|-------|--------|---------|
| Category, Type | Always from image | "Coffee Tables", "Round" |
| Style, Material, Color | Image **unless user overrides** | "Modern", "Wood", "White" |
| Max Price | User query only | "under $500" → `500` |
| Search Terms | Combined image + preferences | ["white round coffee table"] |

**Selective override rule:** When the user mentions a specific attribute (e.g. "white"), that attribute uses the user's value. Everything the user did **not** mention is derived from the image normally. This means:
- User says "white" → color = white (override), material = from image, style = from image
- User says nothing → all attributes from image

### Phase 2 — Retrieval

Three parallel MongoDB queries (all filtered by `maxPrice` when present):

1. **Text search** — `$text` index on title (weight 2) + description (weight 1)
2. **Category + Type** — compound index exact match
3. **Category only** — broader fallback for recall

All queries use explicit field projection (`PRODUCT_FIELDS`) to transfer only the 9 fields used by the ranker.

### Phase 3 — Ranking

Results are deduplicated, then scored with **5 configurable signals**:

```
score = w_text × textScore
      + w_category × categoryMatch
      + w_type × typeMatch
      + w_style × styleMatch
      + w_query × queryMatch
```

| Signal | Default Weight | What it measures |
|--------|---------------|------------------|
| Category | 0.30 | Exact category match from AI |
| Query | 0.20 | User's explicit text terms found in product title/description + price compliance |
| Type | 0.20 | Exact type match from AI |
| Text | 0.15 | MongoDB keyword relevance score |
| Style | 0.15 | AI-detected attributes found in product text |

The `queryMatch` signal is **independent of the AI** — it tokenizes the raw user query (stripping stop words and price patterns) and checks each product directly. This ensures user preferences are respected even if the AI misinterprets them.

---

## Performance

| Optimization | Impact |
|-------------|--------|
| **Shared OpenAI client** | Reused across requests. Recreated only when API key changes. |
| **Cached system prompt** | Built once from catalog metadata, not per-request. |
| **Analysis cache (LRU, 128 entries)** | Identical image + query returns instantly, zero API calls. |
| **`max_tokens` 200** (was 500) | JSON response is ≤150 tokens. ~40% inference billing reduction. |
| **MongoDB field projection** | Only 9 fields transferred per document, not the full document. |
| **Dynamic catalog metadata** | Categories and types loaded at startup via `DISTINCT_SCAN`, not hardcoded. |

---

## Admin Panel (`/admin`)

- **Ranking weight sliders** — text, category, type, style, **query match**
- **Max results / Min score** — control result count and quality threshold
- **AI model** — select any OpenRouter model
- **API key** — stored in browser memory only (Zustand), never sent to server storage

Changes take effect on the next search.

---

## Evaluation

Every result card shows its **score** and **signal breakdown bars** (text, category, type, style, query), making it transparent *why* each result was ranked where it is.

**Manual protocol:**
1. Upload images of distinct types (sofa, desk, lamp, bookshelf)
2. Verify top-3 are in the correct category
3. Add a refining query ("white", "under $500") and verify filtering
4. Check AI confidence — low values suggest ambiguous input

---

## Design Decisions

| Decision | Why |
|----------|-----|
| **Selective override (not blanket)** | User says "white" → only color overrides. Material, style, category all still come from the image. Ensures the AI still contributes value for attributes the user didn't specify. |
| **queryMatch as independent signal** | The ranker checks user terms directly against products, independent of AI output. "White" boosts white products even if the AI returned "black". |
| **Structured extraction over embeddings** | Works with existing MongoDB indexes. No vectors to compute or store for 2,500 products. Adding products doesn't require re-indexing. |
| **Three parallel queries** | Text for semantic relevance + category/type for structural precision + fallback for recall. |
| **Dynamic catalog metadata** | Categories/types loaded from MongoDB at startup. Adding a new category to the DB automatically updates the AI prompt. |
| **In-memory analysis cache** | Avoids redundant API calls for repeated searches. LRU eviction keeps memory bounded. |

## Tradeoffs

- **No vector search** — for 10K+ catalogs, embedding-based search would improve semantic matching.
- **No product images** — matching is text-based only. Image-to-image similarity would help if product images existed.
- **In-memory config** — resets on restart. Intentional for simplicity.

---

## Testing

```bash
# Server tests (Vitest)
cd server && npm test

# Client tests (Vitest + React Testing Library)
cd client && npm test
```

- **Server** (6 tests): AI service, ranker, catalog, config routes, search route
- **Client** (30 tests): Navbar, ImageUpload, ProductCard, AnalysisSummary, WeightSlider, ParamField, HomePage, ResultsPage, API service

---

## Future Enhancements

1. Vector/embedding search for larger catalogs
2. Image-to-image similarity (if product images become available)
3. Dimension filters (width, height, depth)
4. Search history with user feedback
5. Pagination / infinite scroll

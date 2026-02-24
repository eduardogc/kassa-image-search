# Kassa Image Search

A full-stack furniture image search application. Upload a furniture image, and the system returns ranked matches from a 2,500+ product catalog. Optionally refine results with a natural-language query.

## Quick Start

### Prerequisites
- Node.js ≥ 18
- An [OpenRouter](https://openrouter.ai) API key (free tier works)

### Setup

```bash
# Install all dependencies
npm run install:all

# Start both server and client
npm run dev
```

Or start individually:

```bash
# Server (port 3001)
cd server && npm run dev

# Client (port 5173)
cd client && npm run dev
```

Open http://localhost:5173, enter your OpenRouter API key, upload a furniture image, and search.

---

## Architecture

```
Client (React + Vite + TS)  ──►  Server (Fastify + TS)  ──►  MongoDB (read-only)
                                        │
                                   OpenRouter API
                                   (vision model)
```

### Search Pipeline (Two-Phase)

**Phase 1 — AI Image Analysis:**
The uploaded image is sent to a vision model (default: Gemini 2.0 Flash via OpenRouter) which extracts structured attributes:
- **Category** and **Type** — mapped to exact values in the catalog (15 categories, 63 types)
- **Style**, **material**, **color** — descriptive attributes
- **Search terms** — natural-language phrases for text search

**Phase 2 — Multi-Signal Retrieval & Ranking:**
Three parallel MongoDB queries using existing indexes:
1. **Text search** — `$text` index on `title` (weight 2) + `description` (weight 1)
2. **Category + Type filter** — compound index (`category`, `type`, `price`)
3. **Category-only fallback** — broader results when type is too narrow

Results are deduplicated, then scored with configurable weights:

```
score = w_text × textScore + w_category × categoryMatch + w_type × typeMatch + w_style × styleMatch
```

### Key Design Choices

| Decision | Rationale |
|---|---|
| **Structured extraction → DB queries** (vs. embedding-based search) | Works with the existing text + compound indexes. No need to create/store embeddings for 2,500 products. Scales well — adding products doesn't require re-indexing vectors. |
| **Three parallel query strategies** | Text search captures semantic relevance; category/type filter captures exact structural match; category fallback ensures recall. Merging provides both precision and coverage. |
| **Admin-tunable weights** | Enables rapid iteration on ranking quality without code changes. Different use cases can prioritize different signals. |
| **OpenRouter** | Supports many models on a single API. Free tier available. Model selectable from admin panel. |
| **Heuristic style matching** | Simple substring check of AI-detected style/material/color against product text. Lightweight, no extra infrastructure needed. |

### Tradeoffs

- **No vector/embedding search** — the current approach relies on text indexes and structured attributes. For a larger catalog (10K+), adding vector search (MongoDB Atlas Search or a dedicated vector DB) would improve semantic matching.
- **No product images** — the catalog has no image URLs, so matching is purely text-based. Image-to-image similarity would dramatically improve quality if product images were available.
- **In-memory config** — config resets on server restart. Intentional for simplicity (no persistent state to manage), but a production system would persist to a file or database.

---

## Admin Panel

Navigate to `/admin` to configure:

- **Ranking Weights** — sliders for text relevance, category match, type match, and style match
- **Max Results** — number of products returned per search
- **Min Score** — threshold below which products are filtered out
- **AI Model** — OpenRouter model used for image analysis

Changes take effect on the next search request.

---

## Evaluation Approach

### Score Transparency
Every result shows its **composite score** and individual **signal breakdowns** (text, category, type, style bars). This makes it easy to inspect *why* a result was ranked where it is.

### Admin Tuning as Evaluation
The admin panel allows rapid A/B testing of different weight configurations. Upload the same image, change weights, observe how results reorder. This is the primary UX for evaluating retrieval quality.

### Evaluation Protocol
To evaluate match quality:
1. Upload images of distinct furniture types (sofa, dining table, desk lamp, bookshelf)
2. Verify top-3 results are in the correct **category**
3. Verify top-1 result has the correct **type**
4. Add a refining query (e.g., "wooden", "under $500") and verify filtering
5. Check AI **confidence** score — low confidence suggests a non-furniture or ambiguous image

### Metrics (Manual)
For a formal evaluation, prepare a test set of N images with known categories/types and measure:
- **Category accuracy@1** — does the top result's category match?
- **Type accuracy@3** — is the correct type in the top 3?
- **MRR (Mean Reciprocal Rank)** — average of 1/rank of the first correct result

---

## Future Enhancements

1. **Vector/embedding search** — precompute text embeddings for all products, use cosine similarity for semantic matching
2. **Product images** — if available, enable image-to-image similarity search
3. **Price and dimension filters** — expose sliders for price range, min/max dimensions
4. **Search history and feedback** — persist search sessions and thumbs-up/down for offline evaluation
5. **Caching** — cache AI analysis for identical images, cache MongoDB results for repeated queries
6. **Pagination** — infinite scroll or load-more for large result sets
7. **Multi-image search** — search for a room setup with multiple furniture items
8. **Batch evaluation endpoint** — upload a test set, run all searches, return accuracy metrics automatically

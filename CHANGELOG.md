# Changelog

All notable changes to the Kassa Image Search project are documented here. Each entry includes the motivation behind the change and, where relevant, the prompts and instructions given to the coding agent.

---

## [1.4.1] — 2026-02-25 — AI Prompt Fix

- **Selective attribute override** — the user query now overrides only the specific attributes the user mentioned. Previously, the prompt declared "Image = SHAPE only", which caused the AI to discard all image-derived attributes (color, material, style) even when the user said nothing about them.
  - *Before:* user types "white" → AI ignores image color, material, style entirely
  - *After:* user types "white" → color = "white" (override), material/style = from image (not mentioned)

## [1.4.0] — 2026-02-24 — Server Performance


### AI (`ai.ts`)
- **Shared OpenAI client** — reused across requests, recreated only when the API key changes. Eliminates TCP handshake overhead on every search.
- **Cached system prompt** — built once from catalog metadata at startup, never rebuilt per-request. The prompt is ~600 tokens of category/type lists.
- **Analysis cache** — SHA-1 keyed LRU (128 entries). Identical image + query combinations return instantly with zero API calls.
- **`max_tokens` 500 → 200** — JSON response is ≤150 tokens; ~40% reduction in inference billing per request.
- **Shorter user message** — ~30 fewer input tokens per query.

### DB (`catalog.ts`)
- **Field projection on all 3 queries** — `PRODUCT_FIELDS` projection limits MongoDB transfer to the 9 fields actually used. `categoryTypeSearch` and `categorySearch` previously fetched full documents.
- **Prompt cache invalidation on connect** — `invalidatePromptCache()` called after `connectDB()` so the AI prompt always reflects live catalog data.

### Ranker + Route (`ranker.ts`, `search.ts`)
- **`totalCandidates` from deduplication Map** — `rankResults` returns `{ results, totalCandidates }` where count comes from `productMap.size`. The route no longer allocates a second `Set` over all 3 result arrays.
- **Config read before AI call** — `getConfig()` called once at pipeline start, not mid-flow.

---

## [1.2.0] — 2026-02-24


### Scalability, Code Quality & Search Tuning

#### Scalable AI Analysis Schema
- **Refactored `ImageAnalysis` type** to a hybrid schema: `category` and `type` remain as typed fields (needed for index-based exact matching), while `style`, `material`, `color` and any future attributes moved to a flexible `attributes: Record<string, string>` map.
  - *Motivation:* Adding a new attribute (e.g. `finish`, `pattern`) now requires only adding a string to `DEFAULT_ATTRIBUTE_KEYS` — the prompt, ranker, and frontend adapt automatically.
  > **Prompt:** "How could we make ai.ts more scalable? What if we changed ImageAnalysis type?"
- **Dynamic catalog metadata from MongoDB** — `getValidCategories()` and `getValidTypes()` load distinct values from the DB at startup via `DISTINCT_SCAN` (using the existing compound index), replacing hardcoded arrays.
  - *Motivation:* If the catalog grows or categories change, no code changes are needed. The AI prompt is built dynamically with the real catalog values.
- **AI prompt built dynamically** via `buildSystemPrompt()` — injects live categories, types, and attribute keys into the system prompt at request time.
- **Ranker updated** — `computeStyleMatch()` now iterates `Object.values(analysis.attributes)` instead of hardcoded `style`/`material`/`color` fields.
- **Frontend updated** — `AnalysisSummary` renders attributes dynamically with `Object.entries()`.

#### Environment Variables
- **`MONGO_URI`** moved from hardcoded string to `server/.env` (loaded via `dotenv`). Throws a clear error at `connectDB()` if missing.
  - *Motivation:* Credentials should never be committed to source code.
  > **Prompt:** "MONGO_URI should come from a .env (server), API_BASE should come from a .env too (client)."
- **`VITE_API_BASE`** moved from hardcoded string to `client/.env` (exposed via `import.meta.env`).
- Replaced `countDocuments()` with `estimatedDocumentCount()` to avoid a full collection scan on startup.

#### Code Quality
- **Removed all `.js` extensions** from TypeScript imports across 7 server files (18 imports total). The `tsconfig.json` already uses `"moduleResolution": "bundler"` which resolves `.ts` files without explicit extensions.
  > **Prompt:** "All these imports with .js at the end? That's very weird. Change to .ts."
- **Added ESLint to the server** with `typescript-eslint` (matching the client setup). TSLint was deprecated in 2019 — `typescript-eslint` is the modern standard.
- **Fixed all lint errors** — unused imports (`vi`, `mockedCatalog`), `prefer-const`, unused type imports.
- **Extracted `ParamField` and `WeightSlider`** from inline definitions in `AdminPage.tsx` into standalone components in `components/` with their own styles files and exported prop interfaces.
  > **Prompt:** "These repeated patterns can be components, right? ParamField, its types, and WeightSlider can go to the component folder and get their own tests."
- **Added 10 new component tests** — `WeightSlider.test.tsx` (3 tests: rendering, attributes, onChange) and `ParamField.test.tsx` (7 tests: rendering, number/text/password types, placeholder, onChange with typing, wide prop). Total client tests: 7 → 17.

#### Optimized Default Ranking Weights
- **Retuned default weights** for better out-of-the-box search quality:
  > **Prompt:** "Is this a recommended way for optimal search? Users that don't understand anything may rely on default configuration."

  | Signal | Before | After | Rationale |
  |--------|--------|-------|-----------|
  | category | 0.30 | **0.35** | Most reliable structural signal — wrong category = bad result |
  | text | 0.40 | **0.25** | Useful but noisy; keyword matches can be misleading |
  | type | 0.20 | **0.25** | Important for precision within a category |
  | style | 0.10 | **0.15** | Heuristic bonus for style/material/color matches |
  | minScore | 0.05 | **0.10** | Filters truly irrelevant results; was too permissive |

- **Default model** changed to `google/gemini-2.5-flash-lite` (vision-capable, cost-effective).

---

## [1.1.0] — 2026-02-24

### UI Restructure & Client-Side API Key Management

> **Prompt:** "Move the API key from the server config to a Zustand in-memory store on the client. Split the UI into a centered search page and a separate results page. Rename the refine label to 'Additional user prompt (optional)'."

#### API Key Architecture Change
- **Removed `openrouterApiKey` from backend** (`server/src/config.ts`, `server/src/types.ts`). The server no longer stores or manages the API key.
  - *Motivation:* The API key should never be persisted server-side. Keeping it exclusively in browser memory (Zustand) is more secure — it's never written to disk, never logged, and disappears when the tab closes.
- **Installed Zustand** for client-side state management (`client/src/store/index.ts`). The store holds `openrouterApiKey`, `searchResult`, `searchQuery`.
- **Admin page** now reads/writes the API key directly to/from Zustand instead of PUTting it to the server.
- **`searchByImage` API function** reverted to accept `apiKey` as a parameter and send it inside the `FormData` payload.

#### Search Page Split
- **Created `HomePage.tsx`** — a new centered landing page at `/` focused on the primary action: upload an image and search.
  - Vertically-centered layout with strong visual hierarchy.
  - `ImageUpload` component + optional "Additional user prompt" input.
  - On submit: validates API key (from Zustand), calls the search API, stores results in Zustand, and navigates to `/results`.
- **Renamed `SearchPage` → `ResultsPage`** — the existing split-panel layout (sidebar + results grid) now serves `/results`.
  - Reads `searchResult` and `searchQuery` from Zustand on mount.
  - If accessed directly without results, auto-redirects to `/`.
  - "← Back to fresh search" button for navigation.
- **Updated `App.tsx` routing**: `/` → `HomePage`, `/results` → `ResultsPage`, `/admin` → `AdminPage`.

  > *Motivation:* The original single-page layout combined the search input and results in one view. Splitting them provides a cleaner UX: users see a focused search prompt first, then a dedicated results view. This also decouples the search trigger from the results display.

#### Multipart Parsing Fix
- **Switched `server/src/routes/search.ts`** from `request.file()` + `request.body` to `request.parts()` iterator.
  - *Motivation:* Fastify's multipart plugin with the original approach required fields to arrive in a specific order. When the browser sent the file before the `apiKey` field, the server would halt parsing and `apiKey` would be `undefined`, causing a 400 error. The `request.parts()` iterator processes all parts regardless of order.
  > **Prompt (debugging):** "The search API is returning a 'bad request' error when a query parameter is included in the multipart payload."

#### CORS Fix
- **Added explicit `PUT` method** to `@fastify/cors` configuration in `server/src/index.ts`.
  - *Motivation:* The Admin page's `PUT /api/config` request was blocked by the browser's CORS preflight because `PUT` was not listed in the allowed methods.

#### Error Handling
- **Added `try/catch` wrapper** around the search pipeline (AI analysis + MongoDB retrieval + ranking) in `search.ts`.
  - OpenRouter errors (401 invalid key, 400 provider error) now return the actual error message to the client instead of crashing with an unhandled exception.
  - Console logs include detailed context for debugging.

#### Product Card Visual Enhancement
- **Added category-based placeholder thumbnails** to `ProductCard.tsx`.
  - *Motivation:* The MongoDB catalog has no product image URLs. Without images, cards were text-only and visually flat. Each card now displays a category emoji (🛏️ Beds, 💺 Chairs, 📚 Bookshelves, etc.) on a subtle gradient background, with rank and score badges overlaid.
  - 15 unique emoji + gradient combinations mapped to catalog categories.

#### Client API Base URL
- **Changed `API_BASE`** from `http://localhost:3001` to `http://127.0.0.1:3001` in `client/src/services/api.ts`.
  - *Motivation:* macOS DNS resolution can map `localhost` to IPv6 (`::1`) while the Fastify server binds to IPv4 (`0.0.0.0`). Using the explicit IPv4 address avoids connection mismatches.

#### Default Model
- **Set default model** to `google/gemini-2.0-flash-exp:free` (supports vision/image analysis, free tier on OpenRouter).

---

## [1.0.0] — 2026-02-23

### Initial Release

> **Prompt:** "Build a furniture image search. Upload an image → AI extracts structured attributes → query MongoDB with multiple strategies → rank results with configurable weights. Use Fastify instead of Express, OpenRouter free API instead of OpenAI."

#### Planning & Exploration
- Explored the MongoDB catalog: 2,500 products across 15 categories and 63 types.
- Discovered existing indexes: text index on `title` (weight 2) + `description` (weight 1), compound index on `category` + `type` + `price`.
- Designed a two-phase search pipeline that leverages these indexes without requiring vector embeddings.

#### Search Pipeline Implementation

**Phase 1 — AI Image Analysis:**
- Integrated OpenRouter via the OpenAI SDK (compatible API format) in `server/src/services/ai.ts`.
- Engineered a structured extraction prompt that includes all 15 valid categories and 63 valid types, forcing the vision model to map to exact catalog values.
- Prompt output schema: `{ category, type, style, material, color, searchTerms[], confidence }`.
- Optional user text query is injected into the AI prompt as additional context for refining the analysis.

**Phase 2 — Multi-Signal Retrieval & Ranking:**
- Implemented three parallel MongoDB query strategies in `server/src/services/catalog.ts`:
  1. **Text search** — `$text` with AI-generated search terms → MongoDB `textScore`
  2. **Category + Type exact match** — compound index for structural precision
  3. **Category-only fallback** — broader recall when type matching is too narrow
- Built a configurable ranker in `server/src/services/ranker.ts`:
  - Scoring formula: `score = w_text × textScore + w_category × categoryMatch + w_type × typeMatch + w_style × styleMatch`
  - Style matching uses a heuristic substring check of AI-detected `style`, `material`, and `color` against product `title` + `description`.
  - Default weights: text=0.40, category=0.30, type=0.20, style=0.10.
  - Over-fetches candidates (3× `maxResults`) then deduplicates and trims.

  > *Design decision:* Structured extraction + existing indexes (vs. embedding-based search) was chosen because the catalog is small (2,500 items), the indexes already exist in a read-only database, and no vector infrastructure is needed.

#### Backend — Fastify + TypeScript
- Fastify server with `@fastify/multipart` (10MB file limit) and `@fastify/cors`.
- Three API endpoints:
  - `POST /api/search` — multipart image upload + optional query → ranked results
  - `GET /PUT /api/config` — admin-tunable ranking parameters
  - `GET /api/health` — server health check
- In-memory configuration store for runtime parameter tuning (weights, maxResults, minScore, model).
  > **Prompt:** "Use Fastify instead of Express, OpenRouter free API instead of OpenAI."

#### Frontend — React + Vite + TypeScript
- Dark-themed UI with Emotion CSS styling.
- **SearchPage** — split layout: sidebar (upload + query) and results grid.
- **AdminPage** — back-office panel with:
  - Ranking weight sliders (text, category, type, style).
  - Max results, min score threshold, AI model selector.
  > **Prompt:** "Create an admin page as an internal back-office interface with controls for all meta-parameters."
- **ImageUpload component** — drag-and-drop with file preview.
- **ProductCard component** — displays title, description, category/type badges, price, dimensions, and signal breakdown bars.
- Loading states, error handling, empty states.

#### CSS Refactoring to Emotion
- Extracted all inline and CSS-module styles into separate `*.styles.tsx` files using `@emotion/css`.
- Created a shared `theme.ts` with design tokens (colors, radii, gradients).
  > **Prompt:** "Refactor all client CSS to use `@emotion/css` — extract styles into separate `.styles.tsx` files for each component and page."

#### Testing
- Unit tests for both server and client using Vitest.
- Server tests: AI service, ranker, catalog, config routes, search routes.
- Client tests: ImageUpload, ProductCard, HomePage, ResultsPage, API service.

#### Documentation
- README with architecture overview, search pipeline explanation, design decisions table, tradeoffs, admin panel guide, evaluation approach, and future enhancements.
- This changelog with development prompts and motivations.

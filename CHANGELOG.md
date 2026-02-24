# Changelog

## [1.0.0] — 2026-02-23

### Initial Release

#### Search Engine
- **Two-phase search pipeline**: AI vision analysis → multi-signal MongoDB retrieval → configurable ranking
- **AI prompt engineering**: Structured extraction prompt includes all 15 categories and 63 types from the catalog, ensuring the vision model maps to exact catalog values
  - *Prompt*: "Build a furniture image search. Upload an image → AI extracts structured attributes → query MongoDB with multiple strategies → rank results with configurable weights"
- **Three query strategies** run in parallel:
  1. MongoDB `$text` search using AI-generated terms (leverages existing title/description text index)
  2. Category + Type exact match (leverages existing compound index)
  3. Category-only fallback for broader recall
- **Scoring formula**: weighted combination of text relevance, category match, type match, and style heuristic (substring matching of style/material/color against product text)
- **Default weights**: text=0.4, category=0.3, type=0.2, style=0.1 — prioritizes text relevance and structural category matching

#### Backend (Fastify + TypeScript)
- Fastify server with multipart upload support (10MB limit)
- OpenRouter API integration via OpenAI SDK (compatible API format)
- In-memory configuration store for admin-tunable parameters
- Three API endpoints: `POST /api/search`, `GET/PUT /api/config`, `GET /api/health`
  - *Prompt*: "Use Fastify instead of Express, OpenRouter free API instead of OpenAI"

#### Frontend (React + Vite + TypeScript)
- Dark-themed UI with search page and admin page
- Drag-and-drop image upload with preview
- Optional natural-language query refinement
- Product cards with score visualization (signal breakdown bars)
- Admin panel with ranking weight sliders, result limit, score threshold, and model selector
  - *Prompt*: "Create an admin page as an internal back-office interface with controls for all meta-parameters"

#### Documentation
- README with architecture overview, design decisions, evaluation approach
- This changelog with development prompts

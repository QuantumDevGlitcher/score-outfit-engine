### Overview
The `server` directory implements the TypeScript/Express API that your React SPA talks to. It also acts as a thin orchestration layer between:
- the client (uploading images, requesting recommendations, saving/deleting items),
- MongoDB (persisting wardrobe items, recommendation history, saved outfits, and user preferences), and
- the Python ML service (`ml-service/main.py`) that does the heavy lifting (image analysis, recommendations, and feedback updates).

A single `createServer()` function wires up routes under `/api/*`. Most “intelligent” work is delegated to the Python service via HTTP using the `PYTHON_MODEL_URL` environment variable (default: `http://127.0.0.1:8001`).

Below is what each file does, how they relate to each other, and how they interface with `ml-service/main.py`.

---

### server/index.ts
- Exposes `createServer()` that sets up the Express app:
    - Middleware: `cors`, JSON/urlencoded body parsing (50MB limits), static serving of `/uploads` (generated images/files).
    - File uploads: Configures `multer` to use in-memory storage for single-file image endpoints.
    - Health/simple routes: `GET /api/ping`, `GET /api/demo`.
    - Main API routes (all JSON unless noted):
        - `POST /api/analyze-outfit` (multipart image)
        - `POST /api/recommend/full`
        - `POST /api/recommend/from-wardrobe`
        - `POST /api/feedback`
        - Wardrobe: `GET /api/wardrobe`, `POST /api/wardrobe/add` (multipart), `POST /api/wardrobe/bulk-add`, `DELETE /api/wardrobe`
        - Saved outfits: `GET /api/saved-outfits`, `POST /api/saved-outfits`, `DELETE /api/saved-outfits/:id`
        - History: `GET /api/history`, `DELETE /api/history/:id`
    - Calls `ensureMongoIndexes()` on startup.
    - Adds alias routes without the `/api` prefix for convenience (same handlers).
- Relationships:
    - Imports all route handlers from `server/routes/*`.
    - Imports `ensureMongoIndexes` from `server/db.ts`.
- Tie-in to `ml-service/main.py`:
    - The actual ML processing is not done here. The handlers proxy JSON/multipart payloads to the Python endpoints and return their responses to the client. The base URL is read from `PYTHON_MODEL_URL`.

### server/node-build.ts
- Production entry that constructs the server and serves the built SPA:
    - Calls `createServer()` from `index.ts`.
    - Serves static files from `../spa` and falls back to `index.html` for React Router routes (except paths starting with `/api/` or `/health`).
    - Starts listening on `process.env.PORT || 3000`.
    - Adds basic SIGTERM/SIGINT handlers for graceful shutdown.
- Relationships: depends on `index.ts` for the Express app and routes.

### server/db.ts
- Centralizes MongoDB setup and typed collection accessors.
- Reads `MONGO_URI` and `MONGO_DB_NAME` (defaults: `mongodb://127.0.0.1:27018` and `score_db`).
- Lazily creates and reuses a single `MongoClient` connection.
- Exposes functions returning typed collections:
    - `getUserProfileCollection()` → `user_profiles`
    - `getSavedOutfitsCollection()` → `saved_outfits`
    - `getRecommendationRunsCollection()` → `recommendation_runs`
    - `getWardrobeCollection()` → `wardrobe_items`
- `ensureMongoIndexes()` sets helpful indexes on `recommendation_runs` and `wardrobe_items` for query performance.
- Relationships:
    - Consumed by all route handlers that need DB access.
- Tie-in to `ml-service/main.py`:
    - Stores/reads user preference vectors (`alpha`, `beta`, `user_centroid`) returned or needed by the ML service.
    - Persists recommendation runs and wardrobe items that are built from or fed to the ML service.

### server/types.ts
- Defines shared TypeScript types used across server routes and DB documents:
    - `Color`, `OutfitItem`, `CurrentOutfitRepresentation`, `ContextInput`, `Recommendation`, …
    - Mongo document shapes: `WardrobeItemDoc`, `RecommendationRunDoc`, `UserProfileDoc`, `SavedOutfitDoc`.
- Relationships:
    - Imported by `db.ts` and several route handlers for type safety.
- Tie-in to `ml-service/main.py`:
    - Mirrors the Pydantic models in `main.py` (e.g., `Color`, `OutfitItem`, `CurrentOutfitRepresentation`, `ContextInput`) so payloads match the FastAPI endpoints.

### server/routes/analyze-outfit.ts
- Route handler: `POST /api/analyze-outfit` (multipart with an `image` file).
- Validates presence/mimetype of the image, constructs a `FormData` payload, and proxies it to the Python endpoint:
    - Calls `POST {PYTHON_MODEL_URL}/analyze-outfit`.
    - Returns the Python response JSON directly to the client.
- Relationships:
    - Used by `index.ts`.
- Tie-in to `ml-service/main.py`:
    - Corresponds to `def analyze_outfit(image: UploadFile = File(...))`.
    - Python extracts garments, predicts attributes, builds embeddings (`visual_embedding`, `outfit_embedding`), colors, confidence, etc., and returns structured items. The server just passes this through.

### server/routes/recommend.ts
- Exposes four handlers:
    - `handleRecommendFull` → `POST /api/recommend/full`
        - Validates body (Zod) for `context` and a full `outfit` with `items`.
        - Looks up the user profile to enrich the `context` with `alpha`, `beta`, and `user_centroid` preferences.
        - Calls `POST {PYTHON_MODEL_URL}/recommend/full` with `{ context, outfit }`.
        - On success, stores a `recommendation_runs` record in Mongo and returns `{ ...pythonResponse, run_id }`.
    - `handleRecommendFromWardrobe` → `POST /api/recommend/from-wardrobe`
        - Validates body for `context`, a `query`, and optional `uploaded_outfit`.
        - Fetches active wardrobe items from Mongo, maps them to the ML schema expected by Python (`clothing_type`, `category_id`, `colors`, `visual_embedding`, `image_path`, …).
        - Enriches `context` with user preferences from `user_profiles`.
        - Calls `POST {PYTHON_MODEL_URL}/recommend/from-pool` with `{ context, query, pool, uploaded_outfit }`.
        - Saves the run in `recommendation_runs` and returns `{ ...pythonResponse, run_id }`.
    - `handleGetHistory` → `GET /api/history`
        - Reads recent `recommendation_runs` from Mongo, sorted by `created_at`.
    - `handleDeleteHistory` → `DELETE /api/history/:id`
        - Validates `:id`, deletes a single run from `recommendation_runs`.
- Relationships:
    - Depends on `db.ts` for `getRecommendationRunsCollection`, `getWardrobeCollection`, and `getUserProfileCollection`.
- Tie-in to `ml-service/main.py`:
    - Directly maps to `recommend_full` and `recommend_from_pool` logic:
        - `main.py` classes: `ContextInput`, `CurrentOutfitRepresentation`, `RecommendFromPoolRequest`.
        - Python returns a list of `Recommendation` items with scores/embeddings that the server persists/forwards.

### server/routes/feedback.ts
- Route: `POST /api/feedback`.
- Validates a feedback payload containing `session_id`, `outfit_embedding`, `liked`, `s_style`, `s_rel`.
- Fetches current user preferences from Mongo and sends them along with the feedback to Python:
    - Calls `POST {PYTHON_MODEL_URL}/feedback`.
- On success, updates `user_profiles` in Mongo with the new preferences returned by Python (`new_alpha`, `new_beta`, `new_user_centroid`).
- Relationships: uses `getUserProfileCollection` from `db.ts`.
- Tie-in to `ml-service/main.py`:
    - Matches `FeedbackRequest` and `update_feedback()` endpoint. The ML service updates preference vectors based on user signals.

### server/routes/wardrobe.ts
- Handlers:
    - `handleAddFromImage` → `POST /api/wardrobe/add` (multipart image)
        - Sends the image to `{PYTHON_MODEL_URL}/analyze-outfit` to extract items and their ML features.
        - Translates ML output into provisional wardrobe items (normalizing fields, adding defaults like `seasons`, `tags`). Returns items for client confirmation rather than persisting immediately.
    - `handleBulkAddItems` → `POST /api/wardrobe/bulk-add`
        - Accepts an array of items (usually from the previous step after user confirmation), inserts them into `wardrobe_items` with `is_active: true`.
    - `handleGetWardrobe` → `GET /api/wardrobe`
        - Returns all active wardrobe items.
    - `handleDeleteWardrobeItems` → `DELETE /api/wardrobe`
        - Soft-deletes items by setting `status.is_active` to `false` on a batch of ObjectIds.
- Relationships:
    - Uses `getWardrobeCollection` from `db.ts`.
- Tie-in to `ml-service/main.py`:
    - Reuses the same `analyze_outfit` endpoint to turn raw images into structured, ML-enriched wardrobe items. The same fields (`visual_embedding`, `dominant_colors`, `category_id`, etc.) are later sent back to Python for recommendations.

### server/routes/saved-outfits.ts
- Handlers for persisting user-favorited results:
    - `handleSaveOutfit` → `POST /api/saved-outfits`
    - `handleGetSavedOutfits` → `GET /api/saved-outfits`
    - `handleDeleteSavedOutfit` → `DELETE /api/saved-outfits/:id`
- Relationships:
    - Uses `getSavedOutfitsCollection` from `db.ts`.
- Tie-in to `ml-service/main.py`:
    - No direct Python calls here; this is a pure persistence layer for outfits that often originate from ML recommendations.

### server/routes/demo.ts
- Simple example endpoint `GET /api/demo` returning a typed payload using `@shared/api`.
- Relationships: none beyond being plugged into `index.ts`.
- Tie-in to `ml-service/main.py`: none.

---

### How everything works together with ml-service/main.py
- The Python service is a FastAPI app (`app = FastAPI(title="SCORE ML Service")`) defining Pydantic models that mirror the server’s TypeScript types.
- Key Python endpoints that the server calls:
    - `POST /analyze-outfit` → parses clothing from an image, infers attributes, returns per-item features plus `outfit_embedding`, `s_style`, `s_rel`.
    - `POST /recommend/full` → takes `context` + current `outfit` to produce recommendations.
    - `POST /recommend/from-pool` → takes `context` + natural-language `query` + a `pool` (from the wardrobe DB) and optional `uploaded_outfit`.
    - `POST /feedback` → updates user preference vectors (`alpha`, `beta`, `user_centroid`) based on like/dislike and embedding.
    - Health (in code): `def health()` is present, typically exposed as `GET /health`.
- Data flow summary:
    1. Client uploads an image → `server/routes/analyze-outfit.ts` → Python `analyze_outfit` → returns structured items.
    2. Client confirms/adds items → `server/routes/wardrobe.ts` persists to Mongo.
    3. Client asks for recs from the current outfit → `server/routes/recommend.ts` enriches with user preferences → Python `/recommend/full` → server stores run in Mongo and returns.
    4. Client asks for recs from wardrobe/query → `server/routes/recommend.ts` loads pool from Mongo → Python `/recommend/from-pool` → store run and return.
    5. Client sends feedback on a recommendation → `server/routes/feedback.ts` → Python `/feedback` returns updated prefs → server persists to `user_profiles`.

---

### Environment variables that connect both sides
- `PYTHON_MODEL_URL` (server) → base URL for the FastAPI app (default `http://127.0.0.1:8001`).
- `UPLOAD_DIR` (both) → used to align where images are stored/read (FastAPI writes under `public/uploads`, server serves `/uploads/*`).
- `MONGO_URI`, `MONGO_DB_NAME` (server) → Mongo access for persistence.

---

### Quick mapping: Express routes → FastAPI endpoints
- `POST /api/analyze-outfit` → `POST {PYTHON_MODEL_URL}/analyze-outfit`
- `POST /api/recommend/full` → `POST {PYTHON_MODEL_URL}/recommend/full`
- `POST /api/recommend/from-wardrobe` → `POST {PYTHON_MODEL_URL}/recommend/from-pool`
- `POST /api/feedback` → `POST {PYTHON_MODEL_URL}/feedback`

This separation keeps the Express server focused on routing, validation, security, and persistence, while the Python service focuses on ML inference and learning from feedback.
# 05 – Web Frontend (React SPA)

## 1. Purpose

The GUI module provides a visual interface for SCORE to support:
- fast demos,
- non-technical users,
- interactive configuration (context, wardrobe items, feedback).

The GUI is a **presentation adapter**, not a logic layer.

---

## 2. Architectural Role

Within Clean Architecture:

```text
GUI
↓
Application Use Cases
↓
Domain
```

The GUI’s responsibility is to:
- collect user inputs (forms / selectors),
- call core use cases,
- render results (ranked outfits, explanations, scores),
- capture feedback (like/dislike/neutral).

The GUI must NOT:
- contain scoring rules,
- implement decision-making,
- replicate core logic.

---

## 3. Technology Stack

The frontend uses:

- React 18 + Vite
- TailwindCSS 3 + Radix UI
- React Router 6 (SPA routing)
- TanStack Query (data fetching/caching)

All stateful business logic remains in backend services (Express API and FastAPI ML).

---

## 4. GUI Features (Version 1)

Version 1 GUI is focused on enabling a functional demo:

- Context selection (e.g., university, presentation, gym)
- Manual garment input (kind, color, material)
- Wardrobe browsing (My Wardrobe concept)
- Recommendation results panel:
  - ranked list
  - numeric scores
  - explanation strings
- Feedback buttons (optional):
  - Like / Neutral / Dislike
  - used to simulate personalization loop (stub or minimal)

---

## 5. Data Flow

1. User selects context
2. User provides current garments (manual or via upload)
3. React calls Express API endpoints (e.g., `POST /api/recommendations`)
4. Express coordinates with the FastAPI ML service when needed
5. React renders results (score + explanation)
6. React may send feedback to `POST /api/feedback` for personalization

---

## 6. Frontend/Backend Boundary

The React SPA communicates exclusively via HTTP to the Express API and never embeds business logic. It may import shared TypeScript types from `shared/` using the `@shared/*` alias for request/response modeling.

The frontend must never implement:
- fuzzy rules
- scoring weights
- ranking logic

All intelligence lives in the backend services.

---

## 7. Example Internal Structure

```text
client/
├── App.tsx
├── global.css
├── pages/
│  ├── Landing.tsx
│  ├── Dashboard.tsx
│  ├── Wardrobe.tsx
│  ├── SavedOutfits.tsx
│  ├── History.tsx
│  └── Preferences.tsx
├── components/
│  ├── Sidebar.tsx
│  ├── NavigationMenu.tsx
│  └── ui/
└── lib/
```

This keeps the UI modular and readable.

---

## 8. Testing Strategy

GUI tests are optional for Version 1.

If implemented, they should focus on:
- input validation logic at the UI layer
- formatting correctness
- mocking the core use case calls

Core must remain fully testable independently.

---

## 9. Why React + Vite

- Production-ready SPA with fast HMR
- Seamless integration with TypeScript and TailwindCSS
- Rich ecosystem (Radix UI, TanStack Query)
- Single-port dev experience with the Express server

---

## 10. Future GUI Extensions

Potential future improvements:

- photo input + perception preview (“detected colors/materials”)
- wardrobe import/export
- recommendation history
- difference comparison view (before/after preference learning)

These are excluded from Version 1 unless time permits.

---

## 11. Summary

The web frontend:

- is a presentation adapter,
- provides an interactive SPA,
- depends on API contracts only,
- contains zero business logic.

The frontend is replaceable.

The backend intelligence is not.

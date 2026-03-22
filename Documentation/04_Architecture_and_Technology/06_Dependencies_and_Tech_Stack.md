# 06 – Dependencies and Technology Stack

## 1. Overview

SCORE is designed as a modular, cross-platform Python system
targeting Windows and macOS environments.

The technology stack is selected based on:

- architectural clarity
- reproducibility
- minimal friction for a small academic team
- future extensibility

---

# 2. Tech Stack Overview

- **Frontend**: React 18 + Vite + TailwindCSS + Radix UI
- **Backend**: Express API (Node.js)
- **ML Service**: FastAPI (Python 3.13+)
- **Database**: MongoDB (running in Docker)
- **Package Manager**: PNPM (for JS/TS), pip/venv (for Python)

---

# 3. Environment Strategy

## 3.1 Environment Manager

We use:

- **PNPM**: Fast, disk-efficient package manager for the Node.js parts.
- **Python venv**: Standard Python virtual environments for the `ml-service`.
- **Docker**: Specifically for running the MongoDB database container.

### Why this combination?

PNPM:
- Handles the complex dependency tree of a modern React/Express app efficiently.
- Shared store reduces disk usage across projects.

Docker:
- Ensures a consistent MongoDB environment across all developer machines.
- Easy to start/stop without installing MongoDB locally.

FastAPI:
- High performance, asynchronous Python framework.
- Automatic interactive API documentation (Swagger/OpenAPI).

---

## 3.2 Lock Strategy

After installing dependencies:

```bash
uv pip freeze > requirements.lock.txt
```

This file ensures:

- all team members share identical dependency versions
- reproducible installs
- easier debugging across platforms

---

# 4. Core Dependencies (score-core)

## 4.1 ML / Vision

- `torch`
- `torchvision`
- `opencv-python`
- `numpy`

### Purpose

- Image processing (future)
- Feature extraction
- Tensor operations
- Foundation for perception layer

Note:
Version 1 does not require heavy model training.
Pretrained backbones or lightweight logic are enough.

---

## 4.2 Fuzzy Logic

- `scikit-fuzzy`

Purpose:
- Define membership functions
- Implement interpretable scoring logic
- Model soft fashion constraints (e.g., "too bright", "formal enough")

Rationale:
Fuzzy logic allows explainable scoring instead of black-box ML.

---

## 4.3 Data Validation

- `pydantic`

Purpose:
- Structured domain models
- Input validation
- Strong typing support

Used across domain and application layers.

---

# 5. API Dependencies

- `express`
- `cors`
- `multer` (for file uploads)
- `zod` (for schema validation)

# 6. ML Service Dependencies

- `fastapi`
- `uvicorn`
- `torch` & `torchvision` (for inference)
- `scikit-fuzzy` (for scoring logic)

Purpose:

- Rapid interactive interface
- Table visualization
- Demo-ready interface for presentations

GUI dependencies are isolated in `score-gui`.

Core must never depend on GUI libraries.

---

# 7. Storage Options

Version 1 supports:

- In-memory objects
- JSON storage (simple persistence)

Future option:
- SQLite
- SQLAlchemy

We avoid early database complexity in Version 1.

---

# 8. Testing and Code Quality

- `pytest`
- `ruff`
- optional: `pre-commit`

Purpose:

- ensure correctness
- enforce style
- maintain consistent code quality

---

# 9. Cross-Platform Considerations

Target platforms:

- Windows (primary development)
- macOS (expected team usage)

Key compatibility concerns:

- PyTorch CPU version consistency
- OpenCV binary compatibility
- Conda channel alignment

Conda mitigates most platform-specific issues.

---

# 10. Docker Usage

Docker is used for the database layer:

- **MongoDB**: Provides a reliable document store for wardrobe and user data.
- **score-mongo**: Pre-configured container name for consistency.

---

# 11. Summary

The stack prioritizes:

- clarity
- modularity
- explainability
- reproducibility
- low friction for a mixed-experience team

This is not an experimental stack.

It is intentionally structured for long-term scalability.

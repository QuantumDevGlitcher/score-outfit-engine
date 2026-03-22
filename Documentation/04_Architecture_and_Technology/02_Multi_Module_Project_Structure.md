# 02 – Multi-Module Project Structure

## 1. Purpose

SCORE is structured as a **multi-module Python project** to replicate the separation-of-concerns style commonly seen in Gradle multi-module projects (core / cli / gui), while remaining idiomatic to Python packaging.

The goal is to:
- isolate dependencies per module,
- enforce architectural boundaries,
- support multiple entrypoints (CLI + GUI),
- and reduce setup friction for a mixed-skill team.

---

## 2. Repository Layout

High-level layout:

```text
SCORE/
├── packages/
│ ├── core/
│ │ ├── src/
│ │ ├── tests/
│ │ └── pyproject.toml
│ ├── cli/
│ │ ├── src/
│ │ ├── tests/
│ │ └── pyproject.toml
│ └── gui/
│ ├── src/
│ ├── tests/
│ └── pyproject.toml
│
├── Documentation/
├── assets/
├── scripts/
└── pyproject.toml (workspace-level metadata)
```

---

## 3. Module Responsibilities

### 3.1 `packages/core` (score-core)

Core contains **all business logic** and must remain UI/framework independent.

Includes:
- Domain entities (Garment, Outfit, etc.)
- Use cases (recommend_outfits, update_preferences)
- Ports (interfaces for wardrobe storage, perception inputs)
- Scoring engine (fuzzy rules + context logic)

Core must **not** import:
- Typer, Rich, Streamlit
- OpenCV UI components
- Database-specific code (unless behind adapters)

---

### 3.2 `packages/cli` (score-cli)

CLI contains:
- Typer application
- command definitions
- input parsing and output formatting

CLI depends on:
- score-core

CLI must not contain:
- business logic
- scoring rules
- learning algorithms

---

### 3.3 `packages/gui` (score-gui)

GUI contains:
- Streamlit UI
- user input forms
- wardrobe browsing UX
- visualization and charts (optional)

GUI depends on:
- score-core

GUI must not contain:
- business logic
- scoring rules
- learning algorithms

---

## 4. Dependency Rules (Hard Constraints)

Allowed dependencies:

- `cli` → `core`
- `gui` → `core`

Forbidden dependencies:

- `core` → `cli`
- `core` → `gui`
- `cli` ↔ `gui` (direct coupling)

This maintains a Clean Architecture dependency direction.

---

## 5. Python Equivalent of “Gradle Multi-Module”

In Gradle, each module has its own dependencies and build file.

In SCORE, each module has:
- its own `pyproject.toml`
- its own dependency set
- its own tests folder

The integration happens via editable installations:
```bash
uv pip install -e packages/core
uv pip install -e packages/cli
uv pip install -e packages/gui
```

This makes modules behave like locally-linked packages.

---

## 6. Environment Strategy

SCORE uses:

- **Conda** to manage Python runtime (cross-platform stability)
- **uv** to manage dependencies + fast installs

Rationale:
- Conda avoids OS-specific failures with ML/vision stacks.
- uv provides faster installs and consistent dependency locking.

Target Python version:
- Python 3.11

---

## 7. Setup Instructions (For Teammates)

### 7.1 Install Miniconda (once)

Install Miniconda on each machine, then open a new terminal session.

### 7.2 Create and activate environment

```bash
conda create -n score python=3.11 -y
conda activate score
```

### 7.3 Install uv

```bash
python -m pip install -U uv
```

### 7.4 Install modules (editable)

From the project root:

```bash
uv pip install -e packages/core
uv pip install -e packages/cli
uv pip install -e packages/gui
```

### 7.5 Run a quick wiring test

```bash
python -c "import score_core, score_cli; print('OK')"
score --help
score recommend run --context presentation
```

---

## 8. Locking Dependencies (Team Consistency)

After installing dependencies, generate a lock snapshot:

```bash
uv pip freeze > requirements.lock.txt
```

Notes:
- The lock file is a reproducibility snapshot for the team.
- This is not the dataset and must remain small.

---

## 9. What Must NOT Be Committed

Do not commit:
- dataset files (46k images)
- model checkpoints (100–500MB)
- local env folders (`.venv/`, `miniconda3/`, `envs/`)
- OS junk files

Recommended `.gitignore` entries:

```text
.venv/
pycache/
*.pyc
.env
.DS_Store
Thumbs.db
*.pt
*.pth
data/
datasets/
checkpoints/
models/
```

---

## 10. Extending the Project

When adding new functionality:

1. Add it to `core` as a use case, entity, or port.
2. Expose it through CLI as a command.
3. Expose it through GUI as a UI flow.

Never implement business logic directly in CLI or GUI.

---

## 11. Summary

SCORE uses a multi-module Python structure to enforce Clean Architecture boundaries and support scalable development.

This structure is designed to:
- reduce dependency conflicts,
- improve maintainability,
- and make cross-platform setup predictable for a mixed-skill team.
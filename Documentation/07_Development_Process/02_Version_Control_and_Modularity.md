# 02 – Version Control and Modularity

## 1. Purpose

This document defines:

- repository structure
- multi-module design
- dependency isolation
- version control practices

SCORE is structured to reflect professional multi-module systems.

---

## 2. Repository Structure

The project follows a multi-package layout:

```text
SCORE/
│
├── packages/
│ ├── core/
│ ├── cli/
│ └── gui/
│
├── Documentation/
├── requirements.lock.txt
└── README.md
```

Each package has:

- its own pyproject.toml
- isolated dependencies
- independent installation capability

---

## 3. Module Responsibilities

### 3.1 Core Module

Contains:

- domain entities
- scoring engine
- fuzzy logic
- reinforcement adaptation
- use cases

Core must not depend on:

- CLI
- GUI
- external UI frameworks

It is the architectural center.

---

### 3.2 CLI Module

Contains:

- Typer-based interface
- command definitions
- argument parsing

Depends on:

- core module only

It does not contain business logic.

---

### 3.3 GUI Module

Contains:

- Streamlit interface
- visual components
- user interaction flow

Depends on:

- core module only

It does not implement scoring logic.

---

## 4. Editable Installation Strategy

During development, packages are installed in editable mode:

```bash
uv pip install -e packages/core
uv pip install -e packages/cli
uv pip install -e packages/gui
```

This allows:

- live code updates
- modular separation
- realistic package simulation

---

## 5. Dependency Isolation

Each module defines its own dependencies:

Core:
- torch
- numpy
- scikit-fuzzy

CLI:
- typer
- rich

GUI:
- streamlit
- pandas

This prevents unnecessary dependency bloat in the core.

---

## 6. Environment Strategy

The project uses:

- Conda environment (Python 3.11)
- uv for dependency management
- locked dependency snapshot

This ensures:

- cross-machine reproducibility
- consistent installations
- minimized compatibility issues

---

## 7. Branch Strategy

Recommended workflow:

- main → stable
- feature branches → development
- pull request → integration

Example:

```text
feature/scoring-engine
feature/reinforcement-adaptation
feature/vision-training
```

Avoid direct commits to the main.

---

## 8. Commit Discipline

Commits should be:

- descriptive
- modular
- scoped

Example:

```text
feat(core): implement fuzzy scoring engine
fix(cli): correct command routing
docs(data): add dataset exclusion section
```

---

## 9. Why Multi-Module?

Benefits:

- separation of concerns
- testability
- scalability
- easier debugging
- architectural clarity

Even in academic scope,
this prepares for real-world systems.

---

## 10. Summary

SCORE follows:

- clean modular separation
- editable package simulation
- isolated dependencies
- disciplined version control

The system is structured as if it were a production project.

# 03 – Core Module (score-core)

## 1. Purpose

The **core module** contains all business logic and decision-making mechanisms of SCORE.

It is fully independent of:
- CLI frameworks (Typer, Rich)
- GUI frameworks (Streamlit)
- external UI logic
- presentation formatting

Core is the **brain of the system**.

---

## 2. Architectural Style

The core follows a simplified Clean Architecture approach:

```text
Domain Layer
↓
Application Layer (Use Cases)
↓
Ports (Interfaces)
```

External systems (CLI, GUI, datasets, storage, ML models) must interact with the core only through defined interfaces.

---

## 3. Internal Structure

Suggested internal structure:

```text
packages/core/src/score_core/
│
├── domain/
│ ├── entities/
│ │ ├── garment.py
│ │ ├── outfit.py
│ │ └── user_profile.py
│ ├── value_objects/
│ │ ├── color.py
│ │ ├── context.py
│ │ └── score.py
│ └── rules/
│ └── harmony_rules.py
│
├── application/
│ ├── use_cases/
│ │ ├── recommend_outfit.py
│ │ ├── update_preferences.py
│ │ └── score_combination.py
│ └── services/
│ └── scoring_engine.py
│
├── ports/
│ ├── wardrobe_repository.py
│ ├── perception_gateway.py
│ └── preference_store.py
│
└── init.py
```

This is a logical structure — it can evolve.

---

## 4. Domain Layer

The Domain layer defines the core concepts of the system.

Examples:

- `Garment`
- `Outfit`
- `UserProfile`
- `Context`
- `Score`

Rules:
- No framework imports
- No external services
- Pure Python logic only

This layer should be deterministic and testable in isolation.

---

## 5. Application Layer (Use Cases)

Use cases orchestrate domain objects.

Example:

`recommend_outfits(current: List[Garment], context: str) -> List[Recommendation]`

Responsibilities:
- coordinate scoring engine
- apply harmony rules
- integrate user preferences
- rank combinations

This layer may:
- call scoring services
- call ports (interfaces)

This layer must NOT:
- read files directly
- call Streamlit
- print output
- depend on CLI input parsing

---

## 6. Scoring Engine

The scoring engine is where:

- fuzzy logic lives
- harmony scoring happens
- context modifiers are applied
- reinforcement signals may be integrated later

It must remain framework-agnostic.

Example scoring components:

- Color harmony score
- Context appropriateness score
- User preference alignment score
- Penalty rules

The final score aggregation strategy must be documented.

---

## 7. Ports (Interfaces)

Ports define how the core communicates with the outside world.

Examples:

- `WardrobeRepository`
- `PerceptionGateway`
- `PreferenceStore`

These are abstract interfaces.

Implementations of these ports live OUTSIDE the core (in CLI, GUI, or infrastructure adapters).

This allows:
- testing with mocks
- swapping storage
- future database integration
- future ML-based perception

---

## 8. Reinforcement Learning (Future Integration)

The RL component, when added, must:

- live inside the core module
- operate as a service
- update preference weights
- not depend on UI

Possible placement:

```text
application/services/reinforcement_engine.py
```

The RL module will:
- receive feedback signals
- adjust scoring weights
- persist learned state through a port

---

## 9. Dependency Constraints (Strict)

Core MAY import:
- standard library
- numpy
- torch (if needed)
- scikit-fuzzy
- pydantic (optional validation)

Core MUST NOT import:
- typer
- streamlit
- rich
- click
- pandas (unless used strictly for data transformation internally)
- GUI-related modules

Violating this breaks architectural integrity.

---

## 10. Testing Strategy

Core must have:

```text
packages/core/tests/
```

Tests should cover:
- garment scoring logic
- harmony rule evaluation
- ranking consistency
- deterministic scoring behavior

Core must be testable without CLI or GUI installed.

---

## 11. What Core Does NOT Do (Version 1)

Core does not:

- perform full garment segmentation
- process raw camera feeds
- perform large-scale dataset training
- perform body-shape modeling
- deploy cloud APIs

These are future enhancements.

---

## 12. Architectural Principle

Core is designed to be:

- Stable
- Deterministic
- Framework-agnostic
- Testable in isolation
- Extensible without modifying outer layers

The CLI and GUI are replaceable.

The core is not.

---

## 13. Summary

The `score-core` module encapsulates all intelligence of the system.

It enforces separation between:

- decision logic
- presentation logic
- infrastructure

This guarantees scalability, testability, and long-term maintainability.

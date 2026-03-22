# 08 - SCORE Core Module Structure

## 1. Purpose

This document defines the internal structure of the `score_core` module.

The goal is to:
- Clearly separate domain logic from infrastructure.
- Allow Android, Web, and Desktop to share the same core logic.
- Support multiple scoring strategies (rules, fuzzy, neural).
- Allow perception models (CNN-based) to evolve independently.

This module follows **Clean Architecture** principles.

---

## 2. High-Level Architecture

```text
score_core/
├── domain/         # Pure business logic (entities, value objects)
├── ports/          # Interfaces / Contracts for external systems
├── application/    # Use cases and services
├── scoring/        # Scoring implementations (Rules, Fuzzy, NN)
├── adapters/       # Mapping and translation
├── infrastructure/ # Concrete implementations of ports
└── utils/          # Common helpers and cross-cutting utilities
```

Each layer has a specific responsibility and dependency direction.

Dependencies always point inward:
**Infrastructure → Adapters → Application → Domain**

---

## 3. Domain Layer (Pure Business Logic)

**Location:** `score_core/domain/`

This layer contains pure business concepts.
- No external libraries.
- No database access.
- No HTTP.
- No ML frameworks.

### Entities

Entities represent core business concepts. They encapsulate business rules and invariants, should be immutable, and have no side effects.

```text
entities/
├── garment.py       # Representation of a wardrobe item
├── outfit.py        # Structured set of garments organized by slot
└── user_profile.py  # Learned preferences and style tendencies
```

### Value Objects

Value objects represent simple data types used by entities and use cases.

```text
value_objects/
├── context.py      # Occasion + weather + temperature labels
├── color.py        # Hex code + color helper methods
├── score.py        # 0–100 value + component breakdown
└── explanation.py  # Structured explanation entries
```

### Errors

```text
errors.py           # Domain-specific exceptions (e.g., MissingSlot, InvalidLayering)
```

---

## 4. Ports Layer (Interfaces / Contracts)

**Location:** `score_core/ports/`

Ports define what the core expects from the outside world. They are abstract base classes or interfaces that infrastructure must implement.

```text
ports/
├── scoring/
│   └── scoring_engine_port.py    # Interface for the scoring engine
├── recommender/
│   └── recommender_port.py       # Interface for the full recommendation pipeline
├── storage/
│   └── wardrobe_repository_port.py # Interface for loading/saving wardrobe items
├── preferences/
│   └── preferences_port.py       # Interface for storing feedback and weights
├── perception/
│   └── perception_port.py        # Interface to CNN-based garment classification
└── context/
    └── context_provider_port.py  # Optional weather/temperature provider interface
```

---

## 5. Application Layer (Use Cases)

**Location:** `score_core/application/`

Coordinates domain entities, scoring logic, and ports to execute specific business actions.

### Use Cases

Use cases validate inputs, select templates, call the scoring engine, and return structured outputs.

```text
use_cases/
├── uc01_outfit_completion.py    # Complete missing slots in a partial outfit
├── uc02_garment_comparison.py   # Compare and rank alternatives for a slot
├── uc03_full_recommendation.py  # Generate full outfits based on context
└── uc04_photo_analysis.py       # Evaluate a photo and suggest improvements
```

### Services

Services contain domain logic that doesn't belong to a single entity or use case.

```text
services/
├── outfit_generator_service.py # Beam search / top-K combination logic
├── filter_service.py           # Context + rule-based pre-filtering
├── explainability_service.py   # Converts score breakdown into human messages
└── feedback_service.py         # Reinforcement-lite preference updates
```

---

## 6. Scoring Layer (The Brain)

**Location:** `score_core/scoring/`

Contains multiple levels of scoring implementations.

### Rules (L1 - Baseline)

Deterministic scoring components based on hard rules and heuristics.

```text
rules/
├── hard_constraints.py   # Mandatory rules (e.g., layering)
├── color_harmony.py      # Color theory-based scoring
├── formality.py          # Context-matching formality
├── warmth_weather.py     # Thermal suitability
├── style_coherence.py    # Tag-based consistency
└── weights.py            # Global weights for L1 components
```

### Fuzzy (L2 - Advanced)

Implements fuzzy logic systems for smoother scoring and human-like reasoning.

```text
fuzzy/
├── membership.py         # Fuzzy set definitions (low, medium, high)
├── rule_base.py          # Linguistic rules (IF... THEN...)
└── fuzzy_engine.py       # Inference engine for fuzzy scoring
```

### Neural (L3 – Optional)

Small compatibility models that augment the final score based on learned features.

```text
nn/
├── features.py           # Feature extraction for NN
├── compatibility_model.py # Model architecture (MLP/Embedding)
└── inference.py          # Runtime for NN scoring
```

---

## 7. Adapters Layer (Mapping / Translation)

**Location:** `score_core/adapters/`

Adapters translate between external representations (APIs, DB DTOs) and internal domain objects.

### Context Mapping

```text
context/
├── context_normalizer.py # Standardizes raw input into domain labels
└── weather_labels.py     # Maps numeric weather data to categories
```

### Feedback Mapping

```text
feedback/
└── feedback_mapper.py    # Maps UI interactions to preference updates
```

### Persistence Mapping

```text
persistence/
└── dto_mapper.py         # Maps Domain Entities to Persistence DTOs
```

---

## 8. Infrastructure Layer (External Implementations)

**Location:** `score_core/infrastructure/`

Concrete implementations of the ports defined in Section 4.

### Storage

```text
storage/
├── json_wardrobe_repository.py    # File-based local storage
└── sqlite_wardrobe_repository.py  # Relational local storage
```

### Preferences

```text
preferences/
└── sqlite_preferences_repository.py # Persistence for learned weights
```

### Perception (CNN Runtime)

```text
perception/
├── cnn_classifier_runtime.py # Runs image classification models
├── segmentation_runtime.py   # Runs garment segmentation models
└── color_extractor.py        # Extracts colors from image regions
```

### Scoring Engine Implementation

```text
scoring/
├── scoring_engine.py         # Orchestrates L1, L2, and L3
└── nn_runtime.py             # Runtime for L3 model inference
```

### Logging

```text
logging/
└── logger.py                 # Centralized structured logging implementation
```

---

## 9. Utils Layer (Common Helpers)

**Location:** `score_core/utils/`

Cross-cutting utilities used by all other layers.

```text
utils/
├── validation.py     # Generic input and data validation logic
├── serialization.py  # JSON/Pickle helper methods
├── constants.py      # System-wide constants and magic numbers
└── math_helpers.py   # Normalization and scoring math utilities
```

---

## 10. Dependency Direction

**Domain ← Application ← Adapters ← Infrastructure**

- **Domain:** Knows nothing about any other layer.
- **Application:** Depends only on Domain and Ports.
- **Adapters:** Depends on Application (Use Cases) and Domain.
- **Infrastructure:** Implements Ports; depends on Domain and Adapters for mapping.

This guarantees:
- **Platform Independence:** Same core logic for Android, Desktop, and Web.
- **Replaceability:** Easily swap the database or weather API.
- **Testability:** Core logic can be unit-tested without external dependencies.

---

## 11. Implementation Strategy

### Phase 1: Foundation
- Implement domain entities (`Garment`, `Outfit`).
- Implement L1 rule scoring (Hard constraints, Color harmony).
- Implement basic use cases (UC01, UC03).

### Phase 2: Intelligence
- Add L2 Fuzzy engine for smoother rankings.
- Implement explainability mapping.
- Add user feedback loop (Reinforcement-lite).

### Phase 3: Optimization
- Add L3 Neural compatibility model.
- Distill L3 model from L2 fuzzy engine.
- Optimize candidate generation (Beam Search).

---

## 12. Rationale

SCORE is a **structured compatibility engine**, not a black-box recommender.

- **Vision handles Perception:** Extracts raw attributes from pixels.
- **SCORE handles Reasoning:** Evaluates those attributes using rules and logic.

Separation of concerns ensures that as perception models improve (e.g., adding segmentation), the reasoning logic remains stable and explainable.
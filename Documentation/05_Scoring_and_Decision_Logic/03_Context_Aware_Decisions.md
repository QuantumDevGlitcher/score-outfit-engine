# 03 – Context-Aware Decisions

## 1. Purpose

The scoring engine does not evaluate garments in isolation.

Every recommendation is evaluated relative to a **context**.

Context is the primary driver of:

- formal appropriateness
- acceptable color contrast
- risk tolerance
- expressiveness

Without context, scoring would be meaningless.

---

## 2. What is Context?

A context represents an occasion or situation in which an outfit will be worn.

Examples:

- university
- presentation
[//]: # ( [MermaidChart: 871c7cc9-501e-41d0-9bde-eea50f5d737d] )
[//]: # ( [MermaidChart: dd3c4ea6-108a-4ea8-a5eb-4fa194bf381a] )
- formal event
- gym
- casual meeting
- interview

Each context defines a configuration profile.

---

## 3. Context Configuration Model (Version 1)

Each context contains:

### 3.1 Target Formality

Numeric range (0–100).

Example:

| Context      | Target Formality |
|--------------|------------------|
| gym          | 10–20            |
| university   | 40–60            |
| presentation | 70–90            |
| interview    | 80–95            |

---

### 3.2 Risk Tolerance

How bold can color combinations be?

| Context      | Risk Tolerance |
|--------------|----------------|
| gym          | High           |
| university   | Medium         |
| presentation | Low            |
| interview    | Very Low       |

Risk tolerance affects:

- acceptable contrast
- multi-color tolerance
- saturation intensity

---

### 3.3 Expression Level

Defines whether personality is encouraged.

| Context        | Expression Level |
|----------------|------------------|
| creative_event | High             |
| university     | Medium           |
| presentation   | Low              |
| interview      | Very Low         |

---

## 4. Decision Flow

High-level flow:

```text
User Input
↓
Context Selected
↓
Garment Feature Extraction
↓
Color & Formality Scoring
↓
Fuzzy Rule Evaluation
↓
Context Constraint Adjustment
↓
Final Score + Explanation
```

---

## 5. Context Influence on Scoring

Context modifies scoring weights.

Example:

In a presentation:

- Formality weight ↑
- Color harmony weight ↑
- Risk penalty ↑

In gym:

- Formality weight ↓
- Comfort weight ↑ (future extension)
- Color freedom ↑

---

## 6. Context Penalty Examples

### Under-formal Penalty

If:

```text
OutfitFormality << ContextRequirement
```

Apply strong penalty.

---

### Over-formal Adjustment

If:

```text
OutfitFormality >> ContextRequirement
```

Apply a mild penalty.

Reason:
Overdressing is usually safer than underdressing.

---

### High-Contrast Adjustment

If:

```text
Contrast is High
AND Context RiskTolerance is Low
```

Apply penalty.

---

## 7. Implementation Strategy (Version 1)

Context will be implemented as:

- configuration dictionary
or
- lightweight context object

Example:

```typescript
Context(
    name="presentation",
    target_formality=80,
    risk_tolerance="low",
)
```

The scoring engine reads this configuration and adjusts weights dynamically.

---

## 8. Extensibility

Future context enhancements:
- weather conditions
- cultural region
- seasonal trends
- personal user profile
- company dress code simulation

---

## 9. Why Context-Aware Architecture Matters

Without context:
- scoring is generic
- personalization is impossible
- evaluation becomes static

With context:
- recommendations adapt
- system becomes realistic
- architecture becomes extensible

Context-awareness is the foundation for future reinforcement learning.


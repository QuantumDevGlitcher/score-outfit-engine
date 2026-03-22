# 01 – Scoring System Overview

## 1. Purpose

SCORE produces outfit recommendations by computing a **numeric compatibility score** for candidate combinations.

The scoring system is the primary decision mechanism of the project.  
Machine learning (vision/perception) supports the scoring system but does not replace it in Version 1.

---

## 2. Core Idea

Given:

- a **context** (e.g., university, presentation, gym)
- a set of **current garments** (detected or manually provided)
- the user’s **wardrobe** (optional)
- optional **user preferences** (learned over time)

SCORE outputs:

- a ranked list of outfit candidates
- each with:
  - total score
  - component breakdown (optional)
  - explanation

---

## 3. High-Level Scoring Model

Each candidate outfit receives a final score:

```pseudocode
TotalScore = wC * ColorHarmony
+ wM * MaterialCompatibility
+ wX * ContextAppropriateness
+ wP * PreferenceAlignment
- wE * Penalties
```

Where:

- **ColorHarmony**: how well the colors match
- **MaterialCompatibility**: whether textures/materials match the scenario
- **ContextAppropriateness**: suitability for the selected occasion
- **PreferenceAlignment**: learned personalization signal
- **Penalties**: contradictions or strong mismatches

Weights `w*` are tunable and may be context-dependent.

---

## 4. Scoring Pipeline

### Step 1 — Input normalization
Inputs are normalized into a unified garment representation:

- kind/category (top, bottom, shoes, outerwear)
- primary color (+ optional secondary colors)
- material (if available)
- pattern flag (optional)

### Step 2 — Candidate generation
Candidates may come from:

- **Direct completion**: user has only top → the system suggests bottom/shoes
- **Wardrobe search**: combine available items in My Wardrobe
- **Minimal mode**: suggest **only color/material combos** when wardrobe is unavailable

### Step 3 — Feature extraction
For each candidate outfit:

- identify color pairs
- detect dominant/secondary colors
- extract material pairings
- apply context tag

### Step 4 — Component scoring (fuzzy + rules)
Each component produces a score in a common range (e.g., 0–100).

### Step 5 — Aggregate + penalties
Combine component scores with weights and apply penalties.

### Step 6 — Rank + explain
Sort candidates by TotalScore descending and generate explanations.

---

## 5. Why Fuzzy Logic

Fashion rules are not binary.

Example:
- “Black pants work with most tops” is a soft rule.
- “Neon colors in a formal presentation” is usually negative, but not always.

Fuzzy logic enables:

- smooth scoring curves
- interpretable rules
- explainability

Fuzzy scoring is used primarily for:

- color harmony intensity
- formality level
- context appropriateness

---

## 6. Personalization (Reinforcement Signal)

Personalization is treated as a **weight adjustment** problem.

Feedback types:

- like / accept → positive reinforcement
- dislike / reject → negative reinforcement
- neutral / ignore → minimal update

The system updates preference parameters such as:

- preferred colors
- avoided combinations
- preferred formality level per context

In Version 1, personalization may be implemented as:
- a simple update rule on weights (lightweight RL-style)
- a stored profile vector used in `PreferenceAlignment`

---

## 7. Explainability Requirement

Every recommendation must include a short explanation:

Examples:
- “High contrast complementary colors for presentation context.”
- “Neutral bottom balances a multi-color top.”
- “Material pairing is consistent with a cold weather context.”

Explainability is required because:
- it improves trust
- it helps users correct wrong detections
- it supports academic evaluation

---

## 8. Output Format (Version 1)

A recommendation entry contains:

- `score`: numeric
- `outfit`: garment list (or suggested placeholders)
- `explanation`: string
- optional `breakdown`:
  - ColorHarmony
  - MaterialCompatibility
  - ContextAppropriateness
  - PreferenceAlignment
  - Penalties

---

## 9. Limitations (Version 1)

Version 1 scoring assumes:

- material and pattern may be manually provided (fallback)
- perception may mis-detect colors under unusual lighting
- full garment segmentation is not required
- the system may ask clarifying questions if input is incomplete

---

## 10. Summary

The scoring system is the core intelligence of SCORE.

It provides:
- deterministic ranking
- interpretable reasoning (fuzzy rules)
- context-aware decisions
- a foundation for personalization

All other system components exist to supply inputs to this scoring engine.

# 02 – User Input Flows

## 1. Purpose

This document defines how users interact with SCORE
and how the system handles incomplete or ambiguous input.

The goal is to:

- reduce friction
- prevent abandonment
- ensure sufficient context for accurate recommendations

---

## 2. Core Interaction Flow

The standard interaction pipeline is:

1. User selects context
2. User selects garments (or requests full recommendation)
3. System validates input completeness
4. Missing information is requested if necessary
5. Recommendation is generated
6. User provides feedback (optional)

---

## 3. Context Selection (Mandatory)

Context is required before scoring.

Examples:

- university
- gym
- presentation
- formal event
- casual outing

Reason:

The same garment combination may be appropriate in one context
and inappropriate in another.

If context is missing:

The system must request it before proceeding.

---

## 4. Manual Garment Input

Version 1 uses structured forms:

User selects via dropdown:

- category
- primary color
- optional secondary color
- material

Free-text descriptions are avoided
to reduce ambiguity and parsing complexity.

---

## 5. Partial Information Handling

If a user provides only one garment:

Example:
- only jacket detected

The system must ask:

- What are you wearing underneath?
- What pants are you planning to wear?
- What shoes will you use?

Scoring requires a complete combination.

The system does not assume missing garments.

---

## 6. Multi-Color Garment Handling

If a garment contains multiple colors:

Example:
- patterned shirt
- tropical design

The system:

- identifies dominant color
- optionally considers secondary color
- adjusts scoring to reduce color clash

If uncertainty exists,
user confirmation is requested.

---

## 7. Vision Misclassification Handling

If lighting causes color distortion:

Example:
Red shirt detected as orange.

The system:

- displays detected attributes
- allows user correction
- updates garment attributes before scoring

User confirmation is required before final evaluation.

---

## 8. Clarification Logic

The system behaves similarly to error handling logic:

- detect insufficient context
- request clarification
- resume evaluation

This prevents:

- invalid scoring
- context misinterpretation
- misleading recommendations

---

## 9. Default Behavior

If the user provides minimal input:

System may:

- suggest a wardrobe-based complete outfit
- generate default combinations

However, context remains mandatory.

---

## 10. Abandonment Minimization

To reduce user friction:

- dropdown-based inputs are used
- no long textual descriptions required
- no excessive questions asked simultaneously

Clarifications occur only when necessary.

---

## 11. Feedback Collection

After recommendation:

User may:

- approve
- reject
- ignore

Feedback feeds the personalization layer.

---

## 12. Summary

User input flow in SCORE is:

- structured
- context-aware
- clarification-driven
- resilient to incomplete information

The system actively ensures
it has sufficient data before scoring.

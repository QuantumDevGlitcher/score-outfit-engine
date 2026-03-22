# 05 – Explainability

## 1. Introduction

An intelligent system must not only produce decisions —
it must justify them.

SCORE is designed as an explainable hybrid system:

- Vision-based perception
- Rule-based fuzzy reasoning
- Context-aware scoring
- Structured decision logic

Every recommendation must provide:

1. A numerical score
2. A structured explanation
3. A reasoning trace (internally)

---

## 2. Why Explainability Matters

In this domain:

- Style is subjective
- Context matters
- Cultural interpretation varies

Therefore:

The system must expose why a combination is recommended or penalized.

Explainability increases:

- Trust
- Debuggability
- Academic transparency
- System maintainability

---

## 3. Types of Explanations

SCORE provides three explanation layers.

---

### 3.1 Human-Readable Explanation

Example:

"High contrast between orange and green improves visibility  
but reduced suitability for formal presentation context."

Simple.
Concise.
Readable.

---

### 3.2 Rule-Based Breakdown (Internal)

Example:

Color Harmony: 72  
Contrast: 85  
Context Risk Penalty: -15  
Final Score: 70

This layer is useful for:

- debugging
- evaluation
- academic validation

---

### 3.3 Confidence Indicator

Example:

Confidence: 82%

Confidence depends on:

- detection clarity
- completeness of outfit
- ambiguity in inputs
- presence of multi-color patterns

Confidence does not reflect style quality —
it reflects reliability of evaluation.

---

## 4. Explainability in Architecture

Explainability is not an afterthought.

It is enforced at the Core layer.

The Recommendation object contains:

- score
- explanation
- optional reasoning metadata

This ensures:

CLI and GUI can display explanations without recomputing logic.

---

## 5. Deterministic vs. Learning-Based Explanations

Version 1 behavior:

- Core scoring logic is deterministic
- Fuzzy logic rules are explicit
- Context adjustments are predefined

Future versions may introduce:

- learned weight tuning
- reinforcement learning personalization

If learning modifies weights:

- Explanation must still reflect the final decision path
- System must not behave as a black box

---

## 6. Academic Justification

SCORE is not purely neural.

It is:

Hybrid AI Architecture.

- Symbolic reasoning (fuzzy logic)
- Structured decision modeling
- Vision perception (ML)
- Optional personalization (RL)

This allows:

- Interpretability
- Modular evaluation
- Controlled experimentation

---

## 7. Limitations of Explainability

Not fully explainable:

- Raw CNN feature extraction
- Intermediate tensor representations

However:

Color extraction and classification decisions
are mapped into structured domain features,
which restores explainability at the decision layer.

---

## 8. Example Full Explanation Output

Example output:

Score: 68  
Confidence: 84%  

Explanation:
- Complementary colors create a strong visual contrast.
- High saturation reduces suitability for academic context.
- No formal garment was detected.
- Outfit is expressive but risky for presentation.

---

## 9. Design Principle

Explainability is treated as:

A first-class architectural requirement.

If a recommendation cannot be explained,
it is considered invalid.

---

## 10. Summary

SCORE ensures:

- Transparent reasoning
- Structured scoring
- Contextual justification
- Extensible explanation logic

This aligns the system with modern AI best practices
in interpretable intelligent systems.

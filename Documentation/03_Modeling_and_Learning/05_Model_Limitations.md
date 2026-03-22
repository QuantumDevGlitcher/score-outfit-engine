# 05 – Model Limitations

## 1. Introduction

This document outlines the known limitations of the modeling components in SCORE.

Acknowledging limitations is essential for:

- academic transparency
- reproducibility
- responsible AI design
- realistic evaluation of system capabilities

SCORE is not intended to be a production-level fashion AI system.

It is a structured academic prototype.

---

## 2. Vision Model Limitations

### 2.1 Classification-Only (No Full Segmentation)

The current vision model performs:

- garment category classification

It does NOT perform:

- pixel-level garment segmentation
- instance detection of multiple garments
- layered clothing decomposition

If multiple garments appear in a single image,
misclassification may occur.

---

### 2.2 Sensitivity to Lighting Conditions

Color extraction depends on:

- camera quality
- ambient lighting
- shadows
- white balance

Under poor lighting:

- dominant color detection may shift
- warm light may distort red/orange
- cool light may distort blue/green

User correction is required in such cases.

---

### 2.3 Dataset Bias

The training dataset may:

- overrepresent certain clothing styles
- underrepresent certain materials
- lack cultural diversity

This may introduce classification bias.

---

### 2.4 Generalization Constraints

The model may struggle with:

- unusual fashion items
- avant-garde clothing
- hybrid garments
- partially occluded garments

Out-of-distribution inputs reduce reliability.

---

## 3. Reinforcement Learning Limitations

### 3.1 Simplified Reward Mechanism

The RL component:

- uses simple reward signals
- adjusts scoring weights incrementally

It does not:

- optimize global policies
- use exploration strategies
- guarantee convergence

---

### 3.2 Personalization Scope

Personalization affects:

- scoring weights

It does NOT affect:

- vision model retraining
- garment classification
- base fuzzy rule definitions

Thus, personalization remains constrained.

---

## 4. Fuzzy Logic Limitations

Fuzzy logic:

- encodes heuristic fashion rules
- models approximate reasoning

However:

- rules are manually designed
- membership functions may not reflect all fashion nuances
- cultural and subjective factors are simplified

The fuzzy system cannot fully capture evolving fashion trends.

---

## 5. Context Modeling Limitations

Context input is:

- manually selected
- predefined (e.g., university, gym, presentation)

The system does not:

- infer context automatically
- model social subtleties
- adapt to real-time environmental signals

Context modeling is simplified.

---

## 6. Absence of Body Shape Modeling (Version 1)

SCORE does not:

- model body geometry
- simulate garment fit
- account for silhouette optimization

Thus, recommendations focus on:

- color
- material compatibility
- context appropriateness

Not physical tailoring.

---

## 7. No Full Multi-Garment Interaction Modeling

Version 1 scoring evaluates:

- garment combinations
- compatibility rules

But does not simulate:

- fabric draping
- 3D interaction
- layered garment realism

---

## 8. Hardware and Deployment Constraints

Version 1 assumes:

- CPU-only inference
- local execution
- no cloud infrastructure

Performance may degrade on low-end hardware.

---

## 9. Ethical Considerations

The system:

- does not evaluate attractiveness
- does not rank body types
- does not make judgments about personal identity

Recommendations are purely:

- stylistic
- context-aware
- rule-based

This avoids sensitive bias areas.

---

## 10. Summary

SCORE is:

- structured
- explainable
- modular

But limited in:

- segmentation capability
- physical modeling
- deep personalization
- real-world robustness

These limitations are acceptable
within the academic scope of this project.

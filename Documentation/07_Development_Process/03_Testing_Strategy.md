# 03 – Testing Strategy

## 1. Purpose

This document defines the testing strategy used in SCORE.

Testing ensures:

- scoring correctness
- architectural stability
- predictable personalization behavior
- safe integration across modules

Even as an academic project,
testing discipline is maintained.

---

## 2. Testing Levels

SCORE follows three primary testing layers:

1. Unit Testing
2. Integration Testing
3. Manual Validation Testing

---

## 3. Unit Testing

Unit tests focus on isolated components.

### 3.1 Domain Entity Tests

Validate:

- garment object creation
- attribute validation
- color handling
- material handling

---

### 3.2 Scoring Engine Tests

Validate:

- compatibility score calculations
- fuzzy membership correctness
- context modifiers
- penalty application

Example test cases:

- green + orange → low compatibility
- black + white → high compatibility
- gym context with formal shoes → penalized

---

### 3.3 Reinforcement Update Tests

Validate:

- weight updates occur correctly
- learning rate applied properly
- weights remain within safe bounds
- negative rewards decrease tolerance

---

## 4. Integration Testing

Integration tests validate module cooperation.

### 4.1 Core + CLI

- CLI command produces valid recommendation
- CLI passes correct context to core
- Explanation is returned properly

---

### 4.2 Core + GUI

- UI form inputs convert to garment objects
- Recommendation displays correct output
- Feedback updates scoring weights

---

### 4.3 Vision + Core

- Image classification maps to a valid garment object
- Dominant color extraction functions correctly
- Scoring engine accepts inferred attributes

---

## 5. Edge Case Testing

Edge cases include:

- single garment input
- missing context
- duplicate garment categories
- extreme color contrast
- empty wardrobe
- corrupted preference file

System must:

- not crash
- request clarification
- fallback safely

---

## 6. Manual Validation Testing

Certain aspects require manual evaluation:

- perceived style compatibility
- explanation clarity
- UI usability
- personalization behavior over time

These cannot be fully automated.

---

## 7. Performance Testing

Measure:

- inference time on CPU
- recommendation latency
- model loading time
- memory footprint

System should remain responsive on:

- standard laptop hardware

---

## 8. Reproducibility Testing

Verify:

- consistent results with fixed seed
- the same model weights produce the same classification
- personalization behaves deterministically

---

## 9. Testing Tools

Potential tools:

- pytest for unit tests
- mock objects for vision simulation
- manual CLI validation

Testing remains lightweight but structured.

---

## 10. Summary

Testing in SCORE ensures:

- reliability
- correctness
- stability
- architectural discipline

The system is validated across:

- logic
- integration
- edge cases
- performance

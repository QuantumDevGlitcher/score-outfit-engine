# 03 – Error Handling and Clarifications

## 1. Purpose

This document defines how SCORE handles:

- perception errors
- incomplete inputs
- unexpected states
- invalid configurations

The goal is to ensure:

- stability
- transparency
- controlled recovery

The system must fail gracefully.

---

## 2. Error Categories

Errors are divided into:

1. Perception errors
2. User input errors
3. Scoring conflicts
4. System-level failures

---

## 3. Perception Errors

### 3.1 Garment Misclassification

If the vision model incorrectly classifies a garment:

Example:
- sweater detected as jacket

The system:

- displays detected attributes
- allows manual correction
- updates garment object before scoring

No automatic override is applied without user confirmation.

---

### 3.2 Color Detection Errors

Lighting may distort color detection.

If confidence is low:

- system prompts user confirmation
- user may manually override color

Color correction occurs before scoring.

---

### 3.3 Incomplete Detection

If only one garment is detected:

System requests:

- missing garments
- category confirmation

Scoring does not proceed until minimum required garments are provided.

---

## 4. User Input Errors

### 4.1 Missing Context

If context is not provided:

System blocks scoring
and requests context selection.

---

### 4.2 Invalid Combination

If user selects incompatible categories:

Example:
- two bottoms, no top

System warns:

- "Incomplete outfit configuration"

It does not proceed silently.

---

## 5. Scoring Conflicts

If scoring produces extremely low compatibility:

Example:
- severe color clash
- formal context with gym outfit

System may:

- warn user
- explain incompatibility
- suggest alternative combinations

Explanation is mandatory.

---

## 6. Reinforcement Misuse Prevention

To prevent unstable personalization:

- weight adjustments are capped
- the learning rate is small
- base fuzzy rules cannot be overridden

This avoids extreme behavioral drift.

---

## 7. System-Level Failures

Possible failures:

- model loading error
- corrupted preference file
- invalid wardrobe file

Recovery strategies:

- fallback to manual mode
- reset preference weights
- rebuild wardrobe index

System must not crash abruptly.

---

## 8. Defensive Design Principles

SCORE follows:

- validation before scoring
- confirmation before correction
- controlled fallback
- minimal silent assumptions

This improves robustness.

---

## 9. User Communication

Errors must:

- be explained clearly
- avoid technical jargon
- suggest corrective action

Example:

Instead of:
"Classification confidence < threshold"

Display:
"The system is unsure about this garment. Please confirm."

---

## 10. Summary

Error handling in SCORE is:

- structured
- user-aware
- non-destructive
- recoverable

The system prioritizes:

- clarity
- stability
- safe adaptation
over silent automation.

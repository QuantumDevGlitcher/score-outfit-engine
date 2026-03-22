# 04 – Multi-Color Handling and Edge Cases

## 1. Introduction

Real-world garments are rarely simple.

They may include:

- multiple colors
- patterns
- gradients
- logos
- accessories
- ambiguous materials
- overlapping garments

This document defines how Version 1 handles these complexities.

---

## 2. Multi-Color Garments

### 2.1 Primary vs. Secondary Colors

Each garment may contain:

- Primary Color
- Secondary Color (optional)
- Accent Colors (future)

Version 1 supports:

- One primary
- One secondary

Example:

Shirt:
- Primary: orange
- Secondary: white

---

### 2.2 Scoring Strategy for Multi-Color Items

For garments with multiple colors:

1. Evaluate primary color against other garments
2. Evaluate secondary color with reduced weight
3. Aggregate harmony score

Formula concept:


```pseudocode
FinalColorScore =
(PrimaryWeight × HarmonyPrimary)
(SecondaryWeight × HarmonySecondary)
```

Where:

- PrimaryWeight > SecondaryWeight
- Default: 0.7 / 0.3

---

## 3. Patterned Garments

Examples:

- stripes
- plaid
- camouflage
- printed graphics

Version 1 Strategy:

- Treat patterned garments as the dominant color
- Ignore detailed segmentation
- Apply a slight complexity penalty if context risk is low

Reason:

Full pattern analysis requires segmentation and texture modeling,
which is out of scope for Version 1.

---

## 4. Gradient Colors

If the garment transitions between colors:

- Extract dominant hue
- Ignore intermediate spectrum
- Use average color approximation

Future versions may:

- Evaluate gradient harmony dynamically

---

## 5. Accessories

Version 1:

Accessories are ignored or treated as neutral.

Examples:

- belts
- watches
- small jewelry

Future extension:

Accessories can provide accent boosts or clash penalties.

---

## 6. Layered Clothing

Example:

- shirt + jacket
- t-shirt + hoodie

Version 1 assumption:

- The uppermost layer dominates visual perception
- Under-layer influences score with reduced weight

Layer weight example:

| Layer Position | Weight |
|----------------|--------|
| Outer layer    | 0.6    |
| Inner layer    | 0.4    |

---

## 7. Missing Garment Types

If the user only provides:

- top but no bottom
- bottom but no shoes

System behavior:

- Attempt partial evaluation
- Lower confidence score
- Suggest missing items

Example explanation:

"Recommendation incomplete due to missing bottom garment."

---

## 8. Unknown Colors

If color extraction fails:

- Assign neutral placeholder
- Reduce scoring confidence
- Request clarification (future UI improvement)

---

## 9. Extreme Edge Cases

### 9.1 Neon Colors

Neon hues:

- Automatically increase contrast score
- Apply penalty in low-risk contexts

---

### 9.2 Black-on-Black / White-on-White

May produce:

- Low contrast
- Low expressiveness

Penalty depends on context.

---

### 9.3 Clashing Complementaries

Example:

- Orange + Green (high saturation)

In high-risk contexts → allowed
In low-risk contexts → penalized

---

## 10. Confidence Score

Version 1 may introduce:

Confidence metric (0–100)

Influenced by:

- number of detected garments
- clarity of color detection
- ambiguity
- missing elements

Confidence does NOT replace style score.
It complements it.

---

## 11. Version 1 Limitations

Not supported:

- pixel-level segmentation
- texture classification
- fabric reflectivity modeling
- dynamic lighting compensation

These belong to future research phases.

---

## 12. Architectural Importance

Handling edge cases early ensures:

- deterministic behavior
- fewer runtime errors
- explainable scoring
- extensibility

Even simple systems must define edge behavior clearly.

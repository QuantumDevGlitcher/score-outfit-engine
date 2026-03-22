# 02 – Fuzzy Logic Rules

## 1. Purpose

The fuzzy logic layer transforms fashion heuristics into smooth, interpretable scoring functions.

Unlike rigid rule systems, fuzzy logic allows:

- partial compatibility
- smooth transitions between good and bad matches
- interpretable reasoning

Fuzzy logic is used in Version 1 primarily for:

- Color harmony intensity
- Formality alignment
- Context appropriateness

---

## 2. Why Not Hard Rules?

Hard rule example (not used):

```pseudocode
IF color1 == complementary(color2)
THEN score = 100
ELSE score = 0
```

This is unrealistic.

Real fashion behavior:

- Complementary colors → strong contrast (usually good)
- Analogous colors → subtle harmony
- Neutral + bold → balanced
- Neon + formal context → usually bad, but not always

Therefore, we use fuzzy membership functions instead of binary decisions.

---

## 3. Fuzzy Variables (Version 1)

### 3.1 Color Contrast

Input:
- color distance in color wheel (0°–180°)

Fuzzy sets:

- LowContrast
- MediumContrast
- HighContrast

Example intuition:

- 0° → very low contrast
- 90° → medium
- 180° → high contrast

Each input has degrees of membership in these sets.

---

### 3.2 Formality Level

Each garment is assigned a formality score (heuristic):

Example scale:
- 0 = gym / casual
- 50 = smart casual
- 100 = formal

Fuzzy sets:

- Casual
- SemiFormal
- Formal

---

### 3.3 Context Formality Requirement

Each context has a required formality level.

Examples:

| Context      | Target Formality |
|--------------|------------------|
| gym          | 10–20            |
| university   | 40–60            |
| presentation | 70–90            |

Fuzzy sets:

- LowRequirement
- MediumRequirement
- HighRequirement

---

## 4. Example Fuzzy Rules

### Rule Group A — Color Harmony

```pseudocode
IF Contrast is HighContrast
AND Context is Formal
THEN ColorHarmony is Medium
```

Explanation:
High contrast may be too aggressive in a formal setting.

---

```pseudocode
IF Contrast is MediumContrast
THEN ColorHarmony is High
```

Explanation:
Balanced contrast is often ideal.

---

```pseudocode
IF OneColor is Neutral
THEN ColorHarmony is High
```

Explanation:
Neutral colors stabilize combinations.

---

### Rule Group B — Context Alignment

```pseudocode
IF OutfitFormality is CloseTo(ContextRequirement)
THEN ContextAppropriateness is High
```

---

```pseudocode
IF OutfitFormality is MuchLowerThan(ContextRequirement)
THEN ContextAppropriateness is Low
```

---

```pseudocode
IF OutfitFormality is MuchHigherThan(ContextRequirement)
THEN ContextAppropriateness is Medium
```

Overdressing is less problematic than underdressing in most cases.

---

### Rule Group C — Multi-Color Handling

```pseudocode
IF TopHasMultipleColors
AND BottomIsNeutral
THEN ColorHarmony is High
```

---

```pseudocode
IF TopHasMultipleColors
AND BottomHasMultipleColors
THEN ApplyPenalty
```

---

## 5. Defuzzification

Each fuzzy rule contributes to a score.

The final fuzzy output is converted to a numeric value (e.g., 0–100) using:

- weighted average
- centroid method (if using scikit-fuzzy)

Version 1 may use a simplified weighted aggregation approach for clarity.

---

## 6. Explainability Mapping

Each triggered fuzzy rule generates:

- a short explanation fragment

Example:

Rule triggered:

```text
MediumContrast → High Harmony
```

Explanation fragment:
> "Balanced color contrast improves visual harmony."

The final explanation is constructed by combining strongest contributing rules.

---

## 7. Version 1 Simplifications

To keep complexity manageable:

- limited fuzzy variables
- limited rule base
- no adaptive rule learning
- no full fuzzy inference engine tuning

Rules are manually defined and transparent.

---

## 8. Future Enhancements

- adaptive fuzzy rule tuning
- learned membership functions
- reinforcement learning over fuzzy weights
- user-specific fuzzy profile
- dynamic contrast thresholds based on culture or trend

---

## 9. Summary

The fuzzy logic layer provides:

- smooth decision boundaries
- interpretability
- academic rigor
- extensibility

It is the bridge between human fashion heuristics and computational scoring.

# 01 – The “My Wardrobe” Concept

## 1. Purpose

This document defines the conceptual and structural foundation
of the “My Wardrobe” component in SCORE.

“My Wardrobe” represents the user’s personal clothing catalog,
used as the primary source of recommendation candidates.

---

## 2. Concept Overview

The system does not generate clothing items from scratch.

Instead, it:

- analyzes the user’s available garments
- evaluates combinations
- recommends compatible outfits

The wardrobe acts as a constrained search space.

---

## 3. Why a Wardrobe Model?

Without a wardrobe model:

- recommendations would be abstract
- suggestions would lack practicality
- personalization would be limited

The wardrobe enables:

- realistic combinations
- context-aware filtering
- reinforcement personalization

---

## 4. Wardrobe Data Structure

Each garment in the wardrobe contains:

- category (top, bottom, shoes, outerwear)
- primary color
- optional secondary color
- material
- optional tags (casual, formal, sport, etc.)

Example:

```json
{
  "id": "g_001",
  "category": "top",
  "color_primary": "orange",
  "color_secondary": null,
  "material": "wool",
  "tags": ["casual"]
}
```

The wardrobe is stored as:

- MongoDB collection (Production)

---

## 5. Wardrobe Initialization

There are two modes:

### 5.1 Manual Entry (Version 1 default)

User fills a structured form:
- selects category
- selects color
- selects material

This avoids free-text ambiguity.

---

## 5.2 Vision-Based Entry (Optional)

User provides image.

System extracts:
- garment category
- dominant color

User confirms extracted attributes.

This reduces friction but may require correction.

---

## 6. Wardrobe Constraints

The system assumes:
- garments listed are owned by the user
- all items are available for selection
- user input is truthful

The system does not validate physical ownership.

---

## 7. Role in Recommendation Pipeline

Workflow:
1. User selects context (e.g., university)
2. Wardrobe items are filtered
3. Candidate combinations are generated
4. Scoring engine evaluates compatibility
5. Top results are returned

Wardrobe is the input boundary of the search space.

---

## 8. Interaction with Reinforcement Learning

User feedback modifies:
- scoring weights
- preference sensitivity

It does NOT modify:
- wardrobe data
- garment attributes

Wardrobe remains factual inventory.

--- 

## 9. Limitations

Version 1 does not include:
- automatic wardrobe detection from closet images
- garment quantity tracking
- seasonal expiration
- wear history tracking

These may be future enhancements.

---

## 10. Summary

“My Wardrobe” is:
- the structured inventory of user garments
- the constrained input space for recommendations
- the personalization anchor of SCORE

It bridges perception, scoring, and user interaction.
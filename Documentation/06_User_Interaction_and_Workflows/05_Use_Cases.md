# 05 - Use Cases

This section formally defines the primary interaction scenarios supported by **SCORE (Smart Context‑aware Outfit Recommendation Engine)**.

Each use case represents a distinct user intent, but all are executed through the same underlying **Scoring and Decision Engine**.

### 1. Overview

SCORE supports four primary operational scenarios:

1. **Outfit Completion (Fill Missing Item)**
2. **Garment Comparison (Rank Alternatives)**
3. **Full Outfit Recommendation (Context‑Driven Generation)**
4. **Photo‑Based Outfit Analysis (Vision‑Assisted Mode)**

These use cases differ at the interaction level but converge at the same scoring pipeline:

**Perception → Representation → Filtering → Compatibility Scoring → Ranking → Explainability**

---

## UC‑01: Outfit Completion (Fill Missing Item)

### Description
The user has selected part of an outfit and needs recommendations to complete the missing garment category.

### Example Scenario
The user selects:
- Pants  
- Shoes  

Missing:
- Top  

The system recommends suitable tops ranked by compatibility and context alignment.

### Inputs
- Fixed garment embeddings (e.g., bottom + shoes)
- Missing category identifier
- Optional context:
  - Occasion  
  - Style intent  
  - Weather label (via adapter)

### Output
- Ranked list of candidate garments for the missing category
- For each candidate:
  - Final score  
  - Compatibility score  
  - Context relevance score  
  - Explainability summary

---

## UC‑02: Garment Comparison (Rank Alternatives)

### Notes
This is the most fundamental operational mode and can function without image‑based perception (manual selection only).

### Description
The user compares two or more garments for the same category within a partially or fully defined outfit.

### Example Scenario
The user selects:
- Pants  
- Shoes  
- Shirt A  
- Shirt B  

The system evaluates which shirt produces a better overall outfit.

### Inputs
- Fixed garment embeddings (anchors)
- Candidate garments for comparison
- Optional context parameters

### Output
- Ranked alternatives
- Relative score difference
- Explanation of why one candidate performs better

---

## UC‑03: Full Outfit Recommendation (Context‑Driven Generation)

### Notes
This use case is structurally a constrained version of UC‑01 where the candidate set is user‑defined rather than system‑generated.

### Description
The user provides contextual information and requests complete outfit suggestions.

### Example Scenario
User input:
- Occasion: Business meeting  
- Weather: Cold  
- Style intent: Elegant  

The system generates top outfit combinations from the user’s wardrobe.

### Inputs
- Context parameters:
  - Occasion  
  - Style intent  
  - Weather/temperature (via adapter)
- User wardrobe database
- Optional constraints (e.g., must include specific item)

### Output
- Top‑K complete outfits (Top + Bottom + Shoes)
- For each outfit:
  - Compatibility score  
  - Semantic relevance score  
  - Final weighted score  
  - Explanation

### Notes
This use case requires:
- Candidate filtering  
- Combinatorial generation  
- Compatibility Transformer evaluation  

---

## UC‑04: Photo‑Based Outfit Analysis (Vision Mode)

### Description
The user uploads an image. The system detects garments, extracts attributes, and provides evaluation or improvement suggestions.

### Inputs
- Raw image
- Optional context parameters

### Processing
1. Segmentation model extracts garments  
2. Attribute classifier predicts garment features  
3. Embeddings are generated  
4. Standard scoring pipeline is applied  

### Output
- Detected garments with attributes  
- Compatibility analysis  
- Suggested improvements or alternative recommendations  

### Notes
Vision processing is optional for Version 1 but fully compatible with the architecture.

---

## 6. Common Execution Pipeline

All use cases ultimately rely on the same logical pipeline:

1. Input normalization (manual or vision‑derived)  
2. Embedding retrieval or generation  
3. Context‑aware filtering  
4. Compatibility scoring (Transformer)  
5. Final weighted ranking  
6. Explainability generation  

This ensures architectural consistency and avoids duplication of scoring logic.

---

## 7. Architectural Implications

These use cases reinforce the separation of concerns:

- **UI Layer:** Defines interaction pattern (completion, comparison, generation).  
- **Core Layer:** Executes filtering and scoring.  
- **Adapters:** Provide contextual signals (weather API, device sensors).  
- **ML Models:** Provide embeddings and compatibility estimation.  

The weather and temperature inputs are external adapters and are not part of the core scoring model.
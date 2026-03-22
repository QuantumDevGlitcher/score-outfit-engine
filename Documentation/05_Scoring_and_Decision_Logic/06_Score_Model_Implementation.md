# 06 - SCORE Model Implementation (Scoring Engine)

## 1. Purpose
The SCORE Model (the “Brain”) ranks outfit options using:
- deterministic rules (hard constraints)
- fuzzy logic (graded, human-like scoring)
- optional neural compatibility scoring (future enhancement)

The model does **not** classify images. Image classification and attribute extraction belong to the Perception/Vision models. The SCORE Model consumes their outputs (structured fields).

## 2. Scope and Maturity Levels
SCORE is implemented incrementally to reduce risk and keep explainability.

### Level 1 (L1) — Rule Baseline (No Training)
- Filter invalid outfits using hard rules (required categories, layering constraints).
- Score outfits using weighted heuristics.
- Always returns an explanation (why it scored high/low).

### Level 2 (L2) — Fuzzy Logic Scoring (No Training)
- Replace sharp thresholds with membership functions:
  - “warmth is low/medium/high”
  - “formality mismatch is small/medium/large”
  - “color harmony is poor/ok/good”
- Produces smoother rankings and more realistic tradeoffs.

### Level 3 (L3) — Neural Compatibility (Optional)
- A small model predicts outfit compatibility from structured features/embeddings.
- Training can be done using:
  - real labeled outfit data (if available), or
  - distillation from the L2 fuzzy engine (teacher → student).

## 3. Inputs and Outputs

### 3.1 Required Inputs
SCORE consumes:
1) Wardrobe items (stored locally)
2) Context (occasion + optional weather labels)
3) User preferences/feedback (like/dislike/selection history)

### 3.2 Output
A ranked list of recommended outfits:
- score: 0–100
- explanation: human-readable
- breakdown: component scores and rule flags (for debugging + transparency)

## 4. Core Concepts

### 4.1 Top-Level Categories (Slots)
Base slot groups for V1:
- **Upper garments** (Top / Mid-layer / Outerwear)
- **Lower garments** (Bottom)
- **Footwear** (Shoes)

Optional future:
- accessories (belt, bag, hat, watch)
- “special layers” (gloves, scarf)

### 4.2 Layering
Layering is controlled by `layer_role`:
- `base_top` (t-shirt, blouse)
- `mid_layer` (sweater, hoodie)
- `outerwear` (jacket, coat)

Not all contexts require all layer roles.

### 4.3 Sub-Classification
Each item has:
- category: top / bottom / shoes / outerwear / etc.
- subcategory: t-shirt, jeans, boots, blazer, etc.
Used for rules like:
- office context → avoid “flip-flops”
- winter → boots acceptable, sandals rejected

## 5. Use Cases Supported (V1)

### UC-01 Outfit Completion (Fill Missing Item)
User provides partial outfit (e.g., pants + shoes) and asks the system to complete missing slot(s).

Input:
- fixed_items: one or more slots provided
- missing_slots: determined automatically
Output:
- ranked completions

### UC-02 Garment Comparison (Rank Alternatives)
User provides a fixed outfit and two or more alternative items for one slot (e.g., “which shirt is better?”).

Input:
- base_outfit
- candidate_items_for_slot
Output:
- ranked alternatives with explanations

### UC-03 Full Outfit Recommendation (Context-Driven)
User requests full outfit(s) based on context/style.

Requirement:
- wardrobe must contain enough items to satisfy the required template slots
Output:
- top N outfits with rationale

### UC-04 Photo-Based Outfit Analysis (Vision Mode)
User supplies a photo → perception extracts items → SCORE evaluates the extracted outfit and proposes improvements.

Output:
- outfit score
- “what to change” suggestions

## 6. Decision Pipeline

### Step 0 — Validate Available Wardrobe Slots
If the user’s wardrobe lacks required categories:
- disable UC-03 (full outfit)
- still allow UC-01 / UC-02 / UC-04

### Step 1 — Context Normalization
Convert context into standardized labels:
- occasion: `university | office | formal | gym | casual | date`
- temperature_label: `cold | mild | warm`
- weather_label: `clear | rain | snow` (optional)

### Step 2 — Template Selection
Choose outfit slot template based on temperature_label:
- warm: `base_top + bottom + shoes`
- mild: `base_top + (optional mid_layer) + bottom + shoes`
- cold: `base_top + mid_layer + outerwear + bottom + shoes`

### Step 3 — Slot Filtering (Pre-Filter)
For each slot, filter wardrobe candidates using:
- rules (e.g., formality bounds)
- hygiene/availability (dirty, missing, not owned)
- season fit (warmth thresholds)
Then keep top-K candidates per slot.

### Step 4 — Candidate Generation (Avoid Factorial Explosion)
Generate outfits using:
- top-K per slot
- beam search:
  - keep the best partial combinations while expanding slots
  - discard weak partials early

### Step 5 — Scoring
Compute component scores and combine into final 0–100.

### Step 6 — Ranking and Explanation
Return top N outfits:
- final score
- component breakdown
- 3–6 explanation bullets

### Step 7 — Feedback Update
When user likes/dislikes/selects:
- update preference weights
- update item priors (favored colors, preferred fits, avoided categories)
This is “reinforcement-lite” (bandit-style updates, not heavy RL).

## 7. Scoring Model (0–100)

### 7.1 Component Scores (Example Weights)
Total score is a weighted sum:

- Color Harmony: 30
- Formality Match: 25
- Weather Match (Warmth): 20
- Style Coherence: 15
- Penalties / Constraints: 10 (applied as deductions)

### 7.2 Color Harmony
Inputs:
- dominant colors from each item (hex + %)
Logic:
- prefer complementary / analogous / monochrome combos
- penalize clashing saturation or extreme mismatch

### 7.3 Formality Match
Inputs:
- each item has `formality_score` in [0,1]
- context has `target_formality` in [0,1]
Logic:
- minimize distance between outfit formality and target

### 7.4 Weather Match
Inputs:
- each item has `warmth_score` in [0,1]
- context requires warmth band (cold/mild/warm)
Logic:
- outfit warmth should fall within expected band

### 7.5 Style Coherence
Inputs:
- `style_tags`: casual/formal/sporty/street/etc.
Logic:
- reward consistent tags
- penalize mixing incompatible tags (e.g., tuxedo + running shoes)

### 7.6 Penalties (Hard + Soft)
Hard (reject outfit):
- missing required slot
- illegal layering (two outerwear)
Soft (deduct points):
- recently worn
- dirty flag
- low confidence from perception

## 8. Fuzzy Logic (L2)

### 8.1 Membership Functions
Examples:
- harmony: poor/ok/good
- formality mismatch: small/medium/large
- warmth adequacy: under/ok/over

### 8.2 Rule Base
Example rules:
- IF harmony is good AND formality mismatch is small THEN score is high
- IF warmth is under AND temperature is cold THEN score is low
- IF style coherence is poor THEN score is low

### 8.3 Explainability from Fuzzy Rules
Store which fuzzy rules fired and translate them into messages:
- “Colors are strongly compatible (analogous palette).”
- “Formality matches the context.”
- “This outfit may be cold for the current weather.”

## 9. Neural Compatibility (L3, Optional)

### 9.1 Model Goal
Predict a compatibility score from:
- structured features (formality, warmth, tags)
- optional embeddings (if available)

### 9.2 Training Options
- Real labeled outfits (best but hard)
- Distillation:
  - generate random outfits
  - label using L2 fuzzy teacher
  - train a small MLP student to approximate teacher scores

### 9.3 Deployment
The trained NN is used as:
- an additional component score (e.g., +10–20 weight)
- never the only decision-maker (keep explainability stable)

## 10. Data Contract (What SCORE Needs)
SCORE depends on a stable schema for each wardrobe item and context.
See:
- `Documentation/05_Scoring_and_Decision_Logic/JSON_Schemas.md` (if present)
or define it as part of this document in the next iteration.

## 11. Testing Strategy
- Unit tests for each scoring component
- Golden test cases for:
  - UC-01 completion
  - UC-02 comparison
  - UC-03 full recommendation
  - UC-04 analysis
- Regression tests for score stability (avoid sudden ranking flips)

## 12. Implementation Notes
- Start with L1 + explanations first.
- Add L2 fuzzy engine once rules are stable.
- Only pursue L3 if time remains and the teacher (L2) is stable enough to distill.
# 06 - SCORE UI SYSTEM SPEC

## 1. System Overview

SCORE (Smart Context-aware Outfit Recommendation Engine) is a decision system that analyzes a user’s wardrobe and context to generate outfit recommendations.

The UI acts as the interaction layer between the user and the recommendation pipeline.

The architecture separates:

```text
UI Layer
↓
Use Cases
↓
Scoring / Decision Engine
↓
Infrastructure (storage, models, adapters)
```

This ensures the UI remains stateless and modular, while the logic remains inside the core engine.

---

## 2. Core UI Sections

The application contains the following primary pages:

| Page            | Purpose                       |
|-----------------|-------------------------------|
| Landing Page    | Entry point to system         |
| Dashboard       | Main recommendation interface |
| My Wardrobe     | User garment inventory        |
| Saved Outfits   | Saved recommendations         |
| Analysis History| Past recommendation sessions  |
| Settings        | User preferences              |

---

## 3. Landing Page
#### Purpose

Provide entry to the application.

#### UI Elements

- SCORE logo
- System title
- Tagline
- Enter **System button**

#### Behavior

```text
User clicks "Enter System"
↓
Dashboard loads
```

No system processing occurs here.

---

## 4. Dashboard (Main Recommendation Interface)

This is the **core interaction page**.

#### Main Components

1. Context Input
2. Suggested Context Chips
3. Outfit Input
4. Recommendation Panel

---

### 4.1 Context Input

The context box allows users to describe the situation.

Examples:

- “Going to the beach”
- “Work presentation”
- “Date night”
- “Rainy day”

The system interprets context into structured labels.

Example transformation:

```text
"Beach casual"
↓
{
 occasion: beach
 style: casual
 temperature: warm
}
```

Context is mandatory before scoring. **[for more context, review 02_User_Input_Flows.md]**
 

---

### 4.2 Suggested Context Chips

Quick selection buttons:

Examples:

- Work
- Party
- Date
- Beach
- Presentation

These populate the context field automatically.

---

### 4.3 Current Outfit Input

User provides garments via two methods:

#### Method A — Upload Outfit Photo

```text
Upload image
↓
Vision model detects garments
↓
Attributes extracted
↓
User confirms attributes
```

Vision is optional but supported. **[for more context, review 05_Use_Cases.md]**

---

#### Method B — Manual Selection

User selects garments manually:

- Top
- Bottom
- Shoes

Example:

```text
Top → Shirt
Bottom → Jeans
Shoes → Sneakers
```

If a category is missing, the system treats it as Outfit Completion mode.

---

### 4.4 Recommendation Panel

After pressing **Analyze**:

```text
Context
+
Current Outfit
+
Wardrobe
↓
Scoring Engine
↓
Ranked Recommendations
```

Recommendations contain:

- final score
- compatibility reasoning
- suggested improvements

Example:

```text
Monochrome Minimalism
Score: 92
Explanation: neutral palette compatibility
```

---

## 5. My Wardrobe

The wardrobe is the **user’s garment inventory**.

The system does not invent clothing items — it only recommends combinations from the wardrobe. **[for more context, review 01_My_Wardrobe_Concept.md]**

---

### 5.1 Wardrobe Data Model

Each garment contains:

```text
id
category
primary_color
secondary_color
material
tags
```

Example: 

```text
{
  id: g_001,
  category: top,
  color_primary: orange,
  color_secondary: null,
  material: wool,
  tags: [casual]
}
```

---

### 5.2 Wardrobe Views

Two view modes exist.

#### Deck View (default)

Large cards with:

- garment image
- name
- tags
- seasons
- details button

---

#### Compact View

A denser list representation used for large wardrobes.

Compact view improves browsing efficiency.

---

### 5.3 Add Item Flow

Users add garments via a 3-step wizard.

#### Step 1 — Method

Choose:

```text
Add from Photo
Add Manually
```

---

#### Step 2 — Details

User confirms or enters:

- category
- color
- material
- pattern
- seasons

---

#### Step 3 — Confirm

Garment saved to wardrobe database.

---

## 6. Garment Details Drawer

Selecting **View Details** opens a side drawer.

Editable fields include:

```text
Name
Category
Formality
Primary Color
Secondary Color
Material
Pattern
Seasons
Notes
```

Actions:

```text
Save Changes
Cancel
Delete Garment
```

---

## 7. Saved Outfits

Saved recommendations appear here.

Each card contains:

```text
context
score
color palette
date
```

Users may:

```text
Re-run analysis
```

This loads the configuration back into the dashboard.

---

## 8. Analysis History

Displays previous recommendation sessions.

Each record includes:

```text
date
context
top recommendation
score
```

Selecting a record opens details.

---

## 9. Settings

The Settings page controls user preferences.

---

### 9.1 Appearance

- Dark Mode
- Accent Color
- Compact Density

---

### 9.2 Wardrobe Preferences

Options include:

```text
Default View Mode
Confirm Before Delete
Auto-open Details
```

---

### 9.3 Analysis Preferences

Options include:

```text
Auto-detect garments on upload
Show explanations
```

---

## 10. Recommendation Pipeline

All recommendation modes use the same core pipeline.

```text
User Input
↓
Context Normalization
↓
Wardrobe Retrieval
↓
Candidate Generation
↓
Compatibility Scoring
↓
Ranking
↓
Explainability
```

---

## 11. Supported Use Cases

SCORE supports four operational modes.

---

### UC-01 Outfit Completion

User has partial outfit.

Example:

```text
Pants
Shoes
Missing: Top
```

System recommends compatible tops. **[for more context, review 05_Use_Cases.md]**

---

### UC-02 Garment Comparison

User compares alternatives.

Example:

```text
Shirt A
Shirt B
Shirt C
```

System ranks best candidate.

---

### UC-03 Full Outfit Recommendation

User provides context.

Example:

```text
Occasion: Business
Weather: Cold
Style: Elegant
```

System generates top outfit combinations.

---

### UC-04 Photo-Based Analysis

User uploads image.

Pipeline:

```text
Image
↓
Garment detection
↓
Attribute extraction
↓
Outfit representation
↓
Compatibility scoring
```

---

## 12. Error Handling

The system handles four error types.

#### 1. Perception Errors

Example:

```text
Sweater misclassified as jacket
```

User may correct attributes before scoring. **[for more context, review 03_Error_Handling_and_Clarifications.md]**

---

#### 2. Input Errors

Example:

```text
Two bottoms selected
No top selected
```

System warns user and blocks scoring.

---

#### 3. Context Missing

Scoring cannot run without context.

The UI prompts for context selection.

---

#### 4. System Failures

Example:

```text
model loading failure
corrupt preferences
```

System falls back to manual mode.

---

## 13. Feedback and Personalization

After recommendations:

User may provide:

```text
👍 approval
👎 rejection
```

Feedback adjusts scoring weights.

Weight update rule: 

```text
weight_new = weight_old + (learning_rate × reward)
```

Where:

```text
reward = +1 approval
reward = -1 rejection
```

Adaptation is gradual to ensure stability.

---

## 14. Data Flow Summary

```text
User
↓
UI
↓
Use Case Controller
↓
Wardrobe Repository
↓
Context Provider
↓
Scoring Engine
↓
Ranking
↓
Explanation
↓
UI Display
↓
User Feedback
↓
Weight Update
```

---

## 15. Architectural Alignment

SCORE follows **Clean Architecture**.

```text
UI Layer
CLI / Web UI / Mobile
↓
Application Layer
Use Cases
↓
Domain Layer
Entities + Scoring Logic
↓
Infrastructure
Repositories / Models / APIs
```

The UI never interacts directly with the scoring engine.

All interaction occurs through Use Cases.

---

## 16. Design Principles

The UI must ensure:

- minimal user friction
- clear explanations
- structured input
- graceful error recovery
- optional automation

The system should guide **the user rather than assume missing information**. **[for more context, review 02_User_Input_Flows.md]**

---

## 17. Future UI Enhancements

Possible improvements:

```text
Outfit canvas editor
Drag-and-drop garment composition
Wear history tracking
Seasonal wardrobe analytics
Auto outfit generation on wardrobe change
```

---

## Final Summary

SCORE is a **context-aware outfit** decision system built around:

- a structured wardrobe model
- compatibility scoring
- explainable recommendations
- adaptive personalization

The UI’s responsibility is to:

```text
collect structured input
display recommendations
enable corrections
capture feedback
```

while the core engine performs all **decision logic**.
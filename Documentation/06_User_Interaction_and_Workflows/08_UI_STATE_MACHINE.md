# 08 - UI STATE MACHINE

This document defines the visible UI states and transitions of SCORE.

Its purpose is to help the UI implementation remain modular, predictable, and aligned with the system architecture.

It does not define scoring logic or domain behavior.
It defines what the user can see, what actions are enabled, and how screens transition between states.

These states are aligned with the structured input flow, the clarification rules, the error recovery strategy, the feedback loop, and the four supported use cases. Context must exist before scoring, incomplete outfits require clarification, perception errors require confirmation before correction, and explicit feedback may update personalization parameters after results are shown.

---

## 1. Global UI States

### 1.1 Idle
Default resting state.

#### Characteristics
- no blocking overlay
- no active loading indicator
- normal actions available

---

### 1.2 Loading
The UI is waiting for data or a process to complete.

#### Characteristics
- skeleton loaders or progress indicators visible
- relevant actions disabled temporarily
- prior stable content may remain visible

#### Examples
- wardrobe items loading
- recommendations loading
- image upload processing
- saved outfits loading
- history loading

---

### 1.3 Empty
No data exists yet.

#### Characteristics
- designed empty state
- explanatory text
- primary next-step action

#### Examples
- wardrobe empty
- no saved outfits
- no analysis history
- recommendations empty before first analysis

---

### 1.4 Success
A user-triggered action completed successfully.

#### Characteristics
- toast or inline confirmation
- state usually returns to Idle afterward

#### Examples
- garment saved
- garment deleted
- outfit analyzed
- settings updated

---

### 1.5 Error
An operation failed or the input is invalid.

#### Characteristics
- clear user-facing message
- action to recover or retry
- previously entered data preserved when possible

#### Examples
- failed image upload
- invalid outfit configuration
- failed analysis request
- failed save

---

## 2. Landing Page State Machine

### 2.1 States

#### LandingIdle
Landing page visible.
CTA available.

#### LandingTransitioning
User pressed Enter System.
App transitions to Dashboard.

### 2.2 Transitions

```text
LandingIdle
  -> LandingTransitioning
  when user clicks Enter System

LandingTransitioning
  -> DashboardEmpty
  when dashboard page loads
```

---

## 3. Dashboard State Machine

The Dashboard is the main interaction screen for recommendation generation.

### 3.1 Dashboard States

#### DashboardEmpty
No valid outfit analysis has been started yet.

#### UI Behavior
- context box visible
- suggested context chips visible
- current outfit section visible
- recommendations section shows empty state
- Analyze button disabled if required context or minimum outfit data is missing

#### DashboardContextPartial
User is editing text or selectors, but the required minimum state is not yet satisfied.

#### UI Behavior
- partially filled context command box
- Analyze disabled
- inline helper may appear

#### DashboardInputReady
Minimum valid inputs exist for the chosen flow.

#### Examples
- full recommendation with context and enough wardrobe/candidate data
- outfit completion with fixed items + missing category + context
- photo analysis with confirmed detected garments + context

#### UI Behavior
- Analyze enabled
- recommendation panel still empty until analysis begins

#### DashboardClarificationRequired
User input is insufficient or ambiguous.

#### Examples
- missing context
- incomplete outfit with missing category not declared
- low-confidence detected color/category
- invalid combination such as duplicate categories

#### UI Behavior
- blocking or inline clarification prompt
- analysis prevented until clarification is resolved

#### Notes
The system must request clarification rather than silently assume missing garments or auto-correct uncertain detection.

#### DashboardAnalyzing
Analysis request is in progress.

#### UI Behavior
- Analyze disabled
- recommendations panel shows loading state
- current inputs remain visible
- optional “Analyzing outfit...” status visible

#### DashboardResultsReady
Ranked recommendations are available.

#### UI Behavior
- recommendations rendered
- explanation visible
- approval/rejection available
- save actions available if relevant

#### DashboardAnalysisError
Analysis failed.

#### UI Behavior
- error message shown
- retry action visible
- last valid user input preserved

### 3.2 Dashboard Transitions

```text
DashboardEmpty
  -> DashboardContextPartial
  when user starts typing or selecting context

DashboardContextPartial
  -> DashboardInputReady
  when all minimum required inputs are satisfied

DashboardContextPartial
  -> DashboardClarificationRequired
  when user attempts analysis with invalid or incomplete input

DashboardInputReady
  -> DashboardAnalyzing
  when user clicks Analyze

DashboardAnalyzing
  -> DashboardResultsReady
  when results are returned successfully

DashboardAnalyzing
  -> DashboardAnalysisError
  when analysis request fails

DashboardResultsReady
  -> DashboardContextPartial
  when user edits context or outfit inputs

DashboardResultsReady
  -> DashboardAnalyzing
  when user re-runs analysis

DashboardAnalysisError
  -> DashboardAnalyzing
  when user retries

DashboardClarificationRequired
  -> DashboardInputReady
  when user resolves missing/uncertain input
```

---

## 4. Current Outfit / Photo Analysis State Machine

This applies inside the dashboard current-outfit area.

### 4.1 States

#### OutfitInputEmpty
No outfit image or manual garment assignment yet.

#### OutfitPhotoUploading
Photo upload in progress.

#### OutfitPhotoUploaded
Image uploaded successfully.

#### OutfitDetectionRunning
Vision-assisted extraction in progress.

#### OutfitDetectionIncomplete
Only some garments or attributes were detected.

#### OutfitDetectionLowConfidence
Detection exists but requires user confirmation.

#### OutfitRepresentationReady
Detected/manual garments are sufficiently confirmed for scoring.

#### OutfitInputError
Upload or detection failed.

### 4.2 Transitions

```text
OutfitInputEmpty
  -> OutfitPhotoUploading
  when user uploads a photo

OutfitPhotoUploading
  -> OutfitPhotoUploaded
  when upload succeeds

OutfitPhotoUploaded
  -> OutfitDetectionRunning
  when detection starts

OutfitDetectionRunning
  -> OutfitDetectionIncomplete
  when only partial garment data is detected

OutfitDetectionRunning
  -> OutfitDetectionLowConfidence
  when confidence threshold is low

OutfitDetectionRunning
  -> OutfitRepresentationReady
  when garments and attributes are extracted sufficiently

OutfitDetectionLowConfidence
  -> OutfitRepresentationReady
  when user confirms/corrects attributes

OutfitDetectionIncomplete
  -> OutfitRepresentationReady
  when missing garments are added manually

OutfitPhotoUploading
  -> OutfitInputError
  when upload fails

OutfitDetectionRunning
  -> OutfitInputError
  when processing fails
```

---

## 5. Wardrobe Page State Machine

The wardrobe is the user-owned garment inventory and candidate source. It is factual inventory, not a learned preference object.

### 5.1 States

#### WardrobeLoading
Garments are loading.

#### WardrobeEmpty
No garments exist.

#### WardrobeLoadedDeck
Garments loaded and deck view active.

#### WardrobeLoadedCompact
Garments loaded and compact view active.

#### WardrobeFiltering
Search/filter is being applied.

#### WardrobeError
Wardrobe could not load.

### 5.2 Transitions

```text
WardrobeLoading
  -> WardrobeEmpty
  when no garments are returned

WardrobeLoading
  -> WardrobeLoadedDeck
  when garments load successfully and deck mode is active

WardrobeLoading
  -> WardrobeLoadedCompact
  when garments load successfully and compact mode is active

WardrobeLoadedDeck
  -> WardrobeFiltering
  when user changes filters/search

WardrobeLoadedCompact
  -> WardrobeFiltering
  when user changes filters/search

WardrobeFiltering
  -> WardrobeLoadedDeck
  when filtered results render in deck mode

WardrobeFiltering
  -> WardrobeLoadedCompact
  when filtered results render in compact mode

WardrobeLoadedDeck
  -> WardrobeLoadedCompact
  when user switches to compact view

WardrobeLoadedCompact
  -> WardrobeLoadedDeck
  when user switches to deck view

WardrobeLoading
  -> WardrobeError
  when loading fails
```

---

## 6. Garment Details Drawer State Machine

The garment drawer is the authoritative editing surface for one wardrobe item.

### 6.1 States

#### DrawerClosed
Drawer not visible.

#### DrawerOpening
Drawer animation in progress.

#### DrawerViewing
Drawer open, no edits yet.

#### DrawerEditing
At least one field has changed.

#### DrawerSaving
Save action in progress.

#### DrawerDeleteConfirm
Delete confirmation visible.

#### DrawerClosing
Drawer closing animation in progress.

#### DrawerError
Save or delete failed.

### 6.2 Transitions

```text
DrawerClosed
  -> DrawerOpening
  when user clicks View Details or a garment card

DrawerOpening
  -> DrawerViewing
  when drawer finishes opening

DrawerViewing
  -> DrawerEditing
  when user changes any field

DrawerEditing
  -> DrawerSaving
  when user clicks Save Changes

DrawerSaving
  -> DrawerViewing
  when save succeeds

DrawerSaving
  -> DrawerError
  when save fails

DrawerViewing
  -> DrawerDeleteConfirm
  when user clicks Delete

DrawerEditing
  -> DrawerDeleteConfirm
  when user clicks Delete

DrawerDeleteConfirm
  -> DrawerClosing
  when delete succeeds

DrawerDeleteConfirm
  -> DrawerViewing
  when delete is canceled

DrawerViewing
  -> DrawerClosing
  when user closes drawer

DrawerEditing
  -> DrawerClosing
  when user cancels and discard is confirmed

DrawerClosing
  -> DrawerClosed
  when close animation ends
```

---

## 7. Add Item Wizard State Machine

The add-item flow supports both manual structured entry and photo-assisted entry. Version 1 prioritizes structured form input, while photo mode is a future-compatible optional path.

### 7.1 States

#### AddItemClosed
Wizard not visible.

#### AddItemMethodStep
Step 1 visible.
User chooses add method.

#### AddItemDetailsStepPhoto
Step 2 for photo mode.

#### AddItemDetailsStepManual
Step 2 for manual mode.

#### AddItemDetectionLowConfidence
Photo mode produced uncertain fields needing confirmation.

#### AddItemConfirmStep
Step 3 visible.

#### AddItemSaving
Save action in progress.

#### AddItemSuccess
Save completed.

#### AddItemError
Save failed or upload failed.

### 7.2 Transitions

```text
AddItemClosed
  -> AddItemMethodStep
  when user clicks Add Item

AddItemMethodStep
  -> AddItemDetailsStepPhoto
  when user chooses Add from Photo

AddItemMethodStep
  -> AddItemDetailsStepManual
  when user chooses Add Manually

AddItemDetailsStepPhoto
  -> AddItemDetectionLowConfidence
  when extracted fields need confirmation

AddItemDetectionLowConfidence
  -> AddItemConfirmStep
  when user confirms/corrects fields

AddItemDetailsStepPhoto
  -> AddItemConfirmStep
  when valid photo details are ready

AddItemDetailsStepManual
  -> AddItemConfirmStep
  when required structured fields are valid

AddItemConfirmStep
  -> AddItemSaving
  when user confirms save

AddItemSaving
  -> AddItemSuccess
  when save succeeds

AddItemSaving
  -> AddItemError
  when save fails

AddItemSuccess
  -> AddItemClosed
  after success feedback is shown
```

---

## 8. Recommendation Card State Machine

Applies to each recommendation result after scoring.

### 8.1 States

#### RecommendationHidden
No recommendation exists yet.

#### RecommendationLoading
Placeholder visible during analysis.

#### RecommendationReady
Card rendered with score and explanation.

#### RecommendationLiked
User approved recommendation.

#### RecommendationDisliked
User rejected recommendation.

#### RecommendationSaved
User saved result or selected it as final outcome.

### 8.2 Transitions

```text
RecommendationHidden
  -> RecommendationLoading
  when dashboard analysis starts

RecommendationLoading
  -> RecommendationReady
  when recommendation result arrives

RecommendationReady
  -> RecommendationLiked
  when user clicks approval

RecommendationReady
  -> RecommendationDisliked
  when user clicks rejection

RecommendationReady
  -> RecommendationSaved
  when user saves/selects the recommendation
```

#### Notes
Only explicit approval/rejection should trigger personalization updates; no response should not change weights. 

---

## 9. Saved Outfits State Machine

### 9.1 States

#### SavedOutfitsLoading
Saved outfits are loading.

#### SavedOutfitsEmpty
No saved outfits exist.

#### SavedOutfitsLoaded
Saved outfits visible.

#### SavedOutfitsRerunPending
User selected re-run analysis.

#### SavedOutfitsError
Loading failed.

### 9.2 Transitions

```text
SavedOutfitsLoading
  -> SavedOutfitsEmpty
  when no saved outfits exist

SavedOutfitsLoading
  -> SavedOutfitsLoaded
  when saved outfits load successfully

SavedOutfitsLoaded
  -> SavedOutfitsRerunPending
  when user clicks Re-run Analysis

SavedOutfitsRerunPending
  -> DashboardInputReady
  when dashboard is restored with saved context/outfit

SavedOutfitsLoading
  -> SavedOutfitsError
  when loading fails
```

---

## 10. Analysis History State Machine

### 10.1 States

#### HistoryLoading
History is loading.

#### HistoryEmpty
No history records exist.

#### HistoryLoaded
History list visible.

#### HistoryEntrySelected
User selected a record.

#### HistoryError
History load failed.

### 10.2 Transitions

```text
HistoryLoading
  -> HistoryEmpty
  when no history exists

HistoryLoading
  -> HistoryLoaded
  when history loads successfully

HistoryLoaded
  -> HistoryEntrySelected
  when user clicks a record

HistoryLoading
  -> HistoryError
  when loading fails
```

---

## 11. Settings State Machine

### 11.1 States

#### SettingsIdle
No unsaved edits pending, or auto-save is stable.

#### SettingsEdited
A setting changed and has not yet been persisted.

#### SettingsSaving
Preferences are being persisted.

#### SettingsSaved
Short-lived success state after save.

#### SettingsError
Preferences failed to save.

### 11.2 Transitions

```text
SettingsIdle
  -> SettingsEdited
  when user changes any setting

SettingsEdited
  -> SettingsSaving
  when auto-save triggers or user confirms save

SettingsSaving
  -> SettingsSaved
  when save succeeds

SettingsSaving
  -> SettingsError
  when save fails

SettingsSaved
  -> SettingsIdle
  after success feedback is shown

SettingsError
  -> SettingsSaving
  when user retries
```

---

## 12. Image State Machine

Applies anywhere garment or outfit images are shown.

### 12.1 States

#### NoImage
No image exists.
Placeholder visible.

#### ImageLoading
Image is loading or being uploaded.

#### ImageLoaded
Valid image visible.

#### ImageError
Image failed to load/process.

### 12.2 Transitions

```text
NoImage
  -> ImageLoading
  when user uploads or image fetch begins

ImageLoading
  -> ImageLoaded
  when image succeeds

ImageLoading
  -> ImageError
  when image fails

ImageError
  -> ImageLoading
  when user retries
```

---

## 13. Clarification State Rules

The product relies on clarification-driven interaction rather than silent assumptions.

Trigger clarification when:
- context is missing
- outfit is incomplete and missing categories are not explicitly defined
- detection confidence is low
- category assignment is inconsistent
- color detection is uncertain
- duplicate incompatible category assignment exists

Do not continue automatically when:
- required context is absent
- only one detected garment exists but scoring requires a fuller representation
- vision output is ambiguous
- category structure is invalid

These rules come directly from the structured input and error-handling documents.

---

## 14. Feedback State Rules

Feedback exists after recommendation display, not before.

#### Feedback options
- approval
- rejection
- no response

#### Effects
- approval/rejection may be persisted
- personalization weights may be updated gradually
- garment facts and wardrobe inventory do not change

This separation is required by the feedback loop and wardrobe concept documents.

---

## 15. UI Rules for Stability

#### Rule 1
Never show raw broken states like:
- undefined
- null
- plain technical confidence errors
- bare broken image text

#### Rule 2
Empty state is not error state.

#### Rule 3
Preserve user input whenever possible after failure.

#### Rule 4
Disable actions only when required by validation or loading.

#### Rule 5
Use clear user-facing messages:
- “Please select a context”
- “The system is unsure about this garment. Please confirm.”
- “Incomplete outfit configuration”

The wording principle is explicitly supported by the error-handling doc. 

---

## Final Summary

SCORE’s UI state model is built around:
- Idle
- Loading
- Empty
- ClarificationRequired
- Ready
- Success
- Error

Each page and component must implement visible, recoverable states so the user always understands:
- what the system is waiting for
- what is currently happening
- what action is available next
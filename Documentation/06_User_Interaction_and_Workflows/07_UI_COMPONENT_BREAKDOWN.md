# 07 - UI COMPONENT BREAKDOWN

This document defines the main UI components of SCORE and their responsibilities.

Its purpose is to help the UI implementation remain modular, predictable, and aligned with the system architecture.

The UI must not contain scoring logic.
It must only:

- collect user input
- display system output
- allow corrections
- trigger use case actions
- present feedback and system states

The recommendation logic, candidate generation, scoring, ranking, and personalization remain outside the UI layer. The wardrobe is the constrained inventory used by the recommendation pipeline, context is mandatory before scoring, clarification is required for incomplete input, and feedback updates personalization weights rather than wardrobe facts.

---

## 1. Global Layout Components

### 1.1 AppShell

Top-level application shell used after the landing page.

#### Responsibilities
- render page frame
- render top navigation
- render current page content
- manage page-level spacing and responsiveness

#### Contains
- TopNav
- PageContainer
- optional page overlays (drawer, modal, toast)

---

### 1.2 TopNav

Top navigation bar used across internal pages.

#### Responsibilities
- show SCORE logo
- show current page title
- expose theme toggle
- expose menu button

#### Behavior
- desktop: compact top bar
- mobile: same top bar with slide-in menu
- active page is controlled by app routing, not by this component itself

#### Contains
- LogoMark
- PageTitle
- ThemeToggle
- MenuButton

---

### 1.3 NavigationMenu

Dropdown or slide-in navigation menu.

#### Responsibilities
- display navigation items:
  - Dashboard
  - My Wardrobe
  - Saved Outfits
  - Analysis History
  - Settings
- support active item highlight
- allow mobile-friendly navigation

#### Notes
This replaces the old persistent sidebar to save horizontal space.

---

### 1.4 PageContainer

Reusable page wrapper for internal screens.

#### Responsibilities
- enforce max width
- manage vertical spacing
- align page sections
- keep consistent padding across pages

---

## 2. Landing Page Components

### 2.1 LandingHero

Main landing composition.

#### Responsibilities
- show logo
- show system title
- show subtitle
- show primary CTA

#### Contains
- LogoDisplay
- AppTitle
- Tagline
- EnterSystemButton

---

### 2.2 EnterSystemButton

Primary CTA on landing page.

#### Responsibilities
- trigger transition to Dashboard

---

## 3. Dashboard Components

The Dashboard is the main recommendation screen.
It supports context input, outfit input, analysis triggering, and recommendation display. This aligns with the structured input flow and the common execution pipeline described in the provided docs.

### 3.1 DashboardPage

Top-level container for Dashboard.

#### Responsibilities
- compose all dashboard subcomponents
- coordinate section ordering
- render empty, loading, and result states

#### Contains
- ContextCommandBox
- SuggestedOccasionsRow
- CurrentOutfitPanel
- RecommendationsPanel

---

### 3.2 ContextCommandBox

Primary context input area.

#### Responsibilities
- collect optional free-text context
- collect structured selections
- support future interpreter integration
- trigger analysis action

#### UI Fields
- free-text context area
- ContextSelect
- StyleIntentSelect
- optional plus button for future advanced inputs
- AnalyzeButton

#### Notes
Context is mandatory before scoring.
The free-text field can be optional, but the system must not proceed without required context.

---

### 3.3 ContextSelect

Structured context selector.

#### Example values
- university
- gym
- presentation
- formal event
- casual outing

#### Responsibilities
- allow mandatory context selection
- surface validation errors if empty

---

### 3.4 StyleIntentSelect

Optional structured style selector.

#### Example values
- casual
- elegant
- sporty
- business

#### Responsibilities
- add style signal to the recommendation request
- remain optional in Version 1

---

### 3.5 SuggestedOccasionsRow

Quick chip row shown below the command box.

#### Example chips
- Work
- Party
- Date
- Beach
- Presentation

#### Responsibilities
- accelerate common context entry
- populate the context input when clicked

---

### 3.6 AnalyzeButton

Primary action button for recommendation flow.

#### Responsibilities
- validate minimum input
- trigger dashboard analysis use case
- show loading state while analysis is running

#### Rules
Disable when:
- required context is missing
- outfit input is insufficient for the current use case

---

### 3.7 CurrentOutfitPanel

Displays the outfit currently being analyzed.

#### Responsibilities
- allow upload of outfit photo
- show garment slots
- show detected or manually selected items
- support incomplete outfit scenarios

#### Contains
- OutfitPhotoUploader
- OutfitSlotCard (Top)
- OutfitSlotCard (Bottom)
- OutfitSlotCard (Shoes)
- optional future slot: Accessories / Outerwear

---

### 3.8 OutfitPhotoUploader

Upload area for photo-based outfit analysis.

#### Responsibilities
- accept photo input
- show preview state
- show upload instructions
- transition into vision-assisted flow

#### Notes
Photo mode is supported by the architecture but remains optional in Version 1. The UI must support upload, detection display, correction, and fallback to manual completion.

---

### 3.9 OutfitSlotCard

Represents one garment category in the current outfit.

#### Example categories
- Top
- Bottom
- Shoes

#### Responsibilities
- show assigned garment or placeholder
- indicate missing category
- allow replacement or manual selection later

#### Notes
If the outfit is incomplete, the system must request the missing garments rather than silently assume them. 

---

### 3.10 RecommendationsPanel

Displays ranked recommendation output.

#### Responsibilities
- render empty state before analysis
- render loading state during scoring
- render ranked recommendations after scoring
- allow feedback actions

#### Contains
- RecommendationCard list
- optional section title / helper text

---

### 3.11 RecommendationCard

Displays one recommendation result.

#### Responsibilities
- show recommendation name
- show final score
- show short explanation
- allow approval / rejection
- allow save action if applicable

#### Fields
- title
- score badge
- progress bar
- explanation text
- feedback buttons
- optional save action

#### Notes
Explanations are important when compatibility is low or when the system suggests alternatives, and the docs explicitly require explainability to remain visible to the user. 

---

## 4. My Wardrobe Components

The wardrobe is the factual inventory of user-owned garments and the constrained search space for recommendations. It stores garment attributes but is not changed by reinforcement feedback. 

### 4.1 MyWardrobePage

Top-level wardrobe page.

#### Responsibilities
- render wardrobe controls
- render selected wardrobe view mode
- render add-item flow
- open garment details drawer

#### Contains
- AddItemButton
- ViewModeToggle
- WardrobeFilterBar
- WardrobeDeckGrid or WardrobeCompactList
- GarmentDetailsDrawer
- AddItemWizardModal

---

### 4.2 AddItemButton

Primary CTA to add a new garment.

#### Responsibilities
- open AddItemWizardModal

---

### 4.3 ViewModeToggle

Switch between wardrobe presentation modes.

#### Modes
- Deck View
- Compact View

#### Responsibilities
- visually indicate active view
- persist selected view mode in preferences
- switch rendered wardrobe component

---

### 4.4 WardrobeFilterBar

Top filter/search row.

#### Responsibilities
- search garments by name, material, or tag
- filter by category
- filter by material / season / tag depending on implementation
- support future expansion without changing page layout

#### Contains
- WardrobeSearchInput
- CategoryFilter
- SecondaryFilterA
- SecondaryFilterB

---

### 4.5 WardrobeSearchInput

Search field for wardrobe inventory.

#### Responsibilities
- filter garments by visible metadata
- preserve entered text across view switches

---

### 4.6 WardrobeDeckGrid

Default visual wardrobe view.

#### Responsibilities
- render larger garment cards
- favor browsing and visual identity
- support moderate number of visible items per screen

#### Contains
- GarmentDeckCard list

---

### 4.7 GarmentDeckCard

Primary wardrobe card in deck mode.

#### Responsibilities
- show garment image or placeholder
- show category badge
- show garment name
- show formality tag
- show color swatches
- show material
- show season chips
- show pattern tag if present
- open details drawer

#### Notes
This is the summary layer.
It must not expose all editable fields.

---

### 4.8 WardrobeCompactList

Dense wardrobe mode for fast scanning.

#### Responsibilities
- render more garments per screen
- use condensed horizontal rows
- keep core attributes visible
- preserve same actions as deck mode

#### Contains
- GarmentCompactRow list

---

### 4.9 GarmentCompactRow

Compact representation of a garment.

#### Responsibilities
- show thumbnail
- show garment name
- show category and material
- show minimal color/formality/season signals
- expose quick actions:
  - view
  - edit
  - delete

---

### 4.10 GarmentImagePlaceholder

Designed fallback for garments without photos.

#### Responsibilities
- show neutral placeholder
- avoid raw broken-image states
- show “No photo added” instead of technical errors

#### Notes
The UI should never show raw broken states like plain “image unavailable” error text. The error-handling document explicitly favors clear, user-facing messaging and confirmation-based recovery.

---

### 4.11 GarmentDetailsDrawer

Right-side drawer with full garment fields.

#### Responsibilities
- show full garment data
- support editing
- support saving
- support delete flow
- support image replacement

#### Contains
- DrawerHeader
- GarmentImageSection
- CoreInfoSection
- AttributesSection
- SeasonSuitabilitySection
- NotesSection
- DrawerFooterActions

---

### 4.12 DrawerHeader

Header inside GarmentDetailsDrawer.

#### Responsibilities
- show title
- show close action

---

### 4.13 GarmentImageSection

Top image area inside the drawer.

#### Responsibilities
- show full image or placeholder
- expose ReplaceImageButton / UploadImageButton

---

### 4.14 CoreInfoSection

Editable core fields.

#### Fields
- Name
- Category
- Formality
- Primary Color
- Secondary Color

---

### 4.15 AttributesSection

Editable garment attributes.

#### Fields
- Material
- Pattern

---

### 4.16 SeasonSuitabilitySection

Editable season suitability chips.

#### Fields
- Spring
- Summer
- Fall
- Winter

---

### 4.17 NotesSection

Optional notes area.

#### Responsibilities
- support free-text notes
- preserve user edits until save/cancel

---

### 4.18 DrawerFooterActions

Sticky footer action area.

#### Actions
- Save Changes
- Cancel
- Delete

#### Rules
- Save disabled unless edits exist
- Delete may open a confirmation dialog
- Cancel closes without persisting

---

### 4.19 DeleteConfirmationDialog

Confirmation modal for deleting a garment.

#### Responsibilities
- confirm destructive action
- display garment name if available
- allow cancel/retry

---

## 5. Add Item Flow Components

Version 1 defaults to manual entry but supports a future-compatible photo-assisted path in which the system extracts category and dominant color and asks for user confirmation. 

### 5.1 AddItemWizardModal

3-step modal for adding a new garment.

#### Steps
1. Method
2. Details
3. Confirm

#### Responsibilities
- coordinate selected add mode
- preserve temporary state between steps
- support back/cancel flow

---

### 5.2 AddMethodStep

Step 1 of wizard.

#### Options
- Add from Photo
- Add Manually

#### Responsibilities
- capture chosen pathway
- move to details step

---

### 5.3 AddPhotoStep

Photo-based details step.

#### Responsibilities
- upload garment photo
- show preview
- show auto-detected attributes if available
- allow manual correction before confirmation

---

### 5.4 AddManualStep

Manual-entry details step.

#### Responsibilities
- expose structured garment form
- collect category, colors, material, pattern, seasons
- avoid ambiguous free text for core factual fields

#### Notes
Structured forms are the preferred V1 interaction mode to avoid parsing ambiguity.

---

### 5.5 AddConfirmStep

Final confirmation step.

#### Responsibilities
- summarize garment data
- allow final save
- show success feedback

---

## 6. Saved Outfits Components

Saved outfits represent successful combinations or user-selected recommendations. The use cases and feedback loop imply that selected results can be preserved and re-used. 

### 6.1 SavedOutfitsPage

Top-level saved outfits page.

#### Responsibilities
- display saved outfit cards
- support re-run analysis
- support empty state

---

### 6.2 SavedOutfitCard

Displays one saved outfit.

#### Responsibilities
- show context
- show score
- show preview image or composition area
- show palette or garment indicators
- show saved date
- expose ReRunAnalysisButton

---

### 6.3 ReRunAnalysisButton

Action for a saved outfit.

#### Responsibilities
- return user to dashboard with the saved outfit/context reloaded

---

## 7. Analysis History Components

History stores past analysis sessions with date, context, top result, and score.

### 7.1 AnalysisHistoryPage

Top-level history page.

#### Responsibilities
- render list of past analysis entries
- support empty state
- support entry selection

---

### 7.2 HistoryEntryCard

Displays one historical record.

#### Fields
- date
- context name
- top recommendation
- score
- view icon / chevron

#### Responsibilities
- summarize a previous recommendation session
- allow viewing or replaying later

---

## 8. Settings Components

Settings represent user preferences, not domain scoring logic. The current UI already separates appearance, wardrobe preferences, and analysis preferences, which matches the product direction.

### 8.1 SettingsPage

Top-level settings page.

#### Responsibilities
- group settings by section
- render preference controls
- show auto-save feedback if used

---

### 8.2 AppearanceSettingsSection

#### Controls
- DarkModeToggle
- AccentColorSelector
- CompactDensityToggle

---

### 8.3 WardrobePreferencesSection

#### Controls
- DefaultViewModeSelector
- ConfirmBeforeDeleteToggle
- AutoOpenDetailsToggle

---

### 8.4 AnalysisPreferencesSection

#### Controls
- AutoDetectOnUploadToggle
- ShowExplanationsToggle

---

## 9. Shared Feedback / Utility Components

### 9.1 LoadingSkeleton

Reusable loading placeholder.

#### Used in
- wardrobe list/grid
- recommendations
- saved outfits
- history list
- image loading

---

### 9.2 EmptyStatePanel

Reusable empty-state container.

#### Used in
- wardrobe
- recommendations
- saved outfits
- history

#### Responsibilities
- show helpful message
- expose next best action

---

### 9.3 ToastNotification

Short-lived feedback message.

#### Examples
- Garment saved
- Garment deleted
- Outfit analyzed
- Preferences saved

---

### 9.4 InlineValidationMessage

Displays field-level or section-level validation feedback.

#### Examples
- Context required before analysis
- Incomplete outfit configuration
- Please confirm detected color

---

### 9.5 ConfirmationPrompt

Reusable confirmation component for destructive or blocking actions.

#### Used in
- delete garment
- discard unsaved edits
- cancel add-item wizard with unsaved data

---

## 10. Component Boundaries

The UI must not:
- calculate compatibility scores
- decide ranking
- modify learning weights directly
- silently override garment facts

The UI must:
- collect structured inputs
- display results
- expose corrections
- present explanations
- pass feedback signals to the application layer

This boundary is required by the clean separation described in the architecture and the input/error/feedback documents. 

---

## Final Summary

Main high-value components for implementation:

- AppShell
- TopNav
- NavigationMenu
- LandingHero
- DashboardPage
- ContextCommandBox
- CurrentOutfitPanel
- RecommendationsPanel
- RecommendationCard
- MyWardrobePage
- WardrobeDeckGrid
- GarmentDeckCard
- WardrobeCompactList
- GarmentCompactRow
- GarmentDetailsDrawer
- AddItemWizardModal
- SavedOutfitsPage
- SavedOutfitCard
- AnalysisHistoryPage
- HistoryEntryCard
- SettingsPage

The UI should be implemented as a component system where:
- page components compose sections
- section components compose reusable controls
- all business logic remains external
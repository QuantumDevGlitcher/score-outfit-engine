# SCORE - Client Directory Structure

This document provides an overview of the files and directories within the `client/` folder of the **SCORE** (Smart Context-aware Outfit Recommendation Engine) application.

## Root Files

- `App.tsx`: The main entry point of the React application. It handles global providers (QueryClient, Tooltip, Toaster), theme management (dark/light), and defines the primary routes using `react-router-dom`.
- `global.css`: Contains global Tailwind CSS styles, theme variables (colors, borders, etc.), and custom utility classes.
- `vite-env.d.ts`: TypeScript declaration file for Vite environment variables and client-side types.

## Directories

### `pages/`
Contains the top-level route components for the SPA.

- `Landing.tsx`: The initial welcome page with the app logo and an "Enter System" call-to-action.
- `Dashboard.tsx`: The primary workspace where users provide context (where they are going) and outfit details to get AI-powered recommendations.
- `Wardrobe.tsx`: A digital catalog of the user's clothes, featuring filtering, view mode switching (deck/grid), and the ability to add new items.
- `SavedOutfits.tsx`: Displays previously saved outfit combinations with their recommendation scores.
- `History.tsx`: A log of previous analysis sessions, allowing users to revisit past recommendations.
- `Preferences.tsx`: Settings page for managing appearance (theme, accent colors) and the user's personal style profile.
- `Index.tsx`: A placeholder home page (often redirected or used as a fallback).
- `NotFound.tsx`: 404 error page for undefined routes.
- `Settings.tsx`: Secondary settings/configuration page.

### `components/`
Contains reusable React components used across various pages.

#### Core Components
- `TopNav.tsx`: Persistent top navigation bar featuring the brand logo, page title, theme toggle, and a mobile-friendly menu.
- `Sidebar.tsx`: Collapsible side navigation menu for quick access to main sections (Dashboard, Wardrobe, etc.).
- `ContextSection.tsx`: Dashboard component for inputting the occasion, setting, and style intent.
- `CurrentOutfitSection.tsx`: Handles outfit input via image upload or manual garment selection.
- `RecommendationResultsSection.tsx`: Displays the generated outfit recommendations and scores.
- `GarmentCard.tsx` / `CompactGarmentCard.tsx`: Visual representations of individual clothing items.
- `PersonalStyleProfile.tsx`: UI for viewing and editing the user's style tendencies and preferences.
- `CalibrationWizard.tsx`: A step-by-step setup process to initialize the user's style profile.
- `AddItemModal.tsx`: A dialog for adding new items to the wardrobe.
- `DetailsDrawer.tsx` / `AnalysisDetailsDrawer.tsx`: Slide-out panels for viewing detailed information about garments or past analyses.
- `ThemeToggle.tsx`: A simple switch for toggling between dark and light modes.
- `FilterBar.tsx`: Filtering controls for the wardrobe.
- `SmartInputBar.tsx`: Enhanced input field for context or search.
- `NavigationMenu.tsx`: The mobile/dropdown navigation menu content.
- `ProfileIndicator.tsx`: Shows the status of the user's style profile completion.
- `RecommendationBreakdown.tsx`: Detailed scoring breakdown for a specific recommendation.
- `ViewModeSelector.tsx`: Controls for switching between different list views.
- `SkeletonGrid.tsx`: Loading states for grid layouts.
- `ImagePlaceholder.tsx`: Fallback UI for missing images.

#### `ui/`
Standardized, low-level UI components (primarily based on Radix UI and Shadcn UI). These include:
- `button.tsx`, `card.tsx`, `input.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `tabs.tsx`, `toast.tsx`, etc.

### `hooks/`
Custom React hooks for shared logic.

- `use-mobile.tsx`: Detects if the user is on a mobile device based on screen width.
- `use-toast.ts`: Hook for managing and displaying toast notifications.

### `lib/`
Utility functions and libraries.

- `utils.ts`: Contains the `cn()` utility for conditionally merging Tailwind CSS classes.

### `data/`
Static data and mock datasets.

- `mockAnalysisHistory.ts`: Mock data used to populate the History page during development.

### `types/`
TypeScript interface and type definitions.

- `preferences.ts`: Definitions for `UserStyleProfile`, `CalibrationStepData`, and various option constants (Context, Style, Colors).

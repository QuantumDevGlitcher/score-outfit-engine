# `client` Folder Structure

The `client` folder houses all the logic of the frontend application. Here you will find the React code, user interface components, and the management of state and routes for the client side.

## Main Files

- `App.tsx`: The main entry point of the React application where routes (React Router 6) and context providers (QueryClient, Tooltip, etc.) are configured.
- `global.css`: The main style file where Tailwind CSS variables and global styles are defined.
- `main.tsx`: The file that initializes and renders the React application in the DOM.

## Directories and their purpose

### `pages/`
Contains the components that represent the pages or full routes of the application (Single Page Application).

- `Landing.tsx`: Initial welcome page.
- `Dashboard.tsx`: Primary workspace for getting context-based outfit recommendations.
- `Wardrobe.tsx`: Digital catalog of the user's clothing.
- `SavedOutfits.tsx`: Displays previously saved outfit combinations.
- `History.tsx`: Record of previous analysis sessions.
- `Preferences.tsx`: Settings page for managing appearance and the personal style profile.
- `NotFound.tsx`: 404 error page for undefined routes.

### `components/`
Houses the reusable React components used across different pages.

#### `ui/`
Basic and standardized user interface components (buttons, cards, inputs, dialogs, etc.), generally built with Radix UI and Tailwind CSS.

### `hooks/`
Contains custom React hooks to encapsulate reusable logic and handle effects or state in a modular way (e.g., `use-mobile.tsx`, `use-toast.ts`).

### `lib/`
Utility functions and configurations for external libraries (such as `utils.ts` for Tailwind class concatenation).

### `data/`
Static data files or test data (mock data) used during development.

### `types/`
Definitions for client-specific TypeScript interfaces and types.

All user interaction logic, component rendering, and SPA navigation are managed within this directory.

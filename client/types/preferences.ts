// User style profile data
export interface UserStyleProfile {
  id: string;
  userId: string;
  frequentContexts: string[]; // e.g., ["work", "casual", "formal"]
  styleTendencies: string[]; // e.g., ["casual", "elegant", "minimalist"]
  colorApproach: "neutral" | "balanced" | "bold"; // single choice
  colorsToAvoid: string[]; // optional color chips
  recommendationBehavior: "safe" | "balanced" | "creative";
  styleNotes: string; // optional free-form text
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Calibration step data
export interface CalibrationStepData {
  frequentContexts: string[];
  styleTendencies: string[];
  colorApproach: "neutral" | "balanced" | "bold";
  colorsToAvoid: string[];
  recommendationBehavior: "safe" | "balanced" | "creative";
  styleNotes: string;
}

// Context options
export const CONTEXT_OPTIONS = [
  { id: "work", label: "University / Work", icon: "Briefcase" },
  { id: "casual", label: "Casual outings", icon: "Coffee" },
  { id: "formal", label: "Formal events", icon: "Smile" },
  { id: "social", label: "Social / night events", icon: "Music" },
  { id: "gym", label: "Gym / sport", icon: "Zap" },
  { id: "outdoor", label: "Outdoor / beach", icon: "Sun" },
  { id: "travel", label: "Travel", icon: "Plane" },
];

// Style tendency options
export const STYLE_OPTIONS = [
  { id: "casual", label: "Casual", icon: "Shirt" },
  { id: "elegant", label: "Elegant", icon: "Sparkles" },
  { id: "minimalist", label: "Minimalist", icon: "Square" },
  { id: "sporty", label: "Sporty", icon: "Activity" },
  { id: "business", label: "Business / Professional", icon: "Briefcase" },
  { id: "streetwear", label: "Streetwear", icon: "Layers" },
  { id: "comfort", label: "Relaxed / Comfort-focused", icon: "Cloud" },
];

// Color options to avoid
export const COLOR_OPTIONS = [
  { id: "red", label: "Red", color: "#ef4444" },
  { id: "yellow", label: "Yellow", color: "#eab308" },
  { id: "orange", label: "Orange", color: "#f97316" },
  { id: "pink", label: "Pink", color: "#ec4899" },
  { id: "purple", label: "Purple", color: "#a855f7" },
  { id: "green", label: "Green", color: "#22c55e" },
  { id: "blue", label: "Blue", color: "#3b82f6" },
  { id: "brown", label: "Brown", color: "#92400e" },
];

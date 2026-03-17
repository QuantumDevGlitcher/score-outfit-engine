export type Color = {
  rgb: [number, number, number];
  confidence?: number;
};

export type OutfitItem = {
  clothing_type: string;
  material: string;
  formality_score: number;
  colors: Color[];
  image_path: string;
};

export type CurrentOutfitRepresentation = {
  items: OutfitItem[];
  source_image_path?: string;
};

export type ContextInput = {
  occasion: string;
  style_intent: string;
  weather?: string | null;
};

export type Recommendation = {
  items: OutfitItem[];
  compatibility_score: number;
  color_harmony?: number;
  formality_match?: number;
  material_compat?: number;
  weather_compat?: number;
  style_tips?: string[];
  explanation?: string;
};

export type RecommendFullRequest = {
  context: ContextInput;
  outfit: CurrentOutfitRepresentation;
};

export type RecommendFullResponse = {
  recommendations: Recommendation[];
};

export type RecommendationRunDoc = {
  context: ContextInput;
  outfit: CurrentOutfitRepresentation;
  recommendations: Recommendation[];
  created_at: Date;
};

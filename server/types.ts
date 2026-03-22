export type Color = {
  hex: string;
  percentage: number;
};

export type OutfitItem = {
  clothing_type: string;
  category_id?: number;
  material: string;
  formality_score: number;
  weather_warmth?: number;
  colors: Color[];
  image_path: string;
  visual_embedding?: number[];
};

export type WardrobeItemDoc = {
  _id?: any;
  owner_user_id: string;
  image_url: string;
  core_info: {
    name: string;
    category: string;
    formality: string;
    primary_color: string;
    secondary_color: string;
  };
  attributes: {
    material: string;
    pattern?: string;
    seasons: string[];
    tags: string[];
    notes?: string;
  };
  ml_features: {
    visual_embedding: number[];
    dominant_colors: Color[];
    weather_warmth: number;
    formality_score: number;
    category_id: number;
  };
  status: {
    is_active: boolean;
    created_at: Date;
  };
};

export type CurrentOutfitRepresentation = {
  items: OutfitItem[];
  source_image_path?: string;
  outfit_embedding?: number[];
  s_style?: number;
  s_rel?: number;
};

export type ContextInput = {
  occasion: string;
  style_intent: string;
  weather?: string | null;
  user_centroid?: number[];
  alpha?: number;
  beta?: number;
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
  outfit_embedding?: number[];
  s_style?: number;
  s_rel?: number;
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

export type UserProfileDoc = {
  user_id: string;
  preferences: {
    alpha: number;
    beta: number;
    user_centroid: number[];
  };
  updated_at: Date;
};

export type SavedOutfitDoc = {
  _id?: any;
  user_id: string;
  outfit: Recommendation;
  created_at: Date;
};

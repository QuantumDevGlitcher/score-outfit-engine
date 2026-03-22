import { Edit2, CheckSquare, Square } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export interface Garment {
  id: string;
  name: string;
  image: string;
  category: string;
  primaryColor: string;
  secondaryColor?: string;
  material: string;
  pattern?: string;
  seasons: string[];
  formality: string;
  notes?: string;
  tags?: string[];
  // ML Features
  formality_score?: number;
  weather_warmth?: number;
  dominant_colors?: { hex: string; percentage: number }[];
  confidence?: number;
}

interface GarmentCardProps {
  garment: Garment;
  onClick: (garment: Garment) => void;
  onEdit: (e: React.MouseEvent, garment: Garment) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const categoryColors: Record<string, string> = {
  Top: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Bottom: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Dress: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Jacket: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Shoes: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Accessory: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

const formalityColors: Record<string, string> = {
  Casual: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Business: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Formal: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

export default function GarmentCard({
  garment,
  onClick,
  onEdit,
  isSelectionMode,
  isSelected,
  onToggleSelect,
}: GarmentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onClick(garment)}
      className={cn(
        "bg-card border border-border rounded-[20px] overflow-hidden hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer group flex flex-col h-full relative",
        isSelected && "border-accent ring-2 ring-accent/20 ring-inset shadow-lg shadow-accent/10"
      )}
    >
      {/* Top Section: Image */}
      <div className="relative overflow-hidden bg-background aspect-square">
        {imageError ? (
          <ImagePlaceholder showUploadButton={false} className="h-full" />
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <div className="animate-pulse">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg" />
                </div>
              </div>
            )}
            <img
              src={garment.image}
              alt={garment.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(true);
                setImageError(true);
              }}
              className={cn(
                "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                !imageLoaded && "opacity-0"
              )}
            />
          </>
        )}
        
        {/* Selection Indicator */}
        {isSelectionMode && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
            className="absolute top-3 left-3 z-20"
          >
            <div className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200",
              isSelected 
                ? "bg-accent text-white shadow-lg shadow-accent/30" 
                : "bg-background/80 backdrop-blur border border-slate-700/50 text-muted-foreground"
            )}>
              {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
            </div>
          </div>
        )}

        {/* Category Badge - Offset if selection mode is on */}
        <div
          className={cn(
            "absolute top-3 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200",
            isSelectionMode ? "left-11" : "left-3",
            categoryColors[garment.category] || categoryColors.Top
          )}
        >
          {garment.category}
        </div>
        {/* Edit Icon - Hidden in selection mode */}
        {!isSelectionMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(e, garment);
            }}
            className="absolute top-3 right-3 p-2 rounded-lg bg-background/80 backdrop-blur hover:bg-background text-foreground hover:text-accent transition-colors duration-200 opacity-0 group-hover:opacity-100"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border/50"></div>

      {/* Bottom Section: Details */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Row 1: Name & Formality */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-foreground text-sm flex-1 line-clamp-2">
            {garment.name}
          </h3>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap",
              formalityColors[garment.formality] || formalityColors.Casual
            )}
          >
            {garment.formality}
          </span>
        </div>

        {/* Row 2: Color swatches & Material */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full border border-border/50"
              style={{ backgroundColor: garment.primaryColor }}
              title={`Primary color`}
            ></div>
            {garment.secondaryColor && (
              <div
                className="w-5 h-5 rounded-full border border-border/50"
                style={{ backgroundColor: garment.secondaryColor }}
                title={`Secondary color`}
              ></div>
            )}
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs bg-background text-muted-foreground border border-border">
            {garment.material}
          </span>
        </div>

        {/* Row 3: Season & Pattern */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {garment.seasons.map((season) => (
            <span
              key={season}
              className="px-2 py-0.5 rounded-full text-xs bg-background text-muted-foreground border border-border"
            >
              {season}
            </span>
          ))}
          {garment.pattern && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-background text-muted-foreground border border-border">
              {garment.pattern}
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onClick(garment)}
          className="w-full mt-2 px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 text-xs font-semibold transition-colors border border-accent/20"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

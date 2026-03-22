import { Edit2, Eye, Trash2, CheckSquare, Square } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { Garment } from "@/components/GarmentCard";

interface CompactGarmentCardProps {
  garment: Garment;
  onClick: (garment: Garment) => void;
  onEdit: (e: React.MouseEvent, garment: Garment) => void;
  onDelete: (garmentId: string) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const formalityColors: Record<string, string> = {
  Casual: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Business: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Formal: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

export default function CompactGarmentCard({
  garment,
  onClick,
  onEdit,
  onDelete,
  isSelectionMode,
  isSelected,
  onToggleSelect,
}: CompactGarmentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      onClick={() => onClick(garment)}
      className={cn(
        "bg-card border border-slate-700/50 rounded-lg overflow-hidden hover:border-emerald-500/50 transition-colors duration-200 flex items-center h-[100px] group cursor-pointer",
        isSelected && "border-accent bg-accent/5"
      )}
    >
      {/* Selection Indicator */}
      {isSelectionMode && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect?.();
          }}
          className="pl-4 pr-1"
        >
          <div className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200",
            isSelected 
              ? "bg-accent text-white shadow-lg shadow-accent/30" 
              : "bg-background border border-slate-700/50 text-muted-foreground"
          )}>
            {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
          </div>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-background overflow-hidden m-2 rounded-md border border-slate-700/50">
        {imageError ? (
          <ImagePlaceholder showUploadButton={false} className="h-full" />
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <div className="animate-pulse">
                  <div className="w-4 h-4 bg-slate-700 rounded" />
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
                "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110",
                !imageLoaded && "opacity-0"
              )}
            />
          </>
        )}
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0 px-3 py-2 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-sm truncate">
            {garment.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {garment.category} • {garment.material}
          </p>
        </div>
      </div>

      {/* Attributes - Color Swatches, Formality, Seasons */}
      <div className="flex items-center gap-3 px-3 flex-shrink-0">
        {/* Color Swatches */}
        <div className="flex items-center gap-1">
          <div
            className="w-4 h-4 rounded-full border border-slate-700/50"
            style={{ backgroundColor: garment.primaryColor }}
            title="Primary color"
          ></div>
          {garment.secondaryColor && (
            <div
              className="w-4 h-4 rounded-full border border-slate-700/50"
              style={{ backgroundColor: garment.secondaryColor }}
              title="Secondary color"
            ></div>
          )}
        </div>

        {/* Formality */}
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap",
            formalityColors[garment.formality] || formalityColors.Casual
          )}
        >
          {garment.formality}
        </span>

        {/* First Season */}
        {garment.seasons.length > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-background text-muted-foreground border border-slate-700/50 whitespace-nowrap">
            {garment.seasons[0]}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 flex-shrink-0">
        {!isSelectionMode && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(garment);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800/50 text-muted-foreground hover:text-emerald-400 transition-colors duration-200"
              title="View details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(e, garment);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-800/50 text-muted-foreground hover:text-emerald-400 transition-colors duration-200"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${garment.name}?`)) {
                  onDelete(garment.id);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors duration-200"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

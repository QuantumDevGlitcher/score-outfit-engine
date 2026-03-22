import { useState } from "react";
import { X, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { cn } from "@/lib/utils";
import type { Garment } from "@/components/GarmentCard";

interface DetailsDrawerProps {
  garment: Garment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (garment: Garment) => void;
  onDelete: (garmentId: string) => void;
}

const CATEGORIES = ["Top", "Bottom", "Dress", "Jacket", "Shoes", "Accessory"];
const MATERIALS = [
  "Cotton",
  "Wool",
  "Silk",
  "Linen",
  "Polyester",
  "Denim",
  "Leather",
  "Suede",
];
const PATTERNS = ["Solid", "Striped", "Checkered", "Floral", "Geometric", "Printed"];
const SEASONS = ["Spring", "Summer", "Fall", "Winter"];
const FORMALITY_OPTIONS = ["Casual", "Business", "Formal"];

export default function DetailsDrawer({
  garment,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: DetailsDrawerProps) {
  const [formData, setFormData] = useState<Garment | null>(garment);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Update formData when garment changes
  if (garment && formData?.id !== garment.id) {
    setFormData(garment);
  }

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData(garment);
    onClose();
  };

  const handleDelete = () => {
    if (garment && confirm("Are you sure you want to delete this garment?")) {
      onDelete(garment.id);
      onClose();
    }
  };

  const toggleSeason = (season: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      seasons: formData.seasons.includes(season)
        ? formData.seasons.filter((s) => s !== season)
        : [...formData.seasons, season],
    });
  };

  if (!isOpen || !formData) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>

      {/* Drawer - Full screen on mobile, slide-in on desktop */}
      <div className="fixed inset-0 md:right-0 md:top-0 md:bottom-0 md:inset-auto w-full md:max-w-[480px] bg-card border-l border-slate-700/50 shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="border-b border-slate-700/50 px-6 py-4 flex items-center justify-between bg-card">
          <h2 className="text-lg font-bold text-foreground">Garment Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-accent transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Section 1: Image */}
          <div>
            <div className="relative rounded-[20px] overflow-hidden bg-background aspect-square mb-4">
              {imageError ? (
                <ImagePlaceholder showUploadButton={false} className="h-full" />
              ) : (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                      <div className="animate-pulse">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg" />
                      </div>
                    </div>
                  )}
                  <img
                    src={formData.image}
                    alt={formData.name}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setImageLoaded(true);
                      setImageError(true);
                    }}
                    className={cn(
                      "w-full h-full object-cover",
                      !imageLoaded && "opacity-0"
                    )}
                  />
                </>
              )}
            </div>
            <button className="w-full px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors duration-200 flex items-center justify-center gap-2">
              <Upload size={16} />
              Replace Image
            </button>
          </div>

          {/* Section 2: Core Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Core Info
            </h3>

            {/* Name - Full width */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors duration-200"
                placeholder="Item name"
              />
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors duration-200"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Formality */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Formality
                </label>
                <select
                  value={formData.formality}
                  onChange={(e) =>
                    setFormData({ ...formData, formality: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors duration-200"
                >
                  {FORMALITY_OPTIONS.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Colors - 2 Column */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryColor: e.target.value,
                      })
                    }
                    className="w-10 h-10 rounded-lg cursor-pointer border border-border"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryColor: e.target.value,
                      })
                    }
                    className="flex-1 px-2.5 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.secondaryColor || "#ffffff"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secondaryColor: e.target.value,
                      })
                    }
                    className="w-10 h-10 rounded-lg cursor-pointer border border-border"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secondaryColor: e.target.value || undefined,
                      })
                    }
                    className="flex-1 px-2.5 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Attributes */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Attributes
            </h3>

            {/* Material & Pattern - 2 Column */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Material
                </label>
                <select
                  value={formData.material}
                  onChange={(e) =>
                    setFormData({ ...formData, material: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors duration-200"
                >
                  {MATERIALS.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Pattern
                </label>
                <select
                  value={formData.pattern || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pattern: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors duration-200"
                >
                  <option value="">None</option>
                  {PATTERNS.map((pat) => (
                    <option key={pat} value={pat}>
                      {pat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Season Suitability */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Season Suitability
            </h3>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((season) => (
                <button
                  key={season}
                  onClick={() => toggleSeason(season)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200",
                    formData.seasons.includes(season)
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/20"
                      : "bg-background border-slate-700/50 text-foreground hover:border-emerald-500/50 hover:bg-background/80"
                  )}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: ML Analysis */}
          <div className="space-y-6 bg-slate-800/20 p-5 rounded-2xl border border-slate-700/30">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                ML Insights
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                SCORE AI
              </span>
            </div>

            <div className="space-y-6">
              {/* Formality Score */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Formality Balance</label>
                  <span className="text-xs font-bold text-foreground">{(formData.formality_score || 0).toFixed(2)}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full relative border border-slate-700/50 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full opacity-80" />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] border-2 border-slate-900 z-10 transition-all duration-700 ease-out"
                    style={{ left: `calc(${(formData.formality_score || 0) * 100}% - 7px)` }}
                  />
                </div>
                <div className="flex justify-between mt-2 px-0.5">
                  <span className="text-[9px] text-muted-foreground/70 uppercase font-medium">Casual / Relaxed</span>
                  <span className="text-[9px] text-muted-foreground/70 uppercase font-medium">Formal / Sharp</span>
                </div>
              </div>

              {/* Weather Warmth */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Warmth Index</label>
                  <span className="text-xs font-bold text-foreground">{(formData.weather_warmth || 0).toFixed(2)}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full relative border border-slate-700/50 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-orange-400 to-red-600 rounded-full opacity-80" />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] border-2 border-slate-900 z-10 transition-all duration-700 ease-out"
                    style={{ left: `calc(${(formData.weather_warmth || 0) * 100}% - 7px)` }}
                  />
                </div>
                <div className="flex justify-between mt-2 px-0.5">
                  <span className="text-[9px] text-muted-foreground/70 uppercase font-medium">Hot Weather / Light</span>
                  <span className="text-[9px] text-muted-foreground/70 uppercase font-medium">Cold Weather / Heavy</span>
                </div>
              </div>

              {/* Dominant Colors Analysis */}
              {formData.dominant_colors && formData.dominant_colors.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-3">
                    Color Spectrum Analysis
                  </label>
                  <div className="space-y-3">
                    {formData.dominant_colors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div 
                          className="w-10 h-4 rounded-md border border-slate-700/50 shadow-sm" 
                          style={{ backgroundColor: color.hex }}
                          title={color.hex}
                        />
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-400 rounded-full opacity-60"
                            style={{ width: `${color.percentage * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
                          {Math.round(color.percentage * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Additional Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Additional Info
            </h3>
            
            {/* Tags */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/50 flex items-center gap-1.5 group"
                  >
                    {tag}
                    <button 
                      onClick={() => setFormData({
                        ...formData,
                        tags: formData.tags?.filter(t => t !== tag)
                      })}
                      className="text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {(!formData.tags || formData.tags.length === 0) && (
                  <span className="text-[10px] text-muted-foreground italic">No tags added</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Add tag and press Enter..."
                  className="w-full px-3 py-2 rounded-lg bg-background border border-slate-700/50 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value && !formData.tags?.includes(value)) {
                        setFormData({
                          ...formData,
                          tags: [...(formData.tags || []), value]
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value || undefined })
                }
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-slate-700/50 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors resize-none"
                placeholder="Add any notes or care instructions..."
                rows={3}
              />
            </div>
          </div>

          {/* Spacer for fixed footer */}
          <div className="h-4"></div>
        </div>

        {/* Footer - Sticky */}
        <div className="border-t border-slate-700/50 px-6 py-4 bg-card space-y-3 flex flex-col">
          <Button
            onClick={handleSave}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
          >
            Save Changes
          </Button>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-slate-700/50 text-foreground font-medium hover:bg-background/80 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium transition-colors duration-200"
              title="Delete this garment"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

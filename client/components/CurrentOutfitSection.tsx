import { useState } from "react";
import { Upload, Plus, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const GARMENT_SLOTS = [
  { id: "top", label: "Top", emoji: "👕" },
  { id: "bottom", label: "Bottom", emoji: "👖" },
  { id: "shoes", label: "Shoes", emoji: "👟" },
  { id: "outerwear", label: "Outerwear", emoji: "🧥", optional: true },
  { id: "accessories", label: "Accessories", emoji: "⌚", optional: true },
];

interface GarmentItem {
  id: string;
  category: string;
  name: string;
  image?: string;
}

interface CurrentOutfitSectionProps {
  imageUploaded: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  garments: Record<string, GarmentItem | null>;
  onGarmentRemove: (slot: string) => void;
  onAddGarment: (slot: string) => void;
}

export default function CurrentOutfitSection({
  imageUploaded,
  onImageUpload,
  garments,
  onGarmentRemove,
  onAddGarment,
}: CurrentOutfitSectionProps) {
  return (
    <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6 md:p-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <ImageIcon size={20} className="text-blue-400" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Your Current Outfit
        </h2>
      </div>

      <div className="space-y-6">
        {/* Photo Uploader */}
        <div>
          <label htmlFor="outfit-image-upload">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
                imageUploaded
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-slate-700/50 hover:border-emerald-500/30 hover:bg-background/50"
              )}
            >
              <Upload
                size={32}
                className={cn(
                  "mx-auto mb-3 transition-colors",
                  imageUploaded ? "text-emerald-400" : "text-muted-foreground"
                )}
              />
              <p
                className={cn(
                  "font-medium mb-1",
                  imageUploaded ? "text-emerald-300" : "text-foreground"
                )}
              >
                {imageUploaded ? "Photo uploaded ✓" : "Upload Outfit Photo"}
              </p>
              <p className="text-sm text-muted-foreground">
                {imageUploaded
                  ? "Click to replace"
                  : "Drag and drop or click to browse"}
              </p>
            </div>
          </label>
          <input
            id="outfit-image-upload"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </div>

        {/* Garment Slots */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-4">
            Select Your Garments
          </p>
          <div className="space-y-3">
            {GARMENT_SLOTS.map((slot) => {
              const garment = garments[slot.id];
              const isRequired = !slot.optional;

              return (
                <div key={slot.id}>
                  {garment ? (
                    /* Garment Card - Filled */
                    <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 transition-colors duration-200">
                      {garment.image ? (
                        <img
                          src={garment.image}
                          alt={garment.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-700/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{slot.emoji}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">
                          {garment.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {garment.category}
                        </p>
                      </div>
                      <button
                        onClick={() => onGarmentRemove(slot.id)}
                        className="p-2 rounded-lg bg-slate-700/20 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors duration-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    /* Garment Card - Empty */
                    <button
                      onClick={() => onAddGarment(slot.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-lg border-2 border-dashed transition-all duration-200",
                        isRequired
                          ? "border-slate-700/50 hover:border-emerald-500/50 hover:bg-background/50"
                          : "border-slate-700/30 hover:border-slate-700/50 hover:bg-background/30"
                      )}
                    >
                      <div className="w-14 h-14 rounded-lg bg-slate-700/20 flex items-center justify-center flex-shrink-0">
                        <Plus size={20} className="text-muted-foreground" />
                      </div>
                      <div className="text-left min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">
                          {slot.emoji} {slot.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isRequired ? "Required" : "Optional"}
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Garment Selection Methods */}
        <div className="p-4 rounded-lg bg-slate-700/10 border border-slate-700/30 text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">Add garments by:</p>
          <ul className="space-y-1 text-xs">
            <li>• Selecting from your wardrobe</li>
            <li>• Uploading individual garment photos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

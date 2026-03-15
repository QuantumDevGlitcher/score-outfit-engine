import { useState } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTION_CHIPS = [
  { id: "work", label: "Work", emoji: "💼" },
  { id: "casual", label: "Casual", emoji: "👕" },
  { id: "party", label: "Party", emoji: "🎉" },
  { id: "gym", label: "Gym", emoji: "💪" },
  { id: "presentation", label: "Presentation", emoji: "🎤" },
  { id: "date", label: "Date", emoji: "💕" },
];

const CONTEXT_SELECTORS = [
  { id: "indoor", label: "Indoor" },
  { id: "outdoor", label: "Outdoor" },
  { id: "formal", label: "Formal" },
  { id: "casual", label: "Casual" },
];

const STYLE_INTENT_OPTIONS = [
  { id: "conservative", label: "Conservative" },
  { id: "balanced", label: "Balanced" },
  { id: "bold", label: "Bold" },
];

interface ContextSectionProps {
  contextInput: string;
  onContextChange: (value: string) => void;
  selectedContext: string | null;
  onContextSelect: (value: string) => void;
  selectedStyle: string | null;
  onStyleSelect: (value: string) => void;
}

export default function ContextSection({
  contextInput,
  onContextChange,
  selectedContext,
  onContextSelect,
  selectedStyle,
  onStyleSelect,
}: ContextSectionProps) {
  return (
    <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6 md:p-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <MapPin size={20} className="text-emerald-400" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Where are you going?
        </h2>
      </div>

      <div className="space-y-6">
        {/* Context Input */}
        <div>
          <label htmlFor="context-input" className="block text-sm font-semibold text-foreground mb-2">
            Occasion or Context
          </label>
          <input
            id="context-input"
            type="text"
            value={contextInput}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="E.g., 'Meeting at the office', 'Coffee date', 'Casual Friday'..."
            className="w-full px-4 py-3 rounded-lg border border-slate-700/50 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
          />
        </div>

        {/* Suggested Occasions */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => onContextChange(chip.label)}
                className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium hover:bg-emerald-500/20 transition-all duration-200 hover:scale-105"
              >
                {chip.emoji} {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Context Selector */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Setting
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CONTEXT_SELECTORS.map((option) => (
              <button
                key={option.id}
                onClick={() => onContextSelect(option.id)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                  selectedContext === option.id
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                    : "bg-background border-slate-700/50 text-foreground hover:border-emerald-500/30"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style Intent */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Style Intent
          </label>
          <div className="grid grid-cols-3 gap-2">
            {STYLE_INTENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => onStyleSelect(option.id)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                  selectedStyle === option.id
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                    : "bg-background border-slate-700/50 text-foreground hover:border-emerald-500/30"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

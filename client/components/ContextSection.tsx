import { Sparkles, Briefcase, Coffee, Heart, Dumbbell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextSectionProps {
  contextInput: string;
  onContextChange: (value: string) => void;
  onAnalyze: () => void;
}

const SUGGESTIONS = [
  { icon: <Briefcase size={14} />, label: "Work", sentence: "I'm heading to the office and need a professional outfit for a business meeting." },
  { icon: <Heart size={14} />, label: "Date", sentence: "I'm going on a romantic dinner date and want to look my best tonight." },
  { icon: <Dumbbell size={14} />, label: "Gym", sentence: "I'm going to the gym for a high-intensity workout and need something functional." },
  { icon: <Coffee size={14} />, label: "Coffee", sentence: "I'm meeting a friend for a casual coffee and want a comfortable, relaxed look." },
  { icon: <Zap size={14} />, label: "Party", sentence: "I'm heading to a lively party and want to wear something stylish and fun." },
];

export default function ContextSection({
  contextInput,
  onContextChange,
  onAnalyze,
}: ContextSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && contextInput.trim()) {
      onAnalyze();
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-slate-700/50 bg-card/40 p-1 md:p-1.5 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl">
        <div className="relative group flex items-center">
          <div className="absolute left-6 text-emerald-400 group-focus-within:text-emerald-300 transition-colors">
            <Sparkles size={22} />
          </div>
          <input
            id="context-input"
            type="text"
            value={contextInput}
            onChange={(e) => onContextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Where are you going? Describe the vibe, weather, or event..."
            className="w-full pl-16 pr-32 py-5 rounded-[20px] bg-background/50 border-none text-xs md:text-sm font-medium text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          <button
            onClick={onAnalyze}
            disabled={!contextInput.trim()}
            className={cn(
              "absolute right-2 px-6 py-3 rounded-[16px] font-bold text-sm uppercase tracking-wider transition-all duration-300",
              contextInput.trim()
                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
          >
            Generate
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-1">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => onContextChange(suggestion.sentence)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs md:text-sm text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
          >
            {suggestion.icon}
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}

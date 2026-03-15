import { useState, useRef, useEffect } from "react";
import { Grid3x3, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "deck" | "grid";

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ViewModeSelector({
  viewMode,
  onViewModeChange,
}: ViewModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMouseEnter = (mode: ViewMode) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(mode);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(null);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => handleMouseEnter(viewMode)}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "p-2.5 rounded-lg transition-all duration-200",
          isOpen
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            : "text-muted-foreground hover:text-foreground hover:bg-background border border-transparent"
        )}
        title={`View mode: ${viewMode === "deck" ? "Deck" : "Grid"}`}
      >
        {viewMode === "deck" ? (
          <Grid3x3 size={20} />
        ) : (
          <LayoutGrid size={20} />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-950 text-slate-200 text-xs rounded-md whitespace-nowrap pointer-events-none z-50">
          {showTooltip === "deck" ? "Deck view" : "Compact view"}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-slate-950" />
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-card border border-slate-700/50 rounded-[12px] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              onViewModeChange("deck");
              setIsOpen(false);
            }}
            onMouseEnter={() => handleMouseEnter("deck")}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-150 flex items-center gap-3",
              viewMode === "deck"
                ? "bg-emerald-500/20 text-emerald-300 border-r-2 border-emerald-500"
                : "text-foreground hover:bg-background/50"
            )}
          >
            <Grid3x3 size={16} />
            <span>Deck View</span>
            {viewMode === "deck" && (
              <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            )}
          </button>
          <div className="h-px bg-slate-700/30" />
          <button
            onClick={() => {
              onViewModeChange("grid");
              setIsOpen(false);
            }}
            onMouseEnter={() => handleMouseEnter("grid")}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-150 flex items-center gap-3",
              viewMode === "grid"
                ? "bg-emerald-500/20 text-emerald-300 border-r-2 border-emerald-500"
                : "text-foreground hover:bg-background/50"
            )}
          >
            <LayoutGrid size={16} />
            <span>Compact View</span>
            {viewMode === "grid" && (
              <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

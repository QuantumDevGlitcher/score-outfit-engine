import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const CONTEXT_OPTIONS = [
  "University",
  "Gym",
  "Presentation",
  "Formal",
  "Casual",
  "Date Night",
  "Beach",
  "Work",
];

const STYLE_OPTIONS = [
  "Elegant",
  "Relaxed",
  "Sporty",
  "Minimal",
  "Bold",
  "Classic",
];

const SUGGESTION_TAGS = {
  occasion: [
    "beach day",
    "party",
    "wedding",
    "brunch",
    "dinner",
    "outdoor",
    "indoor",
  ],
  dressCode: [
    "business casual",
    "smart casual",
    "black tie",
    "cocktail",
    "formal",
    "casual",
  ],
  vibe: [
    "cozy",
    "adventurous",
    "romantic",
    "professional",
    "fun",
    "artistic",
    "sporty",
  ],
  constraints: [
    "no leather",
    "sustainable",
    "vegan",
    "minimal colors",
    "monochrome",
    "maximalist",
  ],
  weather: ["rainy", "sunny", "cold", "hot", "windy", "humid"],
};

interface Chip {
  id: string;
  label: string;
  category: keyof typeof SUGGESTION_TAGS;
}

interface ComboboxState {
  isOpen: boolean;
  searchValue: string;
  selectedIndex: number;
}

interface SmartInputBarProps {
  onAnalyze: (context: string, style: string | null, notes: string, chips: Chip[]) => void;
  hasOutfitInput: boolean;
  label?: string;
}

export default function SmartInputBar({
  onAnalyze,
  hasOutfitInput,
  label = "What's the Occasion?",
}: SmartInputBarProps) {
  const [context, setContext] = useState("");
  const [style, setStyle] = useState("");
  const [notes, setNotes] = useState("");
  const [chips, setChips] = useState<Chip[]>([]);
  const [suggestions, setSuggestions] = useState<
    Array<{ label: string; category: keyof typeof SUGGESTION_TAGS }>
  >([]);

  const [contextCombo, setContextCombo] = useState<ComboboxState>({
    isOpen: false,
    searchValue: "",
    selectedIndex: -1,
  });

  const [styleCombo, setStyleCombo] = useState<ComboboxState>({
    isOpen: false,
    searchValue: "",
    selectedIndex: -1,
  });

  const contextInputRef = useRef<HTMLInputElement>(null);
  const styleInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);
  const contextContainerRef = useRef<HTMLDivElement>(null);
  const styleContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside for context combobox
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextContainerRef.current &&
        !contextContainerRef.current.contains(event.target as Node)
      ) {
        setContextCombo({ ...contextCombo, isOpen: false });
      }
    };

    if (contextCombo.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [contextCombo.isOpen]);

  // Handle click outside for style combobox
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        styleContainerRef.current &&
        !styleContainerRef.current.contains(event.target as Node)
      ) {
        setStyleCombo({ ...styleCombo, isOpen: false });
      }
    };

    if (styleCombo.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [styleCombo.isOpen]);

  // Filter context options
  const filteredContextOptions = CONTEXT_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(contextCombo.searchValue.toLowerCase())
  );

  // Filter style options
  const filteredStyleOptions = STYLE_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(styleCombo.searchValue.toLowerCase())
  );

  // Generate suggestions based on notes text
  useEffect(() => {
    if (!notes.trim()) {
      setSuggestions([]);
      return;
    }

    const noteWords = notes.toLowerCase().split(/\s+/);
    const newSuggestions: Set<string> = new Set();

    Object.entries(SUGGESTION_TAGS).forEach(([category, tags]) => {
      tags.forEach((tag) => {
        // Simple keyword matching - check if any word in notes matches tag words
        const tagWords = tag.toLowerCase().split(/\s+/);
        const isMatched = tagWords.some((tagWord) =>
          noteWords.some(
            (noteWord) =>
              noteWord.includes(tagWord) || tagWord.includes(noteWord)
          )
        );

        if (isMatched && !chips.some((c) => c.label === tag)) {
          newSuggestions.add(JSON.stringify({ label: tag, category }));
        }
      });
    });

    setSuggestions(Array.from(newSuggestions).map((s) => JSON.parse(s)));
  }, [notes, chips]);

  // Handle context selection
  const handleContextSelect = (option: string) => {
    setContext(option);
    setContextCombo({ isOpen: false, searchValue: "", selectedIndex: -1 });
  };

  // Handle style selection
  const handleStyleSelect = (option: string) => {
    setStyle(option);
    setStyleCombo({ isOpen: false, searchValue: "", selectedIndex: -1 });
  };

  // Add chip from suggestion
  const addChip = (label: string, category: keyof typeof SUGGESTION_TAGS) => {
    const newChip: Chip = {
      id: `${category}-${Date.now()}`,
      label,
      category,
    };
    setChips([...chips, newChip]);
    setSuggestions(suggestions.filter((s) => s.label !== label));
  };

  // Remove chip
  const removeChip = (id: string) => {
    setChips(chips.filter((c) => c.id !== id));
  };

  // Handle analyze
  const handleAnalyze = () => {
    if (context && hasOutfitInput) {
      onAnalyze(context, style || null, notes, chips);
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      occasion: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      dressCode: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      vibe: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      constraints: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      weather: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    };
    return colors[category] || "bg-accent/20 text-accent border-accent/30";
  };

  return (
    <div className="space-y-8">
      {/* Label */}
      <div className="px-2 text-center">
        <h2 className="text-4xl font-bold text-foreground">{label}</h2>
      </div>

      {/* Smart Input Bar */}
      <div className="bg-card border border-border rounded-2xl w-full focus-within:border-accent transition-colors duration-200 shadow-lg overflow-hidden">

        {/* Top Section: Notes Input */}
        <div className="p-6 border-b border-border">
          <textarea
            ref={notesInputRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional: add details like 'going to the beach', 'presentation', 'rainy', 'dress code: smart casual'…"
            className="w-full bg-transparent text-foreground text-base placeholder-muted-foreground focus:outline-none resize-none min-h-[100px]"
            rows={3}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
        </div>

        {/* Middle Section: Comboboxes */}
        <div className="px-6 py-4 border-b border-border flex gap-4">
          {/* Context Combobox */}
          <div className="relative flex-1">
            <div ref={contextContainerRef} className="relative">
              <button
                onClick={() =>
                  setContextCombo({ ...contextCombo, isOpen: !contextCombo.isOpen })
                }
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm font-medium text-left transition-colors",
                  context
                    ? "border-accent text-accent"
                    : "text-muted-foreground hover:border-accent/50"
                )}
              >
                {context || "Context"}
              </button>

              {/* Context Dropdown */}
              {contextCombo.isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 w-full">
                  <input
                    ref={contextInputRef}
                    type="text"
                    placeholder="Search..."
                    value={contextCombo.searchValue}
                    onChange={(e) =>
                      setContextCombo({
                        ...contextCombo,
                        searchValue: e.target.value,
                        selectedIndex: -1,
                      })
                    }
                    className="w-full px-3 py-2 bg-background border-b border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredContextOptions.length > 0 ? (
                      filteredContextOptions.map((option, idx) => (
                        <button
                          key={option}
                          onClick={() => handleContextSelect(option)}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm transition-colors",
                            idx === contextCombo.selectedIndex
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-background text-foreground"
                          )}
                        >
                          {option}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No results
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Style Combobox */}
          <div className="relative flex-1">
            <div ref={styleContainerRef} className="relative">
              <button
                onClick={() =>
                  setStyleCombo({ ...styleCombo, isOpen: !styleCombo.isOpen })
                }
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm font-medium text-left transition-colors",
                  style
                    ? "border-accent text-accent"
                    : "text-muted-foreground hover:border-accent/50"
                )}
              >
                {style || "Style (opt.)"}
              </button>

              {/* Style Dropdown */}
              {styleCombo.isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 w-full">
                  <input
                    ref={styleInputRef}
                    type="text"
                    placeholder="Search..."
                    value={styleCombo.searchValue}
                    onChange={(e) =>
                      setStyleCombo({
                        ...styleCombo,
                        searchValue: e.target.value,
                        selectedIndex: -1,
                      })
                    }
                    className="w-full px-3 py-2 bg-background border-b border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredStyleOptions.length > 0 ? (
                      filteredStyleOptions.map((option, idx) => (
                        <button
                          key={option}
                          onClick={() => handleStyleSelect(option)}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm transition-colors",
                            idx === styleCombo.selectedIndex
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-background text-foreground"
                          )}
                        >
                          {option}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No results
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="px-6 py-4 flex items-center gap-3 justify-end">
          {/* Image/Attachment Button */}
          <button
            title="Add images or attachments"
            className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-accent transition-colors"
          >
            <Plus size={20} />
          </button>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!context || !hasOutfitInput}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-2 h-auto rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={16} />
            Analyze
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">
            Suggestions:
          </span>
          {suggestions.map((suggestion) => (
            <button
              key={`${suggestion.category}-${suggestion.label}`}
              onClick={() =>
                addChip(suggestion.label, suggestion.category)
              }
              className="px-3 py-1 bg-background border border-border rounded-full text-xs text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}

      {/* Selected Chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <div
              key={chip.id}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-colors",
                getCategoryColor(chip.category)
              )}
            >
              <span>{chip.label}</span>
              <button
                onClick={() => removeChip(chip.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

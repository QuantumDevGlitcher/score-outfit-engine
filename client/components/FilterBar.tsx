import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  onCategoryChange: (category: string) => void;
  onColorChange: (color: string) => void;
  onSeasonChange: (season: string) => void;
  onSearchChange: (search: string) => void;
}

const CATEGORIES = ["All", "Top", "Bottom", "Dress", "Jacket", "Shoes", "Accessory"];
const COLORS = ["All", "Black", "White", "Blue", "Red", "Green", "Yellow", "Brown", "Gray"];
const SEASONS = ["All", "Spring", "Summer", "Fall", "Winter"];

export default function FilterBar({
  onCategoryChange,
  onColorChange,
  onSeasonChange,
  onSearchChange,
}: FilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categoryRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        if (
          colorRef.current &&
          !colorRef.current.contains(event.target as Node)
        ) {
          if (
            seasonRef.current &&
            !seasonRef.current.contains(event.target as Node)
          ) {
            setOpenDropdown(null);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
    setOpenDropdown(null);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
    setOpenDropdown(null);
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    onSeasonChange(season);
    setOpenDropdown(null);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const Dropdown = ({
    label,
    options,
    selected,
    onChange,
    refElement,
    id,
  }: {
    label: string;
    options: string[];
    selected: string;
    onChange: (value: string) => void;
    refElement: React.RefObject<HTMLDivElement>;
    id: string;
  }) => (
    <div ref={refElement} className="relative inline-block">
      <button
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium text-foreground hover:border-accent/50 transition-colors flex items-center gap-2"
      >
        {selected}
        <ChevronDown size={16} />
      </button>

      {openDropdown === id && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-40 min-w-48">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors",
                selected === option
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-background text-foreground"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name, material, tag..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Category Dropdown */}
        <Dropdown
          label="Category"
          options={CATEGORIES}
          selected={selectedCategory}
          onChange={handleCategoryChange}
          refElement={categoryRef}
          id="category"
        />

        {/* Color Dropdown */}
        <Dropdown
          label="Color"
          options={COLORS}
          selected={selectedColor}
          onChange={handleColorChange}
          refElement={colorRef}
          id="color"
        />

        {/* Season Dropdown */}
        <Dropdown
          label="Season"
          options={SEASONS}
          selected={selectedSeason}
          onChange={handleSeasonChange}
          refElement={seasonRef}
          id="season"
        />
      </div>
    </div>
  );
}

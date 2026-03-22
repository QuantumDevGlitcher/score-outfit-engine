import TopNav from "@/components/TopNav";
import FilterBar from "@/components/FilterBar";
import GarmentCard, { type Garment } from "@/components/GarmentCard";
import CompactGarmentCard from "@/components/CompactGarmentCard";
import DetailsDrawer from "@/components/DetailsDrawer";
import AddItemModal from "@/components/AddItemModal";
import ViewModeSelector from "@/components/ViewModeSelector";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, CheckSquare, Square, X } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface WardrobePage {
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
}

// Mock garment data with responsive image URLs
const MOCK_GARMENTS: Garment[] = [
  {
    id: "1",
    name: "Navy Oxford Shirt",
    image:
      "https://images.unsplash.com/photo-1596215852991-5ff352677d07?w=600&h=600&fit=crop&crop=faces",
    category: "Top",
    primaryColor: "#001f3f",
    secondaryColor: "#ffffff",
    material: "Cotton",
    pattern: "Striped",
    seasons: ["Spring", "Summer", "Fall", "Winter"],
    formality: "Business",
    notes: "Great for office days",
    tags: ["professional", "versatile"],
  },
  {
    id: "2",
    name: "Black Leather Jacket",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=600&fit=crop&crop=faces",
    category: "Jacket",
    primaryColor: "#000000",
    secondaryColor: "#222222",
    material: "Leather",
    seasons: ["Fall", "Winter"],
    formality: "Casual",
    tags: ["edgy", "classic"],
  },
  {
    id: "3",
    name: "White Linen Dress",
    image:
      "https://images.unsplash.com/photo-1595777707802-c9c147d79d13?w=600&h=600&fit=crop&crop=faces",
    category: "Dress",
    primaryColor: "#ffffff",
    secondaryColor: "#f0f0f0",
    material: "Linen",
    seasons: ["Spring", "Summer"],
    formality: "Casual",
    tags: ["summer", "breeze"],
  },
  {
    id: "4",
    name: "Slim Fit Jeans",
    image:
      "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=600&fit=crop&crop=faces",
    category: "Bottom",
    primaryColor: "#1a3a52",
    secondaryColor: "#4a7ba7",
    material: "Denim",
    seasons: ["Spring", "Fall", "Winter"],
    formality: "Casual",
    tags: ["everyday", "staple"],
  },
  {
    id: "5",
    name: "Golden Heels",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&crop=faces",
    category: "Shoes",
    primaryColor: "#ffd700",
    secondaryColor: "#ffed4e",
    material: "Suede",
    seasons: ["All"],
    formality: "Formal",
    tags: ["evening", "glamorous"],
  },
  {
    id: "6",
    name: "Wool Beanie",
    image:
      "https://images.unsplash.com/photo-1529381096fe45b13e5e0f3a46ad20340e0b44e4?w=600&h=600&fit=crop&crop=faces",
    category: "Accessory",
    primaryColor: "#4a4a4a",
    secondaryColor: "#6b6b6b",
    material: "Wool",
    seasons: ["Fall", "Winter"],
    formality: "Casual",
    tags: ["cozy", "winter"],
  },
];

type ViewMode = "deck" | "grid";

export default function Wardrobe({ theme, onThemeChange }: WardrobePage) {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wardrobe")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item: any) => ({
          id: item._id,
          name: item.core_info.name,
          image: item.image_url,
          category: item.core_info.category,
          primaryColor: item.core_info.primary_color,
          secondaryColor: item.core_info.secondary_color,
          material: item.attributes.material,
          seasons: item.attributes.seasons,
          formality: item.core_info.formality,
          notes: item.attributes.notes,
          tags: item.attributes.tags,
          formality_score: item.ml_features?.formality_score,
          weather_warmth: item.ml_features?.weather_warmth,
          dominant_colors: item.ml_features?.dominant_colors,
        }));
        setGarments(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch wardrobe:", err);
        setLoading(false);
      });
  }, []);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem("wardrobeViewMode");
    return (saved as ViewMode) || "deck";
  });
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGarments = useMemo(() => {
    return garments.filter((garment) => {
      const matchCategory =
        selectedCategory === "All" || garment.category === selectedCategory;
      const matchColor =
        selectedColor === "All" ||
        garment.primaryColor === selectedColor ||
        garment.secondaryColor === selectedColor;
      const matchSeason =
        selectedSeason === "All" || garment.seasons?.includes(selectedSeason);
      const matchSearch =
        searchTerm === "" ||
        garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchCategory && matchColor && matchSeason && matchSearch;
    });
  }, [garments, selectedCategory, selectedColor, selectedSeason, searchTerm]);

  // Selection handlers
  const toggleSelectGarment = useCallback((garmentId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(garmentId)) {
        next.delete(garmentId);
      } else {
        next.add(garmentId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredGarments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGarments.map((g) => g.id)));
    }
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} items?`)) return;

    try {
      const idsToDelete = Array.from(selectedIds);
      const res = await fetch("/api/wardrobe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (res.ok) {
        setGarments((prev) => prev.filter((g) => !selectedIds.has(g.id)));
        exitSelectionMode();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete items");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete items");
    }
  };

  const handleDeleteGarment = async (garmentId: string) => {
    try {
      const res = await fetch("/api/wardrobe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [garmentId] }),
      });

      if (res.ok) {
        setGarments(garments.filter((g) => g.id !== garmentId));
        setSelectedGarment(null);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete garment");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete garment");
    }
  };

  const handleAddFromPhoto = (newGarments: Garment[]) => {
    setGarments([...newGarments, ...garments]);
  };

  const handleAddManual = (emptyGarment: Garment) => {
    setSelectedGarment(emptyGarment);
    setGarments([...garments, emptyGarment]);
  };

  const handleSaveGarment = (updated: Garment) => {
    setGarments(garments.map((g) => (g.id === updated.id ? updated : g)));
    setSelectedGarment(null);
  };

  const handleEditClick = (
    e: React.MouseEvent,
    garment: Garment
  ) => {
    e.stopPropagation();
    setSelectedGarment(garment);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <TopNav title="My Wardrobe" theme={theme} onThemeChange={onThemeChange} />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-2 rounded-lg transition-colors duration-200"
              >
                <Plus size={18} />
                Add Item
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setIsSelectionMode(!isSelectionMode)}
                className={cn(
                  "gap-2 rounded-lg border-slate-700/50 hover:bg-slate-800 transition-colors",
                  isSelectionMode && "bg-accent/10 border-accent/50 text-accent"
                )}
              >
                {isSelectionMode ? <X size={18} /> : <CheckSquare size={18} />}
                {isSelectionMode ? "Cancel Selection" : "Select Items"}
              </Button>
            </div>

            <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Selection Bar */}
          {isSelectionMode && (
            <div className="flex items-center justify-between bg-accent/5 border border-accent/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  {selectedIds.size === filteredGarments.length ? (
                    <CheckSquare size={18} className="text-accent" />
                  ) : (
                    <Square size={18} />
                  )}
                  Select All
                </button>
                <span className="text-sm text-muted-foreground">
                  {selectedIds.size} items selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={selectedIds.size === 0}
                  onClick={handleBulkDelete}
                  className="gap-2"
                >
                  <Trash2 size={16} />
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <FilterBar
              onCategoryChange={setSelectedCategory}
              onColorChange={setSelectedColor}
              onSeasonChange={setSelectedSeason}
              onSearchChange={setSearchTerm}
            />

            {/* Content Area */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : garments.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Your wardrobe is empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start building your collection
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-2 rounded-lg transition-colors duration-200"
                >
                  <Plus size={18} />
                  Add First Item
                </Button>
              </div>
            ) : filteredGarments.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No garments match your filters
                </p>
              </div>
            ) : viewMode === "deck" ? (
              /* Deck View - Grid Layout */
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGarments.map((garment) => (
                  <GarmentCard
                    key={garment.id}
                    garment={garment}
                    onClick={isSelectionMode ? () => toggleSelectGarment(garment.id) : setSelectedGarment}
                    onEdit={(e) => handleEditClick(e, garment)}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedIds.has(garment.id)}
                    onToggleSelect={() => toggleSelectGarment(garment.id)}
                  />
                ))}
              </div>
            ) : (
              /* Compact View - List Layout */
              <div className="space-y-2">
                {filteredGarments.map((garment) => (
                  <CompactGarmentCard
                    key={garment.id}
                    garment={garment}
                    onClick={isSelectionMode ? () => toggleSelectGarment(garment.id) : setSelectedGarment}
                    onEdit={(e) => handleEditClick(e, garment)}
                    onDelete={handleDeleteGarment}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedIds.has(garment.id)}
                    onToggleSelect={() => toggleSelectGarment(garment.id)}
                  />
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Details Drawer */}
      <DetailsDrawer
        garment={selectedGarment}
        isOpen={selectedGarment !== null}
        onClose={() => setSelectedGarment(null)}
        onSave={handleSaveGarment}
        onDelete={handleDeleteGarment}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddFromPhoto={handleAddFromPhoto}
        onAddManual={handleAddManual}
      />
    </div>
  );
}

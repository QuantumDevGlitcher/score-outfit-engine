import TopNav from "@/components/TopNav";
import FilterBar from "@/components/FilterBar";
import GarmentCard, { type Garment } from "@/components/GarmentCard";
import CompactGarmentCard from "@/components/CompactGarmentCard";
import DetailsDrawer from "@/components/DetailsDrawer";
import AddItemModal from "@/components/AddItemModal";
import ViewModeSelector from "@/components/ViewModeSelector";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

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
  const [garments, setGarments] = useState<Garment[]>(MOCK_GARMENTS);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem("wardrobeViewMode");
    return (saved as ViewMode) || "deck";
  });
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Persist view mode to localStorage
  useEffect(() => {
    localStorage.setItem("wardrobeViewMode", viewMode);
  }, [viewMode]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter garments
  const filteredGarments = useMemo(() => {
    return garments.filter((garment) => {
      const matchesCategory =
        selectedCategory === "All" || garment.category === selectedCategory;
      const matchesSearch =
        garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesSeason =
        selectedSeason === "All" || garment.seasons.includes(selectedSeason);
      // Color filtering is simplified (would need better color matching in real app)
      const matchesColor =
        selectedColor === "All" ||
        garment.primaryColor.toLowerCase().includes(selectedColor.toLowerCase());

      return matchesCategory && matchesSearch && matchesSeason && matchesColor;
    });
  }, [garments, selectedCategory, searchTerm, selectedSeason, selectedColor]);

  const handleSaveGarment = (updatedGarment: Garment) => {
    setGarments(
      garments.map((g) => (g.id === updatedGarment.id ? updatedGarment : g))
    );
  };

  const handleDeleteGarment = (garmentId: string) => {
    setGarments(garments.filter((g) => g.id !== garmentId));
    setSelectedGarment(null);
  };

  const handleAddFromPhoto = (newGarment: Garment) => {
    setGarments([...garments, newGarment]);
  };

  const handleAddManual = (emptyGarment: Garment) => {
    setSelectedGarment(emptyGarment);
    setGarments([...garments, emptyGarment]);
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
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-2 rounded-lg transition-colors duration-200"
            >
              <Plus size={18} />
              Add Item
            </Button>

            <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Filter Bar */}
          <FilterBar
              onCategoryChange={setSelectedCategory}
              onColorChange={setSelectedColor}
              onSeasonChange={setSelectedSeason}
              onSearchChange={setSearchTerm}
            />

            {/* Empty State */}
            {garments.length === 0 ? (
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
                    onClick={setSelectedGarment}
                    onEdit={(e) => handleEditClick(e, garment)}
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
                    onClick={setSelectedGarment}
                    onEdit={(e) => handleEditClick(e, garment)}
                    onDelete={handleDeleteGarment}
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

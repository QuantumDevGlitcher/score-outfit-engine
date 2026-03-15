import TopNav from "@/components/TopNav";
import { RotateCw, Star } from "lucide-react";
import { useState } from "react";

interface SavedOutfit {
  id: string;
  image: string;
  context: string;
  score: number;
  date: string;
  items: { category: string; color: string }[];
}

const MOCK_SAVED_OUTFITS: SavedOutfit[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1539533057440-7814abe1ef04?w=600&h=600&fit=crop",
    context: "Work Presentation",
    score: 95,
    date: "2024-01-15",
    items: [
      { category: "Top", color: "#1a3a52" },
      { category: "Bottom", color: "#000000" },
      { category: "Shoes", color: "#8B4513" },
    ],
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1525572614471-ca09cec66157?w=600&h=600&fit=crop",
    context: "Beach Casual",
    score: 87,
    date: "2024-01-10",
    items: [
      { category: "Top", color: "#ffffff" },
      { category: "Bottom", color: "#4a90e2" },
      { category: "Shoes", color: "#d4af37" },
    ],
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop",
    context: "Evening Party",
    score: 92,
    date: "2024-01-08",
    items: [
      { category: "Dress", color: "#000000" },
      { category: "Shoes", color: "#ffd700" },
      { category: "Accessory", color: "#ffffff" },
    ],
  },
];

interface SavedOutfitsProps {
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
}

export default function SavedOutfits({
  theme,
  onThemeChange,
}: SavedOutfitsProps) {
  const [outfits] = useState<SavedOutfit[]>(MOCK_SAVED_OUTFITS);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <TopNav title="Saved Outfits" theme={theme} onThemeChange={onThemeChange} />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {outfits.length === 0 ? (
              <div className="text-center py-16">
                <Star size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  No saved outfits yet
                </h2>
                <p className="text-muted-foreground">
                  Analyze outfits on the dashboard to save your favorites
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className="bg-card rounded-[20px] overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    {/* Image Section */}
                    <div className="relative aspect-square overflow-hidden bg-background">
                      <img
                        src={outfit.image}
                        alt={outfit.context}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Score Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg font-semibold text-sm">
                        {outfit.score}
                      </div>

                      {/* Items Preview */}
                      <div className="absolute bottom-4 left-4 flex gap-1.5">
                        {outfit.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg border border-white/20 shadow-lg"
                            style={{ backgroundColor: item.color }}
                            title={item.category}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-4">
                      {/* Context */}
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Context
                        </p>
                        <h3 className="font-semibold text-foreground">
                          {outfit.context}
                        </h3>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-slate-700/50 pt-3">
                        <span>{formatDate(outfit.date)}</span>
                      </div>

                      {/* Re-run Button */}
                      <button className="w-full px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-sm hover:bg-emerald-500/20 transition-colors duration-200 flex items-center justify-center gap-2">
                        <RotateCw size={16} />
                        Re-run Analysis
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  );
}

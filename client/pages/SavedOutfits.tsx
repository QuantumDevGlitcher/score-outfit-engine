import TopNav from "@/components/TopNav";
import { RotateCw, Star, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface SavedOutfit {
  _id: string;
  user_id: string;
  outfit: {
    items: {
      clothing_type: string;
      image_path: string;
      category_name?: string;
      colors?: { hex: string; percentage: number }[];
    }[];
    compatibility_score: number;
    explanation: string;
    s_style?: number;
    s_rel?: number;
  };
  created_at: string;
}

interface SavedOutfitsProps {
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
}

export default function SavedOutfits({
  theme,
  onThemeChange,
}: SavedOutfitsProps) {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSavedOutfits = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/saved-outfits");
      if (!response.ok) throw new Error("Failed to fetch saved outfits");
      const data = await response.json();
      setOutfits(data);
    } catch (error) {
      console.error("Fetch saved outfits error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOutfit = async (id: string) => {
    try {
      const response = await fetch(`/api/saved-outfits/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete outfit");

      setOutfits((prev) => prev.filter((o) => o._id !== id));
      toast({
        title: "Success",
        description: "Outfit removed from saved list",
      });
    } catch (error) {
      console.error("Delete outfit error", error);
      toast({
        title: "Error",
        description: "Failed to remove outfit",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSavedOutfits();
  }, []);

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
            {loading ? (
              <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : outfits.length === 0 ? (
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
                    key={outfit._id}
                    className="bg-card rounded-[20px] overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    {/* Image Section */}
                    <div className="relative aspect-square overflow-hidden bg-background">
                      <img
                        src={outfit.outfit.items[0] ? `/uploads/${outfit.outfit.items[0].image_path}` : "https://images.unsplash.com/photo-1523381235312-3a1647fa9918?auto=format&fit=crop&q=80&w=600"}
                        alt={outfit.outfit.explanation}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                           (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523381235312-3a1647fa9918?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Score Badge */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg font-semibold text-sm backdrop-blur-md">
                          {Math.round(outfit.outfit.compatibility_score * 100)}%
                        </div>
                        <button
                          onClick={() => handleDeleteOutfit(outfit._id)}
                          className="p-1.5 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200 backdrop-blur-md"
                          title="Remove from saved"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Items Preview */}
                      <div className="absolute bottom-4 left-4 flex gap-1.5">
                        {outfit.outfit.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg border border-white/20 shadow-lg overflow-hidden"
                          >
                             <img src={`/uploads/${item.image_path}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-4">
                      {/* Context */}
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Explanation
                        </p>
                        <h3 className="font-semibold text-foreground text-sm line-clamp-2">
                          {outfit.outfit.explanation}
                        </h3>
                      </div>

                      {/* AI Analysis Breakdown */}
                      <div className="flex gap-4 pt-1">
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between text-[9px] font-semibold text-purple-400 uppercase tracking-wider">
                            <span>Style</span>
                            <span>{Math.round((outfit.outfit.s_style || 0) * 100)}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-700/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${(outfit.outfit.s_style || 0) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between text-[9px] font-semibold text-blue-400 uppercase tracking-wider">
                            <span>Rel</span>
                            <span>{Math.round((outfit.outfit.s_rel || 0) * 100)}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-700/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(outfit.outfit.s_rel || 0) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-slate-700/50 pt-3">
                        <span>{formatDate(outfit.created_at)}</span>
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

import { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import AnalysisDetailsDrawer, {
  AnalysisHistoryItem,
  AnalysisRecommendation,
  AnalysisGarment,
} from "@/components/AnalysisDetailsDrawer";
import { Clock, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface HistoryProps {
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
}

export default function History({ theme, onThemeChange }: HistoryProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [rawRuns, setRawRuns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisHistoryItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/history");
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setRawRuns(data);
      
      const mappedHistory: AnalysisHistoryItem[] = data.map((run: any) => {
        const mapRecommendation = (rec: any, index: number): AnalysisRecommendation => ({
          id: `rec-${index}-${run._id}`,
          name: index === 0 ? "Primary Recommendation" : `Alternative ${index}`,
          score: Math.round(rec.compatibility_score * 100),
          explanation: rec.explanation || "No explanation provided.",
          breakdown: {
            overall_score: Math.round(rec.compatibility_score * 100),
            breakdown: [
              { label: "Style Match", value: Math.round((rec.s_style || 0) * 100) },
              { label: "Relevance", value: Math.round((rec.s_rel || 0) * 100) },
              { label: "Color Harmony", value: Math.round((rec.color_harmony || 0) * 100) },
              { label: "Formality", value: Math.round((rec.formality_match || 0) * 100) },
            ].filter(b => b.value > 0),
            explanation: rec.explanation || ""
          }
        });

        const mapGarment = (item: any, idx: number): AnalysisGarment => ({
          id: `g-${idx}-${run._id}`,
          name: item.clothing_type || "Garment",
          category: item.clothing_type || "Unknown",
          image: item.image_path ? `/uploads/${item.image_path}` : undefined
        });

        const inputGarments = (run.outfit?.items || []).map(mapGarment);
        const recGarments = (run.recommendations[0]?.items || []).map(mapGarment);

        return {
          id: run._id,
          date: run.created_at,
          context: run.query || run.context.occasion,
          styleIntent: run.context.style_intent,
          inputMode: run.outfit?.source_image_path ? "photo" : "manual",
          garments: inputGarments.length > 0 ? inputGarments : recGarments,
          topRecommendation: mapRecommendation(run.recommendations[0], 0),
          alternatives: run.recommendations.slice(1).map((rec: any, idx: number) => mapRecommendation(rec, idx + 1)),
          feedback: run.feedback || null 
        };
      });

      setItems(mappedHistory);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Error",
        description: "Failed to load history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleSelectAnalysis = (analysis: AnalysisHistoryItem) => {
    setSelectedAnalysis(analysis);
    setIsDrawerOpen(true);
  };

  const handleRerun = (analysisId: string) => {
    const run = rawRuns.find((r) => r._id === analysisId);
    if (run) {
      navigate("/dashboard", { state: { context: run.query || run.context.occasion } });
    } else {
      navigate("/dashboard");
    }
  };

  const handleSave = async (analysisId: string) => {
    const run = rawRuns.find((r) => r._id === analysisId);
    if (!run || !run.recommendations || run.recommendations.length === 0) return;

    try {
      const response = await fetch("/api/saved-outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outfit: run.recommendations[0] }),
      });

      if (!response.ok) throw new Error("Failed to save outfit");

      toast({
        title: "Success",
        description: "Outfit saved to your collection",
      });
    } catch (error) {
      console.error("Error saving outfit:", error);
      toast({
        title: "Error",
        description: "Failed to save outfit",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    try {
      const response = await fetch(`/api/history/${analysisId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete analysis");

      setItems((prev) => prev.filter((item) => item.id !== analysisId));
      setRawRuns((prev) => prev.filter((r) => r._id !== analysisId));
      toast({
        title: "Success",
        description: "Analysis deleted",
      });
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast({
        title: "Error",
        description: "Failed to delete analysis",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <TopNav title="Analysis History" theme={theme} onThemeChange={onThemeChange} />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-muted-foreground animate-pulse">Loading history...</p>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-lg bg-slate-700/20 flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No analysis history yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Your previous outfit recommendation sessions will appear here.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-medium hover:bg-emerald-500/30 transition-colors duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            /* History List */
            <div className="space-y-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectAnalysis(item)}
                  className="w-full p-4 md:p-5 rounded-[16px] bg-card border border-slate-700/50 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    {/* Left Side: Date Badge, Context, Recommendation */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Date Badge & Context */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex-shrink-0">
                          {formatDate(item.date)}
                        </span>
                        <h3 className="text-sm md:text-base font-semibold text-foreground truncate">
                          {item.context}
                        </h3>
                      </div>

                      {/* Top Recommendation */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-muted-foreground">
                          Top recommendation:
                        </p>
                        <span className="text-xs font-medium text-foreground bg-slate-700/30 px-2.5 py-1 rounded-full">
                          {item.topRecommendation.name}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Score Badge & Chevron */}
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                        {item.topRecommendation.score}%
                      </span>
                      <ChevronRight
                        size={20}
                        className="text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
                      />
                    </div>
                  </div>

                  {/* Optional: Feedback Indicator */}
                  {item.feedback && (
                    <div className="mt-3 flex items-center gap-2">
                      {item.feedback === "approved" ? (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Approved
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          Rejected
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Details Drawer */}
      <AnalysisDetailsDrawer
        analysis={selectedAnalysis}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedAnalysis(null);
        }}
        onRerun={handleRerun}
        onSave={handleSave}
        onDelete={handleDeleteAnalysis}
      />
    </div>
  );
}

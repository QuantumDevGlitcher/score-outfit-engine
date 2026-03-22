import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopNav from "@/components/TopNav";
import ProfileIndicator from "@/components/ProfileIndicator";
import ContextSection from "@/components/ContextSection";
import RecommendationResultsSection from "@/components/RecommendationResultsSection";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
}

export default function Dashboard({
  theme,
  onThemeChange,
}: DashboardProps) {
  const location = useLocation();
  // Context State
  const [contextInput, setContextInput] = useState("");

  useEffect(() => {
    if (location.state?.context) {
      setContextInput(location.state.context);
    }
  }, [location.state]);

  // Analysis State
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [analysisContext, setAnalysisContext] = useState<{
    context: string;
    style: string | null;
  } | null>(null);

  // Handlers
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (contextInput) {
      const occasion = contextInput;
      setAnalysisContext({
        context: occasion,
        style: null,
      });

      // Recommend from Wardrobe Pool
      try {
        const payload = {
          context: {
            occasion: occasion,
            style_intent: "Balanced",
            weather: "pleasant"
          },
          query: occasion,
        };

        const response = await fetch("/api/recommend/from-wardrobe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error("Wardrobe recommendation failed");
        const data = await response.json();
        setCurrentRunId(data.run_id);
        
        const combinedRecommendations = data.recommendations.map((rec: any, index: number) => {
          return {
            id: index + 1,
            name: `Wardrobe Recommendation ${index + 1}`,
            score: Math.round(rec.compatibility_score * 100),
            explanation: rec.explanation,
            fullExplanation: (rec.style_tips?.join(" ") || "") + (rec.explanation ? " " + rec.explanation : ""),
            items: rec.items,
            outfit_embedding: rec.outfit_embedding,
            s_style: rec.s_style,
            s_rel: rec.s_rel,
            raw_rec: rec
          };
        });
        
        setRecommendations(combinedRecommendations);
        setIsAnalyzed(true);
        return;
      } catch (error) {
        console.error("Wardrobe recommendation failed", error);
        alert("Failed to fetch wardrobe recommendations. Please try again.");
      }
    }
  };

  const { toast } = useToast();

  const handleFeedback = async (rec: any, liked: boolean) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: currentRunId || "dashboard_session",
          outfit_embedding: rec.outfit_embedding,
          liked,
          s_style: rec.s_style || 0.5,
          s_rel: rec.s_rel || 0.5,
        }),
      });

      if (!response.ok) throw new Error("Feedback failed");
      
      toast({
        title: liked ? "Approved!" : "Disapproved",
        description: `Your style preferences have been updated. Alpha: ${(await response.json()).new_alpha.toFixed(2)}`,
      });
    } catch (error) {
      console.error("Feedback error", error);
      toast({
        title: "Feedback Error",
        description: "Failed to update style preferences.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (rec: any) => {
    try {
      const response = await fetch("/api/saved-outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outfit: rec.raw_rec }),
      });

      if (!response.ok) throw new Error("Save failed");

      toast({
        title: "Outfit Saved",
        description: "You can find this outfit in your Saved Outfits page.",
      });
    } catch (error) {
      console.error("Save error", error);
      toast({
        title: "Save Error",
        description: "Failed to save the outfit.",
        variant: "destructive",
      });
    }
  };

  const hasContext = !!contextInput;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <TopNav title="Dashboard" theme={theme} onThemeChange={onThemeChange} />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Profile Indicator */}
          <ProfileIndicator theme={theme} />

          {/* Section 1: Context */}
          <ContextSection
            contextInput={contextInput}
            onContextChange={setContextInput}
            onAnalyze={handleAnalyze}
          />

          {/* Section 2: Recommendation Results */}
          <RecommendationResultsSection
            hasContext={hasContext}
            isAnalyzed={isAnalyzed}
            recommendations={recommendations}
            analysisContext={analysisContext}
            onApprove={(rec) => handleFeedback(rec, true)}
            onReject={(rec) => handleFeedback(rec, false)}
            onSave={handleSave}
          />

          {/* Footer Spacing */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

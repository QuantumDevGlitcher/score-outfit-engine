import { useState } from "react";
import { Sparkles } from "lucide-react";
import TopNav from "@/components/TopNav";
import ProfileIndicator from "@/components/ProfileIndicator";
import ContextSection from "@/components/ContextSection";
import CurrentOutfitSection from "@/components/CurrentOutfitSection";
import RecommendationResultsSection from "@/components/RecommendationResultsSection";

const RECOMMENDATIONS = [
  {
    id: 1,
    name: "Monochrome Minimalism",
    score: 92,
    explanation: "Neutral tones with clean lines create a sophisticated look",
    fullExplanation:
      "This outfit combines neutral tones and minimalist styling, which aligns perfectly with your selected context and personal style profile. The clean silhouettes and coordinated color palette provide a polished, professional appearance.",
  },
  {
    id: 2,
    name: "Professional Contrast",
    score: 87,
    explanation: "Dark base with accent pieces provides visual interest",
    fullExplanation:
      "The contrasting color combination creates visual depth while maintaining professionalism. This look works well for formal settings and complements your preference for balanced styling.",
  },
  {
    id: 3,
    name: "Relaxed Elegance",
    score: 84,
    explanation: "Comfortable fit with refined styling for casual settings",
    fullExplanation:
      "Combining comfort with elegance, this outfit bridges the gap between casual and formal wear. It's ideal for semi-formal occasions where you want to maintain a relaxed vibe.",
  },
];

interface GarmentItem {
  id: string;
  category: string;
  name: string;
  image?: string;
}

interface DashboardProps {
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
}

export default function Dashboard({
  theme,
  onThemeChange,
}: DashboardProps) {
  // Profile State
  const [hasProfile, setHasProfile] = useState(false);

  // Context State
  const [contextInput, setContextInput] = useState("");
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  // Outfit State
  const [imageUploaded, setImageUploaded] = useState(false);
  const [garments, setGarments] = useState<Record<string, GarmentItem | null>>(
    {
      top: null,
      bottom: null,
      shoes: null,
      outerwear: null,
      accessories: null,
    }
  );

  // Analysis State
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [analysisContext, setAnalysisContext] = useState<{
    context: string;
    style: string | null;
  } | null>(null);

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUploaded(true);
    }
  };

  const handleGarmentRemove = (slot: string) => {
    setGarments((prev) => ({
      ...prev,
      [slot]: null,
    }));
  };

  const handleAddGarment = (slot: string) => {
    // Mock garment selection - in a real app, this would open a wardrobe modal
    const mockGarment: GarmentItem = {
      id: `garment_${slot}`,
      category: slot.charAt(0).toUpperCase() + slot.slice(1),
      name: `Selected ${slot}`,
    };
    setGarments((prev) => ({
      ...prev,
      [slot]: mockGarment,
    }));
  };

  const handleAnalyze = () => {
    if (contextInput || selectedContext) {
      setAnalysisContext({
        context: contextInput || selectedContext || "Custom occasion",
        style: selectedStyle,
      });
      setIsAnalyzed(true);
    }
  };

  const hasContext = !!contextInput || !!selectedContext;
  const hasOutfit = imageUploaded || Object.values(garments).some((g) => g !== null);
  const hasRequiredOutfit =
    imageUploaded || (garments.top && garments.bottom && garments.shoes);

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
            selectedContext={selectedContext}
            onContextSelect={setSelectedContext}
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
          />

          {/* Section 2: Current Outfit */}
          <CurrentOutfitSection
            imageUploaded={imageUploaded}
            onImageUpload={handleImageUpload}
            garments={garments}
            onGarmentRemove={handleGarmentRemove}
            onAddGarment={handleAddGarment}
          />

          {/* Analyze Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!hasContext || !hasRequiredOutfit}
              className={`px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 flex items-center gap-2 ${
                !hasContext || !hasRequiredOutfit
                  ? "bg-slate-700/30 text-muted-foreground/50 cursor-not-allowed"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 hover:scale-105 shadow-lg shadow-emerald-500/10"
              }`}
            >
              <Sparkles size={20} />
              Analyze Outfit
            </button>
          </div>

          {/* Section 3: Recommendation Results */}
          <RecommendationResultsSection
            hasContext={hasContext}
            hasOutfit={hasOutfit}
            isAnalyzed={isAnalyzed}
            recommendations={isAnalyzed ? RECOMMENDATIONS : []}
            analysisContext={analysisContext}
          />

          {/* Footer Spacing */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

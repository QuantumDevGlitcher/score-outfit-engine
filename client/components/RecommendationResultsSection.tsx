import { useState } from "react";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Heart,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCard {
  id: number;
  name: string;
  score: number;
  explanation: string;
  fullExplanation: string;
}

interface RecommendationResultsSectionProps {
  hasContext: boolean;
  hasOutfit: boolean;
  isAnalyzed: boolean;
  recommendations: RecommendationCard[];
  analysisContext: {
    context: string;
    style: string | null;
  } | null;
}

export default function RecommendationResultsSection({
  hasContext,
  hasOutfit,
  isAnalyzed,
  recommendations,
  analysisContext,
}: RecommendationResultsSectionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Empty state logic
  if (!hasContext && !hasOutfit) {
    return (
      <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Sparkles size={20} className="text-purple-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Recommended Outfits
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-lg bg-slate-700/20 flex items-center justify-center mb-4">
            <Sparkles size={32} className="text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-2">
            Ready for recommendations?
          </p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Provide context and outfit details to receive personalized outfit
            recommendations.
          </p>
        </div>
      </div>
    );
  }

  if (!hasContext) {
    return (
      <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Sparkles size={20} className="text-purple-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Recommended Outfits
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-foreground font-medium mb-2">
            Tell us where you're going
          </p>
          <p className="text-sm text-muted-foreground max-w-sm">
            SCORE needs context to generate the best recommendations for you.
          </p>
        </div>
      </div>
    );
  }

  if (!hasOutfit) {
    return (
      <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Sparkles size={20} className="text-purple-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Recommended Outfits
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-foreground font-medium mb-2">
            Add your current outfit
          </p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Upload a photo or select garments from your wardrobe to get
            personalized recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Sparkles size={20} className="text-purple-400" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Recommended Outfits
        </h2>
      </div>

      {/* Analysis Summary */}
      {analysisContext && (
        <div className="mb-6 p-4 bg-background rounded-lg border border-emerald-500/30 text-sm">
          <p className="text-muted-foreground">
            Analysis for:{" "}
            <span className="text-emerald-400 font-semibold">
              {analysisContext.context}
            </span>
            {analysisContext.style && (
              <>
                {" "}
                • Style:{" "}
                <span className="text-emerald-400 font-semibold capitalize">
                  {analysisContext.style}
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {!isAnalyzed ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">
            Click "Analyze Outfit" to generate recommendations
          </p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">
            No recommendations available. Try adjusting your context or outfit.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const isExpanded = expandedId === rec.id;
            return (
              <div
                key={rec.id}
                className="bg-background rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-colors duration-200 overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="p-4 md:p-5 cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : rec.id)
                  }
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm md:text-base">
                        {rec.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/30 whitespace-nowrap">
                        {rec.score}%
                      </span>
                      <button className="p-1 hover:bg-slate-700/30 rounded transition-colors duration-200">
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-muted-foreground" />
                        ) : (
                          <ChevronDown size={18} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Score Bar */}
                  <div className="w-full h-1.5 bg-slate-700/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${rec.score}%` }}
                    />
                  </div>
                </div>

                {/* Card Body - Expanded */}
                {isExpanded && (
                  <div className="border-t border-slate-700/50 px-4 md:px-5 py-4 space-y-4">
                    {/* Explanation Section */}
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <Info size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                            Why this works
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rec.explanation}
                      </p>
                    </div>

                    {/* Full Explanation */}
                    <div className="p-3 rounded-lg bg-slate-700/10 border border-slate-700/30">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rec.fullExplanation}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 transition-colors duration-200 text-sm font-medium group">
                        <ThumbsUp size={16} className="group-hover:scale-110 transition-transform" />
                        Approve
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700/20 border border-slate-700/50 hover:bg-slate-700/30 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium group">
                        <ThumbsDown size={16} className="group-hover:scale-110 transition-transform" />
                        Reject
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700/20 border border-slate-700/50 hover:bg-slate-700/30 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium group">
                        <Heart size={16} className="group-hover:scale-110 transition-transform" />
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {/* Collapsed View - Quick Info */}
                {!isExpanded && (
                  <div className="px-4 md:px-5 py-3 border-t border-slate-700/50 text-xs text-muted-foreground flex items-center justify-between">
                    <p>{rec.explanation}</p>
                    <span className="text-right ml-4 flex-shrink-0">Click to expand</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

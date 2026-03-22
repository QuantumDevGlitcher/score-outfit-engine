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

interface OutfitItem {
  clothing_type: string;
  image_path: string;
  category_name?: string;
}

interface RecommendationCard {
  id: number;
  name: string;
  score: number;
  explanation: string;
  fullExplanation: string;
  items?: OutfitItem[];
  outfit_embedding?: number[];
  s_style?: number;
  s_rel?: number;
  raw_rec?: any;
}

interface RecommendationResultsSectionProps {
  hasContext: boolean;
  isAnalyzed: boolean;
  recommendations: RecommendationCard[];
  analysisContext: {
    context: string;
    style: string | null;
  } | null;
  onApprove?: (rec: RecommendationCard) => void;
  onReject?: (rec: RecommendationCard) => void;
  onSave?: (rec: RecommendationCard) => void;
}

export default function RecommendationResultsSection({
  hasContext,
  isAnalyzed,
  recommendations,
  analysisContext,
  onApprove,
  onReject,
  onSave,
}: RecommendationResultsSectionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Empty state logic
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
          <div className="w-16 h-16 rounded-lg bg-slate-700/20 flex items-center justify-center mb-4">
            <Sparkles size={32} className="text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-2">
            Ready for recommendations?
          </p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Provide context about your occasion to receive personalized outfit
            recommendations from your wardrobe.
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
                    {/* Garment Visualization */}
                    {rec.items && rec.items.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        {rec.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col gap-1.5">
                            <div className="aspect-[3/4] rounded-lg bg-slate-800/50 border border-slate-700/50 overflow-hidden relative group">
                              <img
                                src={`/uploads/${item.image_path}`}
                                alt={item.category_name || item.clothing_type}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523381235312-3a1647fa9918?auto=format&fit=crop&q=80&w=200';
                                }}
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="text-[10px] font-medium text-white capitalize truncate">
                                  {item.clothing_type}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Analysis Breakdown */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-semibold text-purple-300 uppercase tracking-wider">
                          <span>Personal Aesthetic</span>
                          <span>{Math.round((rec.s_style || 0) * 100)}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-700/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${(rec.s_style || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-semibold text-blue-300 uppercase tracking-wider">
                          <span>Relevance</span>
                          <span>{Math.round((rec.s_rel || 0) * 100)}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-700/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${(rec.s_rel || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

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
                      <button 
                        onClick={() => onApprove?.(rec)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 transition-colors duration-200 text-sm font-medium group"
                      >
                        <ThumbsUp size={16} className="group-hover:scale-110 transition-transform" />
                        Approve
                      </button>
                      <button 
                        onClick={() => onReject?.(rec)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700/20 border border-slate-700/50 hover:bg-slate-700/30 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium group"
                      >
                        <ThumbsDown size={16} className="group-hover:scale-110 transition-transform" />
                        Reject
                      </button>
                      <button 
                        onClick={() => onSave?.(rec)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700/20 border border-slate-700/50 hover:bg-slate-700/30 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium group"
                      >
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

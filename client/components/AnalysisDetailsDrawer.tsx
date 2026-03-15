import { useState } from "react";
import { X, RotateCcw, Heart, Trash2, Check, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import RecommendationBreakdown, {
  RecommendationBreakdownData,
} from "./RecommendationBreakdown";

export interface AnalysisGarment {
  id: string;
  name: string;
  category: string;
  image?: string;
}

export interface AnalysisRecommendation {
  id: string;
  name: string;
  score: number;
  explanation: string;
  breakdown: RecommendationBreakdownData;
}

export interface AnalysisHistoryItem {
  id: string;
  date: string;
  context: string;
  styleIntent: string;
  inputMode: "manual" | "photo";
  garments: AnalysisGarment[];
  topRecommendation: AnalysisRecommendation;
  alternatives: AnalysisRecommendation[];
  feedback: "approved" | "rejected" | null;
}

interface AnalysisDetailsDrawerProps {
  analysis: AnalysisHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRerun: (analysisId: string) => void;
  onSave: (analysisId: string) => void;
  onDelete: (analysisId: string) => void;
}

export default function AnalysisDetailsDrawer({
  analysis,
  isOpen,
  onClose,
  onRerun,
  onSave,
  onDelete,
}: AnalysisDetailsDrawerProps) {
  const [expandedAlternative, setExpandedAlternative] = useState<string | null>(
    null
  );

  if (!isOpen || !analysis) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this analysis? This action cannot be undone."
      )
    ) {
      onDelete(analysis.id);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer - Full screen on mobile, side panel on desktop */}
      <div className="fixed inset-0 md:right-0 md:top-0 md:bottom-0 md:inset-auto w-full md:max-w-[480px] bg-card border-l border-slate-700/50 shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="border-b border-slate-700/50 px-6 py-4 bg-card sticky top-0 z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Analysis Details
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {analysis.context}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-accent transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Header Meta */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground bg-slate-700/30 px-2.5 py-1 rounded-full">
              {formatDate(analysis.date)}
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/30">
              {analysis.topRecommendation.score}%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Section 1: Session Input Snapshot */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Session Inputs
            </h3>

            {/* Context & Mode */}
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Context</p>
                <p className="text-sm font-medium text-foreground">
                  {analysis.context}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Style Intent
                </p>
                <p className="text-sm font-medium text-foreground capitalize">
                  {analysis.styleIntent}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Input Mode
                </p>
                <p className="text-sm font-medium text-foreground capitalize">
                  {analysis.inputMode === "photo" ? "Photo Upload" : "Manual Selection"}
                </p>
              </div>
            </div>

            {/* Garments */}
            {analysis.garments.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Garments</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.garments.map((garment) => (
                    <div
                      key={garment.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-slate-700/50"
                    >
                      {garment.image && (
                        <img
                          src={garment.image}
                          alt={garment.name}
                          className="w-6 h-6 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {garment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {garment.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Top Recommendation */}
          <div className="space-y-3 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Top Recommendation
            </h3>
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="text-sm font-semibold text-foreground">
                  {analysis.topRecommendation.name}
                </h4>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-semibold border border-emerald-500/30">
                  {analysis.topRecommendation.score}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysis.topRecommendation.explanation}
              </p>
            </div>
          </div>

          {/* Section 3: Recommendation Confidence Visualization */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Confidence Breakdown
            </h3>
            <RecommendationBreakdown
              data={analysis.topRecommendation.breakdown}
            />
          </div>

          {/* Section 4: Alternative Recommendations */}
          {analysis.alternatives.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Other Options
              </h3>
              <div className="space-y-2">
                {analysis.alternatives.map((alt) => {
                  const isExpanded = expandedAlternative === alt.id;
                  return (
                    <button
                      key={alt.id}
                      onClick={() =>
                        setExpandedAlternative(
                          isExpanded ? null : alt.id
                        )
                      }
                      className="w-full text-left p-3 rounded-lg bg-background border border-slate-700/50 hover:border-emerald-500/30 transition-colors duration-200"
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="text-sm font-semibold text-foreground">
                          {alt.name}
                        </h4>
                        <span className="px-2 py-0.5 bg-slate-700/30 text-foreground rounded text-xs font-semibold">
                          {alt.score}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {alt.explanation}
                      </p>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-3">
                          <RecommendationBreakdown
                            data={alt.breakdown}
                            compact
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 5: Feedback */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Feedback
            </h3>
            <div className="p-3 rounded-lg bg-background border border-slate-700/50">
              {analysis.feedback === "approved" ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-emerald-300">Approved</span>
                </div>
              ) : analysis.feedback === "rejected" ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm text-red-300">Rejected</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No feedback recorded
                </p>
              )}
            </div>
          </div>

          {/* Spacer for footer */}
          <div className="h-4" />
        </div>

        {/* Footer - Sticky */}
        <div className="border-t border-slate-700/50 px-6 py-4 bg-card space-y-3 flex flex-col">
          {/* Primary Action */}
          <button
            onClick={() => {
              onRerun(analysis.id);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold hover:bg-emerald-500/30 transition-all duration-200"
          >
            <RotateCcw size={18} />
            Re-run Analysis
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onSave(analysis.id);
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-background border border-slate-700/50 text-foreground font-medium hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors duration-200"
            >
              <Heart size={18} />
              Save
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/20 transition-colors duration-200"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

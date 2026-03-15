import { cn } from "@/lib/utils";

export interface ScoreBreakdownMetric {
  label: string;
  value: number;
}

export interface RecommendationBreakdownData {
  overall_score: number;
  breakdown: ScoreBreakdownMetric[];
  explanation: string;
}

interface RecommendationBreakdownProps {
  data: RecommendationBreakdownData;
  compact?: boolean;
}

export default function RecommendationBreakdown({
  data,
  compact = false,
}: RecommendationBreakdownProps) {
  const getMetricColor = (value: number): string => {
    if (value >= 85) return "bg-emerald-500";
    if (value >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-foreground">
          {data.overall_score}
        </span>
        <span className="text-sm text-muted-foreground">Overall Score</span>
      </div>

      {/* Breakdown Bars */}
      <div className={cn("space-y-3", compact && "space-y-2")}>
        {data.breakdown.map((metric, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <label className={cn(
                "font-medium text-foreground",
                compact ? "text-xs" : "text-sm"
              )}>
                {metric.label}
              </label>
              <span className={cn(
                "font-semibold text-foreground",
                compact ? "text-xs" : "text-sm"
              )}>
                {metric.value}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700/30 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  getMetricColor(metric.value)
                )}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className={cn(
        "p-3 rounded-lg bg-slate-700/10 border border-slate-700/30",
        compact && "p-2"
      )}>
        <p className={cn(
          "text-muted-foreground leading-relaxed",
          compact ? "text-xs" : "text-sm"
        )}>
          {data.explanation}
        </p>
      </div>
    </div>
  );
}

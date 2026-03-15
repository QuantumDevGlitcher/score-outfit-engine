import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Coffee,
  Smile,
  Music,
  Zap,
  Sun,
  Plane,
  Shirt,
  Sparkles,
  Square,
  Activity,
  Cloud,
  Layers,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import {
  CalibrationStepData,
  CONTEXT_OPTIONS,
  STYLE_OPTIONS,
  COLOR_OPTIONS,
} from "@/types/preferences";

const ICON_MAP: Record<string, React.ComponentType<{ size: number }>> = {
  Briefcase,
  Coffee,
  Smile,
  Music,
  Zap,
  Sun,
  Plane,
  Shirt,
  Sparkles,
  Square,
  Activity,
  Cloud,
  Layers,
};

interface CalibrationWizardProps {
  onComplete: (data: CalibrationStepData) => void;
  onCancel: () => void;
}

export default function CalibrationWizard({
  onComplete,
  onCancel,
}: CalibrationWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CalibrationStepData>({
    frequentContexts: [],
    styleTendencies: [],
    colorApproach: "balanced",
    colorsToAvoid: [],
    recommendationBehavior: "balanced",
    styleNotes: "",
  });

  const updateData = <K extends keyof CalibrationStepData>(
    key: K,
    value: CalibrationStepData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (
    key: keyof CalibrationStepData,
    item: string
  ) => {
    const current = data[key] as string[];
    if (current.includes(item)) {
      updateData(
        key,
        current.filter((i) => i !== item) as CalibrationStepData[keyof CalibrationStepData]
      );
    } else {
      updateData(
        key,
        [...current, item] as CalibrationStepData[keyof CalibrationStepData]
      );
    }
  };

  const canProceed = () => {
    switch (step) {
      case 2:
        return data.frequentContexts.length > 0;
      case 3:
        return data.styleTendencies.length > 0;
      case 4:
        return true; // Color step always allows proceed
      case 5:
        return true; // Behavior step always allows proceed
      case 6:
        return true; // Notes step always allows proceed
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-slate-700/50 rounded-[20px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-slate-700/50 bg-background/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {step === 1 && "Help SCORE understand your style"}
                {step === 2 && "Frequent Contexts"}
                {step === 3 && "Style Tendencies"}
                {step === 4 && "Color Preferences"}
                {step === 5 && "Recommendation Behavior"}
                {step === 6 && "Style Notes"}
                {step === 7 && "Profile Complete!"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 1 &&
                  "This quick setup helps SCORE generate better outfit recommendations based on your preferences and lifestyle."}
                {step === 2 && "Select all that apply to your lifestyle"}
                {step === 3 && "Choose the styles that resonate with you"}
                {step === 4 && "Pick your color comfort zone"}
                {step === 5 && "How adventurous should recommendations be?"}
                {step === 6 && "Add any additional style notes (optional)"}
                {step === 7 &&
                  "SCORE will use this information to personalize recommendations."}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Step {step} of 7
              </span>
              <span className="text-muted-foreground">
                {Math.round(((step - 1) / 6) * 100)}%
              </span>
            </div>
            <div className="h-1 bg-slate-700/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${((step - 1) / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <span className="font-bold text-emerald-400 text-2xl">
                    SCORE
                  </span>
                </div>
              </div>
              <p className="text-center text-foreground text-lg">
                Let's build your personal style profile
              </p>
            </div>
          )}

          {/* Step 2: Frequent Contexts */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONTEXT_OPTIONS.map((option) => {
                  const Icon = ICON_MAP[option.icon];
                  const isSelected = data.frequentContexts.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        toggleArrayItem("frequentContexts", option.id)
                      }
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500/50 text-foreground"
                          : "bg-background border-slate-700/50 text-muted-foreground hover:border-emerald-500/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon size={20} className="flex-shrink-0" />}
                        <span className="font-medium text-sm">
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Style Tendencies */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STYLE_OPTIONS.map((option) => {
                  const Icon = ICON_MAP[option.icon];
                  const isSelected = data.styleTendencies.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        toggleArrayItem("styleTendencies", option.id)
                      }
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500/50 text-foreground"
                          : "bg-background border-slate-700/50 text-muted-foreground hover:border-emerald-500/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon size={20} className="flex-shrink-0" />}
                        <span className="font-medium text-sm">
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Color Preferences */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Color Approach */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Color approach
                </h3>
                <div className="space-y-2">
                  {["neutral", "balanced", "bold"].map((approach) => (
                    <label
                      key={approach}
                      className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200"
                      style={{
                        borderColor:
                          data.colorApproach === approach
                            ? "#10b981"
                            : "rgba(71, 85, 105, 0.5)",
                        backgroundColor:
                          data.colorApproach === approach
                            ? "rgba(16, 185, 129, 0.1)"
                            : "transparent",
                      }}
                    >
                      <input
                        type="radio"
                        name="colorApproach"
                        value={approach}
                        checked={
                          data.colorApproach ===
                          (approach as "neutral" | "balanced" | "bold")
                        }
                        onChange={(e) =>
                          updateData(
                            "colorApproach",
                            e.target.value as "neutral" | "balanced" | "bold"
                          )
                        }
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="ml-3 font-medium text-foreground capitalize">
                        {approach === "neutral" && "Mostly neutral colors"}
                        {approach === "balanced" && "Balanced mix"}
                        {approach === "bold" && "Bold colors"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colors to Avoid */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Colors to avoid (optional)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COLOR_OPTIONS.map((colorOption) => {
                    const isSelected = data.colorsToAvoid.includes(
                      colorOption.id
                    );
                    return (
                      <button
                        key={colorOption.id}
                        onClick={() =>
                          toggleArrayItem("colorsToAvoid", colorOption.id)
                        }
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2",
                          isSelected
                            ? "border-emerald-500/50 bg-emerald-500/20"
                            : "border-slate-700/50 hover:border-slate-700"
                        )}
                      >
                        <div
                          className="w-6 h-6 rounded-lg border border-slate-600"
                          style={{ backgroundColor: colorOption.color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {colorOption.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Recommendation Behavior */}
          {step === 5 && (
            <div className="space-y-3">
              {["safe", "balanced", "creative"].map((behavior) => (
                <label
                  key={behavior}
                  className="flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200"
                  style={{
                    borderColor:
                      data.recommendationBehavior === behavior
                        ? "#10b981"
                        : "rgba(71, 85, 105, 0.5)",
                    backgroundColor:
                      data.recommendationBehavior === behavior
                        ? "rgba(16, 185, 129, 0.1)"
                        : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="behavior"
                    value={behavior}
                    checked={
                      data.recommendationBehavior ===
                      (behavior as "safe" | "balanced" | "creative")
                    }
                    onChange={(e) =>
                      updateData(
                        "recommendationBehavior",
                        e.target.value as "safe" | "balanced" | "creative"
                      )
                    }
                    className="w-4 h-4 cursor-pointer mt-1"
                  />
                  <div className="ml-3">
                    <h4 className="font-semibold text-foreground capitalize">
                      {behavior === "safe" && "Safe and practical"}
                      {behavior === "balanced" && "Balanced"}
                      {behavior === "creative" &&
                        "More creative and experimental"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {behavior === "safe" &&
                        "Suggestions aligned with your existing wardrobe"}
                      {behavior === "balanced" &&
                        "Mix of reliable and slightly adventurous options"}
                      {behavior === "creative" &&
                        "Diverse combinations and new style explorations"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Step 6: Style Notes */}
          {step === 6 && (
            <div className="space-y-4">
              <textarea
                value={data.styleNotes}
                onChange={(e) => updateData("styleNotes", e.target.value)}
                placeholder={
                  "Examples:\n• I usually prefer darker outfits\n• I don't like flashy clothing\n• I want more office-appropriate recommendations"
                }
                className="w-full min-h-[200px] px-4 py-3 rounded-lg border border-slate-700/50 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This is optional but helps SCORE personalize recommendations
                even more.
              </p>
            </div>
          )}

          {/* Step 7: Completion */}
          {step === 7 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                  <Check size={32} className="text-emerald-400" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Your style profile is ready!
                </h2>
                <p className="text-muted-foreground mt-2">
                  SCORE will use this information to personalize your
                  recommendations. You can update your profile anytime.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-700/50 bg-background/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={cn(
                "px-4 py-2 rounded-lg border border-slate-700/50 font-medium text-sm transition-all duration-200 flex items-center gap-2",
                step === 1
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10"
              )}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-slate-700/50 text-foreground font-medium text-sm hover:border-slate-700 hover:bg-slate-700/20 transition-all duration-200"
            >
              {step === 7 ? "Later" : "Cancel"}
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2",
                canProceed()
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
                  : "bg-slate-700/20 text-muted-foreground/50 cursor-not-allowed border border-slate-700/50"
              )}
            >
              {step === 7 ? "Finish" : "Next"}
              {step < 7 && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

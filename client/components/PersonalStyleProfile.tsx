import { useState } from "react";
import { User, Edit2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserStyleProfile } from "@/types/preferences";
import CalibrationWizard from "./CalibrationWizard";
import { CalibrationStepData } from "@/types/preferences";

interface PersonalStyleProfileProps {
  profile: UserStyleProfile | null;
  onProfileUpdate: (profile: UserStyleProfile) => void;
}

export default function PersonalStyleProfile({
  profile,
  onProfileUpdate,
}: PersonalStyleProfileProps) {
  const [showWizard, setShowWizard] = useState(false);

  const handleWizardComplete = (data: CalibrationStepData) => {
    const updatedProfile: UserStyleProfile = {
      id: profile?.id || `profile_${Date.now()}`,
      userId: profile?.userId || "current_user",
      frequentContexts: data.frequentContexts,
      styleTendencies: data.styleTendencies,
      colorApproach: data.colorApproach,
      colorsToAvoid: data.colorsToAvoid,
      recommendationBehavior: data.recommendationBehavior,
      styleNotes: data.styleNotes,
      isComplete: true,
      createdAt: profile?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    // Save to localStorage
    localStorage.setItem("userStyleProfile", JSON.stringify(updatedProfile));
    onProfileUpdate(updatedProfile);
    setShowWizard(false);
  };

  if (showWizard) {
    return (
      <CalibrationWizard
        onComplete={handleWizardComplete}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  return (
    <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <User size={20} className="text-emerald-400" />
        </div>
        <h2 className="text-lg font-bold text-foreground">
          Personal Style Profile
        </h2>
      </div>

      {!profile || !profile.isComplete ? (
        <div className="space-y-4 text-center py-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-slate-700/30 flex items-center justify-center">
              <Zap size={24} className="text-muted-foreground" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Build your style profile
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete the calibration to help SCORE generate better outfit
              recommendations tailored to your preferences.
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="w-full px-4 py-3 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-medium text-sm hover:bg-emerald-500/30 transition-colors duration-200"
          >
            Start Calibration
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Completeness */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">
                Profile completed
              </span>
            </div>
            <span className="text-xs text-emerald-400/70">
              Updated{" "}
              {profile.updatedAt
                ? new Date(profile.updatedAt).toLocaleDateString()
                : "today"}
            </span>
          </div>

          {/* Frequent Contexts */}
          {profile.frequentContexts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Frequent Contexts
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.frequentContexts.map((context) => (
                  <span
                    key={context}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  >
                    {context.charAt(0).toUpperCase() + context.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Style Tendencies */}
          {profile.styleTendencies.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Style Tendencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.styleTendencies.map((style) => (
                  <span
                    key={style}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Color Approach */}
          {profile.colorApproach && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Color Preference
              </h3>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {profile.colorApproach === "neutral" && "Mostly neutral colors"}
                {profile.colorApproach === "balanced" && "Balanced mix"}
                {profile.colorApproach === "bold" && "Bold colors"}
              </span>
            </div>
          )}

          {/* Colors to Avoid */}
          {profile.colorsToAvoid.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Colors to Avoid
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.colorsToAvoid.map((color) => (
                  <span
                    key={color}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/30 text-muted-foreground border border-slate-700/50"
                  >
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Behavior */}
          {profile.recommendationBehavior && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Recommendation Behavior
              </h3>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {profile.recommendationBehavior === "safe" &&
                  "Safe and practical"}
                {profile.recommendationBehavior === "balanced" && "Balanced"}
                {profile.recommendationBehavior === "creative" &&
                  "Creative and experimental"}
              </span>
            </div>
          )}

          {/* Style Notes */}
          {profile.styleNotes && (
            <div className="p-3 rounded-lg bg-slate-700/20 border border-slate-700/50">
              <p className="text-sm text-muted-foreground">"{profile.styleNotes}"</p>
            </div>
          )}

          {/* Edit Profile Button */}
          <button
            onClick={() => setShowWizard(true)}
            className="w-full px-4 py-3 rounded-lg border border-slate-700/50 text-foreground font-medium text-sm hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

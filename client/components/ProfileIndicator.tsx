import { useState, useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";
import { UserStyleProfile } from "@/types/preferences";
import CalibrationWizard from "./CalibrationWizard";

interface ProfileIndicatorProps {
  theme: "dark" | "light";
}

export default function ProfileIndicator({ theme }: ProfileIndicatorProps) {
  const [profile, setProfile] = useState<UserStyleProfile | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("userStyleProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, []);

  const isComplete = profile?.isComplete ?? false;

  if (showWizard) {
    return (
      <CalibrationWizard
        onComplete={(data) => {
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
          localStorage.setItem("userStyleProfile", JSON.stringify(updatedProfile));
          setProfile(updatedProfile);
          setShowWizard(false);
        }}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  return (
    <div
      className={`px-4 py-3 rounded-lg border flex items-center justify-between ${
        isComplete
          ? "bg-emerald-500/10 border-emerald-500/30"
          : "bg-amber-500/10 border-amber-500/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isComplete
              ? "bg-emerald-500/20"
              : "bg-amber-500/20"
          }`}
        >
          {isComplete ? (
            <Check size={14} className="text-emerald-400" />
          ) : (
            <AlertCircle size={14} className="text-amber-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">
            {isComplete ? (
              <span className="text-emerald-300">
                Style Profile: Completed
              </span>
            ) : (
              <span className="text-amber-300">
                Style Profile: Incomplete
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {isComplete
              ? "Your profile is ready for personalized recommendations"
              : "Complete your profile for better recommendations"}
          </p>
        </div>
      </div>

      {!isComplete && (
        <button
          onClick={() => setShowWizard(true)}
          className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/50 hover:bg-amber-500/30 transition-colors duration-200 whitespace-nowrap"
        >
          Complete Profile
        </button>
      )}
    </div>
  );
}

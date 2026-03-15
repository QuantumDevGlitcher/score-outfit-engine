import TopNav from "@/components/TopNav";
import { Palette, Grid3x3, Brain } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SettingsProps {
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
}

interface ToggleSettings {
  darkMode: boolean;
  compactDensity: boolean;
  confirmBeforeDelete: boolean;
  autoOpenDrawer: boolean;
  autoDetectOnUpload: boolean;
  showExplanations: boolean;
}

const ACCENT_COLORS = [
  { id: "emerald", name: "Emerald", color: "#10b981" },
  { id: "blue", name: "Blue", color: "#3b82f6" },
  { id: "purple", name: "Purple", color: "#a855f7" },
  { id: "pink", name: "Pink", color: "#ec4899" },
  { id: "cyan", name: "Cyan", color: "#06b6d4" },
];

const VIEW_MODES = [
  { id: "deck", label: "Deck View" },
  { id: "grid", label: "Compact View" },
];

export default function Settings({
  theme,
  onThemeChange,
}: SettingsProps) {
  const [selectedAccent, setSelectedAccent] = useState("emerald");
  const [defaultViewMode, setDefaultViewMode] = useState<"deck" | "grid">("deck");
  const [settings, setSettings] = useState<ToggleSettings>({
    darkMode: theme === "dark",
    compactDensity: false,
    confirmBeforeDelete: true,
    autoOpenDrawer: false,
    autoDetectOnUpload: true,
    showExplanations: true,
  });

  const handleToggle = (key: keyof ToggleSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <TopNav title="Settings" theme={theme} onThemeChange={onThemeChange} />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Section 1: Appearance */}
            <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Palette size={20} className="text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Appearance</h2>
              </div>

              <div className="space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
                  <div>
                    <h3 className="font-semibold text-foreground">Dark Mode</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use dark theme throughout the app
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleToggle("darkMode");
                      onThemeChange(settings.darkMode ? "light" : "dark");
                    }}
                    className={cn(
                      "relative w-12 h-7 rounded-full transition-colors duration-200",
                      settings.darkMode
                        ? "bg-emerald-500"
                        : "bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200",
                        settings.darkMode && "translate-x-5"
                      )}
                    />
                  </button>
                </div>

                {/* Accent Color Selector */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Accent Color
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {ACCENT_COLORS.map((accent) => (
                      <button
                        key={accent.id}
                        onClick={() => setSelectedAccent(accent.id)}
                        className={cn(
                          "p-3 rounded-lg transition-all duration-200 border-2",
                          selectedAccent === accent.id
                            ? "border-emerald-400"
                            : "border-slate-700/30 hover:border-emerald-400/50"
                        )}
                        title={accent.name}
                      >
                        <div
                          className="w-6 h-6 rounded-lg"
                          style={{ backgroundColor: accent.color }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Density */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Compact Density
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reduce spacing for a denser interface
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("compactDensity")}
                    className={cn(
                      "relative w-12 h-7 rounded-full transition-colors duration-200",
                      settings.compactDensity
                        ? "bg-emerald-500"
                        : "bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200",
                        settings.compactDensity && "translate-x-5"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Wardrobe Preferences */}
            <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Grid3x3 size={20} className="text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  Wardrobe Preferences
                </h2>
              </div>

              <div className="space-y-6">
                {/* Default View Mode */}
                <div className="pb-4 border-b border-slate-700/30">
                  <h3 className="font-semibold text-foreground mb-3">
                    Default View Mode
                  </h3>
                  <div className="flex gap-3">
                    {VIEW_MODES.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() =>
                          setDefaultViewMode(mode.id as "deck" | "grid")
                        }
                        className={cn(
                          "px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
                          defaultViewMode === mode.id
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                            : "bg-background border border-slate-700/50 text-foreground hover:border-emerald-500/30"
                        )}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm Before Delete */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Confirm Before Delete
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ask for confirmation before deleting garments
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("confirmBeforeDelete")}
                    className={cn(
                      "relative w-12 h-7 rounded-full transition-colors duration-200",
                      settings.confirmBeforeDelete
                        ? "bg-emerald-500"
                        : "bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200",
                        settings.confirmBeforeDelete && "translate-x-5"
                      )}
                    />
                  </button>
                </div>

                {/* Auto-open Drawer */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Auto-open Details
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Open garment details when clicking on a card
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("autoOpenDrawer")}
                    className={cn(
                      "relative w-12 h-7 rounded-full transition-colors duration-200",
                      settings.autoOpenDrawer
                        ? "bg-emerald-500"
                        : "bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200",
                        settings.autoOpenDrawer && "translate-x-5"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Analysis Preferences */}
            <div className="rounded-[20px] border border-slate-700/50 bg-card/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Brain size={20} className="text-purple-400" />
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  Analysis Preferences
                </h2>
              </div>

              <div className="space-y-6">
                {/* Auto-detect on Upload */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Auto-detect on Upload
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automatically detect garment details from photos
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("autoDetectOnUpload")}
                    className={cn(
                      "relative w-12 h-7 rounded-full transition-colors duration-200",
                      settings.autoDetectOnUpload
                        ? "bg-emerald-500"
                        : "bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200",
                        settings.autoDetectOnUpload && "translate-x-5"
                      )}
                    />
                  </button>
                </div>

                {/* Show Explanations */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Show Explanations
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Display detailed explanations for recommendations
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("showExplanations")}
                    className={cn(
                      "relative w-12 h-7 rounded-full transition-colors duration-200",
                      settings.showExplanations
                        ? "bg-emerald-500"
                        : "bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200",
                        settings.showExplanations && "translate-x-5"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-muted-foreground text-center">
              Your preferences are saved automatically
            </p>
          </div>
      </div>
    </div>
  );
}

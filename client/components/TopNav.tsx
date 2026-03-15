import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import NavigationMenu from "@/components/NavigationMenu";
import { Link } from "react-router-dom";

interface TopNavProps {
  title: string;
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
}

export default function TopNav({ title, theme, onThemeChange }: TopNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Navigation Bar - Three Zone Layout */}
      <div className="border-b border-slate-700/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          {/* ZONE 1: Brand (Left) */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
            {/* Logo Icon */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="currentColor"
              >
                {/* Geometric pattern inspired by SCORE logo */}
                <rect x="4" y="4" width="4" height="4" opacity="0.9" />
                <rect x="10" y="4" width="4" height="4" opacity="0.7" />
                <rect x="16" y="4" width="4" height="4" opacity="1" />
                <rect x="4" y="10" width="4" height="4" opacity="0.8" />
                <rect x="10" y="10" width="4" height="4" opacity="0.6" />
                <rect x="16" y="10" width="4" height="4" opacity="0.85" />
                <rect x="4" y="16" width="4" height="4" opacity="1" />
                <rect x="10" y="16" width="4" height="4" opacity="0.75" />
                <rect x="16" y="16" width="4" height="4" opacity="0.8" />
              </svg>
            </div>

            {/* Brand Text */}
            <span className="font-bold text-base md:text-lg text-foreground">
              SCORE
            </span>
          </Link>

          {/* ZONE 2: Page Title (Center) */}
          <div className="flex-1 text-center">
            <h1 className="text-sm md:text-base font-medium text-muted-foreground">
              {title}
            </h1>
          </div>

          {/* ZONE 3: Utilities (Right) */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0 relative">
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:bg-slate-800/50 text-muted-foreground hover:text-foreground",
                isMenuOpen && "bg-slate-800/50 text-foreground"
              )}
              title="Toggle navigation menu"
              aria-label="Navigation menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Navigation Menu */}
            <NavigationMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

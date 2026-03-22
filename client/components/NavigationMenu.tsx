import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Heart,
  History,
  Sliders,
  LogOut,
  Shirt,
  ChevronDown,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Shirt, label: "My Wardrobe", path: "/wardrobe" },
  { icon: Heart, label: "Saved Outfits", path: "/saved" },
  { icon: History, label: "History", path: "/history" },
];

const secondaryItems = [
  { icon: Sliders, label: "Preferences", path: "/preferences" },
  { icon: LogOut, label: "Logout", path: "/" },
];

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isMobile && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, isMobile, onClose]);

  const isActive = (path: string) => location.pathname === path;

  const menuContent = (
    <>
      {/* Primary Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && onClose()}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                active
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-muted-foreground hover:bg-slate-800/50 hover:text-foreground border border-transparent"
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-slate-700/50 my-4"></div>

      {/* Secondary Menu */}
      <nav className="space-y-1">
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && onClose()}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                active
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-muted-foreground hover:bg-slate-800/50 hover:text-foreground border border-transparent"
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  // Desktop: Dropdown menu
  if (!isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={onClose}
          />
        )}
        <div
          ref={dropdownRef}
          className={cn(
            "absolute top-[calc(100%+8px)] -right-4 w-56 rounded-[16px] bg-card border border-slate-700/50 shadow-2xl z-50",
            "overflow-hidden transition-all duration-200 ease-out origin-top-right",
            isOpen
              ? "opacity-100 visible scale-100"
              : "opacity-0 invisible scale-95 pointer-events-none"
          )}
        >
          <div className="p-2">
            {menuContent}
          </div>
        </div>
      </>
    );
  }

  // Mobile: Full-height slide-in from right
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-200"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 w-72 bg-card border-l border-slate-700/50 shadow-2xl z-50",
          "overflow-y-auto transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 space-y-4">
          <div className="h-12" /> {/* Spacing to account for top nav */}
          {menuContent}
        </div>
      </div>
    </>
  );
}

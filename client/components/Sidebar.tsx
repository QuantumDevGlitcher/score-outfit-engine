import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Heart,
  History,
  Settings,
  LogOut,
  Shirt,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Shirt, label: "My Wardrobe", path: "/wardrobe" },
  { icon: Heart, label: "Saved Outfits", path: "/saved" },
  { icon: History, label: "History", path: "/history" },
];

const secondaryItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/" },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed = false, onCollapse }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const handleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapse?.(newState);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col h-screen sticky top-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header with Logo and Collapse Button */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div
          className={cn(
            "font-bold text-accent transition-all duration-300",
            collapsed ? "hidden" : "text-xl"
          )}
        >
          SCORE
        </div>
        <button
          onClick={handleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-accent transition-colors ml-auto"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group",
                active
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "text-muted-foreground hover:bg-background hover:text-foreground border border-transparent"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="px-4 border-t border-border"></div>

      {/* Secondary Menu */}
      <nav className="px-4 py-6 space-y-2">
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group",
                active
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "text-muted-foreground hover:bg-background hover:text-foreground border border-transparent"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

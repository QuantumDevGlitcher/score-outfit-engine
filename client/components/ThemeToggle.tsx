import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  onThemeChange: (theme: "dark" | "light") => void;
  theme: "dark" | "light";
}

export default function ThemeToggle({
  onThemeChange,
  theme,
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    onThemeChange(newTheme);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="p-2 rounded-lg bg-background border border-border hover:border-accent hover:text-accent transition-colors text-muted-foreground"
    >
      {theme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}

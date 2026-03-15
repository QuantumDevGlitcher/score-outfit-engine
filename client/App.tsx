import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Wardrobe from "./pages/Wardrobe";
import SavedOutfits from "./pages/SavedOutfits";
import History from "./pages/History";
import Preferences from "./pages/Preferences";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = ({ theme, onThemeChange }: { theme: "dark" | "light"; onThemeChange: (theme: "dark" | "light") => void }) => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/dashboard" element={<Dashboard theme={theme} onThemeChange={onThemeChange} />} />
    <Route path="/wardrobe" element={<Wardrobe theme={theme} onThemeChange={onThemeChange} />} />
    <Route path="/saved" element={<SavedOutfits theme={theme} onThemeChange={onThemeChange} />} />
    <Route path="/history" element={<History theme={theme} onThemeChange={onThemeChange} />} />
    <Route path="/preferences" element={<Preferences theme={theme} onThemeChange={onThemeChange} />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    // Check localStorage for saved theme preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    }
    // Default to dark mode
    return "dark";
  });

  // Apply theme to root element
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.classList.remove("dark", "light");
      root.classList.add(theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent theme={theme} onThemeChange={handleThemeChange} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

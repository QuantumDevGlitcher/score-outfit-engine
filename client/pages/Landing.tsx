import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/logo.png"
            alt="WARDROBE GENIE Logo"
            className="w-48 h-48 mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
          WARDROBE GENIE
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Smart Context-aware Outfit Recommendation Engine
        </p>

        {/* Enter System Button */}
        <Link to="/dashboard">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-12 py-6 text-lg"
          >
            Enter System
          </Button>
        </Link>
      </div>
    </div>
  );
}

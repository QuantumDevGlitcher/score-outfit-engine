import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fdd2a45c9de4b40dd985ff3aaa868e646%2F7776ccd91dad4426a008ac742e5e4ce6?format=webp&width=800&height=1200"
            alt="SCORE Logo"
            className="w-48 h-48 mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
          SCORE
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

import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { handleDemo } from "./routes/demo";
import { handleAnalyzeOutfit } from "./routes/analyze-outfit";
import { handleRecommendFull, handleRecommendFromWardrobe, handleGetHistory, handleDeleteHistory } from "./routes/recommend";
import { handleFeedback } from "./routes/feedback";
import { handleAddFromImage, handleGetWardrobe, handleDeleteWardrobeItems, handleBulkAddItems } from "./routes/wardrobe";
import { handleSaveOutfit, handleGetSavedOutfits, handleDeleteSavedOutfit } from "./routes/saved-outfits";
import { ensureMongoIndexes } from "./db";

export function createServer() {
  const app = express();

  const uploadDir = resolve(
    process.cwd(),
    process.env.UPLOAD_DIR ?? "public/uploads",
  );
  mkdirSync(uploadDir, { recursive: true });

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  });

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Serve generated images
  app.use("/uploads", express.static(uploadDir));

  // Existing routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // New routes
  app.post("/api/analyze-outfit", upload.single("image"), handleAnalyzeOutfit);
  app.post("/api/recommend/full", handleRecommendFull);
  app.post("/api/recommend/from-wardrobe", handleRecommendFromWardrobe);
  app.post("/api/feedback", handleFeedback);
  app.get("/api/wardrobe", handleGetWardrobe);
  app.post("/api/wardrobe/add", upload.single("image"), handleAddFromImage);
  app.post("/api/wardrobe/bulk-add", handleBulkAddItems);
  app.delete("/api/wardrobe", handleDeleteWardrobeItems);
  app.get("/api/saved-outfits", handleGetSavedOutfits);
  app.post("/api/saved-outfits", handleSaveOutfit);
  app.delete("/api/saved-outfits/:id", handleDeleteSavedOutfit);
  app.get("/api/history", handleGetHistory);
  app.delete("/api/history/:id", handleDeleteHistory);

  // Optional aliases if your frontend expects paths without /api
  app.post("/analyze-outfit", upload.single("image"), handleAnalyzeOutfit);
  app.post("/recommend/full", handleRecommendFull);
  app.post("/recommend/from-wardrobe", handleRecommendFromWardrobe);
  app.post("/feedback", handleFeedback);
  app.get("/wardrobe", handleGetWardrobe);
  app.post("/wardrobe/add", upload.single("image"), handleAddFromImage);
  app.post("/wardrobe/bulk-add", handleBulkAddItems);
  app.delete("/wardrobe", handleDeleteWardrobeItems);
  app.get("/saved-outfits", handleGetSavedOutfits);
  app.post("/saved-outfits", handleSaveOutfit);
  app.delete("/saved-outfits/:id", handleDeleteSavedOutfit);
  app.get("/history", handleGetHistory);
  app.delete("/history/:id", handleDeleteHistory);

  void ensureMongoIndexes().catch((error) => {
    console.error("Mongo index setup failed:", error);
  });

  return app;
}

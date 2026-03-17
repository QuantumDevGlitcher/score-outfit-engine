import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { handleDemo } from "./routes/demo";
import { handleAnalyzeOutfit } from "./routes/analyze-outfit";
import { handleRecommendFull } from "./routes/recommend";
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
      fileSize: 10 * 1024 * 1024,
    },
  });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // Optional aliases if your frontend expects paths without /api
  app.post("/analyze-outfit", upload.single("image"), handleAnalyzeOutfit);
  app.post("/recommend/full", handleRecommendFull);

  void ensureMongoIndexes().catch((error) => {
    console.error("Mongo index setup failed:", error);
  });

  return app;
}

import type { Request, Response } from "express";
import { z } from "zod";
import { getRecommendationRunsCollection } from "../db";

const pythonModelUrl = process.env.PYTHON_MODEL_URL ?? "http://127.0.0.1:8001";

const colorSchema = z.object({
  rgb: z.tuple([z.number(), z.number(), z.number()]),
  confidence: z.number().optional(),
});

const outfitItemSchema = z.object({
  clothing_type: z.string(),
  material: z.string(),
  formality_score: z.number(),
  colors: z.array(colorSchema),
  image_path: z.string(),
});

const recommendFullSchema = z.object({
  context: z.object({
    occasion: z.string().min(1),
    style_intent: z.string().min(1),
    weather: z.string().optional().nullable(),
  }),
  outfit: z.object({
    items: z.array(outfitItemSchema).min(1),
    source_image_path: z.string().optional(),
  }),
});

export async function handleRecommendFull(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsed = recommendFullSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "invalid request body",
        errors: parsed.error.flatten(),
      });
      return;
    }

    const response = await fetch(`${pythonModelUrl}/recommend/full`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    console.log("[recommend] python response ok");

    const collection = await getRecommendationRunsCollection();
    console.log("[recommend] collection acquired");

    const insertResult = await collection.insertOne({
      context: parsed.data.context,
      outfit: parsed.data.outfit,
      recommendations: data.recommendations,
      created_at: new Date(),
    });

    console.log("[recommend] inserted id:", insertResult.insertedId);

    const count = await collection.countDocuments();
    console.log("[recommend] recommendation_runs count:", count);

    res.json(data);
  } catch (error) {
    console.error("recommend/full error:", error);
    res.status(500).json({ message: "failed to generate recommendations" });
  }
}

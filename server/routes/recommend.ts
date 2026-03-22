import type { Request, Response } from "express";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getRecommendationRunsCollection, getWardrobeCollection, getUserProfileCollection } from "../db";

const pythonModelUrl = process.env.PYTHON_MODEL_URL ?? "http://127.0.0.1:8001";

const colorSchema = z.object({
  hex: z.string(),
  percentage: z.number(),
});

const outfitItemSchema = z.object({
  clothing_type: z.string(),
  category_id: z.number().optional(),
  material: z.string(),
  formality_score: z.number(),
  weather_warmth: z.number().optional(),
  colors: z.array(colorSchema),
  image_path: z.string(),
  visual_embedding: z.array(z.number()).optional(),
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

    const user_id = "default_user";
    const userProfileCollection = await getUserProfileCollection();
    const profile = await userProfileCollection.findOne({ user_id });

    const contextWithPrefs = {
      ...parsed.data.context,
      user_centroid: profile?.preferences?.user_centroid,
      alpha: profile?.preferences?.alpha,
      beta: profile?.preferences?.beta,
    };

    const response = await fetch(`${pythonModelUrl}/recommend/full`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context: contextWithPrefs,
        outfit: parsed.data.outfit,
      }),
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
      context: parsed.data.context as any,
      outfit: parsed.data.outfit as any,
      recommendations: data.recommendations,
      created_at: new Date(),
    } as any);

    console.log("[recommend] inserted id:", insertResult.insertedId);

    const count = await collection.countDocuments();
    console.log("[recommend] recommendation_runs count:", count);

    res.json({ ...data, run_id: insertResult.insertedId });
  } catch (error) {
    console.error("recommend/full error:", error);
    res.status(500).json({ message: "failed to generate recommendations" });
  }
}

const recommendFromPoolSchema = z.object({
  context: z.object({
    occasion: z.string().min(1),
    style_intent: z.string().min(1),
    weather: z.string().optional().nullable(),
  }),
  query: z.string().min(1),
  uploaded_outfit: z.object({
    items: z.array(outfitItemSchema),
    source_image_path: z.string().optional(),
  }).optional(),
});

export async function handleRecommendFromWardrobe(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsed = recommendFromPoolSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "invalid request body",
        errors: parsed.error.flatten(),
      });
      return;
    }

    const wardrobeCollection = await getWardrobeCollection();
    const pool = await wardrobeCollection.find({ "status.is_active": true }).toArray();

    // Map DB items to the format Python expects
    const mlPool = pool.map((item) => ({
      clothing_type: item.core_info.category,
      category_id: item.ml_features.category_id,
      material: item.attributes.material,
      formality_score: item.ml_features.formality_score,
      weather_warmth: item.ml_features.weather_warmth,
      colors: item.ml_features.dominant_colors,
      image_path: item.image_url.replace("/uploads/", ""),
      visual_embedding: item.ml_features.visual_embedding,
    }));

    const user_id = "default_user";
    const userProfileCollection = await getUserProfileCollection();
    const profile = await userProfileCollection.findOne({ user_id });

    const contextWithPrefs = {
      ...parsed.data.context,
      user_centroid: profile?.preferences?.user_centroid,
      alpha: profile?.preferences?.alpha,
      beta: profile?.preferences?.beta,
    };

    const response = await fetch(`${pythonModelUrl}/recommend/from-pool`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context: contextWithPrefs,
        query: parsed.data.query,
        pool: mlPool,
        uploaded_outfit: parsed.data.uploaded_outfit,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    const collection = await getRecommendationRunsCollection();
    const insertResult = await collection.insertOne({
      context: parsed.data.context as any,
      query: parsed.data.query,
      outfit: parsed.data.uploaded_outfit || { items: [] },
      recommendations: data.recommendations,
      created_at: new Date(),
    } as any);

    res.json({ ...data, run_id: insertResult.insertedId });
  } catch (error) {
    console.error("recommend/from-wardrobe error:", error);
    res.status(500).json({ message: "failed to generate recommendations" });
  }
}

export async function handleGetHistory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const collection = await getRecommendationRunsCollection();
    const history = await collection
      .find({})
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    res.json(history);
  } catch (error) {
    console.error("get history error:", error);
    res.status(500).json({ message: "failed to fetch history" });
  }
}

export async function handleDeleteHistory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({ message: "invalid history item id" });
      return;
    }

    const collection = await getRecommendationRunsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "history item not found" });
      return;
    }

    res.json({ message: "history item deleted" });
  } catch (error) {
    console.error("delete history error:", error);
    res.status(500).json({ message: "failed to delete history item" });
  }
}

import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getWardrobeCollection } from "../db";
import type { WardrobeItemDoc } from "../types";

const pythonModelUrl = process.env.PYTHON_MODEL_URL ?? "http://127.0.0.1:8001";

export async function handleAddFromImage(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "image file is required" });
      return;
    }

    const form = new FormData();
    form.append(
      "image",
      new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
      file.originalname || "upload.jpg",
    );

    const mlResponse = await fetch(`${pythonModelUrl}/analyze-outfit`, {
      method: "POST",
      body: form,
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.json();
      res.status(mlResponse.status).json(errorData);
      return;
    }

    const data = await mlResponse.json();
    
    // Return the analyzed items for user confirmation
    const items = data.items.map((item: any) => ({
      image_url: `/uploads/${item.image_path}`,
      core_info: {
        name: item.category_name || `New ${item.clothing_type}`,
        category: item.clothing_type,
        formality: item.formality_score > 0.5 ? "formal" : "casual",
        primary_color: item.colors[0]?.hex || "#ffffff",
        secondary_color: item.colors[1]?.hex || "#ffffff",
      },
      attributes: {
        material: item.material || "unknown",
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        tags: [],
      },
      ml_features: {
        visual_embedding: item.visual_embedding,
        dominant_colors: item.colors,
        weather_warmth: item.weather_warmth,
        formality_score: item.formality_score,
        category_id: item.category_id,
        confidence: item.confidence,
      },
    }));

    res.json({ 
      items,
      outfit_embedding: data.outfit_embedding,
      s_style: data.s_style,
      s_rel: data.s_rel
    });
  } catch (error) {
    console.error("wardrobe/analyze error:", error);
    res.status(500).json({ message: "failed to analyze image" });
  }
}

export async function handleBulkAddItems(req: Request, res: Response): Promise<void> {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      res.status(400).json({ message: "items array is required" });
      return;
    }

    const collection = await getWardrobeCollection();
    const itemsToInsert: WardrobeItemDoc[] = items.map((item: any) => ({
      ...item,
      owner_user_id: "user_101010",
      status: {
        is_active: true,
        created_at: new Date(),
      },
    }));

    if (itemsToInsert.length > 0) {
      await collection.insertMany(itemsToInsert);
    }

    res.json({ 
      message: `Added ${itemsToInsert.length} items to wardrobe`,
      items: itemsToInsert 
    });
  } catch (error) {
    console.error("wardrobe/bulk-add error:", error);
    res.status(500).json({ message: "failed to save items" });
  }
}

export async function handleGetWardrobe(req: Request, res: Response): Promise<void> {
  try {
    const collection = await getWardrobeCollection();
    const items = await collection.find({ "status.is_active": true }).toArray();
    res.json(items);
  } catch (error) {
    console.error("wardrobe/get error:", error);
    res.status(500).json({ message: "failed to fetch wardrobe" });
  }
}

export async function handleDeleteWardrobeItems(req: Request, res: Response): Promise<void> {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      res.status(400).json({ message: "ids array is required" });
      return;
    }

    const collection = await getWardrobeCollection();
    
    // Filter out invalid IDs and convert valid ones to ObjectIds
    const objectIds: ObjectId[] = [];
    for (const id of ids) {
      if (id && ObjectId.isValid(id)) {
        objectIds.push(new ObjectId(id));
      } else {
        console.warn(`Skipping invalid ObjectId: ${id}`);
      }
    }

    if (objectIds.length === 0) {
      res.json({ message: "No valid items to delete", modifiedCount: 0 });
      return;
    }

    // Soft delete by setting is_active to false
    const result = await collection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { "status.is_active": false } }
    );

    res.json({ message: `Deleted ${result.modifiedCount} items` });
  } catch (error) {
    console.error("wardrobe/delete error:", error);
    res.status(500).json({ message: "failed to delete wardrobe items" });
  }
}

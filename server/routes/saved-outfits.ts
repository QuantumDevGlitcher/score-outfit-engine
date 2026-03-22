import type { Request, Response } from "express";
import { getSavedOutfitsCollection } from "../db";
import type { Recommendation } from "../types";
import { ObjectId } from "mongodb";

export async function handleSaveOutfit(req: Request, res: Response): Promise<void> {
  try {
    const outfit: Recommendation = req.body.outfit;
    if (!outfit) {
      res.status(400).json({ message: "outfit is required" });
      return;
    }

    const user_id = "default_user";
    const savedOutfitsCollection = await getSavedOutfitsCollection();

    const newSavedOutfit = {
      user_id,
      outfit,
      created_at: new Date(),
    };

    await savedOutfitsCollection.insertOne(newSavedOutfit);

    res.json({ message: "outfit saved successfully" });
  } catch (error) {
    console.error("save outfit error:", error);
    res.status(500).json({ message: "failed to save outfit" });
  }
}

export async function handleGetSavedOutfits(req: Request, res: Response): Promise<void> {
  try {
    const user_id = "default_user";
    const savedOutfitsCollection = await getSavedOutfitsCollection();

    const savedOutfits = await savedOutfitsCollection
      .find({ user_id })
      .sort({ created_at: -1 })
      .toArray();

    res.json(savedOutfits);
  } catch (error) {
    console.error("get saved outfits error:", error);
    res.status(500).json({ message: "failed to fetch saved outfits" });
  }
}

export async function handleDeleteSavedOutfit(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({ message: "invalid outfit id" });
      return;
    }

    const savedOutfitsCollection = await getSavedOutfitsCollection();
    const result = await savedOutfitsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "outfit not found" });
      return;
    }

    res.json({ message: "outfit deleted successfully" });
  } catch (error) {
    console.error("delete saved outfit error:", error);
    res.status(500).json({ message: "failed to delete outfit" });
  }
}

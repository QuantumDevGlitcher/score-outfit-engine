import type { Request, Response } from "express";
import { z } from "zod";
import { getUserProfileCollection } from "../db";

const pythonModelUrl = process.env.PYTHON_MODEL_URL ?? "http://127.0.0.1:8001";

const feedbackSchema = z.object({
  session_id: z.string(),
  outfit_embedding: z.array(z.number()),
  liked: z.boolean(),
  s_style: z.number(),
  s_rel: z.number(),
});

export async function handleFeedback(req: Request, res: Response): Promise<void> {
  try {
    const parsed = feedbackSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "invalid feedback payload", errors: parsed.error.flatten() });
      return;
    }

    const user_id = "default_user";
    const userProfileCollection = await getUserProfileCollection();
    const profile = await userProfileCollection.findOne({ user_id });

    const payload = {
      ...parsed.data,
      user_centroid: profile?.preferences?.user_centroid,
      alpha: profile?.preferences?.alpha,
      beta: profile?.preferences?.beta,
    };

    const response = await fetch(`${pythonModelUrl}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    // Update profile in DB
    await userProfileCollection.updateOne(
      { user_id },
      {
        $set: {
          preferences: {
            alpha: data.new_alpha,
            beta: data.new_beta,
            user_centroid: data.new_user_centroid,
          },
          updated_at: new Date(),
        },
      },
      { upsert: true }
    );

    res.json(data);
  } catch (error) {
    console.error("feedback error:", error);
    res.status(500).json({ message: "failed to update feedback" });
  }
}

import type { Request, Response } from "express";

const pythonModelUrl = process.env.PYTHON_MODEL_URL ?? "http://127.0.0.1:8001";

export async function handleAnalyzeOutfit(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "image file is required" });
      return;
    }

    if (!file.mimetype.startsWith("image/")) {
      res.status(400).json({ message: "uploaded file must be an image" });
      return;
    }

    const form = new FormData();
    form.append(
      "image",
      new Blob([file.buffer], { type: file.mimetype }),
      file.originalname || "upload.jpg",
    );

    const response = await fetch(`${pythonModelUrl}/analyze-outfit`, {
      method: "POST",
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    res.json(data);
  } catch (error) {
    console.error("analyze-outfit error:", error);
    res.status(500).json({ message: "failed to analyze outfit" });
  }
}

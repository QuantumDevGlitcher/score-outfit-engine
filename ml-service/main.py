from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
from uuid import uuid4
from PIL import Image
import io
import os

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / os.getenv("UPLOAD_DIR", "public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="SCORE ML Service")


class Color(BaseModel):
    rgb: List[int]
    confidence: Optional[float] = None


class OutfitItem(BaseModel):
    clothing_type: str
    material: str
    formality_score: float
    colors: List[Color]
    image_path: str


class CurrentOutfitRepresentation(BaseModel):
    items: List[OutfitItem]
    source_image_path: Optional[str] = None


class ContextInput(BaseModel):
    occasion: str
    style_intent: str
    weather: Optional[str] = None


class RecommendFullRequest(BaseModel):
    context: ContextInput
    outfit: CurrentOutfitRepresentation


class Recommendation(BaseModel):
    items: List[OutfitItem]
    compatibility_score: float
    color_harmony: Optional[float] = None
    formality_match: Optional[float] = None
    material_compat: Optional[float] = None
    weather_compat: Optional[float] = None
    style_tips: Optional[List[str]] = None
    explanation: Optional[str] = None


class RecommendFullResponse(BaseModel):
    recommendations: List[Recommendation]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze-outfit", response_model=CurrentOutfitRepresentation)
async def analyze_outfit(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="uploaded file must be an image")

    session_id = uuid4().hex
    session_dir = UPLOAD_DIR / session_id
    session_dir.mkdir(parents=True, exist_ok=True)

    ext = Path(image.filename or "upload.jpg").suffix or ".jpg"
    original_path = session_dir / f"original{ext}"

    content = await image.read()
    original_path.write_bytes(content)

    img = Image.open(io.BytesIO(content)).convert("RGB")

    crop_top = session_dir / "crop_top.jpg"
    crop_bottom = session_dir / "crop_bottom.jpg"

    # Temporary stub: duplicate the same image as fake crops
    img.save(crop_top)
    img.save(crop_bottom)

    return CurrentOutfitRepresentation(
        source_image_path=f"{session_id}/original{ext}",
        items=[
            OutfitItem(
                clothing_type="shirt",
                material="cotton",
                formality_score=0.72,
                colors=[Color(rgb=[240, 240, 240], confidence=0.95)],
                image_path=f"{session_id}/crop_top.jpg",
            ),
            OutfitItem(
                clothing_type="pants",
                material="wool",
                formality_score=0.64,
                colors=[Color(rgb=[40, 40, 40], confidence=0.92)],
                image_path=f"{session_id}/crop_bottom.jpg",
            ),
        ],
    )


@app.post("/recommend/full", response_model=RecommendFullResponse)
def recommend_full(payload: RecommendFullRequest):
    if not payload.outfit.items:
        raise HTTPException(status_code=400, detail="outfit.items is required")

    return RecommendFullResponse(
        recommendations=[
            Recommendation(
                items=payload.outfit.items,
                compatibility_score=0.91,
                color_harmony=0.84,
                formality_match=0.88,
                material_compat=0.79,
                weather_compat=0.82,
                style_tips=["Good neutral base for the chosen context."],
                explanation=f"Recommended for {payload.context.occasion} with a {payload.context.style_intent} style.",
            )
        ]
    )
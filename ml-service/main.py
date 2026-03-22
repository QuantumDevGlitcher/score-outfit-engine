import io
import os
import torch
import numpy as np

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
from uuid import uuid4
from PIL import Image

from perception_layer.clothing_detection_yolo_backup.inference import GarmentDetector
from perception_layer.multi_attribute_classifire.inference import AttributePredictor
from representation_layer.visual_embeddings.inference import GarmentEmbedder
from recomendation_engine.brain_engine import FashionBrain
from perception_layer.color_utils import quantize_colors, harmony_score_from_images
from semantic_processing.query_vectorization.query_vectorizer import QueryVectorizer
from semantic_processing.intent_filter_extractor.IntentExtractor import IntentExtractor


BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / os.getenv("UPLOAD_DIR", "public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

detector = GarmentDetector()  # loads YOLOS and processor

# Initialize Advanced ML components
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# 1. Perception: Attribute Classifier
ATTR_MODEL_PATH = Path(__file__).parent / "perception_layer" / "multi_attribute_classifire" / "runs2" / "1b" / "best_model.pt"
attribute_predictor = AttributePredictor(str(ATTR_MODEL_PATH), device=DEVICE)

# 2. Representation: Visual Embeddings (Student CLIP)
EMBED_MODEL_PATH = Path(__file__).parent / "representation_layer" / "visual_embeddings" / "best_student_model.pth"
garment_embedder = GarmentEmbedder(str(EMBED_MODEL_PATH), device=DEVICE)

# 3. Semantic Processing (Surprises!)
MODEL_PATH = Path(__file__).parent / "semantic_processing" / "query_vectorization" / "distilled_query_encoder.pth"
vectorizer = QueryVectorizer(model_path=str(MODEL_PATH))
intent_extractor = IntentExtractor(vectorizer=vectorizer)

# 4. Recommendation Engine (The Brain)
STYLIST_MODEL_PATH = Path(__file__).parent / "recomendation_engine" / "best_stylist.pth"
WARDROBE_PATH = Path(__file__).parent / "dummy_wardrobe.pth"
if not WARDROBE_PATH.exists():
    import torch
    torch.save({'pool': []}, str(WARDROBE_PATH))

brain = FashionBrain(str(STYLIST_MODEL_PATH), str(WARDROBE_PATH), device=DEVICE)

# Map Fashionpedia categories to project-specific slots
CATEGORY_MAP = {
    # Tops
    'shirt, blouse': 'top',
    'top, t-shirt, sweatshirt': 'top',
    'sweater': 'top',
    'cardigan': 'top',
    'dress': 'top',
    'jumpsuit': 'top',
    # Bottoms
    'pants': 'bottom',
    'shorts': 'bottom',
    'skirt': 'bottom',
    # Outerwear
    'jacket': 'outerwear',
    'vest': 'outerwear',
    'coat': 'outerwear',
    'cape': 'outerwear',
    # Shoes
    'shoe': 'shoes',
    # Accessories
    'glasses': 'accessories',
    'hat': 'accessories',
    'headband, head covering, hair accessory': 'accessories',
    'tie': 'accessories',
    'glove': 'accessories',
    'watch': 'accessories',
    'belt': 'accessories',
    'bag, wallet': 'accessories',
    'scarf': 'accessories',
    'umbrella': 'accessories',
}

app = FastAPI(title="SCORE ML Service")


class Color(BaseModel):
    hex: str
    percentage: float

class OutfitItem(BaseModel):
    clothing_type: str
    category_id: int
    category_name: Optional[str] = None
    material: str
    formality_score: float
    weather_warmth: float
    colors: List[Color]
    image_path: str
    visual_embedding: Optional[List[float]] = None
    confidence: Optional[float] = None


class CurrentOutfitRepresentation(BaseModel):
    items: List[OutfitItem]
    source_image_path: Optional[str] = None
    outfit_embedding: Optional[List[float]] = None
    s_style: Optional[float] = None
    s_rel: Optional[float] = None


class ContextInput(BaseModel):
    occasion: str
    style_intent: str
    weather: Optional[str] = None
    user_centroid: Optional[List[float]] = None
    alpha: Optional[float] = None
    beta: Optional[float] = None


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
    intents: Optional[dict] = None
    filters: Optional[dict] = None
    outfit_embedding: Optional[List[float]] = None
    s_style: Optional[float] = None
    s_rel: Optional[float] = None


class RecommendFullResponse(BaseModel):
    recommendations: List[Recommendation]


class RecommendFromPoolRequest(BaseModel):
    context: ContextInput
    query: str
    pool: List[OutfitItem]
    uploaded_outfit: Optional[CurrentOutfitRepresentation] = None


# Ideal scores for various context/style combinations
# format: (occasion, style_intent) -> {'formality': float, 'tips': list[str]}
STYLE_RULES = {
    ("Formal", "Elegant"): {"formality": 0.9, "tips": ["Focus on clean lines and high-quality materials.", "Stick to a refined color palette."]},
    ("Formal", "Classic"): {"formality": 0.85, "tips": ["Timeless silhouettes are your best friend.", "Classic navy, black, or grey are always safe."]},
    ("Work", "Minimal"): {"formality": 0.7, "tips": ["Less is more. Avoid distracting patterns.", "Neutral tones create a professional, focused look."]},
    ("Work", "Classic"): {"formality": 0.75, "tips": ["Structured pieces like blazers add instant professionalism."]},
    ("Casual", "Relaxed"): {"formality": 0.2, "tips": ["Prioritize comfort without sacrificing fit.", "Loose but intentional layering works well here."]},
    ("Casual", "Minimal"): {"formality": 0.3, "tips": ["A high-quality t-shirt and well-fitting denim go a long way."]},
    ("Date Night", "Elegant"): {"formality": 0.7, "tips": ["Add a subtle touch of color or a unique accessory.", "Balanced proportions create an appealing silhouette."]},
    ("University", "Relaxed"): {"formality": 0.25, "tips": ["Layering is key for changing environments."]},
    ("Gym", "Sporty"): {"formality": 0.1, "tips": ["Technical fabrics are essential for performance."]},
    # New combinations from UI
    ("Formal", "Bold"): {"formality": 0.85, "tips": ["Make a statement with a unique piece while keeping the silhouette formal."]},
    ("Work", "Elegant"): {"formality": 0.75, "tips": ["Polished and professional. Silk blends and tailored fits work great."]},
    ("Casual", "Classic"): {"formality": 0.4, "tips": ["Chinos and a polo create a timeless casual look."]},
    ("Date Night", "Bold"): {"formality": 0.65, "tips": ["Express your personality with a standout color or pattern."]},
    ("University", "Minimal"): {"formality": 0.3, "tips": ["Simple, clean essentials that transition from lecture to social."]}
}


def calculate_color_harmony(images: List[Image.Image]) -> float:
    """Real color harmony calculation using K-Means."""
    if not images:
        return 0.0
    return harmony_score_from_images(images)


@app.post("/recommend/full", response_model=RecommendFullResponse)
def get_recommendation(payload: RecommendFullRequest):
    """The full recommendation engine endpoint."""
    rec = calculate_recommendation(payload)
    return RecommendFullResponse(recommendations=[rec])


def calculate_recommendation(payload: RecommendFullRequest) -> Recommendation:
    context = payload.context
    outfit = payload.outfit

    # Apply user preferences if provided
    if context.user_centroid is not None:
        brain.user_centroid = torch.tensor([context.user_centroid]).to(DEVICE)
    if context.alpha is not None:
        brain.alpha = context.alpha
    if context.beta is not None:
        brain.beta = context.beta
    
    # 1. Semantic Intent Extraction (The Surprise!)
    query = f"{context.occasion} occasion, {context.style_intent} style"
    if context.weather:
        query += f", {context.weather} weather"
        
    semantic_result = intent_extractor.extract(query)
    extracted_intents = semantic_result["intent_scores"]
    semantic_filters = semantic_result["filters"]
    query_vec = semantic_result["query_vec"] # This is (1, 512)
    
    # 2. Advanced Scoring using FashionBrain (Set-Transformer)
    item_vecs = []
    item_cats = []
    item_images = []
    
    for item in outfit.items:
        if item.visual_embedding:
            item_vecs.append(torch.tensor(item.visual_embedding))
            item_cats.append(item.category_id)
            # Try to load image for color harmony if path exists
            full_crop_path = UPLOAD_DIR / item.image_path
            if full_crop_path.exists():
                item_images.append(Image.open(full_crop_path).convert("RGB"))

    if not item_vecs:
         # Fallback to simple logic if no embeddings
         avg_formality = sum(item.formality_score for item in outfit.items) / len(outfit.items)
         formality_match = 1.0 - abs(avg_formality - (semantic_filters["min_formality"] or 0.5))
         color_harmony = 0.7
         weather_compat = 0.7
         compatibility_score = (formality_match * 0.5) + (color_harmony * 0.5)
         outfit_embedding = [0.0] * 128
    else:
        # Use brain to score
        # items param in score_outfit expects a list of dicts with 'vec' and 'cat'
        brain_items = [{'vec': v, 'cat': c} for v, c in zip(item_vecs, item_cats)]
        # We need query_vec as tensor
        q_vec_tensor = torch.from_numpy(query_vec).to(DEVICE) if isinstance(query_vec, np.ndarray) else query_vec.to(DEVICE)
        
        # score_outfit returns final_score, outfit_emb
        # Note: final_score in brain_engine is (alpha * s_style) + (beta * s_rel)
        comp_score, outfit_emb_tensor = brain.score_outfit(brain_items, q_vec_tensor)
        compatibility_score = comp_score
        outfit_embedding = outfit_emb_tensor.squeeze().tolist()
        
        # Recalculate sub-scores for the UI breakdown
        dist = torch.norm(outfit_emb_tensor - brain.user_centroid, p=2).item()
        s_style = 1.0 / (1.0 + dist)
        s_rel = sum(torch.nn.functional.cosine_similarity(i['vec'].unsqueeze(0).to(DEVICE), q_vec_tensor, dim=1).item() for i in brain_items) / len(brain_items)
        
        formality_match = s_rel # Using relevance as a proxy for formality/context match
        color_harmony = calculate_color_harmony(item_images) if item_images else 0.8
        weather_compat = 0.8 # TODO: improve with attribute predictions

    # Find matching style rule for tips
    rule = STYLE_RULES.get((context.occasion, context.style_intent))
    tips = rule["tips"] if rule else ["The Set-Transformer thinks this fits your vibe."]
    
    return Recommendation(
        items=outfit.items,
        compatibility_score=round(compatibility_score, 2),
        color_harmony=round(color_harmony, 2),
        formality_match=round(formality_match, 2),
        weather_compat=round(weather_compat, 2),
        style_tips=tips,
        explanation=f"This outfit is a {int(compatibility_score*100)}% match for your {context.occasion} occasion.",
        intents=extracted_intents,
        filters=semantic_filters,
        outfit_embedding=outfit_embedding,
        s_style=round(s_style, 2) if 's_style' in locals() else 0.5,
        s_rel=round(s_rel, 2) if 's_rel' in locals() else 0.5
    )


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
    original_name = f"original{ext}"
    original_path = session_dir / original_name

    content = await image.read()
    original_path.write_bytes(content)

    img = Image.open(io.BytesIO(content)).convert("RGB")
    
    # run detection at desired threshold
    detections = detector.predict(img, threshold=0.5)

    items = []
    for idx, det in enumerate(detections):
        category_id = det.get("category_id", 0)
        category_name = det["category_name"]  # e.g. "shirt, blouse"
        
        # Map Fashionpedia category to generic slot
        mapped_type = CATEGORY_MAP.get(category_name, category_name)
        if category_name in ['dress', 'jumpsuit']:
            mapped_type = 'top'
        
        cropped_img: Image.Image = det["image"]
        
        # 1. Attribute Prediction (Advanced)
        attr_results = attribute_predictor.predict(cropped_img, category_id=category_id)
        
        # 2. Visual Embedding (Advanced)
        visual_emb = garment_embedder.embed_crop(cropped_img)
        visual_emb_list = visual_emb.squeeze().tolist()
        
        # 3. Color Extraction (Advanced)
        color_data = quantize_colors(cropped_img, k=3)
        colors = [Color(hex=c[0], percentage=c[1]) for c in color_data]
        
        # Save the crop
        crop_name = f"crop_{idx}.jpg"
        crop_path = session_dir / crop_name
        cropped_img.save(crop_path)
        
        items.append(
            OutfitItem(
                clothing_type=mapped_type,
                category_id=category_id,
                category_name=category_name,
                material="unknown",
                formality_score=attr_results["formality_score"],
                weather_warmth=attr_results["weather_warmth"],
                colors=colors,
                image_path=f"{session_id}/{crop_name}",
                visual_embedding=visual_emb_list,
                confidence=det["confidence"]
            )
        )

    # Calculate Outfit Embedding and Sub-scores if items were detected
    outfit_embedding = None
    s_style = 0.5
    s_rel = 0.5

    if items:
        # We can calculate the embedding from the items
        item_vecs = torch.stack([torch.tensor(i.visual_embedding) for i in items if i.visual_embedding]).unsqueeze(0).to(DEVICE)
        item_cats = torch.tensor([i.category_id for i in items if i.visual_embedding]).unsqueeze(0).to(DEVICE)
        
        if item_vecs.shape[1] > 0:
            with torch.no_grad():
                outfit_emb_tensor = brain.stylist(item_vecs, item_cats)
                outfit_embedding = outfit_emb_tensor.squeeze().tolist()
                
                # Style score (distance from centroid)
                dist = torch.norm(outfit_emb_tensor - brain.user_centroid, p=2).item()
                s_style = 1.0 / (1.0 + dist)
                # s_rel is neutral since there's no context
                s_rel = 0.5

    return CurrentOutfitRepresentation(
        source_image_path=f"{session_id}/{original_name}",
        items=items,
        outfit_embedding=outfit_embedding,
        s_style=round(s_style, 2),
        s_rel=round(s_rel, 2)
    )


class FeedbackRequest(BaseModel):
    session_id: str
    outfit_embedding: List[float]
    liked: bool
    s_style: float
    s_rel: float
    user_centroid: Optional[List[float]] = None
    alpha: Optional[float] = None
    beta: Optional[float] = None

@app.post("/feedback")
def update_feedback(payload: FeedbackRequest):
    # Initialize brain with user preferences if provided
    if payload.user_centroid is not None:
        brain.user_centroid = torch.tensor([payload.user_centroid]).to(DEVICE)
    if payload.alpha is not None:
        brain.alpha = payload.alpha
    if payload.beta is not None:
        brain.beta = payload.beta

    outfit_emb = torch.tensor([payload.outfit_embedding]).to(DEVICE)
    brain.update_feedback(outfit_emb, payload.liked, payload.s_style, payload.s_rel)
    return {
        "status": "updated",
        "new_alpha": brain.alpha,
        "new_beta": brain.beta,
        "new_user_centroid": brain.user_centroid.squeeze().tolist()
    }


@app.post("/recommend/from-pool", response_model=RecommendFullResponse)
def recommend_from_pool(payload: RecommendFromPoolRequest):
    # Apply user preferences if provided
    if payload.context.user_centroid is not None:
        brain.user_centroid = torch.tensor([payload.context.user_centroid]).to(DEVICE)
    if payload.context.alpha is not None:
        brain.alpha = payload.context.alpha
    if payload.context.beta is not None:
        brain.beta = payload.context.beta

    # 1. Text Query Processing
    q_vec = vectorizer.vectorize(payload.query)
    q_vec_tensor = torch.tensor(q_vec).to(DEVICE)
    extracted_intents = intent_extractor.extract_intents(payload.query)
    semantic_filters = intent_extractor.map_to_filters(extracted_intents)

    recommendations = []

    # 1a. Score uploaded outfit if provided
    if payload.uploaded_outfit and payload.uploaded_outfit.items:
        o_items = []
        for item in payload.uploaded_outfit.items:
            if item.visual_embedding:
                o_items.append({
                    'vec': torch.tensor(item.visual_embedding).to(DEVICE),
                    'cat': item.category_id or 0,
                    'orig_item': item
                })
        
        if o_items:
            comp_score, outfit_emb_tensor = brain.score_outfit(o_items, q_vec_tensor)
            s_rel = sum(torch.nn.functional.cosine_similarity(i['vec'].unsqueeze(0), q_vec_tensor, dim=1).item() for i in o_items) / len(o_items)
            
            # Sub-scores for feedback
            dist = torch.norm(outfit_emb_tensor - brain.user_centroid, p=2).item()
            s_style = 1.0 / (1.0 + dist)

            rule = STYLE_RULES.get((payload.context.occasion, payload.context.style_intent))
            tips = rule["tips"] if rule else ["Analysis of your uploaded outfit."]

            recommendations.append(Recommendation(
                items=[i['orig_item'] for i in o_items],
                compatibility_score=round(comp_score, 2),
                color_harmony=0.8,
                formality_match=round(s_rel, 2),
                weather_compat=0.8,
                style_tips=tips,
                explanation=f"Your uploaded outfit is a {int(comp_score*100)}% match.",
                outfit_embedding=outfit_emb_tensor.squeeze().tolist(),
                s_style=round(s_style, 2),
                s_rel=round(s_rel, 2)
            ))

    # 2. Map pool to brain format
    pool_items = []
    for item in payload.pool:
        if item.visual_embedding is None: continue
        pool_items.append({
            'vec': torch.tensor(item.visual_embedding).to(DEVICE),
            'cat': item.category_id or 0,
            'warmth': item.weather_warmth,
            'formality': item.formality_score,
            'orig_item': item
        })

    # 3. Gatekeeper filtering
    candidates = brain.gatekeeper_filter(q_vec_tensor, semantic_filters, pool=pool_items, top_k=40)

    # 4. Outfit Generation (Permutations: Top + Bottom + Shoes)
    tops = [c for c in candidates if c['orig_item'].clothing_type == 'top']
    bottoms = [c for c in candidates if c['orig_item'].clothing_type == 'bottom']
    shoes = [c for c in candidates if c['orig_item'].clothing_type == 'shoes']

    if tops and bottoms:
        if not shoes:
            shoes = tops[:1] # extremely hacky fallback

        outfit_candidates = []
        # Limit combinations for performance
        import itertools
        for t, b, s in itertools.islice(itertools.product(tops[:5], bottoms[:5], shoes[:5]), 10):
            outfit_candidates.append([t, b, s])

        # 5. Score outfits from pool
        for o_items in outfit_candidates:
            comp_score, outfit_emb_tensor = brain.score_outfit(o_items, q_vec_tensor)
            
            # Calculate sub-scores
            dist = torch.norm(outfit_emb_tensor - brain.user_centroid, p=2).item()
            s_style = 1.0 / (1.0 + dist)
            s_rel = sum(torch.nn.functional.cosine_similarity(i['vec'].unsqueeze(0), q_vec_tensor, dim=1).item() for i in o_items) / len(o_items)
            
            color_harmony = 0.8 

            rule = STYLE_RULES.get((payload.context.occasion, payload.context.style_intent))
            tips = rule["tips"] if rule else ["Great combination for your vibe."]

            recommendations.append(Recommendation(
                items=[i['orig_item'] for i in o_items],
                compatibility_score=round(comp_score, 2),
                color_harmony=round(color_harmony, 2),
                formality_match=round(s_rel, 2),
                weather_compat=0.8,
                style_tips=tips,
                explanation=f"This generated outfit is a {int(comp_score*100)}% match for your request.",
                outfit_embedding=outfit_emb_tensor.squeeze().tolist(),
                s_style=round(s_style, 2),
                s_rel=round(s_rel, 2)
            ))

    # Sort and return top recommendations (keeping uploaded one if it was first)
    # Actually, let's keep the uploaded one at the top if it exists.
    if payload.uploaded_outfit and recommendations:
        uploaded_rec = recommendations[0]
        others = recommendations[1:]
        others.sort(key=lambda x: x.compatibility_score, reverse=True)
        return RecommendFullResponse(recommendations=[uploaded_rec] + others[:3])

    recommendations.sort(key=lambda x: x.compatibility_score, reverse=True)
    return RecommendFullResponse(recommendations=recommendations[:4])
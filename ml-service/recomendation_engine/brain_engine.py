import torch
import torch.nn.functional as F
from typing import List, Dict
from .model import OutfitEmbeddingTransformer


class FashionBrain:
    def __init__(self, model_path: str, wardrobe_path: str, device: str = "cpu", user_centroid: torch.Tensor = None, alpha: float = 0.6, beta: float = 0.4):
        self.device = torch.device(device)
        self.stylist = OutfitEmbeddingTransformer().to(self.device)
        self.stylist.load_state_dict(torch.load(model_path, map_location=self.device))
        self.stylist.eval()

        data = torch.load(wardrobe_path)
        self.wardrobe = data['pool']

        # User Centroid mapping their specific taste in the 128-dim hypersphere
        if user_centroid is not None:
            self.user_centroid = user_centroid.to(self.device)
        else:
            self.user_centroid = torch.randn(1, 128).to(self.device)
            self.user_centroid = F.normalize(self.user_centroid, p=2, dim=1)

        self.alpha = alpha  # Weight for Aesthetic Style
        self.beta = beta    # Weight for Query Relevance
        self.eta = 0.15     # Learning rate

    def gatekeeper_filter(self, query_vec: torch.Tensor, context: Dict, pool: List[Dict] = None, top_k: int = 40):
        candidates = []
        items_to_scan = pool if pool is not None else self.wardrobe
        
        # Hybrid weights
        rel_weight = context.get('relevance_weight', 0.5)
        attr_weight = context.get('attribute_weight', 0.5)

        for item in items_to_scan:
            # Hard filtering (pruning)
            # Prune based on extreme warmth/formality mismatch
            if abs(item.get('warmth', 0.5) - context.get('warmth_threshold', 0.5)) > 0.4: continue
            if abs(item.get('formality', 0.5) - context.get('formality_threshold', 0.5)) > 0.5: continue

            # Soft scoring (hybrid)
            # 1. Semantic relevance from visual-text embedding similarity
            relevance = F.cosine_similarity(item['vec'].unsqueeze(0).to(self.device), query_vec, dim=1).item()
            
            # 2. Attribute match score
            w_match = 1.0 - abs(item.get('warmth', 0.5) - context.get('warmth_threshold', 0.5))
            f_match = 1.0 - abs(item.get('formality', 0.5) - context.get('formality_threshold', 0.5))
            attr_score = (w_match + f_match) / 2.0
            
            # Hybrid combination
            final_item_score = (rel_weight * relevance) + (attr_weight * attr_score)
            
            candidates.append({'item': item, 'rel': final_item_score})

        candidates.sort(key=lambda x: x['rel'], reverse=True)
        return [c['item'] for c in candidates[:top_k]]

    @torch.no_grad()
    def score_outfit(self, items: List[Dict], query_vec: torch.Tensor):
        item_vecs = torch.stack([i['vec'] for i in items]).unsqueeze(0).to(self.device)
        item_cats = torch.tensor([i['cat'] for i in items]).unsqueeze(0).to(self.device)

        outfit_emb = self.stylist(item_vecs, item_cats)

        dist = torch.norm(outfit_emb - self.user_centroid, p=2).item()
        s_style = 1.0 / (1.0 + dist)
        s_rel = sum(F.cosine_similarity(i['vec'].unsqueeze(0), query_vec, dim=1).item() for i in items) / len(items)

        final_score = (self.alpha * s_style) + (self.beta * s_rel)
        return final_score, outfit_emb

    def update_feedback(self, outfit_emb: torch.Tensor, liked: bool, s_style: float, s_rel: float):
        """Updates User Centroid and Bandit weights based on feedback."""
        reward = 1.0 if liked else -1.0

        # Update Centroid
        if liked:
            self.user_centroid = (1 - self.eta) * self.user_centroid + (self.eta * outfit_emb)
        else:
            direction = outfit_emb - self.user_centroid
            self.user_centroid = self.user_centroid - (self.eta * 0.5 * direction)

        self.user_centroid = F.normalize(self.user_centroid, p=2, dim=1)

        # Update Bandit Weights
        self.alpha += reward * (s_style - 0.5) * 0.1
        self.beta += reward * (s_rel - 0.5) * 0.1

        # Clamp and normalize weights so alpha + beta = 1.0
        total = self.alpha + self.beta
        self.alpha = max(0.1, min(0.9, self.alpha / total))
        self.beta = max(0.1, min(0.9, self.beta / total))
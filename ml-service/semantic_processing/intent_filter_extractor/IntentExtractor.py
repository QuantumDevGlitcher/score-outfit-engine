import torch
import torch.nn.functional as F

class IntentExtractor:
    """
    Zero-shot intent detection using text embedding similarity.
    Converts soft query meaning into hard filtering constraints.
    """

    def __init__(self, vectorizer):
        self.vectorizer = vectorizer

        self.intent_labels = [
            "formal office business setting",
            "casual everyday wear",
            "sport athletic activity",
            "cold winter weather",
            "hot summer weather",
            "rainy wet conditions",
            "comfortable relaxed clothing"
        ]

        # Precompute label embeddings once
        with torch.no_grad():
            self.label_embeddings = self.vectorizer.encode(self.intent_labels)

    def extract_intents(self, query: str):
        query_vec = self.vectorizer.encode(query)
        scores = torch.matmul(query_vec, self.label_embeddings.T)[0]
        probs = F.softmax(scores, dim=-1)
        intent_scores = dict(zip(self.intent_labels, probs.tolist()))
        return {
            "intent_scores": intent_scores,
            "query_vec": query_vec
        }

    def map_to_filters(self, extracted: dict):
        intent_scores = extracted["intent_scores"]
        
        # Hybrid Filtering logic: Combine semantic intents into concrete thresholds
        filters = {
            "formality_threshold": 0.7 if intent_scores["formal office business setting"] > 0.40 else 0.3 if intent_scores["casual everyday wear"] > 0.40 else 0.5,
            "warmth_threshold": 0.3 if intent_scores["hot summer weather"] > 0.40 else 0.8 if intent_scores["cold winter weather"] > 0.40 else 0.5,
            "relevance_weight": 0.6,
            "attribute_weight": 0.4
        }
        return filters
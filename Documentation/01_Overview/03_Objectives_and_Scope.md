# 03 – Objectives and Scope

## 1. Objectives

The objectives of SCORE are:

1. Detect garments and primary colors from input images (utilizing trained model weights) or manual input.
2. Evaluate compatibility using a scoring engine.
3. Provide context-aware recommendations.
4. Generate explainable reasoning.
5. Adapt recommendations based on feedback.

---

## 2. In-Scope (Version 1)

- Manual wardrobe input
- Image-based garment and color detection (utilizing trained and fine-tuned model weights)
- Fuzzy scoring engine
- Context-aware rule adjustments
- React SPA interface
- Express API server
- FastAPI ML service
- Reinforcement-lite feedback update

---

## 3. Feature Maturity Matrix (Version 1)

The following table summarizes the implementation status and maturity of key features in SCORE Version 1.

| Feature                            | Status      | Maturity Level     | Notes                                       |
|------------------------------------|-------------|--------------------|---------------------------------------------|
| Vision-based garment detection     | Implemented | Production-Ready   | Trained weights included; dataset excluded. |
| Manual garment input               | Implemented | Production-Ready   | Reliable fallback/direct entry mode.        |
| Fuzzy scoring engine               | Implemented | Production-Ready   | Core decision logic based on style rules.   |
| Reinforcement-lite personalization | Implemented | Implemented        | Reward-based weight adjustment loop.        |
| React SPA Interface                | Implemented | Production-Ready   | Modern web UI via Vite/TailwindCSS.         |
| Express API & MongoDB              | Implemented | Production-Ready   | Scalable backend and persistence layer.     |
| FastAPI ML Service                 | Implemented | Production-Ready   | Dedicated service for inference/scoring.    |
| Full garment segmentation          | Planned     | Future Enhancement | Targeted for post-v1 releases.              |
| Body shape modeling                | Planned     | Future Enhancement | Targeted for post-v1 releases.              |

---

## 4. Out-of-Scope (Version 1)

- Full garment segmentation
- Fashion trend prediction
- Body-shape modeling
- Social media integration
- Large-scale cloud deployment

---

## 5. Future Enhancements (Post-Version 1)

The following capabilities are considered potential extensions beyond Version 1:

### 4.1 Full Garment Segmentation

Future versions may incorporate semantic segmentation models to:

- Extract pixel-accurate garment masks
- Improve multi-layer clothing detection
- Enhance color extraction precision
- Reduce background interference

This would be implemented within the Perception Adapter layer and would not modify core domain logic.

---

### 4.2 Body Shape Modeling

An advanced extension may include body-shape-aware modeling to:

- Evaluate garment fit suitability
- Improve proportion-based styling recommendations
- Introduce geometry-aware scoring factors

This feature would extend the scoring engine with an additional suitability dimension while maintaining separation of concerns.

---

### 4.3 Advanced Personalization

Future improvements may include:

- Contextual multi-armed bandit optimization
- Preference embedding models
- Long-term reinforcement personalization tracking

---

These enhancements are excluded from Version 1 to maintain academic feasibility and implementation stability.
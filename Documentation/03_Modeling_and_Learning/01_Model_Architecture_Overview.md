# 01 – Model Architecture Overview

## 1. Role of Machine Learning in SCORE

Machine learning in SCORE supports perception.

It is not the primary reasoning mechanism.

ML is responsible for:

- garment classification (Production-Ready)
- color extraction assistance
- feature representation
- potential material inference (future)

Decision logic remains rule-based and fuzzy-driven.

---

## 2. Perception Architecture (Version 1)

Version 1 ML design is lightweight.

Two possible modes:

### Mode A – Manual Input (Guaranteed Stability)
User manually selects:

- garment type
- color
- material
- pattern flag

This ensures scoring logic can be tested independently.

---

### Mode B – Image-Based Detection (Production-Ready)

The image pipeline utilizes trained weights to perform inference on input images:

```text
Input Image
↓
Preprocessing (resize, normalize)
↓
CNN Backbone (pretrained)
↓
Garment Class Prediction
↓
Dominant Color Extraction
↓
Structured Garment Object
```

Pretrained models considered:

- ResNet18 / ResNet34
- MobileNet (lighter)
- EfficientNet (optional)

---

## 3. Why Lightweight Models

The model is expected to:

- remain under 500MB
- run on CPU
- not require GPU

Academic focus is not on maximizing state-of-the-art accuracy 
but on integrating perception into a decision system.

---

## 4. Training Dataset

Dataset size:

~46,000 labeled images

Used for:

- garment category classification
- optional material classification

The dataset is:

- used only for training
- excluded from repository
- not required at runtime

---

## 5. Training Strategy

Proposed split:

- 80% training
- 20% testing

Optional experimentation:

- 10% quick validation experiments
- early-stopping monitoring

Training includes:

- cross-entropy loss
- standard augmentation
- early stopping to prevent overfitting

---

## 6. Model Size vs. Accuracy Tradeoff

Expected model sizes:

- Small backbone: ~100MB
- Medium backbone: ~200–300MB
- Larger backbone: ~400–500MB

Tradeoff considerations:

- Higher accuracy vs. slower CPU inference
- Memory footprint vs. deployability
- Training time vs. marginal accuracy gains

Version 1 prioritizes:

- stability
- reasonable accuracy
- CPU compatibility

---

## 7. Output Representation

The model does not directly produce style decisions.

It outputs structured features:

- garment category
- color vector
- optional material prediction

These features are passed to the scoring engine.

---

## 8. Why ML Is Separated from Scoring

This separation ensures:

- scoring logic remains explainable
- ML errors do not break reasoning architecture
- perception can be replaced without redesigning core logic

SCORE is intentionally hybrid.

---

## 9. Future Enhancements

Possible future improvements:

- garment segmentation models
- pose estimation
- body-shape modeling
- texture classification
- learned harmony scoring

These are not required for Version 1.

---

## 10. Summary

Machine learning in SCORE:

- supports perception using trained weights
- produces structured garment features
- remains isolated from decision logic
- is a core component of the recommendation pipeline in Version 1

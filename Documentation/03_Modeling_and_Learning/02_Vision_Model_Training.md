# 02 – Vision Model Training

## 1. Purpose

This document defines the training pipeline for the garment classification model used in SCORE.

The goal is not to achieve state-of-the-art performance,
but to obtain a stable and reliable perception component
that integrates cleanly with the scoring engine.

---

## 2. Problem Definition

Primary supervised task:

Garment category classification.

Input:
- RGB image of a clothing item or person wearing clothing

Output:
- garment category label (e.g., top, bottom, shoes, outerwear)

Optional secondary tasks:
- material classification (future)
- multi-label classification (future)

---

## 3. Dataset Overview

Dataset size:
~46,000 labeled images

Assumed label types:
- garment category
- possibly material tags

The dataset is used exclusively for training and evaluation.
It is NOT bundled with the application.

---

## 4. Data Split Strategy

Standard split:

- 80% Training
- 20% Testing

Optional additional split:
- 10% subset of training for quick experimentation

Split goals:
- avoid data leakage
- ensure balanced category distribution
- maintain realistic evaluation

---

## 5. Preprocessing Pipeline

Preprocessing steps:

1. Resize images to a fixed input size (e.g., 224x224)
2. Normalize pixel values
3. Optional data augmentation:
   - horizontal flip
   - slight rotation
   - brightness adjustment

Data augmentation improves generalization
without introducing unrealistic distortions.

---

## 6. Model Architecture Candidates

Candidate backbones:

- ResNet18
- ResNet34
- MobileNetV2
- EfficientNet-B0

Version 1 recommendation:
Start with ResNet18 or MobileNet
for a good balance between size and performance.

---

## 7. Loss Function

Primary loss:

Cross-Entropy Loss

If a class imbalance exists:
- weighted cross-entropy may be used

---

## 8. Optimization Strategy

Optimizer:
- Adam or SGD

Learning rate:
- Initial: 1e-3 (example baseline)
- Use scheduler if needed

Early stopping:
- Monitor validation loss
- Stop training if no improvement after N epochs

Batch size:
- Depends on hardware (CPU-friendly)
- Typical: 16–32

---

## 9. Evaluation Metrics

Primary metric:
- Accuracy

Secondary metrics:
- Precision
- Recall
- F1-score
- Confusion matrix

Reason:
Fashion classification errors may not be equally costly.

Example:
Confusing “top” vs. “outerwear” may be less harmful than misclassifying shoes as top.

---

## 10. Model Selection Criteria

Selection based on:

- Validation accuracy
- Inference speed (CPU)
- Model size
- Stability across contexts

Not based solely on the highest accuracy.

---

## 11. Inference Pipeline

During runtime:

1. Load trained model
2. Preprocess input image
3. Predict garment category
4. Extract dominant color (OpenCV-based)
5. Construct Garment domain object

If the model fails:
Fallback to manual input mode.

---

## 12. Overfitting Mitigation

Strategies:

- data augmentation
- early stopping
- dropout (if needed)
- validation monitoring

Version 1 prioritizes stability over extreme optimization.

---

## 13. Reproducibility

Training should document:

- random seed
- model architecture
- optimizer configuration
- number of epochs
- final accuracy

This ensures academic reproducibility.

---

## 14. Limitations

Version 1 training does not include:

- segmentation training
- multi-task learning
- pose estimation
- contrastive learning
- large-scale hyperparameter search

These are future improvements.

---

## 15. Summary

The vision training pipeline is:

- supervised
- lightweight
- reproducible
- CPU-compatible

It provides structured garment features
to the scoring engine without replacing explainable reasoning.

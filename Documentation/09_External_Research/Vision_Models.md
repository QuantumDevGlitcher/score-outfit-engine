# Vision Models – Background Research

## 1. Purpose

This document summarizes relevant research and model families
related to visual garment classification.

The goal is to justify architectural choices in SCORE,
not to reproduce state-of-the-art results.

---

## 2. Convolutional Neural Networks (CNNs)

CNNs are the standard architecture for image classification.

Key properties:

- spatial feature extraction
- translation invariance
- hierarchical feature learning

CNN-based models are well-suited for:

- garment category recognition
- color feature extraction
- material texture recognition (limited)

---

## 3. ResNet Architecture

Reference:
He et al., 2016 – Deep Residual Learning for Image Recognition.

Key idea:

- Residual connections
- Mitigation of vanishing gradients

Advantages:

- stable training
- strong performance
- moderate size (ResNet18, ResNet34)

Reason for consideration in SCORE:

- reliable
- widely validated
- balanced accuracy-to-size ratio

---

## 4. MobileNet

Reference:
Howard et al., 2017 – MobileNets: Efficient CNNs for Mobile Vision Applications.

Key idea:

- depthwise separable convolutions
- lightweight architecture

Advantages:

- small size
- fast inference
- CPU-friendly

Reason for consideration in SCORE:

- suitable for local laptop execution
- lower memory footprint

---

## 5. EfficientNet

Reference:
Tan & Le, 2019 – EfficientNet: Rethinking Model Scaling.

Key idea:

- compound scaling (depth, width, resolution)

Advantages:

- high accuracy for parameter count
- good performance-to-size ratio

Disadvantage:

- slightly more complex
- may increase inference cost

---

## 6. Transfer Learning

Instead of training from scratch,
SCORE uses transfer learning.

Benefits:

- reduced training time
- improved performance with limited dataset
- stable convergence

Pretrained on:

- ImageNet

Fine-tuned for:

- garment classification

---

## 7. Garment Segmentation Research (Future Direction)

Relevant approaches:

- Mask R-CNN
- DeepLab
- U-Net variants

These enable:

- pixel-level segmentation
- multi-garment separation
- layered clothing analysis

Not included in Version 1
due to increased complexity.

---

## 8. Fashion-Specific Datasets in Literature

Common datasets:

- DeepFashion
- Fashion-MNIST
- ModaNet

These datasets are used for:

- garment classification
- attribute recognition
- segmentation

SCORE’s dataset scale (~46k images)
is moderate compared to these.

---

## 9. Model Selection Justification

Given:

- academic scope
- CPU-only deployment
- modular architecture

Lightweight CNN with transfer learning
is most appropriate.

Extremely large models are unnecessary.

---

## 10. Summary

SCORE’s vision component is grounded in:

- established CNN architecture
- transfer learning principles
- efficiency-focused model selection

The system favors architectural balance
over maximal benchmark performance.

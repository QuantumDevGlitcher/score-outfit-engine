# 02 – Data Preprocessing

## 1. Purpose

This document defines the preprocessing pipeline applied to the dataset
before training the vision model.

Preprocessing ensures:

- consistency of input format
- stability during training
- improved generalization
- reduced overfitting

---

## 2. Image Standardization

All images are transformed into a consistent format before training.

### 2.1 Resize

Images are resized to a fixed resolution:

Example:
224 × 224 pixels

Reason:
Pretrained convolutional models expect fixed-size input tensors.

---

### 2.2 Normalization

Pixel values are normalized:

- scaled to [0, 1]
or
- normalized using ImageNet mean and standard deviation

Reason:
Stabilizes gradient descent and improves convergence.

---

## 3. Data Augmentation (Training Only)

Data augmentation is applied only to the training split.

Possible augmentations:

- horizontal flip
- slight rotation
- random crop
- brightness adjustment
- contrast adjustment

Purpose:

- improve robustness to lighting variation
- reduce overfitting
- simulate real-world image conditions

Validation and test data are NOT augmented.

---

## 4. Class Balancing

If the dataset is imbalanced:

Options include:

- weighted loss function
- oversampling minority classes
- undersampling majority classes

Version 1 prioritizes weighted cross-entropy over resampling.

---

## 5. Label Encoding

Garment categories are encoded as:

- integer labels
or
- one-hot vectors (depending on implementation)

Mapping must be stored consistently:

Example:
0 → top  
1 → bottom  
2 → shoes  

This mapping must be saved alongside the model.

---

## 6. Color Extraction Preparation

Although classification is the primary task,
color extraction may be performed during inference.

Preprocessing considerations:

- ensure RGB format consistency
- avoid grayscale conversion
- preserve original color information

Color extraction is handled separately from training.

---

## 7. Data Integrity Checks

Before training:

- verify image readability
- remove corrupted files
- ensure labels match image count
- confirm no duplicate splits

This prevents silent training errors.

---

## 8. Reproducibility

Preprocessing configuration should be documented:

- image resolution
- normalization method
- augmentation types
- random seed

This ensures consistent experiments.

---

## 9. Limitations

Preprocessing does not include:

- background removal
- garment segmentation
- pose normalization
- body cropping

Images are treated as full-frame classification inputs.

---

## 10. Summary

The preprocessing pipeline ensures:

- standardized input
- training stability
- controlled augmentation
- reproducibility

It prepares the dataset for efficient supervised learning
while maintaining architectural simplicity.

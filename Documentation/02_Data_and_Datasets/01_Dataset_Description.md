# 01 – Dataset Description

## 1. Purpose

This document describes the dataset used to train the vision component of SCORE.

The dataset is used exclusively for:

- supervised garment classification training
- evaluation of model accuracy
- experimentation with model size and performance

It is NOT distributed with the final application.

---

## 2. Dataset Size

Approximate size:

~46,000 labeled images

The dataset is considered medium-scale,
sufficient for training lightweight convolutional models.

---

## 3. Data Type

Each data sample consists of:

- RGB image
- corresponding garment category label

Optional metadata (if available):
- material type
- sub-category
- tag descriptors

Version 1 only guarantees:

- garment category labels

---

## 4. Target Labels

Primary classification target:

Garment category.

Example categories:

- top
- bottom
- shoes
- outerwear
- dress
- accessory

Final label set depends on dataset structure.

---

## 5. Data Source Assumptions

The dataset is assumed to be:

- publicly available
or
- academically licensed

The project does not claim ownership of the dataset.

Proper citation must be included if required.

---

## 6. Dataset Usage Scope

The dataset is used for:

- offline training
- experimentation
- validation

It is NOT:

- uploaded to any server
- embedded inside the deployed application
- redistributed with SCORE

---

## 7. Dataset Exclusion from Runtime

The deployed SCORE application includes:

- trained model weights
- scoring engine
- UI layer

It does NOT include:

- raw training images
- full dataset folders

This reduces:

- storage requirements
- legal risk
- distribution size

---

## 8. Expected Data Quality

Potential dataset issues:

- imbalanced class distribution
- inconsistent lighting
- varying image resolutions
- mislabeled samples

Mitigation strategies:

- balanced splits
- validation monitoring
- confusion matrix analysis

---

## 9. Ethical and Bias Considerations

Possible bias risks:

- overrepresentation of certain styles
- underrepresentation of cultural attire
- limited diversity in garment types

SCORE does not claim universal fashion understanding.

It operates within dataset boundaries.

---

## 10. Summary

The dataset provides:

- sufficient volume for supervised training
- labeled garment categories
- moderate complexity

It is:

- external to runtime
- used strictly for training
- architecturally separated from application logic

# 05 – Dataset Exclusion from Application

## 1. Purpose

This document formalizes the decision to exclude the full training dataset
from the distributed SCORE application.

The dataset is used strictly for offline model training.

It is not required for runtime inference.

---

## 2. Architectural Separation

SCORE is divided into two major phases:

1. Training Phase (offline)
2. Runtime Phase (application use)

During training:
- dataset images are required
- model weights are learned
- performance metrics are evaluated

During runtime:
- only trained model weights are required
- no dataset images are accessed

This separation ensures architectural cleanliness.

---

## 3. Reasons for Dataset Exclusion

### 3.1 Storage Efficiency

The dataset contains approximately 46,000 images.

Bundling it with the application would:

- significantly increases the project size
- complicate distribution
- reduce portability

Only model weights (100–500MB) are required.

---

### 3.2 Legal and Licensing Concerns

If the dataset is:

- publicly available
- academically licensed

Redistribution may be restricted.

Excluding it avoids licensing violations.

---

### 3.3 Deployment Simplicity

The application is designed to:

- run locally
- require minimal setup
- avoid large data dependencies

Including the dataset would:

- increase installation time
- increase configuration complexity
- introduce unnecessary risk

---

### 3.4 Security and Privacy

Training datasets may contain:

- diverse individuals
- personal clothing images

Even if publicly available,
redistributing such data is unnecessary.

The application only needs:

- trained parameters
- inference pipeline

---

## 4. Runtime Components

The deployed SCORE system includes:

- trained model weights
- scoring engine
- fuzzy logic system
- reinforcement personalization layer
- CLI / GUI modules

It does NOT include:

- raw training images
- dataset directories
- augmentation pipelines

---

## 5. Re-Training Considerations

If retraining is desired:

- dataset must be obtained separately
- the training environment must be configured manually
- training scripts must be executed offline

The production application does not retrain models.

---

## 6. Academic Justification

Separating dataset from runtime:

- follows machine learning best practices
- respects reproducibility standards
- ensures clean architectural boundaries
- reinforces modular design principles

---

## 7. Summary

The dataset is:

- used for training only
- excluded from application distribution
- architecturally separated from runtime

SCORE operates on trained weights,
not raw data.

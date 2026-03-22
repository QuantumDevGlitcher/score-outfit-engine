# 03 – Train, Validation, and Test Split

## 1. Purpose

This document defines the dataset partitioning strategy used in SCORE.

Proper data splitting is essential to:

- prevent data leakage
- ensure fair evaluation
- measure generalization performance
- support reproducibility

---

## 2. Split Strategy Overview

The dataset is divided into:

- 80% Training set
- 20% Test set

Optionally:

- 10% of the training set may be reserved as validation

Final structure:

- 70% Training
- 10% Validation
- 20% Test

Validation is optional but recommended.

---

## 3. Role of Each Split

### 3.1 Training Set

Used to:

- optimize model weights
- compute gradients
- update parameters

This is the only split used during backpropagation.

---

### 3.2 Validation Set

Used to:

- monitor generalization during training
- tune hyperparameters
- apply early stopping

Validation data is never used for gradient updates.

---

### 3.3 Test Set

Used to:

- evaluate final model performance
- report metrics
- measure real-world approximation

Test data must remain untouched during training.

---

## 4. Stratified Splitting

If possible, splitting should be stratified.

Stratification ensures:

- class distribution remains consistent
- rare garment categories are represented across splits

This avoids misleading evaluation results.

---

## 5. Data Leakage Prevention

To avoid data leakage:

- identical images must not appear in multiple splits
- augmented variants must remain within the training split
- label mappings must remain consistent

Data leakage artificially inflates accuracy
and invalidates results.

---

## 6. Experimentation Subset

For rapid experimentation:

A small subset (e.g., 10% of dataset)
may be used for:

- architecture testing
- hyperparameter trials
- debugging training loops

Final performance must always be evaluated on full test sets.

---

## 7. Reproducibility Requirements

All splits must be:

- deterministic
- controlled by a fixed random seed
- documented

Example:
random_seed = 42

This ensures:

- consistent results across teammates
- replicable academic reporting

---

## 8. Reporting Metrics

Final reported metrics must be:

- computed on the test set only
- clearly separated from validation results

Metrics may include:

- accuracy
- precision
- recall
- F1-score
- confusion matrix

---

## 9. Limitations

Even with proper splits:

- test set may not represent real-world diversity
- performance may drop in uncontrolled environments
- dataset bias still affects evaluation

Split discipline does not remove bias.

---

## 10. Summary

The split strategy ensures:

- fair evaluation
- controlled experimentation
- reproducibility
- methodological correctness

This strengthens the academic validity of SCORE.

# 04 – Experimentation Strategy

## 1. Purpose

This document defines how experiments are conducted in SCORE.

Experimentation must be:

- controlled
- reproducible
- comparable
- documented

The goal is not random trial-and-error,
but structured evaluation.

---

## 2. Experiment Categories

Experiments fall into three categories:

1. Vision Model Experiments
2. Scoring Parameter Experiments
3. Personalization Behavior Experiments

---

## 3. Vision Model Experiments

Variables tested:

- architecture type (MobileNet, ResNet18, etc.)
- learning rate
- batch size
- augmentation strength
- number of epochs

Each experiment must record:

- model architecture
- training configuration
- validation accuracy
- test accuracy
- model size
- inference time

---

## 4. Controlled Variable Strategy

When testing a variable:

Only change one parameter at a time.

Example:

If testing model architecture:
- keep the learning rate fixed
- keep dataset split fixed
- keep augmentation fixed

This isolates the effect of the architecture.

---

## 5. Model Selection Criteria

Final model selection must consider:

- accuracy
- model size
- inference speed
- memory footprint
- integration stability

The highest accuracy alone is not enough.

Architectural balance is prioritized.

---

## 6. Scoring Parameter Experiments

Scoring experiments may adjust:

- fuzzy membership boundaries
- context weight modifiers
- penalty multipliers
- reinforcement learning rate

Evaluation criteria:

- logical consistency
- reduced false positives
- improved user feedback alignment

---

## 7. Personalization Experiments

Evaluate:

- adaptation speed
- stability after repeated feedback
- resistance to oscillation
- effect of learning rate

Ensure:

- personalization does not override base rules
- weights remain bounded

---

## 8. Experiment Logging

Each experiment should document:

- configuration
- dataset split
- metrics
- observations
- conclusions

This may be stored in:

- markdown experiment log
or
- structured experiment notebook

---

## 9. Reproducibility Requirements

All experiments must:

- fix random seed
- use consistent dataset split
- document hardware environment
- specify library versions

This prevents inconsistent conclusions.

---

## 10. Risk Mitigation

To avoid unstable experimentation:

- do not change multiple system layers simultaneously
- avoid training extremely large models prematurely
- validate scoring logic before model tuning

Foundation must remain stable.

---

## 11. Academic Reporting

The final report should include:

- comparison table of model variants
- accuracy vs. size tradeoff
- justification of final model choice
- explanation of discarded alternatives

---

## 12. Summary

Experimentation in SCORE is:

- structured
- documented
- reproducible
- architecturally aware

The system evolves through disciplined evaluation,
not uncontrolled modification.

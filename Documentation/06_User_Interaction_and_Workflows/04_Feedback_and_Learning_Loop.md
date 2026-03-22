# 04 – Feedback and Learning Loop

## 1. Purpose

This document defines how user feedback
is integrated into the SCORE recommendation pipeline.

The feedback loop enables:

- personalization
- gradual adaptation
- improved long-term relevance

Without feedback, the system remains static.

---

## 2. Feedback Types

After receiving a recommendation,
the user may provide:

- 👍 Approval
- 👎 Rejection
- No response

Only explicit approval or rejection
triggers adaptation.

---

## 3. Learning Loop Overview

The adaptation cycle follows:

1. Recommendation generated
2. User provides feedback
3. Reward value assigned
4. Scoring weights updated
5. Future recommendations adjusted

This creates a closed loop.

---

## 4. Reward Mapping

Example mapping:

- Approval → +1 reward
- Rejection → -1 reward

Reward influences:

- color compatibility weight
- material compatibility weight
- boldness tolerance
- context strictness factor

---

## 5. Weight Update Formula

Incremental update:

weight_new = weight_old + (learning_rate × reward)

Where:

learning_rate is small (e.g., 0.05)

This ensures:

- gradual adaptation
- no sudden behavioral changes
- stability across sessions

---

## 6. Personalization Scope

The feedback loop modifies:

- scoring parameters only

It does NOT modify:

- wardrobe contents
- garment attributes
- trained vision model weights
- fuzzy rule definitions

This separation preserves architectural boundaries.

---

## 7. Persistence of Preferences

Personalization parameters are:

- stored locally
- user-specific
- small in size

Storage options:

- JSON configuration file
- SQLite table

Preferences persist across sessions.

---

## 8. Cold Start Behavior

For new users:

- the default scoring configuration is applied
- no personalization exists

After sufficient feedback:

- personalization gradually influences ranking

Cold start does not degrade performance 
but lacks personalization refinement.

---

## 9. Safety Constraints

To prevent unstable adaptation:

- weight values are capped within limits
- base fuzzy constraints remain dominant
- context rules cannot be overridden

This ensures:

- appropriateness
- consistency
- interpretability

---

## 10. Explainability Integration

When recommendations adapt,
the explanation may include:

"Adjusted based on your previous preferences."

This improves transparency
and user trust.

---

## 11. Limitations

The feedback loop:

- does not implement advanced reinforcement algorithms
- it does not model long-term policy optimization
- does not include exploration/exploitation balancing

It is a controlled personalization mechanism.

---

## 12. Summary

The feedback and learning loop:

- closes the interaction cycle
- enables personalization
- maintains architectural separation
- preserves explainability

It transforms SCORE from a static system
into an adaptive assistant.

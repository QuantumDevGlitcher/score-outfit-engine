# 04 – Reinforcement Learning Personalization

## 1. Purpose

This document defines how personalization is implemented in SCORE.

The goal is not to implement full-scale deep reinforcement learning,
but to introduce an adaptive mechanism that improves recommendations
based on user feedback.

---

## 2. Why Reinforcement Learning?

Fashion preferences are subjective.

Two users may receive the same recommendation but:
- one approves it
- one rejects it

A static scoring system cannot adapt to personal taste.

Therefore, SCORE includes a feedback loop
that adjusts internal weights over time.

---

## 3. What RL Means in SCORE

In SCORE, Reinforcement Learning is implemented as:

Lightweight reward-based weight adjustment.

It is NOT:
- Deep Q-Learning
- Policy gradient training
- Neural reinforcement agents
- Large-scale exploration strategies

Instead, it is:

A structured feedback loop that updates preference parameters.

---

## 4. Basic RL Framework

We model:

State:
- context (e.g., university, gym, presentation)
- garment attributes (color, material, category)

Action:
- recommended outfit combination

Reward:
- user feedback (approve / reject / neutral)

Policy:
- scoring weight configuration

---

## 5. Reward Mechanism

Example feedback:

- 👍 Accepted recommendation → positive reward
- 👎 Rejected recommendation → negative reward
- No feedback → no update

Reward values (example):

+1 for acceptance  
-1 for rejection  

These values update preference weights.

---

## 6. What Gets Updated?

The following parameters may adapt:

- color compatibility weight
- material compatibility weight
- context strictness factor
- boldness tolerance (color contrast sensitivity)

For example:

If a user repeatedly approves bold combinations,
the system increases tolerance for high color contrast.

---

## 7. Update Strategy (Version 1)

Version 1 uses:

Incremental weight adjustment:

weight_new = weight_old + learning_rate * reward

Where learning_rate is small (e.g., 0.05).

This ensures:

- stability
- gradual adaptation
- no sudden behavioral shifts

---

## 8. Storage of Learned Preferences

User preference parameters are stored locally:

- JSON file
or
- SQLite table

Preferences are:

- user-specific
- persistent across sessions
- small in size

The core model is NOT retrained.

Only scoring weights change.

---

## 9. Safety Constraints

RL adaptation must:

- not override base fuzzy rules
- not violate context constraints
- not recommend socially inappropriate outfits

Therefore:

Base scoring remains dominant.
Personalization only adjusts margins.

---

## 10. Cold Start Problem

When a new user begins:

- Default weight configuration is used.
- No personalization exists.

After N feedback interactions:

- Personalization gradually activates.

---

## 11. Limitations

Version 1 RL does not include:

- deep neural RL
- exploration/exploitation balancing
- contextual bandits
- policy optimization
- dynamic retraining of the vision model

It is a controlled adaptive layer.

---

## 12. Future Enhancements

Potential improvements:

- contextual bandit algorithms
- Bayesian preference modeling
- collaborative filtering
- reinforcement meta-learning

These are beyond the current academic scope.

---

## 13. Summary

Reinforcement Learning in SCORE is:

- lightweight
- controlled
- interpretable
- safe

It enhances personalization
without compromising explainability
or architectural stability.

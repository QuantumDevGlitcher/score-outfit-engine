# Reinforcement Learning – Background Research

## 1. Purpose

This document summarizes the theoretical background of reinforcement learning (RL)
and clarifies how SCORE adopts a simplified adaptation strategy
inspired by RL principles.

SCORE does not implement full-scale deep reinforcement learning.
Instead, it applies controlled reward-based adaptation.

---

## 2. What is Reinforcement Learning?

Reinforcement Learning is a machine learning paradigm where:

- An agent interacts with an environment
- Takes actions
- Receives rewards
- Updates its policy to maximize cumulative reward

Core components:

- State
- Action
- Reward
- Policy
- Environment

---

## 3. Classical RL Formulation

In standard RL:

- The agent observes state \( S_t \)
- Chooses action \( A_t \)
- Receives reward \( R_t \)
- Updates policy \( \pi \)

Goal:

Maximize expected cumulative reward.

Common algorithms:

- Q-Learning
- SARSA
- Policy Gradient
- Deep Q Networks (DQN)

---

## 4. Why Full RL is Not Used in SCORE

Full RL would require:

- continuous exploration
- policy optimization
- reward discounting
- dynamic environment modeling
- large interaction data

For an academic fashion assistant:

- environment is static
- actions are limited
- reward data is sparse
- complexity would be unjustified

Therefore, a simplified approach is used.

---

## 5. Reinforcement Concept Applied in SCORE

SCORE adopts:

Reward-driven weight adaptation.

Instead of learning a new policy,
the system adjusts:

- scoring weights
- tolerance thresholds
- context modifiers

Based on user feedback.

---

## 6. Relation to Contextual Bandits

The adaptation strategy resembles:

Contextual bandit problems.

In contextual bandits:

- state is observed
- action is chosen
- an immediate reward is received
- no long-term state transition modeling

SCORE aligns more closely with this simplified structure.

---

## 7. Lightweight Update Strategy

Weight update rule:

```pseudocode
weight_new = weight_old + (learning_rate × reward)
```

Characteristics:

- no value function estimation
- no backpropagation through policy
- no experience replay
- no discount factor

This keeps adaptation interpretable.

---

## 8. Benefits of Simplified RL

Advantages:

- low computational cost
- stable behavior
- interpretable adaptation
- minimal storage requirements
- no retraining required

It fits:

- local execution
- academic scope
- modular architecture

---

## 9. Limitations Compared to Full RL

The system does not:

- optimize long-term reward sequences
- explore unknown style combinations automatically
- model dynamic preference drift
- learn new rules autonomously

Adaptation is constrained and safe.

---

## 10. Ethical and Stability Considerations

Uncontrolled RL can:

- produce unpredictable outputs
- reinforce extreme behavior
- drift into unstable policy regions

SCORE constrains adaptation to:

- bounded weight ranges
- rule-dominant structure
- safe context filtering

---

## 11. Summary

SCORE’s reinforcement mechanism is:

- inspired by classical RL
- simplified for academic scope
- controlled and interpretable
- aligned with contextual bandit principles

It enhances personalization
without introducing algorithmic instability.

# 04 – System Capabilities and Limitations

## 1. Capabilities

SCORE can:

- Accept contextual input (e.g., presentation, gym, university).
- Process garment attributes (color, type, material).
- Apply fuzzy rules to evaluate compatibility.
- Rank outfit combinations.
- Provide an explanation for each recommendation.
- Accept user reward feedback.

---

## 2. Limitations

- Vision accuracy depends on lighting conditions.
- Multi-pattern garments may reduce classification precision.
- Reinforcement adaptation is simplified for academic scope.
- The dataset used for training (46,000 images) is not embedded in the application, but the resulting trained model weights are included for inference.
- Manual garment input is available as a production-ready fallback mode.

---

## 3. Ethical Considerations

The system does not:
- Judge personal identity
- Assign value to appearance
- Promote harmful stereotypes

It operates strictly as a decision-support tool.

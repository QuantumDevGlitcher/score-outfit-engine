# 03 – Model Size vs Accuracy Tradeoffs

## 1. Introduction

Model selection in SCORE is not driven solely by maximum accuracy.

Instead, it balances:

- classification accuracy
- inference speed
- memory footprint
- CPU compatibility
- deployment simplicity

Since SCORE is an academic project targeting local execution,
efficiency and stability are prioritized over marginal accuracy gains.

---

## 2. Model Size Considerations

Estimated size ranges:

| Model Type      | Approx Size | Notes                   |
|-----------------|-------------|-------------------------|
| MobileNet       | ~80–120MB   | Lightweight, fast       |
| ResNet18        | ~100–150MB  | Balanced                |
| ResNet34        | ~200–300MB  | Higher capacity         |
| Larger backbone | 400–500MB   | Higher accuracy, slower |

The final model size depends on:

- architecture depth
- precision (FP32 vs. FP16)
- number of classes
- included layers

---

## 3. Accuracy vs Practical Benefit

Increasing model size typically yields:

- improved classification accuracy
- better generalization
- increased training time
- slower CPU inference

However, in SCORE:

A 2–3% accuracy gain may not significantly improve final outfit recommendations,
because:

- Scoring logic includes fuzzy reasoning
- Context filtering reduces noise
- Manual correction fallback exists
- Color extraction contributes significantly

Thus, extremely large models may produce diminishing returns.

---

## 4. CPU Inference Constraints

Version 1 assumes:

- CPU-only execution
- No GPU acceleration
- No cloud inference

Large models:

- increase startup time
- increase RAM usage
- reduce responsiveness during demo

A model under 300MB is preferable for:

- classroom demonstrations
- laptop compatibility
- smooth integration with Streamlit

---

## 5. Memory Footprint

Considerations:

- Conda environment size
- Torch runtime overhead
- GUI dependencies
- Potential model checkpoints

Keeping the model size moderate ensures the total project remains manageable.

---

## 6. Training Time vs. Benefit

Training larger models:

- requires more epochs
- increases experimentation cost
- increases debugging complexity

For academic scope:

Rapid iteration is more valuable than maximum performance.

---

## 7. Risk Analysis

Using overly large models introduces:

- environment instability
- longer setup time for teammates
- higher failure probability during demo
- version conflicts

Lightweight models reduce systemic risk.

---

## 8. Recommended Strategy (Version 1)

1. Start with MobileNet or ResNet18.
2. Evaluate validation accuracy.
3. Measure inference time on CPU.
4. If accuracy is insufficient, test ResNet34.
5. Avoid models exceeding practical memory constraints.

The final decision should prioritize:

- reliability
- speed
- acceptable classification accuracy

---

## 9. Future Optimization Possibilities

If performance becomes critical:

- Model pruning
- Quantization
- Knowledge distillation
- ONNX export
- TensorRT (if GPU available)

These are not required for Version 1.

---

## 10. Summary

In SCORE:

Model size is a design constraint,
not an afterthought.

The selected model must:

- integrate cleanly with scoring
- run on CPU
- remain under practical size limits
- provide stable classification performance

Maximal accuracy is not the objective.

Architectural balance is.

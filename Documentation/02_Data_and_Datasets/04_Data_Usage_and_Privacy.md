# 04 – Data Usage and Privacy

## 1. Purpose

This document defines how data is handled in SCORE,
including training data and user-provided images.

The system is designed with minimal data retention
and local execution principles.

---

## 2. Training Dataset Usage

The 46,000-image dataset is used strictly for:

- offline supervised training
- model evaluation
- experimentation

The dataset is:

- not redistributed
- not bundled in the application
- not uploaded to external servers

All training occurs locally.

---

## 3. User Image Handling

When users provide images during runtime:

- images are processed locally
- no cloud upload is performed
- no remote storage is used

The system extracts:

- garment category
- dominant color

After processing:

- images may be discarded
or
- stored temporarily for session use only

Persistent storage of user images is NOT required in Version 1.

---

## 4. Personalization Data

The Reinforcement Learning component stores:

- small numerical preference parameters
- reward history (optional)

Stored data does NOT include:

- user photos
- biometric information
- sensitive personal attributes

Personalization data is:

- minimal
- local
- user-specific

---

## 5. No Biometric Profiling

SCORE does NOT:

- perform facial recognition
- estimate age or gender
- analyze body type
- store identity data

The system evaluates clothing attributes only.

---

## 6. Privacy by Design Principles

The architecture follows:

- local inference
- minimal data retention
- no external API dependency
- no third-party tracking

This reduces:

- privacy risks
- security exposure
- compliance complexity

---

## 7. Ethical Boundaries

SCORE does not:

- judge attractiveness
- rank physical traits
- make personal evaluations

Recommendations are:

- style-based
- context-based
- rule-driven

The system avoids sensitive identity inference.

---

## 8. Dataset Licensing

If a public dataset is used:

- a proper citation must be included
- license terms must be respected
- redistribution must be avoided unless permitted

The project does not claim dataset ownership.

---

## 9. Limitations

Although privacy-conscious:

- the system depends on user honesty in manual inputs
- local execution does not prevent misuse
- dataset bias may still exist

Privacy design does not eliminate ethical responsibility.

---

## 10. Summary

SCORE is designed to:

- operate locally
- minimize stored data
- avoid biometric profiling
- respect user privacy

Data usage is restricted to:

- training
- inference
- lightweight personalization

No unnecessary personal data is retained.

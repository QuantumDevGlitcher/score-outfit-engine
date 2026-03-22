# 07 – Deployment Assumptions

## 1. Deployment Context

SCORE is developed as an academic intelligent systems project.

It is not intended for production deployment in Version 1.

Deployment assumptions are therefore aligned with:

- local execution
- classroom demo usage
- small team collaboration
- CPU-only environments

---

## 2. Target Execution Environment

Supported platforms:

- Windows 10/11
- macOS (Intel / Apple Silicon with CPU support)

Minimum hardware:

- 8GB RAM
- CPU-only execution (no GPU required)
- ~2GB free disk space for environment + dependencies

---

## 3. Runtime Requirements

- Node.js and PNPM (frontend + Express API)
- Python 3.13+ with virtualenv (ML service)
- Docker (MongoDB container)
- Local file system access

No cloud services are required.

No internet connection is required after dependencies are installed.

---

## 4. Model and Dataset Handling

### 4.1 Dataset

- Training dataset (~46,000 images) is NOT included in the repository.
- The dataset is used only for training experiments.
- It is excluded from version control.

### 4.2 Model Files

- Trained models (100–500MB range depending on an accuracy threshold) are not committed to Git.
- Models may be:
  - stored locally,
  - shared via external storage (e.g., cloud drive),
  - or replaced with stub logic for demo purposes.

Version 1 does not require large model downloads at runtime.

---

## 5. Execution Modes

### 5.1 Development (Single-Port)

```powershell
pnpm dev
```

- Serves React SPA and Express API at http://localhost:8080

---

### 5.2 ML Service (Python)

```powershell
cd ml-service
# activate your venv first
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

- Runs the FastAPI service powering perception and parts of the recommendation logic
- Health check: http://127.0.0.1:8001/health

---

## 6. No GPU Requirement

Version 1 does not require GPU acceleration.

If PyTorch is installed with CPU support only, the system remains fully functional.

This simplifies cross-platform compatibility.

---

## 7. No Cloud Infrastructure

The system does not depend on external cloud providers:

- No AWS/Azure/GCP required
- All REST endpoints are local-only (Express at 8080, FastAPI at 8001)

All components run locally. Future versions may optionally introduce cloud inference or hosted model serving.

---

## 8. Docker Usage

Docker is used for the database layer:

- MongoDB container named `score-mongo`
- Start with: `docker start score-mongo`

Rationale:
- Ensures a consistent database across machines
- Avoids installing MongoDB locally
- Easy to reset state when needed

---

## 9. Security and Privacy Assumptions

Version 1 does not:

- collect personal biometric data
- store sensitive user identity information
- transmit data externally

If body modeling or advanced perception is added in the future,
additional privacy documentation will be required.

---

## 10. Failure Handling Assumptions

If:

- model loading fails,
- perception fails,
- input is invalid,

the system will:

- return structured error messages,
- avoid crashing silently,
- maintain deterministic behavior.

Graceful degradation is preferred over runtime failure.

---

## 11. Summary

SCORE Version 1 is designed for:

- local execution,
- deterministic behavior,
- minimal infrastructure complexity,
- academic evaluation context.

It does not assume production deployment constraints.

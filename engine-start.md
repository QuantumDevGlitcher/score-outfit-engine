# SCORE Outfit Engine - Start Guide

Follow these steps to start the complete pipeline (Frontend, Express Server, and ML Service).

## 0. Quick Start (Recommended)
We've provided scripts to start everything in one go.

**For Git Bash / MINGW64:**
```bash
chmod +x start-engine.sh
./start-engine.sh
```
*(Note: This uses PowerShell in the background for reliable window management on Windows)*

**For PowerShell:**
```powershell
.\start-engine.ps1
```

---

## 1. Prerequisites
- **Docker**: For running MongoDB.
- **Python 3.13+**: For the ML Service.
- **Node.js & PNPM**: For the Frontend and Express Server.

---

## 2. Start MongoDB
Ensure your MongoDB container is running. If you haven't created it yet, use the `docker run` command first.

```powershell
# Start existing container
docker start score-mongo

# If first time (create and start):
# docker run -d --name score-mongo -p 27018:27017 mongo
```

---

## 3. Start ML Service (Python)
Open a new terminal and navigate to the `ml-service` directory.

```powershell
cd ml-service

# Activate Virtual Environment (Windows PowerShell)
.\venv\Scripts\activate
# (For Git Bash: source venv/Scripts/activate)

# Start the FastAPI server
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```
*Wait until you see `Application startup complete.`*

---

## 4. Start Web Server & Frontend (Node.js)
Open another terminal in the root project directory.

```powershell
pnpm dev
```
*The application will be available at `http://localhost:8080`.*

---

## 5. (First Time Only) Download Model Weights
If you haven't downloaded the YOLOS weights yet, run this script inside the `ml-service` environment:

```powershell
cd ml-service/perception_layer/clothing_detection_yolo_backup
python download_model.py
```

---

## Summary of URLs
- **Frontend/API**: `http://localhost:8080`
- **ML Service API**: `http://127.0.0.1:8001`
- **ML Health Check**: `http://127.0.0.1:8001/health`
- **MongoDB**: `localhost:27018`

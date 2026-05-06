

# 🚀 CityPlus – AI-Powered Civic Issue Reporting Platform

<div align="center">
	<img src="https://img.shields.io/badge/AI%20Model-EfficientNet-blue" />
	<img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-green" />
	<img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-yellow" />
	<img src="https://img.shields.io/badge/Cloudinary-Image%20Storage-lightgrey" />
	<img src="https://img.shields.io/badge/Deployed-Hugging%20Face%20%2B%20Render%20%2B%20Netlify-orange" />
</div>

> **A full-stack, production-grade platform where AI automatically classifies civic issue images, built and deployed end-to-end by a student.**

---

## 🌟 Executive Summary

CityPlus is a next-generation civic engagement platform that empowers citizens to report public infrastructure issues (like potholes, garbage, waterlogging, etc.) with AI-powered automatic image classification. Built as a full-stack MERN application, CityPlus integrates cloud storage, real-time maps, and a custom-trained EfficientNet AI model deployed on Hugging Face Spaces. Every part of this project—from model training to cloud deployment and API integration—was designed, debugged, and shipped by a single student, demonstrating advanced engineering, problem-solving, and deployment skills.

---


## 🔗 Live Demo

- **Frontend:** https://citypluss.netlify.app/
- **Backend API:** https://cityplus-fp1w.onrender.com/

---

---


## ✨ Features at a Glance

**User Experience**
- Secure registration/login (JWT)
- Report civic issues with image, type, and map location
- Track report status in real time
- Delete open reports

**Admin Dashboard**
- View/manage all reports
- Update status (Open, In Progress, Resolved)
- Remove fake/irrelevant reports

**AI/ML Integration**
- EfficientNet-based image classification (Hugging Face Spaces)
- Automatic issue type prediction and confidence scoring
- AI result stored and used in report workflow

**Visualization**
- Interactive city map with clickable issue markers

---



## 🤖 AI/ML Engineering

### 🚦 Current AI Integration
- **Image Classification:** EfficientNet model (PyTorch) classifies images into: pothole, garbage, streetlight, waterlogging, or other.
- **Cloud AI Service:** Model deployed as a Python microservice on Hugging Face Spaces, called by backend via Gradio API.
- **End-to-End Automation:** User uploads → Cloudinary → Backend → AI model → Prediction returned → MongoDB stores result.

### 🧭 Future AI/ML Roadmap
- Text analysis (DistilBERT/NLP) for smarter categorization
- AI-based report prioritization and anomaly detection
- Admin AI-assist for moderation and merging

---


## 🧰 Tech Stack & Deployment

**Frontend:** React (Vite), Tailwind CSS, React Router, Leaflet

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary

**AI Model:** PyTorch EfficientNet, Gradio, Hugging Face Spaces

**Deployment:**
- Frontend: Netlify
- Backend: Render
- AI Model: Hugging Face Spaces
- Image Storage: Cloudinary

---


## ⚙️ System Architecture (High Level)

```mermaid
flowchart TD
	A[User uploads report] --> B[Cloudinary stores image]
	B --> C[Backend API receives report]
	C --> D[AI model (Hugging Face) predicts issue type]
	D --> E[Prediction + confidence returned]
	E --> F[MongoDB stores report + AI result]
	F --> G[Admin dashboard & user tracking]
```

---


## 🎯 Purpose & Impact

CityPlus digitizes civic issue reporting, making city management transparent, data-driven, and AI-powered. By combining visual evidence, geolocation, and role-based moderation, the platform reduces ambiguity, prevents misuse, and encourages responsible civic participation. This project demonstrates how a single student can deliver a real-world, production-grade, AI-integrated solution.

---


## 🧪 Project Status

- Core features implemented and deployed
- AI image classification fully integrated
- Authentication, uploads, and admin dashboard working
- Open for further AI/NLP expansion

---


## 📄 License

This project is developed for educational and demonstration purposes.

---

## 🏆 Key Engineering Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Python/AI model deployment failures (Render) | Migrated to Hugging Face Spaces, optimized dependencies, enforced Python 3.10 |
| PyTorch/NumPy incompatibility | Pinned compatible versions, debugged ABI issues |
| Memory/timeouts on free tier | Moved to cloud AI service, separated backend and AI |
| Gradio API integration | Switched to correct endpoint, base64 payload, SSE response parsing |
| Fallback logic hiding errors | Improved error handling, added logging, validated end-to-end |

---

## 💡 What I Learned (Engineering Takeaways)

- AI deployment is very different from local inference
- Model hosting platforms have strict dependency and memory constraints
- Gradio APIs require special payloads and response parsing
- Fallback logic can hide real failures—always validate end-to-end
- Isolating AI inference as a service improves maintainability
- Debugging production deployments requires log tracing and patience

---


---

## 🙌 Acknowledgements

- OpenStreetMap contributors
- Cloudinary for image hosting
- Render & Netlify for deployment support
- Hugging Face for AI model hosting

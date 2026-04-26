
# CityPlus – Civic Issue Reporting Platform

CityPlus is a full-stack web application designed to improve civic engagement by enabling citizens to report public infrastructure issues and track their resolution transparently.

The platform allows users to submit real-world civic problems—such as potholes, garbage accumulation, faulty streetlights, and waterlogging—by uploading an image, selecting the issue type, and pinpointing the exact location on a city map. Each report is reviewed and managed through an admin dashboard to ensure authenticity and accountability.

---

## 🔗 Live Demo

- **Frontend:** https://citypluss.netlify.app/
- **Backend API:** https://cityplus-fp1w.onrender.com/  

---

## ✨ Features

### 👤 User Features
- Secure user registration and login (JWT authentication)
- Report civic issues with:
	- Image upload
	- Issue type selection
	- Precise geolocation using map
- View submitted reports and track their status
- Delete reports that are still in *open* state

### 🛠️ Admin Features
- Admin-only dashboard
- View all reported issues in one place
- Update issue status:
	- Open
	- In Progress
	- Resolved
- Delete fake or irrelevant reports to maintain data integrity

### 🗺️ Map-Based Visualization
- All reported issues displayed on an interactive city map
- Clickable markers showing issue details and images

---


## 🤖 AI/ML Features & Vision

### Current AI Integration
- **Image Classification:** The backend integrates an AI model (EfficientNet, DistilBERT, etc.) to automatically classify uploaded images into categories such as pothole, garbage, streetlight, waterlogging, or other. This assists in verifying and prioritizing reports.
- **AI Model Service:** The AI model is deployed as a Python/Flask microservice and is called by the backend when a user submits a report with an image.

### Future AI/ML Enhancements
- **Text Analysis:** Planned integration of NLP models (e.g., DistilBERT) to analyze and categorize textual descriptions of issues for improved accuracy and automated moderation.
- **Smart Prioritization:** Use AI to prioritize reports based on severity, frequency, and location data.
- **Anomaly Detection:** Automatically flag suspicious or duplicate reports using ML algorithms.
- **Admin Assistance:** AI-powered suggestions for admins to resolve or merge similar issues.

---

## 🧰 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router
- Leaflet (for map and geolocation)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer + Cloudinary (image uploads)

### Deployment
- **Frontend:** Netlify
- **Backend:** Render
- **Image Storage:** Cloudinary

---

## ⚙️ System Architecture (High Level)

1. User submits a report with image and location from the frontend.
2. Image is uploaded to Cloudinary.
3. Report metadata (description, type, image URL, coordinates) is stored in MongoDB.
4. Admin reviews reports and updates status via dashboard.
5. Users can track report progress in real time.

---

## 🎯 Purpose & Impact

CityPlus aims to digitize civic issue reporting and promote transparency between citizens and authorities. By combining visual evidence, geolocation, and role-based moderation, the platform reduces ambiguity, prevents misuse, and encourages responsible civic participation.

---

## 🧪 Project Status

- Core features implemented and deployed
- Authentication, image uploads, and role-based access working
- Actively open for feature expansion and AI integration

---

## 📄 License

This project is developed for educational and demonstration purposes.

---

## 🙌 Acknowledgements

- OpenStreetMap contributors
- Cloudinary for image hosting
- Render & Netlify for deployment support

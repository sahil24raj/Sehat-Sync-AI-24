# MedAlloc AI (Smart Hospital Resource Allocation System)

MedAlloc AI is a full-stack, AI-powered web application designed to intelligently assign limited hospital resources (such as ICU beds, oxygen, and ventilators) to patients based on urgency and real-time availability.

## 🚀 Features
- **Real-Time Dashboard**: Monitor hospital capacities via dynamic charts.
- **AI Priority Engine**: Groq Cloud API (LLM) evaluates patient vitals and assigns a priority score (Low/Medium/High) instantly.
- **Smart Allocation**: Automatically assigns high-priority patients to nearest hospitals with available ICU beds/ventilators.
- **WebSocket Alerts**: Real-time notifications for new patients and resource depletion.

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Chart.js, React Router
- **Backend**: Node.js, Express.js, MongoDB (Memory Server for Hackathon prototype), Socket.io
- **AI Microservice**: Python, FastAPI, Groq Cloud API (LLaMA 3)

## 🏗️ System Architecture
1. **Client Layer**: React-based UI communicating with the Node backend via REST APIs and WebSockets.
2. **Backend Middleware**: Node.js/Express server that handles database operations, patient state management, and real-time socket events.
3. **AI Inference Layer**: FastAPI server integrating with Groq Cloud API, which returns instantaneous severity and priority scoring for dynamic allocation.

## 📡 Key API Endpoints
### Backend Server (`localhost:5000`)
- `GET /api/hospitals`: Fetches all hospitals and their current real-time resources.
- `GET /api/patients`: Fetches all admitted patients and their allocated hospitals.
- `POST /api/patients`: Submits a new patient, calculates priority via ML service, allocates a hospital bed, and emits socket events.

### AI Microservice (`localhost:8000`)
- `POST /predict`: Accepts `age`, `oxygen_level`, `symptoms_severity`, and `comorbidities`. Returns `priority_score` (0-100) and `priority_label` (Low/Medium/High).

## ⚙️ Setup & Installation

### 1. AI Microservice (`/ml-service`)
This service uses Groq Cloud API for priority prediction.
```bash
cd ml-service
python -m venv venv
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt

# Create a .env file and add your Groq API Key
echo GROQ_API_KEY=your_api_key_here > .env

uvicorn main:app --reload --port 8000
```

### 2. Node Backend Server (`/server`)
Runs the API and WebSocket server. Uses an in-memory MongoDB by default.
```bash
cd server
npm install
npm start
```

### 3. React Frontend (`/client`)
Runs the user interface.
```bash
cd client
npm install
npm run dev
```

## 🧪 Demo Scenario
1. Start all three services as detailed above.
2. Open `http://localhost:5173` to view the Dashboard. You will see 3 dummy hospitals pre-loaded with resources.
3. Click on **Patient Intake**.
4. Enter patient details. For a High Priority demo, enter:
   - Age: 75
   - Symptoms Severity: 95
   - Blood Oxygen: 75%
   - Comorbidities: Severe
5. Submit the form. The system will consult the AI model, mark them as "High Priority", allocate an ICU bed at the nearest hospital, and trigger a real-time UI update on the dashboard!

---
*Built for the Hackathon.*

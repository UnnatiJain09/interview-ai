<div align="center">

# 🎙️ InterviewAI – AI-Powered Personal Interview Coach
### *“Practice. Perform. Improve.”*

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI Pipeline](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/UnnatiJain09/interview-ai/actions)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o_%7C_Whisper-412991?logo=openai&logoColor=white)](https://openai.com/)

**A full-stack, Generative AI interview preparation platform designed for software engineering placements, technical assessments, and HR behavioral rounds.**

[Live Demo](http://localhost:5173) • [Documentation](#-table-of-contents) • [Report Bug](https://github.com/UnnatiJain09/interview-ai/issues) • [Request Feature](https://github.com/UnnatiJain09/interview-ai/issues)

</div>

---

## 📑 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [Key Features](#-key-features)
3. [System Architecture & Workflow](#-system-architecture--workflow)
4. [Technology Stack](#-technology-stack)
5. [Database Models (Mongoose)](#-database-models-mongoose)
6. [REST API Specification](#-rest-api-specification)
7. [AI Evaluation Rubrics & Metrics](#-ai-evaluation-rubrics--metrics)
8. [Installation & Local Setup](#-installation--local-setup)
9. [Project Directory Structure](#-project-directory-structure)
10. [Author & Acknowledgments](#-author--acknowledgments)

---

## 🌟 Executive Summary

**InterviewAI** is an advanced, production-quality interview preparation simulator developed as a final-year B.Tech Information Technology capstone project. 

Unlike conventional static question repositories or basic generic chatbots, **InterviewAI** acts as an **interactive, intelligent hiring manager**:
- 🗣️ **Real-time Speech Recognition**: Candidates can speak answers naturally via microphone (powered by OpenAI Whisper STT and browser Web Speech fallback).
- 🔊 **Voice Synthesis & AI Avatar**: Contextual question delivery with animated visual feedback and text-to-speech audio playback.
- 🎯 **Dynamic Adaptive Probing**: Automatically detects gaps or interesting points in candidate answers and generates contextual follow-up questions.
- 💻 **In-Browser Coding Assessment**: Integrated Monaco Editor (VS Code engine) with multi-language execution, automated test case runner, and Big-O complexity evaluation.
- 📊 **8-Dimensional Answer Evaluation**: Rigorous analysis of Technical Knowledge, Relevance, Accuracy, Completeness, Structure, Communication, Clarity, and Grammar.
- 📈 **Longitudinal Analytics**: Competency radar charts, progress over time, strengths/weaknesses breakdown, and model ideal answers.

---

## ✨ Key Features

| Category | Features Included |
| :--- | :--- |
| **Interview Modes** | • **Technical Round**: Role-tailored (Frontend, Backend, Full Stack, DevOps, AI/ML)<br>• **HR Behavioral**: STAR method, leadership, conflict resolution, cultural fit<br>• **Coding Assessment**: Algorithmic problem solving with test cases<br>• **Full Mock Simulation**: End-to-end multi-stage hiring panel |
| **Voice & Speech** | • OpenAI Whisper API (`whisper-1`) high-fidelity audio transcription<br>• Real-time speech visualizer and audio recording timer<br>• Web Speech API speech synthesis for realistic interviewer audio |
| **Code Sandbox** | • Monaco Editor with syntax highlighting, line numbers, and theme support<br>• Multi-language execution: JavaScript, Python, Java, C++<br>• Test case validation, runtime execution timer (ms), and Big-O complexity audits |
| **AI Assessment Engine** | • Weighted scoring tailored by interview category<br>• Question-by-question breakdown with candidate transcript vs. model ideal answer<br>• Actionable recommendations for immediate improvement |
| **Analytics & History** | • Recharts Radar competency graphs across 6 core engineering pillars<br>• Progression AreaChart tracking scores across multiple rounds<br>• Filterable history table with archived session reports |
| **UX & Modern Design** | • Sleek dark & light modes with persistent localStorage storage<br>• Glassmorphism panels, radiant gradients, and micro-animations<br>• Instant demo preview mode (`demo@interviewai.com`) |

---

## 🏗️ System Architecture & Workflow

```
                             ┌───────────────────────────────────┐
                             │       InterviewAI Web Client      │
                             │   React 18 • Vite • Tailwind CSS  │
                             │     Monaco Editor • Recharts      │
                             └─────────────────┬─────────────────┘
                                               │
                                 HTTPS / REST  │  Multipart Audio
                                               ▼
                             ┌───────────────────────────────────┐
                             │     Node.js / Express Backend     │
                             │  JWT Middleware • Multer • CORS   │
                             └─────┬───────────┬───────────┬─────┘
                                   │           │           │
         ┌─────────────────────────┘           │           └─────────────────────────┐
         ▼                                     ▼                                     ▼
┌──────────────────┐               ┌───────────────────────┐             ┌───────────────────────┐
│  MongoDB Atlas   │               │   AI & Speech Engine  │             │   Sandboxed Runner    │
│ Mongoose Schemas │               │ OpenAI GPT-4o Whisper │             │ Child-Process Sandbox │
│ Users, Sessions, │               │ Dynamic Probing & STT │             │ JS / Python / C++     │
│ Questions, Code  │               └───────────────────────┘             └───────────────────────┘
└──────────────────┘
```

### 🔄 End-to-End Interview Flow
1. **Candidate Configures Round**: Selects category (HR / Technical / Coding / Mock), difficulty, question count, and target role.
2. **AI Generates Opener**: Synthesizes a role-appropriate introductory technical or behavioral question.
3. **Candidate Responds**:
   - Spoken audio is recorded via `MediaRecorder` and transcribed using Whisper STT.
   - Or code is written directly in the Monaco Editor and submitted against test cases.
4. **Multi-Metric Evaluation**:
   - The backend runs prompt engineering evaluation pipeline returning JSON scores and qualitative feedback.
5. **Contextual Follow-Up**: If the answer warrants deeper investigation, the AI dynamically crafts an adaptive follow-up probe.
6. **Comprehensive Scorecard**: Calculates category-weighted score, renders radar chart, highlights key strengths/weaknesses, and stores performance in MongoDB.

---

## 💻 Technology Stack

### **Frontend**
* **Core**: React 18 (Vite 6)
* **Routing**: React Router DOM v7
* **Styling**: Tailwind CSS (with bespoke glassmorphism and radiant glow utilities)
* **Code Editor**: `@monaco-editor/react` (VS Code browser engine)
* **Visualizations**: `recharts` (Responsive Area Charts, Radar Competency Graphs)
* **Icons**: `lucide-react`
* **Effects**: `canvas-confetti`
* **HTTP Client**: `axios` with automatic JWT Bearer interceptors

### **Backend**
* **Runtime**: Node.js (v20+)
* **Framework**: Express.js (MVC REST Architecture)
* **Database**: MongoDB (Local or MongoDB Atlas) via Mongoose ODM
* **Security & Auth**: JSON Web Tokens (JWT), `bcryptjs` password hashing, `express-rate-limit`, CORS
* **File Uploads**: `multer` with MIME-type filtering for voice audio

### **AI & Intelligent Fallback**
* **LLM**: OpenAI GPT-4o & GPT-4o-mini
* **STT**: OpenAI Whisper (`whisper-1`) + Web Speech Recognition API
* **TTS**: Web Speech Synthesis API
* **Dynamic Simulation Engine**: Built-in intelligent fallback engine guaranteeing zero downtime and full offline evaluation capabilities.

---

## 🗄️ Database Models (Mongoose)

* **`User`**: `name`, `email`, `password` (bcrypt hash), `role`, `experience`, `skills`, `preferredLanguage`, `resumeSummary`.
* **`Interview`**: `userId`, `interviewType` (HR, Technical, Coding, Full Mock), `targetRole`, `difficulty`, `duration`, `questionCount`, `mode`, `status`, `overallScore`, `technicalScore`, `communicationScore`, `codingScore`, `summaryFeedback`, `strengths`, `improvements`.
* **`Question`**: `interviewId`, `question`, `type`, `difficulty`, `order`, `expectedTopics`, `followUpTo`, `codingChallenge` (title, description, examples, constraints, starterCode, testCases).
* **`Answer`**: `interviewId`, `questionId`, `userId`, `transcript`, `answerText`, `score`, `relevance`, `accuracy`, `communication`, `clarity`, `grammar`, `completeness`, `technicalKnowledge`, `strengths`, `weaknesses`, `suggestions`, `idealAnswer`.
* **`CodingSubmission`**: `interviewId`, `questionId`, `userId`, `language`, `code`, `testCasesPassed`, `totalTestCases`, `executionTimeMs`, `score`, `timeComplexity`, `spaceComplexity`, `feedback`, `testResults`.
* **`Performance`**: `userId`, `interviewId`, `overallScore`, `technicalScore`, `communicationScore`, `codingScore`, `createdAt`.

---

## 🌐 REST API Specification

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new candidate with profile details | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token | No |
| `POST` | `/api/auth/demo` | Instant 1-click evaluator login (`demo@interviewai.com`) | No |
| `GET` | `/api/auth/me` | Fetch active user session | Yes (JWT) |
| `POST` | `/api/auth/logout` | Terminate session | Yes (JWT) |

### 🎙️ Interviews (`/api/interviews`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interviews` | Create and initialize a new interview round | Yes (JWT) |
| `GET` | `/api/interviews` | List all historical sessions with pagination | Yes (JWT) |
| `GET` | `/api/interviews/:id` | Fetch session details, questions, and answers | Yes (JWT) |
| `POST` | `/api/interviews/:id/start` | Launch session and generate first question | Yes (JWT) |
| `POST` | `/api/interviews/:id/complete`| Finalize interview, compute overall score & summary | Yes (JWT) |

### ❓ Questions & Evaluation (`/api/questions`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/questions/interview/:id` | Get all questions assigned to a session | Yes (JWT) |
| `POST` | `/api/questions/:id/answer` | Submit answer, get 8-metric scoring & follow-up | Yes (JWT) |

### 💻 Coding Sandbox (`/api/coding`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/coding/run` | Execute code against unit tests in isolated subprocess | Yes (JWT) |
| `POST` | `/api/coding/submit` | Evaluate code quality, test coverage, and Big-O | Yes (JWT) |

### 📊 Analytics (`/api/analytics`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/dashboard` | Aggregated dashboard stats & progression history | Yes (JWT) |
| `GET` | `/api/analytics/performance` | 6-pillar radar competency breakdown & insights | Yes (JWT) |
| `GET` | `/api/analytics/history` | Filterable archive of all completed interview logs | Yes (JWT) |

---

## 🎯 AI Evaluation Rubrics & Metrics

The platform implements category-weighted scoring algorithms:

### 1. Technical Interview Scoring
$$\text{Overall Score} = 0.35(\text{Technical}) + 0.25(\text{Answer Quality}) + 0.20(\text{Communication}) + 0.10(\text{Relevance}) + 0.10(\text{Fluency})$$

### 2. HR Behavioral Scoring
$$\text{Overall Score} = 0.30(\text{Communication}) + 0.25(\text{Quality}) + 0.20(\text{Relevance}) + 0.15(\text{Clarity}) + 0.10(\text{Grammar})$$

### 3. Coding Assessment Scoring
$$\text{Overall Score} = 0.50(\text{Test Case Pass Rate}) + 0.20(\text{Code Quality}) + 0.15(\text{Time Complexity}) + 0.15(\text{Space Complexity})$$

---

## 🚀 Installation & Local Setup

### 📋 Prerequisites
* **Node.js**: v18.0.0 or higher (`node -v`)
* **npm**: v9.0.0 or higher (`npm -v`)
* **MongoDB**: Local MongoDB community service (`mongodb://localhost:27017`) or [MongoDB Atlas URI](https://www.mongodb.com/atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/UnnatiJain09/interview-ai.git
cd interview-ai
```

### 2. Install Dependencies
```bash
# Install root, backend, and frontend dependencies in one command
npm run install:all
```

### 3. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/interview_ai
JWT_SECRET=supersecret_interviewai_jwt_key_2026_production_grade
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
CLIENT_URL=http://localhost:5173
```
*(Optional: Provide an `OPENAI_API_KEY` for live OpenAI GPT-4o/Whisper calls. If omitted, the platform uses its built-in offline simulation engine).*

### 4. Seed the Database
Populate sample users, technical rounds, behavioral interviews, and analytics:
```bash
npm run seed
```

### 5. Launch the Application
```bash
# Runs Express backend (Port 5000) and Vite frontend (Port 5173) concurrently
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

**Demo Credentials**:
* **Email**: `demo@interviewai.com`
* **Password**: `password123`
*(Or click the 1-click **Demo Login** button on the sign-in page).*

---

## 📁 Project Directory Structure

```
interview-ai/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI Build & Verification
├── client/                        # React 18 Frontend
│   ├── src/
│   │   ├── components/            # UI, Interview & Coding widgets
│   │   ├── context/               # AuthContext & ThemeContext
│   │   ├── pages/                 # 13 Application Views & Routes
│   │   ├── services/api.js        # Axios API Client with JWT
│   │   ├── App.jsx                # Route Matrix
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── tailwind.config.js
├── server/                        # Node.js Express REST API
│   ├── config/db.js               # MongoDB Mongoose connector
│   ├── controllers/               # Auth, Interview, Question, Coding, Analytics
│   ├── middleware/                # JWT Auth, Multer, Error Handlers
│   ├── models/                    # Mongoose Schemas
│   ├── prompts/                   # OpenAI GPT-4o Evaluation Prompts
│   ├── routes/                    # Express Router Endpoints
│   ├── services/                  # OpenAI, Whisper, Sandbox Execution
│   ├── utils/seedData.js          # Full Database Seeder
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   └── server.js
├── .env.example
├── .gitignore
├── LICENSE                        # MIT License
├── package.json                   # Root workspace scripts
└── README.md                      # Project documentation
```

---

## 👩‍💻 Author & Acknowledgments

* **Developer**: **Unnati Jain** ([@UnnatiJain09](https://github.com/UnnatiJain09))
* **Project**: Final-Year B.Tech Information Technology Capstone Project
* **Special Thanks**: Open-source contributors of React, Tailwind CSS, Monaco Editor, and OpenAI.

---

<div align="center">
⭐ Star this repository if you found it useful for your interview prep or engineering capstone!
</div>

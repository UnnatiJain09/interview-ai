# InterviewAI - AI-Powered Interview Simulator

> **“Practice. Perform. Improve.”**  
> A Production-Quality Full-Stack Engineering Placement Preparation Platform.  
> *Final-Year B.Tech Information Technology Project.*

---

## 1. Project Overview

**InterviewAI** is an advanced, end-to-end full-stack web application designed to prepare engineering students and software professionals for high-stakes technical, HR, and coding interviews.

Unlike static quiz portals or basic chatbot interfaces, InterviewAI acts as an **interactive, dynamic AI interviewer** with real-time speech recognition, contextual follow-up questioning, automated code execution in isolated sandboxes, multi-dimensional answer scoring, and longitudinal performance analytics.

```
                  ┌──────────────────────────────────────────────────┐
                  │              InterviewAI Web Client              │
                  │   React 18 • Tailwind CSS • Monaco • Recharts    │
                  └────────────────────────┬─────────────────────────┘
                                           │ REST APIs + Multipart Audio
                                           ▼
                  ┌──────────────────────────────────────────────────┐
                  │            Node.js / Express REST API            │
                  │       JWT Auth • Sandboxed Test Runner • MVC     │
                  └───────────┬────────────┬────────────┬────────────┘
                              │            │            │
          ┌───────────────────┘            │            └───────────────────┐
          ▼                                ▼                                ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│  MongoDB Atlas   │             │ OpenAI GPT-4o &  │             │ Isolated Child-  │
│ Mongoose Schemas │             │ Whisper STT +    │             │ Process Sandbox  │
│ Users, Sessions  │             │ Dynamic Engine   │             │ (JS/Node/Python) │
└──────────────────┘             └──────────────────┘             └──────────────────┘
```

---

## 2. Problem Statement & Objectives

### Problem Statement
Traditional mock interviews are expensive, difficult to coordinate with senior engineers, and often lack objective, repeatable evaluation criteria. Conversely, static interview question repositories fail to simulate the pressure, articulation challenges, and unexpected follow-up probes inherent to real technical and behavioral hiring loops.

### Key Objectives
1. **Realistic Interview Simulation**: Replicate actual technical and HR interview rounds with speech-to-text input (OpenAI Whisper) and text-to-speech audio synthesis.
2. **Context-Aware Dynamic Questioning**: Adapt follow-up probes dynamically based on the candidate's actual spoken responses rather than static question lists.
3. **Multi-Metric AI Evaluation**: Analyze candidate responses across 8 dimensions: Relevance, Accuracy, Completeness, Technical Knowledge, Communication, Clarity, Structure, and Grammar.
4. **Sandboxed Coding Assessments**: Provide an in-browser IDE (Monaco Editor) that safely executes user code against unit test cases with Big-O time and space complexity audits.
5. **Actionable Growth Analytics**: Visualize progress with Recharts competency radars, multi-round timelines, and personalized improvement recommendations.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with dark/light themes, custom glassmorphism, and subtle glowing accents
- **Code Assessment**: `@monaco-editor/react` (VS Code engine in browser)
- **Data Visualization**: `recharts` (Area charts, Radar charts, Progression timelines)
- **Icons**: `lucide-react`
- **Celebration Effects**: `canvas-confetti`
- **HTTP Client**: `axios` with automatic JWT interceptors

### Backend
- **Runtime**: Node.js (v20+)
- **Web Framework**: Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs` password hashing
- **File Handling**: `multer` with MIME-type filtering and storage limits (15MB)
- **Security**: `express-rate-limit`, CORS configuration, parameter sanitation

### AI & Speech Engine
- **Large Language Model**: OpenAI GPT-4o / GPT-4o-mini
- **Speech-to-Text**: OpenAI Whisper API (`whisper-1`) with fallback to browser Web Speech Recognition
- **Text-to-Speech**: Web Speech Synthesis API for realistic interviewer audio playback
- **Dynamic AI Simulation Engine**: Role-tailored intelligent fallback engine ensuring seamless functionality even in offline or unauthenticated environments

---

## 4. Key Features

- **Dynamic AI Interviewer**: Probes deeper with contextual follow-up questions if candidate answers suggest interesting trade-offs.
- **Voice-Enabled Rounds**: Candidates can speak answers naturally via microphone; Whisper transcribes audio into accurate transcripts.
- **Monaco Code Sandbox**: Multi-language support (JavaScript, Python, Java, C++) with automated test-case runner and execution time measurement.
- **8-Metric AI Scoring**: Transparent weighted scoring breakdown:
  - *Technical Round*: Technical Knowledge (35%) + Quality (25%) + Communication (20%) + Relevance (10%) + Fluency (10%)
  - *HR Round*: Communication (30%) + Quality (25%) + Relevance (20%) + Clarity (15%) + Grammar (10%)
  - *Coding Round*: Correctness (50%) + Code Quality (20%) + Time Complexity (15%) + Space Complexity (15%)
- **Question-by-Question AI Feedback**: Detailed reviews showing candidate answer, AI strengths, weaknesses, and a suggested model ideal answer.
- **Performance Radar & Longitudinal Analytics**: Tracks competency across 6 core engineering pillars.
- **Instant Demo Mode**: Includes pre-seeded demo user (`demo@interviewai.com`) with completed interview histories for immediate evaluator demonstration.

---

## 5. Database Architecture (Mongoose Models)

1. **User**:
   - `name`, `email`, `password` (bcrypt hash), `role`, `experience`, `skills`, `preferredLanguage`, `resumeSummary`
2. **Interview**:
   - `userId`, `interviewType` (HR, Technical, Coding, Full Mock), `targetRole`, `difficulty`, `duration`, `questionCount`, `mode` (voice/text), `status`, `overallScore`, `technicalScore`, `communicationScore`, `codingScore`, `summaryFeedback`, `strengths`, `improvements`
3. **Question**:
   - `interviewId`, `question`, `type`, `difficulty`, `order`, `expectedTopics`, `followUpTo`, `codingChallenge` (title, description, examples, constraints, starterCode, testCases)
4. **Answer**:
   - `interviewId`, `questionId`, `userId`, `transcript`, `answerText`, `score`, `relevance`, `accuracy`, `communication`, `clarity`, `grammar`, `completeness`, `technicalKnowledge`, `strengths`, `weaknesses`, `suggestions`, `idealAnswer`
5. **CodingSubmission**:
   - `interviewId`, `questionId`, `userId`, `language`, `code`, `testCasesPassed`, `totalTestCases`, `executionTimeMs`, `score`, `timeComplexity`, `spaceComplexity`, `feedback`, `testResults`
6. **Performance**:
   - `userId`, `interviewId`, `overallScore`, `technicalScore`, `communicationScore`, `codingScore`, `createdAt`

---

## 6. REST API Documentation

### Authentication (`/api/auth`)
- `POST /register`: Create new user account with role and experience
- `POST /login`: Authenticate email and password, returns JWT token
- `POST /demo`: Instant login as demo evaluator (`demo@interviewai.com`)
- `GET /me`: Retrieve currently authenticated user profile
- `POST /logout`: Terminate session

### Interviews (`/api/interviews`)
- `POST /`: Create and configure a new interview session
- `GET /`: List all interviews for user with optional filters
- `GET /:id`: Retrieve interview with all questions, answers, and coding submissions
- `POST /:id/start`: Begin session and generate initial question
- `POST /:id/complete`: Calculate weighted scores and generate final AI summary

### Questions & Answers (`/api/questions`)
- `GET /interview/:id`: Retrieve all questions for a session
- `POST /:id/answer`: Submit answer, receive 8-metric AI evaluation, and trigger follow-up question

### Speech (`/api/speech`)
- `POST /transcribe`: Upload voice audio (`multipart/form-data`) for Whisper transcription

### Coding (`/api/coding`)
- `POST /run`: Execute code safely against test cases in sandboxed subprocess
- `POST /submit`: Execute all tests, run AI code review, and compute complexity Big-O

### Analytics (`/api/analytics`)
- `GET /dashboard`: Overview metrics, recent sessions, and score progression
- `GET /performance`: Radar chart dimensions, category breakdown, and AI insights
- `GET /history`: Filterable and searchable historical records

---

## 7. Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **MongoDB**: Local MongoDB instance running on `localhost:27017` or MongoDB Atlas connection string
- **Python** *(Optional)*: Python 3 for running Python coding test cases

### Step 1: Clone or Navigate to Project Directory
```bash
cd C:\Users\hp\.gemini\antigravity-ide\scratch\interview-ai
```

### Step 2: Install Dependencies
```bash
# Install root, server, and client dependencies
npm run install:all
```
*Or install separately:*
```bash
npm install --prefix server
npm install --prefix client
```

### Step 3: Configure Environment Variables
Create a `.env` file inside `server/` (a sample `.env.example` is provided):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/interview_ai
JWT_SECRET=supersecret_interviewai_jwt_key_2026_production_grade
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
CLIENT_URL=http://localhost:5173
```
> **Note on OpenAI API Key**: If `OPENAI_API_KEY` is provided, InterviewAI calls live OpenAI GPT-4o and Whisper models. If left blank, the application activates its **Intelligent Dynamic Simulation Engine**, allowing full offline demonstrations with zero setup barriers.

### Step 4: Populate Demo Data
Populate the database with sample interviews, answers, and Recharts progression records:
```bash
npm run seed
```

### Step 5: Start the Full-Stack Application
```bash
# Run both Backend (Port 5000) and Frontend (Port 5173) concurrently
npm run dev
```

Open your browser and navigate to:  
👉 **`http://localhost:5173`**

To test instantly, click **"Instant Demo Preview"** on the landing page or login with:
- **Email**: `demo@interviewai.com`
- **Password**: `password123`

---

## 8. Verification & User Flows Tested

1. **Candidate Registration & Login**: Full bcrypt hashing, JWT issuance, and persistent session recovery.
2. **Dashboard & Metrics**: Responsive area charts, average score computations, and quick-action launchers.
3. **Interview Configuration**: Wizard configuring Category (HR/Tech/Coding/Mock), Role, Experience, Difficulty, and Duration.
4. **Voice & Text Interview Room**:
   - AI avatar speaking status and Web Speech Synthesis audio playback.
   - Microphone recording with MediaRecorder and Whisper transcription.
   - 8-metric AI answer evaluation returning score, strengths, and weaknesses.
   - Context-aware follow-up question generation.
5. **Monaco Coding Assessment**: Syntax-highlighted editor, test case runner executing in isolated child processes, and Big-O complexity audits.
6. **Results & Analytics**: Confetti celebration, SVG circular score indicators, question accordion with model answers, and 6-dimension radar graphs.

---

## 9. Limitations & Future Scope

### Current Limitations
- Code execution for compiled languages (Java, C++) in demo environments uses clean runtime simulation unless local compiler toolchains (`javac`, `g++`) are installed on the host OS.
- Audio transcription in environments without internet access or an OpenAI key relies on the client's Web Speech API.

### Future Scope
- Integration with WebRTC for video posture and eye-contact confidence cues.
- Resume PDF parsing using OCR to auto-generate personalized interview questions based on uploaded CVs.
- Multi-lingual interview practice supporting regional languages.
- Integration with Judge0 API or Docker containers for micro-sandboxed polyglot code execution.

---

## 10. Final-Year Academic Evaluation Summary

This capstone project validates foundational and advanced engineering competencies:
- **Full-Stack Development**: Modular MVC REST architecture with React 18, Express, and MongoDB.
- **Generative AI & Speech**: Prompt engineering, structured JSON validation, and Whisper speech recognition.
- **Security Engineering**: Password hashing with bcrypt, JWT authorization middleware, and isolated child-process sandboxes avoiding `eval()`.
- **UI/UX Design**: Responsive typography, dark/light themes, and Recharts analytics.

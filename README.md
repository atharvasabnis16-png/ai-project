# AI-Powered Collaborative Project Intelligence Platform

A smart collaboration platform for students that manages projects by understanding skills, tracking contributions, and using AI (Anthropic Claude) to coordinate work.

## Core Features Built
- **Auth & Team Setup**: Signup/Login → Skill Profile → Create/Join Team.
- **AI Task Board**: Status-based Kanban with AI skill-based assignment.
- **Smart Workspace**: Shared notes with AI Summarization, Task Extraction, and Idea Clustering.
- **Dashboard**: High-level intelligence overview with contribution charts and workload alerts.

## Tech Stack
- **Frontend**: React, Tailwind CSS v4, Zustand, Axios, React Icons.
- **Backend**: Node.js, Express, MongoDB, JWT, bcryptjs.
- **AI**: Anthropic Claude API (with Mock Fallback mode).

## Getting Started

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas cluster (Cloud) or local MongoDB.

### 2. Configuration
Create a `.env` file in the root directory (placed there already with placeholders).
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
USE_MOCK_AI=true
ANTHROPIC_API_KEY=your_key_here
CLIENT_URL=http://localhost:5173
```

### 3. Run the Backend
```bash
cd server
npm install
npm run dev
```

### 4. Run the Frontend
```bash
cd client
npm install
npm run dev
```

## AI Mock Mode
The platform is currently set to `USE_MOCK_AI=true`. This allows full functionality of the UI (Summarization, Task Assignment, etc.) without requiring a live Claude API key. Change it to `false` and provide an `ANTHROPIC_API_KEY` to use real AI features.

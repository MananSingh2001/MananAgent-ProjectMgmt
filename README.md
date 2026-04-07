# Manan Agent — Multi-Agent AI System

> **APAC GenAI Academy | Final Project Submission**

🚀 **Live Demo:** [https://manan-agent-332997736058.us-central1.run.app](https://manan-agent-332997736058.us-central1.run.app)

## Overview

Manan Agent is a **multi-agent AI system** that transforms project management from static tracking to active, autonomous agent orchestration. It uses **Google Gemini 2.0 Flash** as the primary reasoning engine to classify user intent and route tasks to specialized sub-agents.

## Architecture

```
User → React UI → Express Backend → Gemini Orchestrator
                                         ↓
                         ┌────────────────┼────────────────┐
                         ↓                ↓                ↓
                    Task Agent       Repo Agent       Notes Agent
                   (Supabase)        (GitHub)        (Gemini AI)
```

### Core Components

| Component | Technology | Role |
|-----------|-----------|------|
| **Frontend** | React + Vite + Tailwind CSS + Framer Motion | Premium glassmorphism UI with real-time agent status |
| **Backend** | Node.js + Express | REST API server, static file serving, orchestration |
| **Orchestrator** | Google Gemini 2.0 Flash | Intent classification & agent routing |
| **Task Agent** | Supabase (PostgreSQL) | CRUD operations for tasks and milestones |
| **Repo Agent** | GitHub API (Octokit) | Repository and issue management |
| **Notes Agent** | Gemini AI | Intelligent note-taking and summarization |

## Tech Stack

- **AI Model:** Google Gemini 2.0 Flash (via `@google/generative-ai` SDK)
- **Frontend:** React 19, Vite 8, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend:** Node.js 20, Express
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Google Cloud Run (containerized via Docker)
- **CI/CD:** Multi-stage Dockerfile with automated builds

## Project Structure

```
├── client/                 # React frontend (Vite)
│   ├── src/App.tsx         # Main UI with agent dashboard
│   └── package.json
├── server/                 # Express backend
│   ├── index.js            # Orchestrator & API routes
│   └── agents/
│       ├── task_agent.js   # Supabase task management
│       ├── repo_agent.js   # GitHub repository operations
│       └── notes_agent.js  # AI-powered note taking
├── Dockerfile              # Multi-stage production build
└── README.md
```

## Deployment

### Prerequisites
- Google Cloud account with Cloud Run enabled
- API keys for: Gemini AI, Supabase, GitHub

### Deploy to Cloud Run

```bash
gcloud run deploy manan-agent \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=<key>,SUPABASE_URL=<url>,SUPABASE_KEY=<key>,GITHUB_TOKEN=<token>,GITHUB_OWNER=<owner>"
```

## Key Features

- **Intelligent Routing:** Gemini classifies user requests and routes to the appropriate agent
- **Real-time Status:** Live agent status indicators (Task, Repo, Notes)
- **Premium UI:** Dark glassmorphism design with smooth animations
- **Production Ready:** Dockerized and deployed on Google Cloud Run

## Author

**Manan Singh** — Built for the APAC GenAI Academy

- GitHub: [@MananSingh2001](https://github.com/MananSingh2001)

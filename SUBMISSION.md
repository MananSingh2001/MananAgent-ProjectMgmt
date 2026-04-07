# APAC GenAI Academy — Final Submission

## Project: Manan Agent (Multi-Agent AI System)

### Submission Links

| Item | Link |
|------|------|
| **GitHub Repository** | [github.com/MananSingh2001/MananAgent-ProjectMgmt](https://github.com/MananSingh2001/MananAgent-ProjectMgmt) |
| **Live Deployment** | [manan-agent-332997736058.us-central1.run.app](https://manan-agent-332997736058.us-central1.run.app) |
| **GCP Project** | moonlit-outlet-491915-t5 |
| **Region** | us-central1 |

---

## Slide 1: Project Title & Team

**Project Name:** Manan Agent: Multi-Agent AI System  
**Team Member:** Manan Singh  
**Vision:** Transforming project management from static tracking to active, autonomous agent orchestration.

---

## Slide 2: The Problem Statement

- **The Gap:** Conventional PM tools like Jira or Linear require manual updates across Supabase (tasks), GitHub (code), and documentation (notes).
- **The Pain Point:** Developers lose context switching between these platforms, leading to project drift and missing documentation.

---

## Slide 3: The Solution (Architecture)

**The Manan Agent Ecosystem:** Built with Node.js and Gemini 2.0 Flash for low-latency reasoning.

1. **The Orchestrator:** Powered by Gemini, classifies user intent and routes to the correct agent.
2. **Task Agent (Supabase):** Automates database updates for deadlines and milestones.
3. **Repo Agent (GitHub):** Syncs code progress with project status via Octokit.
4. **Notes Agent:** Summarizes meetings and updates technical documentation.

---

## Slide 4: Key Outcomes & Tech Stack

- **Performance:** Deployed as a containerized service on **Google Cloud Run** for massive scalability.
- **Design:** Premium, dynamic UI built with **React (Vite)** and Framer Motion animations (glassmorphism).
- **Integration:** Seamless cross-platform automation between Supabase and GitHub via secure agentic handles.
- **AI Model:** Google Gemini 2.0 Flash — state-of-the-art reasoning for intent classification.

---

## Slide 5: Demo & Conclusion

- **Final Status:** Live and fully deployed at [manan-agent-332997736058.us-central1.run.app](https://manan-agent-332997736058.us-central1.run.app).
- **Future Vision:** Integration with Slack, Google Calendar, and Jira to create the ultimate autonomous project hub.

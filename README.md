# Manan Agent: Multi-Agent AI Project Management

A powerful multi-agent AI system designed to manage tasks, GitHub repositories, and information using a primary orchestrator and specialized sub-agents.

## Core Architecture

- **Primary Agent (Orchestrator)**: Routes user prompts based on intent classification.
- **Task Agent**: Integrates with Supabase for CRUD operations on tasks.
- **Repo Agent**: Uses `octokit` to manage GitHub repositories and issues.
- **Notes Agent**: Handles persistence of notes and information.

## How it works

1.  **User Input**: User provides a natural language prompt (e.g., "Create a new repo named 'AwesomeApp'").
2.  **Classification**: The Primary Agent classifies the intent into `TASK_MGMT`, `REPO_MGMT`, or `NOTES_MGMT`.
3.  **Specialized Execution**: The chosen agent processes the specific request using LLM reasoning to determine the exact action and parameters.
4.  **Database/Tool Interaction**: The sub-agent calls external APIs (GitHub/Supabase) to persist data or perform actions.
5.  **Feedback**: The system returns a structured response to the user.

## Setup Instructions

### Prerequisites
- Node.js installed.
- Supabase Project ID and API Key.
- GitHub Personal Access Token.
- Google Gemini API Key.

### Server Setup
1.  Navigate to the \`server\` directory:
    \`\`\`bash
    cd server
    \`\`\`
2.  Install dependencies:
    \`\`\`bash
    npm install
    \`\`\`
3.  Configure your \`.env\` file with required keys.
4.  Launch the server:
    \`\`\`bash
    node index.js
    \`\`\`

### Client Setup
1.  Navigate to the \`client\` directory:
    \`\`\`bash
    cd client
    \`\`\`
2.  Install dependencies:
    \`\`\`bash
    npm install
    \`\`\`
3.  Start the development server:
    \`\`\`bash
    npm run dev
    \`\`\`

## Technologies Used
- Backend: **Node.js, Express**
- Frontend: **React, Tailwind CSS, Framer Motion, Lucide Icons**
- AI Model: **Google Gemini 1.5 Flash**
- Database: **Supabase**
- Repository Management: **GitHub Octokit**

Built as part of the APAC GenAI Academy Challenge.

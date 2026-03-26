const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const TaskAgent = require('./agents/task_agent');
const RepoAgent = require('./agents/repo_agent');
const NotesAgent = require('./agents/notes_agent');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define agents
const taskAgent = new TaskAgent();
const repoAgent = new RepoAgent();
const notesAgent = new NotesAgent();

app.post('/api/orchestrate', async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Orchestrator logic: Categorize the prompt
        const classificationPrompt = `
        Classify the following user request into one of these categories:
        1. TASK_MGMT - For creating, listing, or updating tasks/todos.
        2. REPO_MGMT - For GitHub repository management like listing repos or creating issues.
        3. NOTES_MGMT - For taking notes or searching information.

        User Request: "${prompt}"

        Return ONLY the category name.
        `;

        const result = await model.generateContent(classificationPrompt);
        const category = result.response.text().trim();

        console.log(`Request Category: ${category}`);

        let response;
        switch (category) {
            case 'TASK_MGMT':
                response = await taskAgent.process(prompt, model);
                break;
            case 'REPO_MGMT':
                response = await repoAgent.process(prompt, model);
                break;
            case 'NOTES_MGMT':
                response = await notesAgent.process(prompt, model);
                break;
            default:
                response = "I'm not sure how to handle this request. Please specify if it's about tasks, GitHub, or notes.";
        }

        res.json({ category, response });
    } catch (error) {
        console.error('Error in orchestration:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

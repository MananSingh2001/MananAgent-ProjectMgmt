const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const TaskAgent = require('./agents/task_agent');
const RepoAgent = require('./agents/repo_agent');
const NotesAgent = require('./agents/notes_agent');

const app = express();
app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

const PORT = process.env.PORT || 8080;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const taskAgent = new TaskAgent();
const repoAgent = new RepoAgent();
const notesAgent = new NotesAgent();

app.post('/api/orchestrate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const classificationPrompt = `Classify the following user request into one of these categories:
1. TASK_MGMT - For creating, listing, or updating tasks/todos.
2. REPO_MGMT - For GitHub repository management like listing repos or creating issues.
3. NOTES_MGMT - For taking notes or searching information.

User Request: "${prompt}"

Return ONLY the category name.`;

        const result = await model.generateContent(classificationPrompt);
        const category = result.response.text().trim();

        console.log('Request Category:', category);

        let response;
        if (category.includes('TASK')) {
            response = await taskAgent.process(prompt, model);
        } else if (category.includes('REPO')) {
            response = await repoAgent.process(prompt, model);
        } else if (category.includes('NOTES')) {
            response = await notesAgent.process(prompt, model);
        } else {
            response = "I'm not sure how to handle this request. Please specify if it's about tasks, GitHub, or notes.";
        }

        res.json({ category, response });
    } catch (error) {
        console.error('Orchestration error:', error.message || error);
        res.status(500).json({ error: error.message || 'Failed to process request' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});

const { Octokit } = require('octokit');

class RepoAgent {
    constructor() {
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        this.owner = process.env.GITHUB_OWNER || 'MananSingh2001';
    }

    async process(prompt, model) {
        const repoActionPrompt = `
        User Request: "${prompt}"
        
        Available Actions:
        - "LIST_REPOS": List current repositories.
        - "CREATE_REPO": Create a new GitHub repository. Requires a name.
        - "LIST_ISSUES": List issues for a repository. Requires a name.
        - "CREATE_ISSUE": Create an issue in a repository. Requires a name, title, and body.

        Return a JSON object:
        {
          "action": "LIST_REPOS" | "CREATE_REPO" | "LIST_ISSUES" | "CREATE_ISSUE",
          "data": {
            "name": "string",
            "title": "string",
            "body": "string"
          }
        }
        `;

        const result = await model.generateContent(repoActionPrompt);
        const actionData = JSON.parse(result.response.text().replace(/```json|```|/g, '').trim());

        console.log(`Repo Agent Action: ${actionData.action}`);

        switch (actionData.action) {
            case 'LIST_REPOS': return this.listRepos();
            case 'CREATE_REPO': return this.createRepo(actionData.data);
            case 'LIST_ISSUES': return this.listIssues(actionData.data);
            case 'CREATE_ISSUE': return this.createIssue(actionData.data);
            default: return "No repo-related action identified.";
        }
    }

    async listRepos() {
        const { data } = await this.octokit.rest.repos.listForAuthenticatedUser();
        return data.map(repo => repo.name);
    }

    async createRepo(data) {
        const { name } = data;
        const { error } = await this.octokit.rest.repos.createForAuthenticatedUser({ name, private: true });
        if (error) return `Error creating repository: ${error.message}`;
        return "Repository created successfully!";
    }

    async listIssues(data) {
        const { name } = data;
        const { data: issues } = await this.octokit.rest.issues.listForRepo({ owner: this.owner, repo: name });
        return issues.map(issue => issue.title);
    }

    async createIssue(data) {
        const { name, title, body } = data;
        const { error } = await this.octokit.rest.issues.create({ owner: this.owner, repo: name, title, body });
        if (error) return `Error creating issue: ${error.message}`;
        return "Issue created successfully!";
    }
}

module.exports = RepoAgent;

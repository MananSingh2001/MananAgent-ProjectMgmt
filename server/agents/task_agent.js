const { createClient } = require('@supabase/supabase-js');

class TaskAgent {
    constructor() {
        this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }

    async process(prompt, model) {
        const taskActionPrompt = `
        User Request: "${prompt}"
        
        Available Actions:
        - "LIST": List current tasks.
        - "CREATE": Create a new task. Requires a title and description.
        - "UPDATE": Update task status or details.
        - "DELETE": Delete a task.

        Return a JSON object:
        {
          "action": "LIST" | "CREATE" | "UPDATE" | "DELETE",
          "data": {
            "title": "string",
            "description": "string",
            "status": "string",
            "id": "uuid" (for update/delete)
          }
        }
        `;

        const result = await model.generateContent(taskActionPrompt);
        const actionData = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());

        console.log(`Task Agent Action: ${actionData.action}`);

        switch (actionData.action) {
            case 'LIST': return this.listTasks();
            case 'CREATE': return this.createTask(actionData.data);
            case 'UPDATE': return this.updateTask(actionData.data);
            case 'DELETE': return this.deleteTask(actionData.data);
            default: return "No task-related action identified.";
        }
    }

    async listTasks() {
        const { data, error } = await this.supabase.from('tasks').select('*');
        if (error) return `Error listing tasks: ${error.message}`;
        return data;
    }

    async createTask(data) {
        const { title, description } = data;
        const { error } = await this.supabase.from('tasks').insert([{ title, description, status: 'pending' }]);
        if (error) return `Error creating task: ${error.message}`;
        return "Task created successfully!";
    }

    async updateTask(data) {
        const { id, status } = data;
        const { error } = await this.supabase.from('tasks').update({ status }).eq('id', id);
        if (error) return `Error updating task: ${error.message}`;
        return "Task updated successfully!";
    }

    async deleteTask(data) {
        const { id } = data;
        const { error } = await this.supabase.from('tasks').delete().eq('id', id);
        if (error) return `Error deleting task: ${error.message}`;
        return "Task deleted successfully!";
    }
}

module.exports = TaskAgent;

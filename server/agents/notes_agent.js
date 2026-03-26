const { createClient } = require('@supabase/supabase-js');

class NotesAgent {
    constructor() {
        this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }

    async process(prompt, model) {
        const notesActionPrompt = `
        User Request: "${prompt}"
        
        Available Actions:
        - "LIST": List all notes.
        - "CREATE": Create a new note. Requires a title and content.
        - "SEARCH": Search for a note by content.

        Return a JSON object:
        {
          "action": "LIST" | "CREATE" | "SEARCH",
          "data": {
            "title": "string",
            "content": "string",
            "query": "string"
          }
        }
        `;

        const result = await model.generateContent(notesActionPrompt);
        const actionData = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());

        console.log(`Notes Agent Action: ${actionData.action}`);

        switch (actionData.action) {
            case 'LIST': return this.listNotes();
            case 'CREATE': return this.createNote(actionData.data);
            case 'SEARCH': return this.searchNotes(actionData.data);
            default: return "No notes-related action identified.";
        }
    }

    async listNotes() {
        const { data, error } = await this.supabase.from('notes').select('*');
        if (error) return `Error listing notes: ${error.message}`;
        return data.map(note => note.title);
    }

    async createNote(data) {
        const { title, content } = data;
        const { error } = await this.supabase.from('notes').insert([{ title, content }]);
        if (error) return `Error creating note: ${error.message}`;
        return "Note created successfully!";
    }

    async searchNotes(data) {
        const { query } = data;
        const { data: notes, error } = await this.supabase.from('notes').select('*').ilike('content', `%${query}%`);
        if (error) return `Error searching notes: ${error.message}`;
        return notes.map(note => note.title);
    }
}

module.exports = NotesAgent;

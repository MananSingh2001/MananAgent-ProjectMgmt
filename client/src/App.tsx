import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, User, Send, Layout, List, Github, StickyNote, Activity, Database, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'agent'; content: any; category?: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [agentStatus, setAgentStatus] = useState({
        task: 'idle',
        repo: 'idle',
        notes: 'idle'
    });

    const handleSend = async () => {
        if (!prompt.trim()) return;

        const userMsg = { role: 'user', content: prompt } as const;
        setMessages(prev => [...prev, userMsg]);
        setPrompt('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/orchestrate', { prompt });
            const { category, response } = res.data;
            
            // Update agent status animation
            setAgentStatus(prev => ({ 
                ...prev, 
                [category.split('_')[0].toLowerCase()]: 'active' 
            }));
            
            setTimeout(() => {
                setAgentStatus({ task: 'idle', repo: 'idle', notes: 'idle' });
            }, 2000);

            setMessages(prev => [...prev, { role: 'agent', content: response, category }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'agent', content: "Failed to connect to the Multi-Agent System. Please ensure the server is running." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-[#f8fafc] flex font-sans overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-[rgba(255,255,255,0.05)] bg-[#121216] flex flex-col p-6 space-y-8">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Manan Agent</h1>
                        <p className="text-xs text-[#94a3b8] font-medium tracking-widest uppercase">Multi-Agent AI</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-[#64748b] uppercase tracking-widest">Core Agents</h2>
                    <AgentCard name="Task Agent" status={agentStatus.task} icon={<List className="w-5 h-5" />} />
                    <AgentCard name="Repo Agent" status={agentStatus.repo} icon={<Github className="w-5 h-5" />} />
                    <AgentCard name="Notes Agent" status={agentStatus.notes} icon={<StickyNote className="w-5 h-5" />} />
                </div>

                <div className="mt-auto glass p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#94a3b8]">Uptime</span>
                        <span className="text-indigo-400 font-mono">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#94a3b8]">Database</span>
                        <span className="text-green-400 font-mono">Connected</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c] to-[#121216]">
                {/* Header */}
                <header className="h-20 border-b border-[rgba(255,255,255,0.05)] px-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] px-4 py-2 rounded-full">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-medium tracking-tight text-[#94a3b8]">Dashboard Overview</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#121216] bg-[#1e293b]" />
                            ))}
                        </div>
                    </div>
                </header>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 scroll-smooth" id="message-container">
                    <AnimatePresence>
                        {messages.length === 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full flex flex-col items-center justify-center space-y-6"
                            >
                                <Bot className="w-20 h-20 text-[#1e293b]" />
                                <h3 className="text-2xl font-bold gradient-text">How can I help you today?</h3>
                                <p className="text-[#64748b] max-w-md text-center leading-relaxed">
                                    I am an orchestrator for multiple specialized agents. 
                                    I can manage your tasks, GitHub repositories, and notes all in one place.
                                </p>
                            </motion.div>
                        )}
                        {messages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start space-x-4 max-w-[80%]`}>
                                    {msg.role === 'agent' && (
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex-shrink-0 flex items-center justify-center mt-1">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                    <div className={`p-5 rounded-2xl glass border ${msg.role === 'user' ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-white/5'}`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{JSON.stringify(msg.content, null, 2).replace(/["[\]{}]/g, '')}</p>
                                        {msg.category && (
                                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center space-x-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                                                    Processed by ${msg.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-lg bg-[#334155] flex-shrink-0 flex items-center justify-center mt-1">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <div className="flex justify-start items-center space-x-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 animate-pulse" />
                            <div className="glass px-6 py-4 flex space-x-2">
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-indigo-400" />
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-blue-300" />
                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-indigo-400" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="px-10 pb-10">
                    <div className="relative glass border-white/10 p-2 flex items-center">
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent border-none focus:outline-none px-6 py-4 text-sm font-medium" 
                            placeholder="Instruct the multi-agent system..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AgentCard = ({ name, status, icon }: { name: string, status: string, icon: any }) => (
    <div className={`glass p-4 flex items-center justify-between border-l-4 transition-all duration-500 ${status === 'active' ? 'border-indigo-500 bg-indigo-500/5' : 'border-transparent'}`}>
        <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status === 'active' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-[#94a3b8]'}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-bold tracking-tight">{name}</p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-indigo-500 animate-pulse' : 'bg-gray-600'}`} />
                    <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">{status}</p>
                </div>
            </div>
        </div>
    </div>
);

export default App;

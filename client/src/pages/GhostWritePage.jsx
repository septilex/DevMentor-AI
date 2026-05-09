import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { generateCode } from '../services/api';
import { Wand2, Copy, Check, ArrowLeft, Sparkles, Zap, Code2 } from 'lucide-react';

const GhostWritePage = () => {
    const [prompt, setPrompt] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [generatedCode, setGeneratedCode] = useState('// Your intelligent boilerplate will manifest here...');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setGeneratedCode('// Summoning digital architect...');
        try {
            const data = await generateCode(prompt, language);
            setGeneratedCode(data.code);
        } catch (error) {
            setGeneratedCode('// Connection to the ether failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-screen flex flex-col text-[#1d1d1f] overflow-hidden relative font-sans selection:bg-yellow-400 selection:text-black">

            {/* Ambient Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[80px] pointer-events-none transform-gpu" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-yellow-400/10 rounded-full blur-[80px] pointer-events-none transform-gpu mix-blend-multiply" />

            {/* Liquid Glass Toolbar */}
            <div className="z-10 h-16 shrink-0 mx-6 mt-6 rounded-[1.5rem] flex justify-between items-center px-6 mb-6
                bg-white/80 backdrop-blur-md border border-white/60 shadow-lg shadow-black/5 ring-1 ring-white/50 transform-gpu">

                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 group cursor-pointer text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold text-sm">Back to Hub</span>
                    </Link>

                    <div className="h-6 w-px bg-gray-300/50" />

                    <div className="flex items-center gap-2 text-gray-900 font-bold tracking-tight">
                        <div className="p-1.5 bg-purple-100 rounded-lg">
                            <Wand2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <span>Ghost Write <span className="text-gray-400 font-normal">Engine</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:block">Powered by OpenAI</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>

            {/* Main Content liquid Container */}
            <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-6">

                {/* Input Panel */}
                <div className="w-1/3 flex flex-col rounded-[2.5rem] overflow-hidden relative group transition-all
                    bg-white/80 backdrop-blur-sm border border-white/80 shadow-xl shadow-black/5 ring-1 ring-white/50">

                    <div className="p-8 flex flex-col h-full">
                        <h2 className="text-3xl font-bold mb-2 text-gray-900">Architect Specs</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">Describe the component or logic you need. Be specific about patterns (e.g., "Singleton", "Middleware").</p>

                        <div className="space-y-6 flex-1">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Stack</label>
                                <div className="relative">
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all appearance-none cursor-pointer hover:bg-white"
                                    >
                                        <option value="javascript">JavaScript (Node/React)</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                    </select>
                                    <Code2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Blueprint</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g., Create a secure Express.js authentication middleware using JWT and bcrypt..."
                                    className="flex-1 w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-4 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all resize-none placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="w-full mt-6 py-4 bg-[#1d1d1f] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-white shadow-xl shadow-purple-900/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            {loading ? (
                                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 animate-spin" /> Drafting...</span>
                            ) : (
                                <>Generate Boilerplate <Wand2 className="w-5 h-5 text-purple-400" /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="w-2/3 flex flex-col rounded-[2.5rem] overflow-hidden relative transition-all
                    bg-white/90 backdrop-blur-sm border border-white/80 shadow-xl shadow-black/5 ring-1 ring-white/50">

                    <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-white/40">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                        </div>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 transition-colors shadow-sm"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied' : 'Copy Code'}
                        </button>
                    </div>

                    <div className="flex-1 relative bg-white/50">
                        <CodeEditor code={generatedCode} setCode={() => { }} language={language} theme="light" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GhostWritePage;

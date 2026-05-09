import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import ResultsPanel from '../components/ResultsPanel';
import { analyzeCode } from '../services/api';
import { Play, Activity, Code2, AlertCircle, ChevronDown, Sparkles, Wand2, FileText, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AnalysisPage = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'analysis';
    const initialLang = queryParams.get('lang') || 'javascript';

    const [code, setCode] = useState('// Paste your code here\nfunction example() {\n  console.log("Hello World");\n}');
    const [language, setLanguage] = useState(initialLang);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(initialTab);

    // Sync activeTab if URL changes
    useEffect(() => {
        if (queryParams.get('tab')) {
            setActiveTab(queryParams.get('tab'));
        }
    }, [location.search]);

    const handleAnalyze = async () => {
        setLoading(true);
        setActiveTab('analysis'); // Force switch to analysis view on new run
        setResults(null);
        setError(null);
        try {
            const data = await analyzeCode(code, language);
            setResults(data);
        } catch (err) {
            console.error("Analysis failed", err);
            const serverMessage = err.response?.data?.issues?.[0]?.message;
            setError(serverMessage || err.message || "Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col text-primary overflow-hidden relative font-sans selection:bg-yellow-400 selection:text-black bg-background transition-colors duration-300">

            {/* Liquid Glass Toolbar - Reduced blur, increased opacity */}
            <div className="z-10 h-16 shrink-0 mx-6 mt-6 rounded-[1.5rem] flex justify-between items-center px-6 mb-6
                bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg shadow-black/5 ring-1 ring-white/50 dark:ring-white/10 transform-gpu transition-colors duration-300">

                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                        <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight group-hover:opacity-80 transition-opacity">
                            DevMentor <span className="text-gray-400 font-medium">AI</span>
                        </span>
                    </Link>

                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-50" />

                    <div className="relative group">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="appearance-none bg-white/50 dark:bg-neutral-800/50 hover:bg-white/80 dark:hover:bg-neutral-800/80 border border-white/60 dark:border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all cursor-pointer text-gray-700 dark:text-gray-200"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                        </select>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">

                    {/* USP Quick Links */}
                    <div className="flex items-center gap-2 mr-2">
                        <Link to="/ghost-write" className="p-2.5 rounded-xl hover:bg-gray-100/80 text-gray-500 hover:text-purple-600 transition-all group relative" title="Ghost Write Engine">
                            <Wand2 className="w-5 h-5" />
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <button
                            onClick={() => setActiveTab('docs')}
                            className={`p-2.5 rounded-xl hover:bg-gray-100/80 transition-all group relative ${activeTab === 'docs' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600'}`}
                            title="Auto-Docs"
                        >
                            <FileText className="w-5 h-5" />
                            {activeTab === 'docs' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('impact')}
                            className={`p-2.5 rounded-xl hover:bg-gray-100/80 transition-all group relative ${activeTab === 'impact' ? 'text-amber-600 bg-amber-50' : 'text-gray-500 hover:text-amber-600'}`}
                            title="Impact Analysis"
                        >
                            <Activity className="w-5 h-5" />
                            {activeTab === 'impact' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />}
                        </button>
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-1" />

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="relative group overflow-hidden pl-4 pr-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all 
                        bg-[#1d1d1f] dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        <div className="bg-yellow-500 rounded-full p-1 group-hover:rotate-180 transition-transform duration-500">
                            {loading ? <Activity className="w-3.5 h-3.5 text-black animate-spin" /> : <Play className="w-3.5 h-3.5 text-black fill-current" />}
                        </div>
                        <span>{loading ? 'Analyzing...' : 'Run Analysis'}</span>
                    </button>
                </div>
            </div>

            {/* Main Content liquid Container */}
            <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-6">

                {/* Editor Liquid Card - REMOVED heavy blur, increased opacity for performance */}
                <div className="w-1/2 flex flex-col rounded-[2.5rem] overflow-hidden relative group transition-all duration-500
                    bg-white/85 dark:bg-neutral-900/85 backdrop-blur-sm border border-white/80 dark:border-white/10 shadow-xl shadow-black/5 ring-1 ring-white/50 dark:ring-white/10 hover:shadow-2xl hover:shadow-yellow-500/10 transform-gpu">

                    {/* Glass Header */}
                    <div className="px-6 py-4 border-b border-white/30 dark:border-white/5 flex items-center justify-between bg-white/20 dark:bg-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Input Stream</span>
                        </div>
                        <div className="flex gap-2 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm" />
                            <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-sm" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-sm" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 relative bg-white/30 dark:bg-black/30 backdrop-blur-sm">
                        <CodeEditor code={code} setCode={setCode} language={language} theme={theme} />
                    </div>
                </div>

                {/* Results Liquid Card - REMOVED heavy blur, increased opacity for performance */}
                <div className="w-1/2 flex flex-col rounded-[2.5rem] overflow-hidden relative transition-all duration-500
                    bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-white/80 dark:border-white/10 shadow-xl shadow-black/5 ring-1 ring-white/50 dark:ring-white/10 hover:shadow-2xl hover:shadow-yellow-500/10 transform-gpu">

                    {error ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-6 shadow-inner rotate-3 hover:rotate-6 transition-transform">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analysis Failed</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed font-medium">{error}</p>
                            <button onClick={handleAnalyze} className="px-6 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-full font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-sm dark:text-white">
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <ResultsPanel results={results} loading={loading} code={code} language={language} activeTab={activeTab} onTabChange={setActiveTab} />
                    )}
                </div>
            </div>

            {/* Ambient Background Elements (Subtle for Light Mode) */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[80px] pointer-events-none transform-gpu" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[80px] pointer-events-none transform-gpu mix-blend-multiply" />
        </div>
    );
};

export default AnalysisPage;

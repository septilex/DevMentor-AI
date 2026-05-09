import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Zap, Activity, FileText, ChevronRight, Terminal, Github } from 'lucide-react';

const SpotlightCard = ({ to, children, className }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <Link
            to={to}
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
                }}
            />
            {children}
        </Link>
    );
};

const LandingPage = () => {
    const [terminalLines, setTerminalLines] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setTerminalLines(1), 800);
        const t2 = setTimeout(() => setTerminalLines(2), 1600);
        const t3 = setTimeout(() => setTerminalLines(3), 2400);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);
    return (
        <div className="min-h-screen pt-24 pb-20 relative overflow-hidden text-gray-900 dark:text-gray-100 transition-colors duration-300">
            
            {/* Background glowing orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-400/10 dark:bg-blue-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-gray-300/30 dark:bg-indigo-600/10 blur-[100px] pointer-events-none" />

            {/* Header Section */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 animate-float" style={{animationDuration: '8s'}}>
                <div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
                        <span className="text-gray-900 dark:text-white transition-colors duration-300">DevMentor</span> <span className="gradient-accent text-glow">AI</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl transition-colors duration-300">
                        The ultimate AI pair programmer.<br/>
                        <span className="text-gray-900 dark:text-white transition-colors duration-300">Write code that writes history.</span>
                    </p>
                    <div className="mt-8 flex gap-4">
                        <Link to="/analyze" className="px-8 py-3 bg-white/80 dark:bg-black/50 backdrop-blur-md border border-white/60 dark:border-white/20 rounded-full font-semibold text-gray-900 dark:text-white shadow-[0_8px_30px_rgba(0,122,255,0.15)] hover:shadow-[0_12px_40px_rgba(0,122,255,0.25)] hover:bg-white dark:hover:bg-black hover:scale-105 transition-all duration-300">
                            Start Analyzing
                        </Link>
                        <a href="https://github.com/prxjitbxl/DevMentor" target="_blank" rel="noreferrer" className="px-8 py-3 glass rounded-full font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                            <Github className="w-5 h-5" /> Star on GitHub
                        </a>
                    </div>
                </div>
                
                {/* Micro Terminal Widget */}
                <div className="hidden md:flex flex-col w-[350px] glass-card rounded-2xl p-4 font-mono text-sm shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-gray-300 group-hover:from-blue-500 group-hover:to-gray-400 transition-all duration-700"></div>
                    <div className="flex gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-semibold">~ devmentor init --ai</div>
                    {terminalLines >= 1 && <div className="text-gray-500 dark:text-gray-400 mt-1">&gt; Analyzing dependencies... [OK]</div>}
                    {terminalLines >= 2 && <div className="text-gray-700 dark:text-gray-300 mt-1">&gt; Code Intelligence Ready.</div>}
                    <div className={`w-2 h-4 bg-gray-400 dark:bg-white mt-1 ${terminalLines >= 3 ? 'animate-pulse' : 'hidden'}`}></div>
                </div>
            </div>

            {/* Main Feature Cards */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-10 relative z-10">

                {/* Code Analysis Card */}
                <SpotlightCard to="/analyze" className="glass-card rounded-[2rem] p-8 h-[400px] flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-500/10 dark:bg-blue-500/20 blur-[40px] rounded-full group-hover:bg-blue-400/20 transition-colors duration-500"></div>
                    <div className="z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center mb-6 border border-white/80 dark:border-white/20 shadow-sm group-hover:border-blue-400/40 transition-colors">
                            <Terminal className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Deep Analysis</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Instantly discover performance bottlenecks, security flaws, and syntax smells.</p>
                    </div>
                    <div className="z-10 mt-auto flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                        Run Audit <ArrowRight className="w-4 h-4" />
                    </div>
                </SpotlightCard>

                {/* Ghost Write Card */}
                <SpotlightCard to="/ghost-write" className="glass-card rounded-[2rem] p-8 h-[400px] flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[40px] rounded-full group-hover:bg-indigo-400/20 transition-colors duration-500"></div>
                    <div className="z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center mb-6 border border-white/80 dark:border-white/20 shadow-sm group-hover:border-indigo-400/40 transition-colors">
                            <Code className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">Ghost Write</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Summon production-ready boilerplate architectures instantly using AI intent.</p>
                    </div>
                    <div className="z-10 mt-auto flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-2 transition-transform">
                        Start Architecting <ArrowRight className="w-4 h-4" />
                    </div>
                </SpotlightCard>

                {/* Auto Docs / Impact Card */}
                <SpotlightCard to="/analyze?tab=impact" className="glass-card rounded-[2rem] p-8 h-[400px] flex flex-col justify-between relative overflow-hidden group">
                     {/* Multi-gradient backdrop blob */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-300/10 to-gray-300/10 dark:from-purple-500/20 dark:to-indigo-500/20 blur-[40px] rounded-full group-hover:scale-125 transition-transform duration-700"></div>
                     
                    <div className="z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center mb-6 border border-white/80 dark:border-white/20 shadow-sm group-hover:border-gray-500/40 transition-colors">
                            <Activity className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Impact & Docs</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Predict the ripple effect of your code changes and automatically generate PR-ready markdowns.</p>
                    </div>
                    <div className="z-10 mt-auto flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold group-hover:translate-x-2 transition-transform">
                        Visualize Graph <ArrowRight className="w-4 h-4" />
                    </div>
                </SpotlightCard>

            </div>

            {/* Tech Stack Banner */}
             <div className="max-w-[1400px] mx-auto px-6 md:px-10 mt-20 relative z-10 hidden sm:block">
                <div className="glass rounded-[2rem] p-10 flex items-center justify-between overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                    <div className="absolute right-0 top-0 h-full w-[30%] bg-gradient-to-l from-blue-500/5 dark:from-indigo-500/20 to-transparent pointer-events-none"></div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Supported Engines</h3>
                        <p className="text-gray-500 dark:text-gray-400">Seamless integration across your favorite environments.</p>
                    </div>
                    <div className="flex gap-6">
                        {['JavaScript', 'Python', 'React', 'Node.js', 'C++'].map((tech) => (
                             <div key={tech} className="px-5 py-2 glass rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-colors cursor-default border border-white/60 dark:border-white/20">
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LandingPage;

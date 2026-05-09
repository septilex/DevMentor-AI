import React from 'react';
import { AlertCircle, CheckCircle, Clock, Zap, ShieldAlert, ChevronDown, ChevronUp, FileText, Activity, GitCommit, Sparkles } from 'lucide-react';
import { generateDocs, analyzeImpact } from '../services/api';

const ResultsPanel = ({ results, loading, code, language, activeTab, onTabChange }) => {
    const [docs, setDocs] = React.useState(null);
    const [docLoading, setDocLoading] = React.useState(false);
    const [impact, setImpact] = React.useState(null);
    const [impactLoading, setImpactLoading] = React.useState(false);

    const handleGenerateDocs = async () => {
        if (!code) return;
        setDocLoading(true);
        try {
            const data = await generateDocs(code, language);
            setDocs(data.docs);
        } catch (e) {
            console.error(e);
        } finally {
            setDocLoading(false);
        }
    };

    const handleImpactAnalysis = async () => {
        if (!code) return;
        setImpactLoading(true);
        try {
            const data = await analyzeImpact(code, language);
            setImpact(data);
        } catch (e) {
            console.error(e);
        } finally {
            setImpactLoading(false);
        }
    };

    // Auto-trigger analysis when switching to tabs if data missing
    React.useEffect(() => {
        if (activeTab === 'docs' && !docs && code) handleGenerateDocs();
        if (activeTab === 'impact' && !impact && code) handleImpactAnalysis();
    }, [activeTab]);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center animate-pulse gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 animate-pulse"></div>
                    <div className="relative p-6 bg-white/50 backdrop-blur-xl rounded-full border border-white/60 shadow-lg">
                        <Zap className="w-10 h-10 text-yellow-500 animate-bounce" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Molecules...</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Checking structure, purity, and performance.</p>
                </div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <div className="p-8 bg-white/20 backdrop-blur-sm rounded-[2rem] border border-white/30 shadow-inner">
                    <CodePlaceholder />
                </div>
                <p className="mt-6 text-sm font-medium tracking-wide text-gray-500 opacity-60">Results will liquefy here</p>
            </div>
        );
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600 border-emerald-200 bg-emerald-50/50';
        if (score >= 50) return 'text-amber-600 border-amber-200 bg-amber-50/50';
        return 'text-rose-600 border-rose-200 bg-rose-50/50';
    };

    return (
        <div className="h-full flex flex-col bg-white/30 dark:bg-black/30 backdrop-blur-md">
            {/* Liquid Tabs */}
            <div className="p-4 pb-0 z-10">
                <div className="flex p-1.5 bg-gray-200/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 shadow-inner">
                    <button
                        onClick={() => onTabChange('analysis')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden ${activeTab === 'analysis' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-lg shadow-black/5 ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10'}`}
                    >
                        <Zap className="w-3.5 h-3.5" /> Analysis
                        {activeTab === 'analysis' && <div className="absolute bottom-0 w-full h-0.5 bg-yellow-400" />}
                    </button>
                    <button
                        onClick={() => onTabChange('docs')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden ${activeTab === 'docs' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-lg shadow-black/5 ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10'}`}
                    >
                        <FileText className="w-3.5 h-3.5" /> Auto-Docs
                        {activeTab === 'docs' && <div className="absolute bottom-0 w-full h-0.5 bg-blue-400" />}
                    </button>
                    <button
                        onClick={() => onTabChange('impact')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden ${activeTab === 'impact' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-lg shadow-black/5 ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10'}`}
                    >
                        <Activity className="w-3.5 h-3.5" /> Impact
                        {activeTab === 'impact' && <div className="absolute bottom-0 w-full h-0.5 bg-purple-400" />}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 text-gray-700 dark:text-gray-300 custom-scrollbar relative">

                {activeTab === 'analysis' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Health Score Glass Card */}
                        <section className="bg-white/60 dark:bg-neutral-800/60 p-5 rounded-3xl border border-white/80 dark:border-white/10 shadow-sm flex items-center justify-between backdrop-blur-xl relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/80 opacity-50 rounded-bl-3xl pointer-events-none" />
                            <div className="relative">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    Health Score
                                </h3>
                                <p className="text-gray-500 text-xs font-medium">Bugs & Purity check.</p>
                            </div>
                            <div className={`relative w-16 h-16 flex items-center justify-center rounded-full border-[6px] font-black text-xl shadow-inner ${getScoreColor(results.codeHealthScore || 0)}`}>
                                {results.codeHealthScore || 0}
                            </div>
                        </section>

                        {/* Security Analysis */}
                        {results.securityIssues && results.securityIssues.length > 0 && (
                            <section className="bg-rose-50/60 border border-rose-100/60 p-5 rounded-3xl backdrop-blur-sm">
                                <h3 className="text-sm font-bold text-rose-700 mb-4 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4" />
                                    Vulnerabilities Detected
                                </h3>
                                <div className="space-y-3">
                                    {results.securityIssues.map((issue, idx) => (
                                        <div key={idx} className="bg-white/80 p-4 rounded-2xl border border-rose-100 shadow-sm">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-[10px] text-white bg-rose-500 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm shadow-rose-200">{issue.severity}</span>
                                                <span className="font-mono text-[10px] text-gray-400">Line {issue.line}</span>
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-sm">{issue.message}</p>
                                            <p className="text-xs text-rose-800/70 dark:text-rose-300/70 leading-relaxed font-medium">{issue.reasoning}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Issues Section */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                Optimize
                            </h3>
                            <div className="space-y-3">
                                {results.issues && results.issues.length > 0 ? (
                                    results.issues.map((issue, idx) => (
                                        <IssueCard key={idx} issue={issue} />
                                    ))
                                ) : (
                                    <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl text-emerald-700 text-sm flex flex-col items-center gap-2 text-center">
                                        <div className="p-3 bg-emerald-100 rounded-full">
                                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <span className="font-semibold">Clean Code Detected!</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Complexity Section */}
                        <section className="grid grid-cols-2 gap-4">
                            <div className="bg-white/50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-all cursor-default group">
                                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-2 uppercase tracking-wider font-bold group-hover:text-blue-500 transition-colors">Time Complexity</span>
                                <span className="text-xl font-mono text-gray-800 dark:text-gray-200 font-bold tracking-tight bg-gray-100 dark:bg-black/30 px-2 py-1 rounded-lg">{results.complexity || 'N/A'}</span>
                            </div>
                            <div className="bg-white/50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-all cursor-default group">
                                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-2 uppercase tracking-wider font-bold group-hover:text-purple-500 transition-colors">Space Complexity</span>
                                <span className="text-xl font-mono text-gray-800 dark:text-gray-200 font-bold tracking-tight bg-gray-100 dark:bg-black/30 px-2 py-1 rounded-lg">{results.spaceComplexity || 'N/A'}</span>
                            </div>
                        </section>

                        {/* Refactoring Section */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                Refactored Solution
                            </h3>
                            <div className="relative group rounded-3xl overflow-hidden shadow-md">
                                <div className="absolute inset-0 bg-gray-900"></div>
                                <div className="absolute top-0 left-0 w-full h-8 bg-gray-800 flex items-center px-4 gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                </div>
                                <pre className="relative p-6 pt-12 overflow-x-auto text-[13px] font-mono text-gray-300">
                                    <code>{results.refactoredCode || '// No refactoring needed'}</code>
                                </pre>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'docs' && (
                    // ... (Docs section similar update if needed, but keeping simple for now)
                    <div className="bg-white/60 dark:bg-neutral-800/60 p-8 rounded-3xl border border-white/80 dark:border-white/10 shadow-sm backdrop-blur-xl animate-in zoom-in-95 duration-300">
                        {docLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                <Clock className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                                <span className="font-semibold text-gray-600 dark:text-gray-300">Forging Documentation...</span>
                            </div>
                        ) : (
                            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{docs || 'Click tab to generate.'}</pre>
                        )}
                    </div>
                )}

                {activeTab === 'impact' && (
                    // ... (Impact section similar update)
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {impactLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                <Activity className="w-12 h-12 animate-pulse mb-4 text-purple-500" />
                                <span className="font-semibold text-gray-600 text-lg">Calculating Impact Radius...</span>
                                <p className="text-sm text-gray-400 mt-2">Simulating dependency graph traversal</p>
                            </div>
                        ) : impact ? (
                            <>
                                {/* Impact Summary Card */}
                                <section className="grid grid-cols-2 gap-4">
                                    <div className={`p-5 rounded-3xl border shadow-sm backdrop-blur-xl flex flex-col justify-between relative overflow-hidden ${impact.riskLevel === 'High' ? 'bg-rose-50/80 border-rose-100 text-rose-900' :
                                        impact.riskLevel === 'Medium' ? 'bg-amber-50/80 border-amber-100 text-amber-900' :
                                            'bg-emerald-50/80 border-emerald-100 text-emerald-900'
                                        }`}>
                                        <div>
                                            <h3 className="text-sm font-bold opacity-80 uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <Activity className="w-4 h-4" /> Risk Level
                                            </h3>
                                            <span className="text-3xl font-black tracking-tight">{impact.riskLevel}</span>
                                        </div>
                                        <p className="text-xs font-medium opacity-70 mt-2">
                                            {impact.riskLevel === 'High' ? 'Significant breaking changes detected.' :
                                                impact.riskLevel === 'Medium' ? 'Potential side effects found.' :
                                                    'Safe to merge.'}
                                        </p>
                                    </div>

                                    <div className="bg-white/60 dark:bg-neutral-800/60 p-5 rounded-3xl border border-white/80 dark:border-white/10 shadow-sm backdrop-blur-xl flex flex-col">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Impact Scope</h3>
                                        <div className="flex-1 flex flex-col justify-end gap-2">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-800 dark:text-white">{impact.affectedFiles?.length || 0}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">Files Affected</span>
                                            </div>
                                            <div>
                                                <span className="text-2xl font-bold text-gray-800 dark:text-white">{impact.dependentServices?.length || 0}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">Services at Risk</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Simple Graph Visualization */}
                                {impact.visualGraph && (
                                    <section className="bg-[#1d1d1f] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] group-hover:bg-purple-500/30 transition-colors pointer-events-none" />
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                                            <GitCommit className="w-4 h-4 text-purple-400" /> Dependency Map
                                        </h3>

                                        <div className="h-64 w-full relative border border-white/10 rounded-2xl bg-black/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                                            <SimpleGraph graph={impact.visualGraph} />
                                        </div>
                                    </section>
                                )}

                                {/* Affected Files List */}
                                <section className="bg-white/60 dark:bg-neutral-800/60 p-5 rounded-3xl border border-white/80 dark:border-white/10 shadow-sm backdrop-blur-xl">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5 text-blue-500" /> Affected Files
                                    </h3>
                                    <div className="space-y-3">
                                        {impact.affectedFiles && impact.affectedFiles.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-neutral-700/50 transition-colors border border-transparent hover:border-white/50">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-red-400 shadow-sm shrink-0" />
                                                <div>
                                                    <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200 break-all">{item.file}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{item.reason}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(!impact.affectedFiles || impact.affectedFiles.length === 0) && (
                                            <p className="text-sm text-gray-400 italic">No files directly affected.</p>
                                        )}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <div className="text-center py-20 text-gray-400 font-medium bg-white/40 dark:bg-neutral-800/40 rounded-[2rem] border border-white/60 dark:border-white/10">
                                <div className="mb-4 flex justify-center opacity-50">
                                    <Activity className="w-10 h-10" />
                                </div>
                                <p>Run analysis to generate impact report.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const IssueCard = ({ issue }) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div className="bg-white/70 dark:bg-neutral-800/70 hover:bg-white dark:hover:bg-neutral-800 rounded-2xl border border-white/50 dark:border-white/10 hover:border-gray-200 dark:hover:border-neutral-700 transition-all duration-300 group shadow-sm hover:shadow-md backdrop-blur-sm overflow-hidden">
            <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex justify-between items-start mb-2">
                    <span className="font-bold font-mono text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">Line {issue.line}</span>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${issue.severity === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                            {issue.severity}
                        </span>
                        {expanded ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                    </div>
                </div>
                <p className="text-sm font-bold text-gray-800 leading-snug">{issue.message}</p>
            </div>

            {expanded && (
                <div className="px-5 pb-5 pt-0 text-[13px] border-t border-gray-100/50 dark:border-white/5 mt-1 bg-gray-50/30 dark:bg-black/20">
                    <div className="mt-4">
                        <strong className="text-gray-400 block text-[10px] uppercase tracking-wider mb-2">Analysis</strong>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{issue.reasoning || "No detailed explanation available."}</p>
                    </div>
                    {issue.fix_example && (
                        <div className="mt-4">
                            <strong className="text-gray-400 block text-[10px] uppercase tracking-wider mb-2">Suggested Fix</strong>
                            <code className="block bg-gray-800 p-3 rounded-lg border border-gray-700 font-mono text-emerald-400 text-xs shadow-inner">
                                {issue.fix_example}
                            </code>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const CodePlaceholder = () => (
    <svg className="w-16 h-16 opacity-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
);

export default ResultsPanel;

/* Minimal SVG Graph Visualization */
const SimpleGraph = ({ graph }) => {
    if (!graph || !graph.nodes || !graph.edges) return null;

    // Basic Layout Calculation
    // Center node is usually first or "change" type
    const centerNode = graph.nodes.find(n => n.type === 'change') || graph.nodes[0];
    const otherNodes = graph.nodes.filter(n => n.id !== centerNode.id);

    const width = 400; // viewBox width
    const height = 250; // viewBox height
    const cx = width / 2;
    const cy = height / 2;
    const radius = 80; // Distance from center

    // Assign positions
    const nodePositions = {};
    nodePositions[centerNode.id] = { x: cx, y: cy };

    otherNodes.forEach((node, index) => {
        const angle = (index / otherNodes.length) * 2 * Math.PI;
        nodePositions[node.id] = {
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle)
        };
    });

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full pointer-events-none">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
            </defs>

            {/* Edges */}
            {graph.edges.map((edge, i) => {
                const start = nodePositions[edge.from];
                const end = nodePositions[edge.to];
                if (!start || !end) return null;
                return (
                    <line
                        key={i}
                        x1={start.x} y1={start.y}
                        x2={end.x} y2={end.y}
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        markerEnd="url(#arrowhead)"
                    />
                );
            })}

            {/* Nodes */}
            {graph.nodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;
                const isCenter = node.id === centerNode.id;

                return (
                    <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                        {/* Glow for center */}
                        {isCenter && <circle r="25" fill="#a855f7" fillOpacity="0.2" className="animate-pulse" />}

                        {/* Node Circle */}
                        <circle
                            r={isCenter ? 15 : 12}
                            fill={isCenter ? "#a855f7" : (node.type === 'service' ? "#f59e0b" : "#3b82f6")}
                            stroke="white"
                            strokeWidth="2"
                            className="shadow-lg"
                        />

                        {/* Label */}
                        <text
                            y={isCenter ? 28 : 24}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.9)"
                            fontSize="10"
                            fontWeight="600"
                            className="drop-shadow-md font-sans"
                        >
                            {node.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

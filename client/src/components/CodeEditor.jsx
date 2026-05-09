import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode, language, theme }) => {
    const handleEditorChange = (value) => {
        setCode(value);
    };

    return (
        <div className="h-full w-full bg-transparent">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                language={language}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={code}
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineHeight: 24,
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    fontLigatures: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 20, bottom: 20 },
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                }}
            />
        </div>
    );
};

export default CodeEditor;

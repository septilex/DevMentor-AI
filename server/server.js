const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key', // Defaults to mock if not found
});

// Robust Language Heuristics
const detectLanguage = (code, statedLanguage) => {
    const keywords = {
        javascript: ['function', 'const', 'let', 'console.log', '=>', 'import', 'export', 'document.', 'window.', '===', 'null', 'undefined'],
        python: ['def ', 'import ', 'print(', 'class ', 'if __name__', 'return', 'elif ', 'else:', 'try:', 'except:', 'None', 'True', 'False'],
        java: ['public class', 'System.out.println', 'public static void main', 'package ', 'import java', 'private ', 'protected ', 'String ', 'new '],
        cpp: ['#include', 'std::cout', 'int main', 'using namespace', 'vector<', 'cout <<', 'cin >>', '::', '->', 'auto ', '#define']
    };

    const scores = {};
    let maxScore = 0;
    let detectedLang = null;

    Object.keys(keywords).forEach(lang => {
        let score = 0;
        keywords[lang].forEach(word => {
            // Escape special regex chars
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedWord, 'g');
            const matches = (code.match(regex) || []).length;
            score += matches;
        });
        scores[lang] = score;

        if (score > maxScore) {
            maxScore = score;
            detectedLang = lang;
        }
    });

    console.log(`Language Analysis for [${statedLanguage}]:`, scores);

    const statedLangLower = statedLanguage.toLowerCase();

    // Thresholds:
    // 1. Must have a decent score to be confident (> 1 match)
    // 2. Detected language must be different from stated
    // 3. Stated language score must be significantly lower (e.g., less than 20% of the max score) or 0
    if (detectedLang && maxScore > 1) {
        if (detectedLang !== statedLangLower) {
            const statedScore = scores[statedLangLower] || 0;
            if (statedScore < (maxScore * 0.5)) {
                return {
                    valid: false,
                    detected: detectedLang,
                    message: `Language Mismatch: This looks like ${detectedLang} (Score: ${maxScore}) but you selected ${statedLanguage} (Score: ${statedScore}).`
                };
            }
        }
    }

    return { valid: true };
};

// Health Check
app.get('/', (req, res) => {
    res.send('DevMentor Server is running');
});

// Analyze Endpoint
app.post('/api/analyze', async (req, res) => {
    const { code, language } = req.body;

    // 1. Language Detection Check
    const detection = detectLanguage(code, language);
    if (!detection.valid) {
        return res.json({
            issues: [{
                line: 1,
                message: detection.message,
                severity: "error",
                reasoning: "The code syntax does not match the selected language's keywords.",
                fix_example: `// Ensure you selected the correct language in the dropdown.`
            }],
            codeHealthScore: 0,
            securityIssues: [],
            complexity: "N/A",
            refactoredCode: code
        });
    }

    // 2. OpenAI Analysis (if Key exists)
    if (process.env.OPENAI_API_KEY) {
        try {
            const prompt = `
            Analyze the following ${language} code for bugs, performance issues (time/space complexity), security vulnerabilities (OWASP Top 10), and adherence to best practices.
            
            Return the response in strictly valid JSON format with this structure:
            {
                "codeHealthScore": number (0-100 integer),
                "issues": [
                    {
                        "line": number, 
                        "message": "concise description", 
                        "severity": "error"|"warning"|"info",
                        "reasoning": "detailed explanation of why this is an issue (Deep Dive)",
                        "fix_example": "short code snippet showing the fix"
                    }
                ],
                "securityIssues": [
                    {
                        "line": number,
                        "message": "security vulnerability description",
                        "severity": "critical"|"high"|"medium"|"low",
                         "reasoning": "why this is a security risk"
                    }
                ],
                "complexity": "Big O notation string (Time)",
                "spaceComplexity": "Big O notation string (Space)",
                "refactoredCode": "string (the full refactored code)"
            }
            Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
            
            Code:
            ${code}
            `;

            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "You are a senior developer code mentor." }, { role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
            });

            const rawContent = completion.choices[0].message.content;
            const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
            const analysis = JSON.parse(jsonString);

            return res.json(analysis);

        } catch (error) {
            console.error("OpenAI API Error (Falling back to Mock):", error.message);
            // Fall through to mock response below
        }
    }

    // 3. Fallback / Mock Response (if no Key)
    // 3. Fallback / Mock Response (if no Key)
    setTimeout(() => {
        res.json({
            codeHealthScore: 85,
            issues: [
                {
                    line: 1,
                    message: "Simulated AI: Code looks good structure-wise. (Mock Mode)",
                    severity: "info",
                    reasoning: "Using 'var' can lead to hoisting issues. 'let' and 'const' are block-scoped and safer.",
                    fix_example: "const x = 10;"
                }
            ],
            securityIssues: [],
            complexity: "O(n)",
            spaceComplexity: "O(1)",
            refactoredCode: "// [MOCK] Refactored code would appear here\n" + code
        });
    }, 1500);
});

// Ghost-Write Endpoint (USP 1)
app.post('/api/ghost-write', async (req, res) => {
    const { prompt, language } = req.body;

    if (process.env.OPENAI_API_KEY) {
        try {
            const systemPrompt = `You are an expert ${language} architect. 
            Generate secure, production-ready boilerplate code for the user's request. 
            Include necessary imports, error handling, and comments explaining 'why' this pattern is used.
            Focus on 'Digital Twin' quality - high standards, modern syntax.
            Return ONLY the code, no markdown backticks.`;

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                model: "gpt-3.5-turbo",
            });

            let generatedCode = completion.choices[0].message.content;
            // Strip markdown if AI adds it despite instructions
            generatedCode = generatedCode.replace(/```[a-z]*\n?/g, '').replace(/```/g, '');

            return res.json({ code: generatedCode });

        } catch (error) {
            console.error("OpenAI API Error (Falling back to Mock):", error.message);
            // Fall through to mock response below
        }
    }

    // Fallback Mock
    setTimeout(() => {
        let mockCode = `// [MOCK] Generated Boilerplate for: ${prompt}\n`;
        if (language === 'javascript' || language === 'typescript') {
            mockCode += `
import express from 'express';
const router = express.Router();

// Secure ${prompt} implementation
router.get('/', (req, res) => {
    try {
        // Your logic here
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;`;
        } else if (language === 'python') {
            mockCode += `
class ${prompt.replace(/\s+/g, '')}:
    def __init__(self):
        """Initialize ${prompt} logic securely."""
        pass

    def run(self):
        try:
            # Logic
            print("Running secure operation")
        except Exception as e:
            print(f"Error: {e}")
`;
        }
        res.json({ code: mockCode });
    }, 1500);
});

// Auto-Docs Endpoint (USP 2)
app.post('/api/generate-docs', async (req, res) => {
    const { code, language } = req.body;

    if (process.env.OPENAI_API_KEY) {
        try {
            const systemPrompt = `You are a Technical Writer. 
            Generate comprehensive "PR-Ready" documentation for the provided code.
            Include: 
            1. Title & Description
            2. Installation/Usage
            3. API Reference (Inputs/Outputs)
            4. Example Usage
            Return ONLY the valid Markdown string.`;

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: code }
                ],
                model: "gpt-3.5-turbo",
            });

            const docs = completion.choices[0].message.content;
            return res.json({ docs });

        } catch (error) {
            console.error("OpenAI API Error (Falling back to Mock):", error.message);
            // Fall through to mock response below
        }
    }

    // Fallback Mock (Smarter)
    setTimeout(() => {
        // Simple regex to find class or function name
        const classMatch = code.match(/class\s+(\w+)/);
        const funcMatch = code.match(/function\s+(\w+)|const\s+(\w+)\s*=\s*(\(|async)/);
        const entityName = classMatch ? classMatch[1] : (funcMatch ? (funcMatch[1] || funcMatch[2]) : 'Module');

        const mockDocs = `
# Documentation for \`${entityName}\`
> **Note:** Generated in Offline Mode (Mock). Add \`OPENAI_API_KEY\` to \`.env\` for full AI-powered analysis.

## 1. Overview
The \`${entityName}\` component facilitates key logic within the application. It handles data processing and ensures input validation before execution.

## 2. API Reference
| Function | Description |
| :--- | :--- |
| \`${entityName}.init()\` | Initializes the main logic flow. |
| \`${entityName}.validate()\` | Checks input parameters for type safety. |

## 3. Example Usage
\`\`\`${language}
import { ${entityName} } from './${entityName}';

const instance = new ${entityName}();
instance.run();
\`\`\`
        `;
        res.json({ docs: mockDocs });
    }, 1000);
});

// Impact Analysis Endpoint (USP 3)
app.post('/api/impact-analysis', async (req, res) => {
    const { code, language } = req.body;

    if (process.env.OPENAI_API_KEY) {
        try {
            const systemPrompt = `You are a Senior Software Architect and Code Forensic Expert. 
            Analyze the provided ${language} code snippet deeply. 
            
            1. **DETECT CONTEXT**: Infer the likely project type (e.g., React App, Express API, Data Script) based on imports/syntax.
            2. **TRACE DEPENDENCIES**: Look for imports, exported functions, and identifying global changes.
            3. **ASSESS RISK**:
               - **High**: Schema changes, deletion logic, auth modifications, global config changes, or infinite loops.
               - **Medium**: New feature logic, API response shape changes, potential performance bottlenecks.
               - **Low**: UI styling updates, internal helper refactors, comment changes.

            4. **SIMULATE IMPACT**:
               - If it's a UI component, list likely parent pages.
               - If it's a Utility, list likely consumer services.
               - If it's a Database Query, list API endpoints using it.

            Return strictly valid JSON (no markdown) with this structure:
            {
                "riskLevel": "Low" | "Medium" | "High",
                "affectedFiles": [
                    { "file": "string (smartly guessed filename e.g., 'src/components/Parent.jsx')", "reason": "string (specific technical reason e.g., 'Imports Button.jsx')" }
                ],
                "dependentServices": ["string (e.g., 'AuthService', 'PaymentWorker')"],
                "visualGraph": {
                    "nodes": [
                        { "id": 1, "label": "Your Code", "type": "change" },
                        { "id": 2, "label": "string (inferred dependency)", "type": "file" | "service" | "database" }
                    ],
                    "edges": [
                        { "from": 1, "to": 2 }
                    ]
                }
            }`;

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Code Change:\n${code}` }
                ],
                model: "gpt-3.5-turbo",
            });

            const rawContent = completion.choices[0].message.content;
            const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
            const impactData = JSON.parse(jsonString);

            return res.json(impactData);

        } catch (error) {
            console.error("OpenAI Impact Analysis Error:", error.message);
            // Fallthrough to mock
        }
    }

    // Fallback Mock (if API fails or no key)
    setTimeout(() => {
        const impactData = {
            riskLevel: "High",
            affectedFiles: [
                { file: "client/src/App.jsx", reason: "Imports API" },
                { file: "server/routes/auth.js", reason: "Shared User Schema" },
                { file: "tests/integration.test.js", reason: "Integration Test Suite" }
            ],
            dependentServices: ["UserAuthService", "BillingWorker"],
            visualGraph: {
                nodes: [
                    { id: 1, label: "Your Change", type: "change" },
                    { id: 2, label: "App.jsx", type: "file" },
                    { id: 3, label: "Auth API", type: "file" },
                    { id: 4, label: "Billing", type: "service" }
                ],
                edges: [
                    { from: 1, to: 2 },
                    { from: 1, to: 3 },
                    { from: 3, to: 4 }
                ]
            }
        };
        res.json(impactData);
    }, 1500);
});

const path = require('path');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Anything that doesn't match the above routes, send back index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server v6 (Impact Analysis Enabled) is running on port ${PORT}`);
        setInterval(() => {}, 1000 * 60 * 60); // Keep event loop alive
    });
}

module.exports = app;

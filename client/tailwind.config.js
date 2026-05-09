/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--bg-background)',
                surface: 'var(--bg-surface)',
                primary: '#646cff', // Keep raw or use 'var(--primary)' if consistent
                secondary: '#535bf2',
            },
        },
    },
    darkMode: 'class',
    plugins: [],
}

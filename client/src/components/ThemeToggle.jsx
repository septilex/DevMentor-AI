import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl shadow-lg 
            hover:shadow-2xl hover:-translate-y-1 hover:scale-110 active:scale-95 transition-all duration-300 group
            border border-gray-100 dark:border-neutral-700
            hover:shadow-yellow-500/20 dark:hover:shadow-blue-500/20"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle Dark Mode"
        >
            <div className="relative z-10">
                {theme === 'light' ? (
                    <Moon className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors duration-300" />
                ) : (
                    <Sun className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 group-hover:rotate-90 transition-all duration-500" />
                )}
            </div>
            {/* Bubble Glow Effect */}
            <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md ${theme === 'light' ? 'bg-blue-400/20' : 'bg-yellow-400/20'}`} />
        </button>
    );
};

export default ThemeToggle;

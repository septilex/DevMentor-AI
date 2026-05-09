import React from 'react';
import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';


const Navbar = () => {

    return (
        <nav className="bg-surface border-b border-gray-700 py-4 px-6 fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                        <Code2 className="text-primary w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent dark:text-white dark:bg-none">
                        DevMentor
                    </span>
                </Link>
                <div className="flex gap-6 items-center">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                    <Link to="/ghost-write" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-1">
                        <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-700">NEW</span> Ghost-Write
                    </Link>
                    <Link to="/analyze" className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md transition-colors font-medium">
                        Start Analysis
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

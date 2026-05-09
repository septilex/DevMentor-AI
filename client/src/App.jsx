import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WaveBackground from './components/WaveBackground';
import LandingPage from './pages/LandingPage';
import AnalysisPage from './pages/AnalysisPage';

import GhostWritePage from './pages/GhostWritePage';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans relative">
        <WaveBackground /> {/* The New Visible Wave Layer */}
        <ThemeToggle />

        {/* Navbar removed to handle navigation locally per page for cleaner UI */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analyze" element={<AnalysisPage />} />
          <Route path="/ghost-write" element={<GhostWritePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

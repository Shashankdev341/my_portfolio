import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#050507] text-white overflow-x-hidden">
        
        {/* Global Fixed Navbar */}
        <header className="navbar-fixed">
          <Link to="/" className="nav-brand-container">
            <img src="/logo.png" alt="SK Logo" className="nav-logo" />
            <div className="nav-brand-reference">
              <span className="nav-ref-red">SHASHANK KUMAR</span>
              <span className="nav-ref-gray">FULL-STACK & ML</span>
            </div>
          </Link>
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
            <Link to="/#education-skills" className="nav-link">About & Skills</Link>
            <Link to="/#process" className="nav-link">Process</Link>
          </nav>
          <div className="nav-freelance">
            AVAILABLE FOR FREELANCE <Sparkles className="w-4 h-4 text-[#E60000]" />
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
        
      </div>
    </Router>
  );
}

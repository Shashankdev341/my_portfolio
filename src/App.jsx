import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#050507] text-white overflow-x-hidden">
        
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
        
      </div>
    </Router>
  );
}

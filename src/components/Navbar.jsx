import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar-fixed">
      <Link to="/" className="nav-brand-container" onClick={closeMobileMenu}>
        <img src="/logo.png" alt="SK Logo" className="nav-logo" />
        <div className="nav-brand-reference">
          <span className="nav-ref-red">SHASHANK KUMAR</span>
          <span className="nav-ref-gray">FULL-STACK & ML</span>
        </div>
      </Link>
      
      <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
        <Link to="/projects" className="nav-link" onClick={closeMobileMenu}>Projects</Link>
        <Link to="/#education-skills" className="nav-link" onClick={closeMobileMenu}>About & Skills</Link>
        <Link to="/#process" className="nav-link" onClick={closeMobileMenu}>Process</Link>
      </nav>
      
      <div className="nav-freelance">
        AVAILABLE FOR FREELANCE <Sparkles className="w-4 h-4 text-[#E60000]" />
      </div>

      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>
    </header>
  );
}

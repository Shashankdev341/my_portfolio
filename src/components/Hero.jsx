import React from 'react';
import { Globe, Sparkles, Navigation } from 'lucide-react';

function Hero() {
  return (
    <div className="hero-container-full">

      {/* Hero Main Content - Folioblox Reference Layout */}
      <div className="hero-ref-layout">
        
        {/* Left Column */}
        <div className="hero-ref-left">
          <div className="hero-cursive">Hello, I'm</div>
          <h1 className="hero-name-giant">
            SHASHANK<br/>KUMAR DEV
          </h1>
          <h2 className="hero-role-red">
            FULL-STACK WEB DEVELOPER &<br/>ML PRACTITIONER
          </h2>
          <p className="hero-bio-gray">
            I design and build stylish, user-focused web experiences that combine creativity with strategy. Passionate about clean design, smooth interactions, and details that make a difference.
          </p>
          <div className="hero-globe">
            <Globe className="w-4 h-4 text-[#E60000]" />
            <span>AVAILABLE WORLDWIDE</span>
          </div>
        </div>

        {/* Right Column (Removed as per user request) */}
        
      </div>
    </div>
  );
}

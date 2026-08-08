import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CanvasSequence from '../components/CanvasSequence';
import Hero from '../components/Hero';
import EducationSkills from '../components/EducationSkills';
import WorkProcess from '../components/WorkProcess';
import FooterContact from '../components/FooterContact';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Small timeout ensures the element is fully rendered before scrolling
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Full-Page Video Animation Canvas (Fixed Background) */}
      <CanvasSequence scrollProgress={scrollProgress} />

      {/* 2. Hero Overlay Layer */}
      <section id="home" className="relative z-10 h-screen w-full">
        <Hero />
      </section>

      {/* 3. Transparent Glassmorphism Overlay Sections */}
      <main className="relative z-20 space-y-16 pb-20 pt-12">
        <EducationSkills />
        <WorkProcess />
        <FooterContact />
      </main>
    </>
  );
}

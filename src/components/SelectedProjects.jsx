import React, { useState } from 'react';
import { ArrowRight, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const projects = [
  { id: '01', title: 'AI-PREP-PILOT-09', category: 'TypeScript', tags: ['TypeScript'], githubUrl: 'https://github.com/Shashankdev341/ai-prep-pilot-09', description: 'GitHub Repository', image: '/projects/proj_ai_prep_1786192739004.png' },
  { id: '02', title: 'BG_REMOVER', category: 'TypeScript', tags: ['TypeScript'], githubUrl: 'https://github.com/Shashankdev341/BG_remover', description: 'GitHub Repository', image: '/projects/proj_bg_remover_1786192754348.png' },
  { id: '03', title: 'CROP-DISEASE-DETECTION', category: 'Python', tags: ['Python'], githubUrl: 'https://github.com/Shashankdev341/crop-disease-detection', description: 'GitHub Repository', image: '/projects/proj_crop_disease_1786192767422.png' },
  { id: '04', title: 'DISASTER', category: 'CSS', tags: ['CSS'], githubUrl: 'https://github.com/Shashankdev341/disaster', description: 'GitHub Repository', image: '/projects/proj_disaster_1786192801248.png' },
  { id: '05', title: 'GIT-CODEBASE', category: 'TypeScript', tags: ['TypeScript'], githubUrl: 'https://github.com/Shashankdev341/Git-codebase', description: 'GitHub Repository', image: '/projects/proj_git_codebase_1786192814229.png' },
  { id: '06', title: 'KUBERTO-WEBSITE-CLONE', category: 'HTML', tags: ['HTML'], githubUrl: 'https://github.com/Shashankdev341/Kuberto-Website-clone', description: 'GitHub Repository', image: '/projects/proj_kuberto_1786192829048.png' },
  { id: '07', title: 'NETFLIX-CLONE', category: 'HTML', tags: ['HTML'], githubUrl: 'https://github.com/Shashankdev341/Netflix-clone', description: 'GitHub Repository', image: '/projects/proj_netflix_1786192841721.png' }
];

export default function SelectedProjects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const getGradient = (id) => {
    // Generate slight variations in the gradient based on the ID for variety
    const num = parseInt(id, 10);
    const angle = 120 + (num * 15);
    return `linear-gradient(${angle}deg, #050507 0%, #1a0204 50%, #90050B 100%)`;
  };

  return (
    <section className="portfolio-section" id="projects">
      <div className="section-header" style={{ justifyContent: 'flex-end', paddingTop: '40px' }}>
        <a href="https://github.com/Shashankdev341" target="_blank" rel="noreferrer" className="section-link">
          VIEW ALL ON GITHUB <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="project-card"
            onClick={() => setSelectedProject(project)}
          >
            <div className="project-image-wrapper">
              {project.image ? (
                <img src={project.image} alt={project.title} className="project-image" />
              ) : (
                <div className="project-gradient-placeholder" style={{ background: getGradient(project.id) }}>
                  <span className="placeholder-text">{project.title.substring(0, 2)}</span>
                </div>
              )}
            </div>
            <div className="project-info">
              <div className="project-num">{project.id}</div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-category">{project.category}</p>
              <div className="project-tags">
                {project.tags && project.tags.map((tag, idx) => (
                  <span key={idx} className="project-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              className="bg-[#0d0d12] border border-[#DC1823]/30 rounded-2xl p-8 max-w-2xl w-full text-white relative shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
                onClick={() => setSelectedProject(null)}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-[#DC1823] font-mono text-sm mb-2">{selectedProject.id} — {selectedProject.category}</div>
              <h2 className="font-['Bebas_Neue'] text-4xl mb-4 tracking-wide">{selectedProject.title}</h2>
              
              {selectedProject.image ? (
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-64 object-cover rounded-xl mb-6 border border-white/10" />
              ) : (
                <div className="w-full h-64 rounded-xl mb-6 border border-white/10 flex items-center justify-center text-8xl font-['Bebas_Neue'] text-white/10 overflow-hidden relative" style={{ background: getGradient(selectedProject.id) }}>
                  <span className="absolute transform -rotate-12">{selectedProject.title.substring(0, 3)}</span>
                </div>
              )}
              
              <p className="text-gray-300 text-sm leading-relaxed mb-6">{selectedProject.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedProject.tags && selectedProject.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-[#DC1823]/10 text-[#DC1823] border border-[#DC1823]/30 px-3 py-1 rounded-full font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} className="flex items-center gap-2 bg-[#DC1823] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#a00810] transition">
                    LIVE DEMO <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-transparent text-white border border-white/30 text-xs font-bold px-6 py-3 rounded-xl hover:bg-white/5 transition">
                    GITHUB REPO <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

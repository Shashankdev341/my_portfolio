import React from 'react';
import { Award, GraduationCap, Code } from 'lucide-react';

const skills = [
  'Python', 'HTML', 'CSS', 'JavaScript', 'GSAP', 'Three.js',
  'Gradio', 'TensorFlow', 'React', 'Figma', 'Photoshop',
  'SQL', 'PyTorch', 'Node.js', 'Git', 'FastAPI'
];

const EducationSkills = () => {
  return (
    <section className="portfolio-section" id="education-skills">
      <div className="section-header">
        <h2 className="section-title">EDUCATION & SKILLS</h2>
      </div>

      <div className="edu-skills-container">
        {/* Left Column: Education & Achievements */}
        <div>
          <h3 className="sub-title flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> EDUCATION
          </h3>

          <div className="timeline-item">
            <div className="timeline-degree">B.Tech. in Computer Science & Information Technology (CSIT)</div>
            <div className="timeline-institution">[University of Engineering and Management,Kolkata]</div>
            <div className="timeline-year">2024 — 2028</div>
          </div>

          <h3 className="sub-title flex items-center gap-2 mt-8">
            <Award className="w-4 h-4" /> HACKATHONS & ACHIEVEMENTS
          </h3>

          <div className="timeline-item">
            <div className="timeline-degree">IEM HackOasis 2.0</div>
            <div className="timeline-institution">Participant — Built AI Agri-Tech ML Solution</div>
            <div className="timeline-year">2024</div>
          </div>
        </div>

        {/* Right Column: Skills Cloud */}
        <div>
          <h3 className="sub-title flex items-center gap-2">
            <Code className="w-4 h-4" /> TECH STACK & SKILLS
          </h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            A comprehensive set of modern technologies, libraries, and machine learning frameworks utilized across full-stack web and predictive analytics projects:
          </p>

          <div className="skills-cloud">
            {skills.map((skill, idx) => (
              <span key={idx} className="skill-chip">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(EducationSkills);

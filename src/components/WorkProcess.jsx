import React from 'react';

const steps = [
  {
    num: '01',
    title: 'DISCOVER',
    desc: 'Understanding problem statements, user goals, data requirements, and model architecture requirements.'
  },
  {
    num: '02',
    title: 'IDEATE',
    desc: 'Planning full-stack system design, wireframing workflows, and selecting neural network models.'
  },
  {
    num: '03',
    title: 'DESIGN',
    desc: 'Crafting sleek dark-mode visual interfaces with GSAP animations, responsive layouts, and user-centric UI/UX.'
  },
  {
    num: '04',
    title: 'DEVELOP',
    desc: 'Building scalable React & FastAPI applications, integrating ML inference pipelines & real-time APIs.'
  },
  {
    num: '05',
    title: 'DELIVER',
    desc: 'Rigorous testing, performance optimization, model evaluation, and seamless cloud deployment.'
  }
];

const WorkProcess = () => {
  return (
    <section className="portfolio-section" id="process">
      <div className="section-header">
        <h2 className="section-title">WORK PROCESS</h2>
      </div>

      <div className="process-container">
        {/* Left Column: Numbered List */}
        <div className="process-list">
          {steps.map((step) => (
            <div key={step.num} className="process-step">
              <div className="step-num">{step.num}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Red Quote Block */}
        <div className="quote-card">
          <div className="quote-icon">“</div>
          <p className="quote-text">
            Great technology is not just powerful, but also seamless and accessible to all.
          </p>
          <div className="signature-block">
            <span className="signature-name">Shashank</span>
            <span className="signature-tag">FULL-STACK & ML PRACTITIONER</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(WorkProcess);

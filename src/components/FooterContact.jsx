import React from 'react';
import { Mail, Globe, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function FooterContact() {
  return (
    <section className="portfolio-section" id="contact">
      <div className="footer-container">
        {/* Left Column: Heading & Contact List */}
        <div>
          <h2 className="footer-heading">
            LET'S WORK<br />TOGETHER
          </h2>
          <p className="footer-desc">
            I'm currently open for new projects, full-stack development opportunities, and Machine Learning collaborations. Let's create something amazing together.
          </p>

          <div className="contact-list">
            <a href="mailto:shashankkumardev@gmail.com" className="contact-item">
              <div className="contact-icon-box"><Mail className="w-4 h-4" /></div>
              <span>shashankkumardev@gmail.com</span>
            </a>
            <a href="tel:+919708800700" className="contact-item">
              <div className="contact-icon-box"><Phone className="w-4 h-4" /></div>
              <span>+91 9708800700</span>
            </a>
            <div className="contact-item">
              <div className="contact-icon-box"><MapPin className="w-4 h-4" /></div>
              <span>India</span>
            </div>
          </div>

          <div className="mt-8">
            <a href="#contact" className="inline-flex items-center gap-2 text-[#DC1823] font-extrabold text-xs tracking-widest border border-[#DC1823]/40 px-6 py-3 rounded-full hover:bg-[#DC1823] hover:text-white transition">
              AVAILABLE FOR FREELANCE <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column: 3D Laptop Mockup */}
        <div className="laptop-mockup">
          <div className="laptop-screen">
            <div className="screen-code">
              <div><span className="code-keyword">import</span> &#123; NeuralNet, QuantumState &#125; <span className="code-keyword">from</span> <span className="code-str">'@shashank/ai-core'</span>;</div>
              <div><span className="code-keyword">import</span> &#123; deployArchitecture &#125; <span className="code-keyword">from</span> <span className="code-str">'@shashank/fullstack'</span>;</div>
              <br />
              <div><span className="code-keyword">const</span> <span className="code-func">InitializeNexus</span> = <span className="code-keyword">async</span> () =&gt; &#123;</div>
              <div>&nbsp;&nbsp;<span className="code-keyword">const</span> synapseMap = <span className="code-keyword">await</span> NeuralNet.build(QuantumState.ACTIVE);</div>
              <div>&nbsp;&nbsp;</div>
              <div>&nbsp;&nbsp;<span className="code-keyword">const</span> pipeline = synapseMap.<span className="code-func">optimize</span>(&#123;</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;latency: <span className="code-str">'&lt; 5ms'</span>,</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;accuracy: <span className="code-str">'99.9%'</span>,</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;scalability: <span className="code-keyword">Infinity</span></div>
              <div>&nbsp;&nbsp;&#125;);</div>
              <br />
              <div className="text-gray-500">&nbsp;&nbsp;// Deploying neural pathways to edge network...</div>
              <div>&nbsp;&nbsp;<span className="code-keyword">return</span> <span className="code-func">deployArchitecture</span>(pipeline);</div>
              <div>&#125;;</div>
              <br />
              <div className="text-red-400">&lt;SystemStatus active=&#123;<span className="code-keyword">true</span>&#125; /&gt;</div>
            </div>
          </div>
          <div className="laptop-body">
            <div className="laptop-notch"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

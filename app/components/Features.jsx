'use client';

import { useEffect, useRef, useState } from 'react';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      symbol: '⟳',
      title: 'Real scanning, not an overlay',
      body: 'We load your actual page in a real browser and test every element against WCAG 2.1 AA — the legal standard courts reference. No widgets. No false safety. No pretending the problem is fixed when it isn\'t.',
    },
    {
      symbol: '⚡',
      title: 'Results in under 60 seconds',
      body: 'Enter your URL. We return a full violation report before you finish reading this sentence. No signup required. No waiting for a human auditor. No $5,000 quote to get started.',
    },
    {
      symbol: '⚠',
      title: 'Know your exact legal exposure',
      body: 'Every violation is rated Critical, Serious, Moderate, or Minor — and explained in plain English, not WCAG code. You will know exactly which issues carry the highest lawsuit risk and which to fix first.',
    },
    {
      symbol: '✦',
      title: 'AI-generated fixes for every issue',
      body: 'We do not just tell you what is broken. We show you the corrected code. Every violation includes an AI-generated fix you can paste directly into your codebase or hand to your developer. No guesswork. No hours of research.',
    },
    {
      symbol: '⬇',
      title: 'Professional PDF report',
      body: 'Your full report exports as a formatted PDF with a cover page, executive summary, and violation cards. Send it to your developer, your lawyer, or your client. It looks like a professional compliance audit — because it is.',
    },
    {
      symbol: '◎',
      title: 'Continuous monitoring',
      body: 'Every code change, plugin update, or new page can introduce new violations. We rescan your site weekly and alert you the moment something new appears. Set it once. Stay protected automatically.',
    },
  ];

  return (
    <section id="features" className="section" ref={sectionRef}>
      <div className={`section-content ${isVisible ? 'visible' : ''}`}>
        <p className="section-label">What you get</p>
        <h2 className="section-headline">Everything a lawyer's demand letter won't warn you about</h2>
        <p className="section-subheadline">Most tools stick a toolbar on your site and call it done. We actually find the violations.</p>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-symbol">{feature.symbol}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-body">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

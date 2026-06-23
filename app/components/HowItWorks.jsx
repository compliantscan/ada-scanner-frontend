'use client';

import { useEffect, useRef, useState } from 'react';

export default function HowItWorks() {
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

  return (
    <section id="how-it-works" className="section" ref={sectionRef}>
      <div className={`section-content ${isVisible ? 'visible' : ''}`}>
        <p className="section-label">How it works</p>
        <h2 className="section-headline">From worried to protected in under 2 minutes</h2>
        <p className="section-subheadline">No account. No credit card. No technical knowledge required.</p>

        <div className="steps">
          <div className="step">
            <span className="step-number">01</span>
            <h3 className="step-title">Enter your website URL</h3>
            <p className="step-body">
              Paste your website address into the scanner above. That is the only thing you need to provide — no forms, no signup, no waiting.
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <span className="step-number">02</span>
            <h3 className="step-title">We scan your live site instantly</h3>
            <p className="step-body">
              Our scanner loads your actual website in a real browser and tests every element against WCAG 2.1 AA — the legal standard US courts reference in ADA cases. Results appear in under 60 seconds.
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <span className="step-number">03</span>
            <h3 className="step-title">Get your full report with exact fixes</h3>
            <p className="step-body">
              See every violation, its legal risk level, and the exact code fix explained in plain English. Download a professional PDF ready to forward to your developer or lawyer.
            </p>
          </div>
        </div>

        <p className="section-cta">
          Want automatic protection? Upgrade to continuous monitoring and we rescan your site every week.{' '}
          <a href="#pricing">See pricing →</a>
        </p>
      </div>
    </section>
  );
}

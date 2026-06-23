'use client';

import { useEffect, useRef, useState } from 'react';

export default function FAQ() {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
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

  const faqs = [
    {
      question: 'Does this actually protect me from lawsuits?',
      answer: 'No tool can guarantee legal protection — and anyone who says otherwise is not being honest with you. What we do is find the violations plaintiff attorneys scan for, tell you exactly how to fix them, and monitor your site so new ones do not go unnoticed. Fixing violations is your strongest legal defense. We make finding and fixing them as fast as possible.',
    },
    {
      question: 'Why not just use a free accessibility checker?',
      answer: 'Free checkers give you a snapshot. We give you a snapshot plus AI-generated fixes for every issue, a professional PDF you can share with a developer or lawyer, and ongoing monitoring that alerts you when your site changes. One plugin update can introduce a new violation overnight. We catch it before an attorney does.',
    },
    {
      question: 'What if I am not technical?',
      answer: 'You do not need to be. Every violation is explained in plain English with a legal risk rating. The PDF report is formatted to forward directly to your developer or web agency — it tells them exactly what to fix. You do not need to understand code to use this product.',
    },
    {
      question: 'How is this different from accessiBe or UserWay?',
      answer: 'accessiBe and UserWay add a toolbar overlay to your site. Courts and accessibility experts increasingly view overlays as inadequate — the EU Commission has explicitly stated overlays do not provide compliance under the European Accessibility Act. We scan your actual code and find real violations. We then tell you how to fix them permanently, not mask them with a widget.',
    },
    {
      question: 'What is WCAG 2.1 AA and why does it matter legally?',
      answer: 'WCAG 2.1 AA is the Web Content Accessibility Guidelines standard maintained by the W3C. It is the benchmark US courts and the Department of Justice use when evaluating whether a website is ADA compliant. Passing WCAG 2.1 AA does not guarantee you will never face a lawsuit, but failing it is frequently cited in demand letters and court filings as evidence of non-compliance.',
    },
    {
      question: 'How often does the scanner rescan my site?',
      answer: 'Free scans are on-demand — scan whenever you want. Paid plans include automated monitoring: weekly rescans on the Starter plan, daily rescans on Growth and Agency. You receive an email alert only when new violations are detected. If your site is clean, we stay quiet.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section" ref={sectionRef}>
      <div className={`section-content ${isVisible ? 'visible' : ''}`}>
        <p className="section-label">Common questions</p>
        <h2 className="section-headline">Things people ask before they scan</h2>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '×' : '+'}</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';

const FAQS = [
  {
    id: 'widget',
    question: "We already use an accessibility widget — isn't that enough?",
    answer:
      "Widgets and overlays patch how a page is announced to assistive tech, but they don't fix the underlying code. In 2025, 22.6% of sites hit with accessibility lawsuits already had a widget installed. The FTC also fined accessiBe $1M in January 2025 for overstating what its widget could guarantee. A real audit finds and helps fix the actual WCAG violations in your markup — not just paper over them at runtime.",
  },
  {
    id: 'lighthouse',
    question: "Why not just run Lighthouse or a free browser extension?",
    answer:
      "Free automated tools are a reasonable starting point, but they typically catch somewhere around 30-40% of real WCAG failures, and they don't render client-ready reports or prioritized fixes. CompliantScan scans with a real Chromium browser (so JavaScript-rendered content gets checked too), then turns the raw findings into an executive summary for your client and a developer-ready fix list — not just a raw score.",
  },
  {
    id: 'wcag-version',
    question: "What's the difference between WCAG 2.1 and WCAG 2.2?",
    answer:
      'WCAG 2.2 adds newer success criteria on top of 2.1 — things like clearer focus indicators, accommodations for drag-based interactions, and minimum target sizes for touch controls. Most courts and settlements still reference WCAG 2.1 AA as the baseline legal standard, but 2.2 AA is increasingly considered best practice and where the guidelines are heading. We scan against 2.2 so you stay ahead rather than catching up later.',
  },
  {
    id: 'developer-needed',
    question: 'Do I need a developer to act on the results?',
    answer:
      "For most fixes, yes — someone needs to touch the code. What we remove is the guesswork: every issue comes with the specific WCAG criterion it violates, an AI-generated code fix, and a severity ranking so your dev knows what to prioritize first. Agencies use this to scope remediation work quickly instead of starting from a blank audit.",
  },
  {
    id: 'vs-consultant',
    question: 'How is this different from hiring an accessibility consultant?',
    answer:
      "A consultant is still the right call for full manual audits on high-risk or high-traffic sites — automated scanning can't fully replace human judgment or assistive-tech testing. CompliantScan is built for the 80% of cases before that: a fast, affordable first pass your agency can run on every client site, with ongoing monitoring to catch regressions between manual reviews.",
  },
  {
    id: 'privacy',
    question: 'Is my scan and report data private?',
    answer:
      "Yes. Scans, reports, and client data are visible only within your own workspace. Nothing is shared publicly or used to train models, and you control who on your team has access.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.label}>Common questions</p>
        <h2 className={styles.heading}>Before you ask, we&apos;ll answer.</h2>

        <div className={styles.list}>
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className={styles.item}>
                <button
                  type="button"
                  className={styles.question}
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={styles.answerWrap}
                  style={{ maxHeight: isOpen ? '400px' : '0px' }}
                >
                  <p className={styles.answer}>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
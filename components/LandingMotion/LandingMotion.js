'use client';

import { useEffect } from 'react';

export default function LandingMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll('[data-reveal]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    sections.forEach((section) => {
      section.querySelectorAll('[data-reveal-item]').forEach((item, index) => {
        item.style.setProperty('--reveal-index', String(Math.min(index, 7)));
      });
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-revealed'));
      return undefined;
    }

    root.classList.add('motion-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.08,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      root.classList.remove('motion-ready');
    };
  }, []);

  return null;
}

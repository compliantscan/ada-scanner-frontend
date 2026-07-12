'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../../lib/supabaseClient';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 49,
    annualPrice: 39,
    tagline: 'For small business owners who want to stay protected',
    features: [
      '1 website monitored',
      'Weekly automated rescans',
      'Email alerts on new violations',
      'Full violation report',
      'AI-generated fix for every issue',
      'Professional PDF report',
    ],
    cta: 'Start monitoring',
    note: 'No dashboard setup required. Cancel anytime.',
    featured: false,
  },
  {
    name: 'Growth',
    monthlyPrice: 99,
    annualPrice: 79,
    tagline: 'For agencies and businesses managing multiple sites',
    features: [
      '5 websites monitored',
      'Daily rescans',
      'Everything in Starter',
      'White-label PDF reports',
      'Priority email support',
    ],
    cta: 'Start monitoring',
    note: 'Most agencies recover the cost from one client conversation.',
    featured: true,
  },
  {
    name: 'Agency',
    monthlyPrice: 249,
    annualPrice: 199,
    tagline: 'For web agencies with active client portfolios',
    features: [
      '25 websites monitored',
      'Everything in Growth',
      'Client-ready reports',
      'Dedicated onboarding call',
      'Custom plans available',
    ],
    cta: 'Talk to us',
    note: 'Custom plans available for 25+ sites.',
    featured: false,
  },
];

export default function DashboardBillingPage() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login');
    }).catch(() => router.replace('/login'));
  }, [router]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) { setIsVisible(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  function handleCta(plan) {
    if (plan.cta === 'Talk to us') {
      window.open('/#contact', '_blank');
    } else {
      router.push(`/checkout?plan=${plan.name.toLowerCase()}&billing=${isAnnual ? 'annual' : 'monthly'}`);
    }
  }

  return (
    <div className="pricing-section-wrap" ref={sectionRef} style={{ background: 'transparent', padding: '8px 0 40px' }}>
      <div className="pricing-section-inner">
        <div className={`section-content ${isVisible ? 'visible' : ''}`} style={{ textAlign: 'center' }}>
          <span className="pricing-badge">Plans &amp; Billing</span>
          <h2 className="pricing-headline">One lawsuit costs more than 50 years of monitoring</h2>
          <p className="pricing-subtext">Average ADA settlement: $5,000–$25,000. Our plans start at $49/month. The math is simple.</p>

          <div className="billing-toggle-wrap">
            <div className="billing-toggle">
              <button className={`toggle-tab${!isAnnual ? ' active' : ''}`} onClick={() => setIsAnnual(false)}>
                Monthly
              </button>
              <button className={`toggle-tab${isAnnual ? ' active' : ''}`} onClick={() => setIsAnnual(true)}>
                Annually <span className="save-badge">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card${plan.featured ? ' featured' : ''}`}>
                <div className="plan-icon" aria-hidden="true">
                  <img src="/logo.png" alt="CompliantScan" />
                </div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-tagline">{plan.tagline}</p>
                <div className="plan-price">
                  <span className="price-amount">${isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                  <span className="price-period">/ per month</span>
                </div>
                <button className="plan-cta" onClick={() => handleCta(plan)}>
                  {plan.cta}
                </button>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <p className="plan-note">{plan.note}</p>
              </div>
            ))}
          </div>

          <div className="pricing-trust">
            <span>No contracts. Cancel anytime.</span>
            <span>·</span>
            <span>Free scan always available — no card required.</span>
            <span>·</span>
            <span>Every plan includes AI fix suggestions and PDF reports.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

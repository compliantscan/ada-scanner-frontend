'use client';

import { useEffect, useRef, useState } from 'react';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function PricingModal({ plan, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidEmail(email)) { setError('Enter a valid email address.'); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/collect-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, url: `pricing-interest:${plan.name}`, planName: plan.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong.');
      setDone(true);
      onSuccess(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ss-backdrop" role="dialog" aria-modal="true" aria-label={`Get notified about ${plan.name} plan`} onClick={onClose}>
      <div className="ss-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ss-modal-left">
          <h2 className="ss-headline">Get early access to the {plan.name} plan</h2>
          <p className="ss-desc">Enter your email and we&apos;ll notify you the moment {plan.name} launches — ${plan.monthlyPrice}/month.</p>
          <p className="ss-desc">Early subscribers get priority onboarding and a free first month.</p>
          {done ? (
            <p className="message success ss-success">✓ You&apos;re on the list. We&apos;ll be in touch soon.</p>
          ) : (
            <form className="ss-form" onSubmit={handleSubmit} noValidate>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work Email Address"
                aria-label="Work email address"
                className="ss-input"
              />
              <button type="submit" className="ss-cta" disabled={loading}>
                {loading ? 'Saving...' : 'Notify me when live'}
              </button>
            </form>
          )}
          {error && <p className="message error">{error}</p>}
          <p className="ss-trust">No spam. One email when we launch.</p>
          {!done && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#4b4b4b', fontSize: 13, cursor: 'pointer', padding: 0, height: 'auto', marginTop: 4 }}
            >
              ← Back to pricing
            </button>
          )}
        </div>
        <div className="ss-modal-right">
          <h3 className="ss-right-headline">{plan.name} plan includes</h3>
          <ul className="ss-bullets">
            {plan.features.map((f, i) => (
              <li key={i}><span className="ss-check">✓</span> {f}</li>
            ))}
          </ul>
          <p className="ss-social-proof">Join the waitlist — we launch soon.</p>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [modalPlan, setModalPlan] = useState(null);
  const [confirmedPlans, setConfirmedPlans] = useState({});
  const sectionRef = useRef(null);

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modalPlan) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [modalPlan]);

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

  return (
    <>
      <div className="pricing-section-wrap" id="pricing" ref={sectionRef}>
        <div className="pricing-section-inner">
          <div className={`section-content ${isVisible ? 'visible' : ''}`} style={{ textAlign: 'center' }}>
            <span className="pricing-badge">Our Plans</span>
            <h2 className="pricing-headline">One lawsuit costs more than 50 years of monitoring</h2>
            <p className="pricing-subtext">Average ADA settlement: $5,000–$25,000. Our plans start at $49/month. The math is simple.</p>

            <div className="billing-toggle-wrap">
              <div className="billing-toggle">
                <button className={`toggle-tab${!isAnnual ? ' active' : ''}`} onClick={() => setIsAnnual(false)}>
                  Monthly
                </button>
                <button className={`toggle-tab${isAnnual ? ' active' : ''}`} onClick={() => setIsAnnual(true)} aria-label="Switch to annual billing">
                  Annually <span className="save-badge">Save 20%</span>
                </button>
              </div>
            </div>

            <div className="pricing-grid">
              {plans.map((plan, index) => (
                <div key={index} className={`pricing-card${plan.featured ? ' featured' : ''}`}>
                  <div className="plan-icon" aria-hidden="true" />
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-tagline">{plan.tagline}</p>
                  <div className="plan-price">
                    <span className="price-amount">${isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                    <span className="price-period">/ per month</span>
                  </div>
                  {confirmedPlans[plan.name] ? (
                    <button className="plan-cta" disabled style={{ opacity: 0.7 }}>✓ You&apos;re on the list</button>
                  ) : (
                    <button
                      className="plan-cta"
                      onClick={() => plan.cta === 'Talk to us' ? (window.location.href = '/#contact') : setModalPlan(plan)}
                    >
                      {plan.cta}
                    </button>
                  )}
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

      {modalPlan && (
        <PricingModal
          plan={modalPlan}
          onClose={() => setModalPlan(null)}
          onSuccess={(email) => {
            setConfirmedPlans(prev => ({ ...prev, [modalPlan.name]: email }));
            setTimeout(() => setModalPlan(null), 2000);
          }}
        />
      )}
    </>
  );
}

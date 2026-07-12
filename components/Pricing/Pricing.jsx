'use client';

import { useState } from 'react';
import styles from './Pricing.module.css';

const CHECK_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.5l4.5 4.5L19 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'For trying out a single scan before you commit.',
    monthlyPrice: 0,
    annualPrice: 0,
    priceSuffix: '',
    cta: 'Start free scan',
    highlighted: false,
    features: [
      '1 website scan',
      'Executive accessibility report (PDF)',
      'WCAG 2.2 issue summary',
      'Real Chromium browser scan',
      'AI-suggested fixes',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For agencies running scans across active client sites.',
    monthlyPrice: 49,
    annualPrice: 39,
    priceSuffix: '/ month',
    cta: 'Start Pro trial',
    highlighted: true,
    badge: 'Most popular',
    features: [
      'Up to 10 monitored websites',
      'Executive + developer reports',
      'Weekly automated rescans',
      'Email alerts on new issues',
      'Scan history & comparisons',
      'Priority email support',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'For agencies managing accessibility across many clients.',
    monthlyPrice: 149,
    annualPrice: 119,
    priceSuffix: '/ month',
    cta: 'Talk to us',
    highlighted: false,
    features: [
      'Unlimited monitored websites',
      'Executive + developer reports',
      'Daily automated rescans',
      'White-labeled client reports',
      'Team workspaces & permissions',
      'Dedicated onboarding support',
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState('annual');

  const isAnnual = billing === 'annual';

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.label}>Pricing</p>
        <h1 className={styles.heading}>
          Simple pricing that scales with your agency.
        </h1>
        <p className={styles.subheading}>
          Start free with a single scan. Upgrade when you need ongoing
          monitoring and client-ready reports across every site you manage.
        </p>

        <div className={styles.toggleWrap}>
          <div className={styles.toggle}>
            <button
              type="button"
              className={`${styles.toggleOption} ${!isAnnual ? styles.toggleOptionActive : ''}`}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`${styles.toggleOption} ${isAnnual ? styles.toggleOptionActive : ''}`}
              onClick={() => setBilling('annual')}
            >
              Annually
            </button>
          </div>
          <span className={styles.saveBadge}>Save 20%</span>
        </div>

        <div className={styles.plansGrid}>
          {PLANS.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`${styles.planCard} ${plan.highlighted ? styles.planCardHighlighted : ''}`}
              >
                {plan.badge && <span className={styles.badge}>{plan.badge}</span>}

                <p className={styles.planName}>{plan.name}</p>
                <p className={styles.planDescription}>{plan.description}</p>

                <div className={styles.priceRow}>
                  <span className={styles.priceValue}>${price}</span>
                  {plan.priceSuffix && (
                    <span className={styles.priceSuffix}>{plan.priceSuffix}</span>
                  )}
                </div>

                {price > 0 && (
                  <p className={styles.billingNote}>
                    {isAnnual ? 'Billed annually' : 'Billed monthly'}
                  </p>
                )}
                {price === 0 && <p className={styles.billingNote}>No credit card required</p>}

                <button
                  type="button"
                  className={`${styles.planButton} ${plan.highlighted ? styles.planButtonPrimary : ''}`}
                >
                  {plan.cta}
                </button>

                <ul className={styles.featureList}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.featureItem}>
                      <span className={styles.checkIcon}>{CHECK_ICON}</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className={styles.faqLink}>
          Have more questions? <a href="/#faq">See our FAQ</a>
        </p>
      </div>
    </section>
  );
}
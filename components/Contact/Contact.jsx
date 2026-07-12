'use client';

import { useState } from 'react';
import styles from './Contact.module.css';

const CONTACT_LINKS = [
  {
    id: 'email',
    label: 'info@compliantscan.com',
    href: 'mailto:info@compliantscan.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4.5 6.5l7.5 6 7.5-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'Connect on LinkedIn',
    href: 'https://www.linkedin.com/in/bibek-dahal-8357b4347/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10.5v6M8 7.75v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M11.5 16.5v-3.5c0-1.1.9-2 2-2s2 .9 2 2v3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M11.5 16.5v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'x',
    label: 'Follow on X',
    href: 'https://x.com/bibek_dahal0807',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', website: '', message: '' });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Website inquiry from ${form.name || 'a visitor'}`);
    const bodyLines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.website ? `Website: ${form.website}` : null,
      '',
      form.message,
    ].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join('\n'));

    window.location.href = `mailto:info@compliantscan.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.left}>
          <p className={styles.label}>Get in touch</p>
          <h2 className={styles.heading}>
            Questions about your site&apos;s accessibility? Let&apos;s talk.
          </h2>
          <p className={styles.subheading}>
            Whether you&apos;re evaluating CompliantScan for your agency or
            just have a question about a scan result, reach out directly.
          </p>

          <div className={styles.linksColumn}>
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={styles.linkCard}
                target={link.id === 'email' ? undefined : '_blank'}
                rel={link.id === 'email' ? undefined : 'noopener noreferrer'}
              >
                <span className={styles.linkIcon}>{link.icon}</span>
                <span className={styles.linkLabel}>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange('name')}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange('email')}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <input
              type="url"
              placeholder="https://yourwebsite.com (optional)"
              value={form.website}
              onChange={handleChange('website')}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <textarea
              placeholder="What do you need help with?"
              value={form.message}
              onChange={handleChange('message')}
              required
              rows={5}
              className={styles.textarea}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
const plans = [
  ['Starter', 'Full report, AI fixes, branded PDF export'],
  ['Pro', 'Everything in Starter plus compliance badge HTML'],
  ['Business', 'Everything in Pro plus white-label report branding'],
];

export default function PricingPage() {
  return (
    <main className="page-container">
      <section className="hero-section compact-hero">
        <p className="eyebrow">Upgrade</p>
        <h1>Unlock the consultant-grade ADA report</h1>
        <p className="hero-subtitle">Paid reports include full WCAG details, source snippets, AI-powered fixes, priority ranking, trend history, and professional PDF export.</p>
      </section>
      <section className="pricing-grid">
        {plans.map(([name, body]) => (
          <article key={name} className="pricing-card">
            <h2>{name}</h2>
            <p>{body}</p>
            <a className="scan-button pricing-link" href={process.env.NEXT_PUBLIC_CHECKOUT_URL || 'mailto:compliantscan@gmail.com?subject=Upgrade%20ADA%20Scanner'}>Subscribe</a>
          </article>
        ))}
      </section>
    </main>
  );
}

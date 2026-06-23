'use client';

import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function PricingPage() {
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">CompliantScan</a>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/#how-it-works">How it works</a>
            <a href="/#features">Features</a>
            <a href="/pricing">Pricing</a>
            <a href="/#contact">Contact</a>
          </div>
        </div>
      </nav>
      <Pricing />
      <Footer />
    </>
  );
}

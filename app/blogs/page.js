import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

export const metadata = {
  title: 'Blogs — CompliantScan',
};

export default function BlogsPage() {
  return (
    <main>
      <Navbar />
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 48px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-brand-green)', marginBottom: 20 }}>
            Coming soon
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 48, color: 'var(--color-text-primary)', margin: '0 0 16px' }}>
            Blog
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto' }}>
            Articles on accessibility, WCAG 2.2, and agency best practices are on their way.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}

import Navbar from '@/components/Navbar/Navbar';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';

export const metadata = {
  title: 'Contact CompliantScan',
  description:
    'Have a question about CompliantScan or your accessibility scan results? Get in touch with the team directly.',
  alternates: {
    canonical: 'https://www.compliantscan.com/contact',
  },
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <Contact />
      <Footer />
    </main>
  );
}

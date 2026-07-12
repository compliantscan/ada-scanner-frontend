import Navbar from '@/components/Navbar/Navbar';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';

export const metadata = {
  title: 'Contact — CompliantScan',
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

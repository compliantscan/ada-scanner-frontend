import Navbar from '@/components/Navbar/Navbar';
import Pricing from '@/components/Pricing/Pricing';
import Footer from '@/components/Footer/Footer';

export const metadata = {
  title: 'Pricing — CompliantScan',
  description:
    'Simple, transparent pricing for agencies. Scan for free, upgrade for ongoing monitoring and client-ready reports.',
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Pricing />
      <Footer />
    </>
  );
}
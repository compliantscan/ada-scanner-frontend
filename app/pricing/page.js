import Navbar from '@/components/Navbar/Navbar';
import Pricing from '@/components/Pricing/Pricing';
import Footer from '@/components/Footer/Footer';

export const metadata = {
  title: 'Website Accessibility Scanner Pricing | CompliantScan',
  description:
    'Compare CompliantScan plans for scanning client websites, finding WCAG issues, and generating client-ready accessibility reports.',
  alternates: {
    canonical: 'https://www.compliantscan.com/pricing',
  },
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

import { Suspense } from 'react';
import ScanningProgress from '@/components/ScanningProgress/ScanningProgress';

export const metadata = {
  title: 'Scanning your website — CompliantScan',
  description: 'Running your free accessibility scan. This usually takes about 60 seconds.',
};

export default function ScanningPage() {
  return (
    <Suspense fallback={null}>
      <ScanningProgress />
    </Suspense>
  );
}

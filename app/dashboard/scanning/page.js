import { Suspense } from 'react';
import ScanningProgress from '../../../components/ScanningProgress/ScanningProgress';

export default function DashboardScanningPage() {
  return (
    <Suspense fallback={null}>
      <ScanningProgress mode="dashboard" />
    </Suspense>
  );
}

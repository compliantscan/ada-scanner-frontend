export const mockUser = {
  name: 'UpQode Digital',
  email: 'hello@upqode.com',
  initials: 'UD',
};

export const mockPlan = {
  name: 'Agency Plan',
  tier: 'Founding Member',
  scansUsed: 24,
  scansLimit: 100,
};

export const mockStats = [
  {
    id: 'websites',
    label: 'Websites Scanned',
    value: '24',
    trend: '20% vs last month',
    trendDirection: 'up',
    icon: 'globe',
    color: 'blue',
  },
  {
    id: 'pages',
    label: 'Pages Scanned',
    value: '186',
    trend: '18% vs last month',
    trendDirection: 'up',
    icon: 'file',
    color: 'green',
  },
  {
    id: 'violations',
    label: 'Total Violations',
    value: '412',
    trend: '12% vs last month',
    trendDirection: 'up',
    icon: 'alert',
    color: 'red',
  },
  {
    id: 'critical',
    label: 'Critical Issues',
    value: '37',
    trend: '5% vs last month',
    trendDirection: 'down',
    icon: 'shield',
    color: 'orange',
  },
  {
    id: 'score',
    label: 'Avg. Accessibility Score',
    value: '72/100',
    trend: '8 pts vs last month',
    trendDirection: 'up',
    icon: 'chart',
    color: 'purple',
  },
];

export const mockReports = [
  {
    id: '1',
    domain: 'upqode.com',
    url: 'https://upqode.com',
    scanType: 'Full Website',
    scanTypeVariant: 'blue',
    pages: 10,
    score: 72,
    violations: 18,
    violationsChange: 3,
    riskLevel: 'Medium Risk',
    riskVariant: 'orange',
    scannedAt: '2026-03-10T14:32:00',
  },
  {
    id: '2',
    domain: 'dd.nyc',
    url: 'https://dd.nyc',
    scanType: 'Full Website',
    scanTypeVariant: 'blue',
    pages: 8,
    score: 64,
    violations: 31,
    violationsChange: 7,
    riskLevel: 'High Risk',
    riskVariant: 'red',
    scannedAt: '2026-03-09T11:15:00',
  },
  {
    id: '3',
    domain: 'unicorndv.com',
    url: 'https://unicorndv.com',
    scanType: 'Single Page',
    scanTypeVariant: 'green',
    pages: 1,
    score: 81,
    violations: 4,
    violationsChange: 0,
    riskLevel: 'Low Risk',
    riskVariant: 'green',
    scannedAt: '2026-03-08T09:48:00',
  },
];

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'layout' },
  { id: 'scans', label: 'New Scan', href: '/dashboard/scan', icon: 'search' },
  { id: 'reports', label: 'Reports', href: '/dashboard/reports', icon: 'file-text' },
  { id: 'monitoring', label: 'Monitoring', href: '/dashboard/monitoring', icon: 'activity' },
  { id: 'divider', label: '', href: '', icon: '' },
  { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
  { id: 'account', label: 'Account', href: '/dashboard/account', icon: 'user' },
];

export const planFeatures = [
  '10-page full website scans',
  'Executive + developer reports',
  'Scan history & saved reports',
  'Downloadable PDF reports',
  'Priority scan processing',
  'Upgrade path to future white-label dashboard',
];

export const mockMonitoringData = [
  {
    id: '1',
    url: 'constructive.co',
    pagesMonitored: 10,
    status: 'Healthy',
    score: 92,
    scoreTrend: 4,
    scoreTrendDirection: 'up',
    lastScan: '2 hours ago',
    nextScan: 'Tomorrow, 9:00 AM',
    changesDetected: 0,
    issues: {
      newIssues: 0,
      fixedIssues: 3,
      pagesMonitored: 10
    }
  },
  {
    id: '2',
    url: 'upqode.com',
    pagesMonitored: 18,
    status: 'Warning',
    score: 74,
    scoreTrend: 7,
    scoreTrendDirection: 'down',
    lastScan: '5 hours ago',
    nextScan: 'Tomorrow, 9:00 AM',
    changesDetected: 7,
    issues: {
      newIssues: 7,
      fixedIssues: 2,
      pagesMonitored: 18
    }
  },
  {
    id: '3',
    url: 'dd.nyc',
    pagesMonitored: 25,
    status: 'Critical',
    score: 55,
    scoreTrend: 14,
    scoreTrendDirection: 'down',
    lastScan: '1 day ago',
    nextScan: 'Tomorrow, 9:00 AM',
    changesDetected: 12,
    issues: {
      criticalIssues: 2,
      seriousIssues: 5,
      pagesMonitored: 25
    }
  }
];

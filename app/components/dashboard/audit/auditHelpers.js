export function getAuditUrl(report, scanRow) {
  return report?.url || scanRow?.url || '';
}

export function getGeneratedDate(report, scanRow) {
  return report?.generatedAt || scanRow?.completed_at || scanRow?.created_at || '';
}

export function getPagesScanned(report) {
  return report?.pages?.length || 1;
}

export function getIssues(report) {
  return report?.violations || [];
}

export function getSeverityCounts(report) {
  const s = report?.executiveSummary?.severityCounts;
  if (s) return s;
  const issues = getIssues(report);
  return issues.reduce(
    (acc, v) => {
      const sev = v.severity || v.impact || 'minor';
      if (sev in acc) acc[sev]++;
      return acc;
    },
    { critical: 0, serious: 0, moderate: 0, minor: 0 }
  );
}

export function calculateScore(report) {
  if (report?.executiveSummary?.score != null) return report.executiveSummary.score;
  const c = getSeverityCounts(report);
  const deduction = c.critical * 10 + c.serious * 5 + c.moderate * 2 + c.minor * 1;
  return Math.max(0, Math.min(100, 100 - deduction));
}

export function calculateRisk(score) {
  if (score >= 80) return 'Low Risk';
  if (score >= 60) return 'Medium Risk';
  return 'High Risk';
}

export function estimateEffort(counts) {
  const minutes = counts.critical * 45 + counts.serious * 30 + counts.moderate * 15 + counts.minor * 5;
  const lower = Math.ceil(minutes / 60);
  const upper = Math.ceil(lower * 1.25);
  return { lower: Math.max(1, lower), upper: Math.max(1, upper) };
}

export function estimateProjectValue(hours) {
  const RATE = 175;
  return { lower: hours.lower * RATE, upper: hours.upper * RATE };
}

export function getTopPriorityIssues(issues, n = 3) {
  const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  return [...issues]
    .sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9))
    .slice(0, n);
}

export function getQuickWins(issues) {
  return issues.filter(v => {
    const mins = v.fix?.estimatedMinutes ?? minutesBySeverity(v.severity);
    return mins < 30;
  });
}

function minutesBySeverity(sev) {
  return { critical: 45, serious: 30, moderate: 15, minor: 5 }[sev] ?? 15;
}

export function getNextSprintIssues(issues) {
  const top3 = getTopPriorityIssues(issues, 3).map(v => v.ruleId || v.title);
  const quickWinIds = new Set(getQuickWins(issues).map(v => v.ruleId || v.title));
  return issues.filter(v => {
    const id = v.ruleId || v.title;
    return !top3.includes(id) && !quickWinIds.has(id) && ['moderate', 'minor'].includes(v.severity);
  });
}

export function groupIssuesByPage(report) {
  if (report?.pages?.length > 0) return report.pages;
  const issues = getIssues(report);
  const url = report?.url || '';
  const counts = getSeverityCounts(report);
  return [{
    url,
    violations: issues.length,
    critical: counts.critical,
    serious: counts.serious,
  }];
}

export function suggestedSchedule(effortHours) {
  if (effortHours <= 3) return 'Same day';
  if (effortHours <= 8) return '2 business days';
  if (effortHours <= 16) return '3–5 business days';
  return '1–2 weeks';
}

export function formatDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

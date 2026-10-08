import { EPDSScreeningResult, SicringSessionLog, User } from '../types';

export function generateResearchCSV(
  users: User[],
  screenings: EPDSScreeningResult[],
  sicringLogs: SicringSessionLog[]
): string {
  // BR-11: Export riset hanya memuat kode responden pseudonim (MNT-xxx), tanpa NIK, nama, atau no HP!
  const headers = [
    'RESPONDER_CODE',
    'PERINATAL_PHASE',
    'WEEKS_OR_DAYS',
    'WAVE_TYPE',
    'SCREENING_DATE',
    'EPDS_TOTAL_SCORE',
    'ITEM_10_SELFHARM_SCORE',
    'TRIAGE_CATEGORY',
    'SICRING_COMPLETED_SESSIONS',
    'SICRING_ACTIVE_MINUTES',
    'X3_COMPLIANCE_RATE_PERCENT',
    'RESEARCH_CONSENT_ACTIVE',
  ];

  const rows: string[] = [];

  // Group screenings by user
  users
    .filter((u) => u.role === 'ibu' && u.responderCode)
    .forEach((ibu) => {
      // Check research consent
      const hasConsent = ibu.consentGiven?.researchParticipation ?? true;
      if (!hasConsent) return; // BR-12: Tarik consent penelitian -> dikeluarkan dari export

      const userScreenings = screenings.filter((s) => s.userId === ibu.id);
      const userLogs = sicringLogs.filter((l) => l.userId === ibu.id);

      const completedSessions = userLogs.filter((l) => l.isCompleted).length;
      const totalMinutes = Math.round(
        userLogs.reduce((acc, curr) => acc + curr.durationSecondsPlayed, 0) / 60
      );
      // Target protocol SICRING: e.g. 8 recommended sessions for intervention period
      const protocolTargetSessions = 8;
      const complianceRate = Math.min(
        100,
        Math.round((completedSessions / protocolTargetSessions) * 100)
      );

      const phase = ibu.perinatalStage || 'hamil';
      const weeksOrDays =
        phase === 'hamil'
          ? `${ibu.gestationalWeeks ?? 24}_minggu`
          : `${ibu.postpartumDays ?? 7}_hari_nifas`;

      if (userScreenings.length === 0) {
        rows.push(
          [
            ibu.responderCode,
            phase,
            weeksOrDays,
            'BELUM_SKRINING',
            '-',
            '-',
            '-',
            '-',
            completedSessions,
            totalMinutes,
            `${complianceRate}%`,
            'TRUE',
          ].join(',')
        );
      } else {
        userScreenings.forEach((scr) => {
          rows.push(
            [
              ibu.responderCode,
              phase,
              weeksOrDays,
              scr.waveType,
              new Date(scr.date).toISOString().split('T')[0],
              scr.totalScore,
              scr.item10Score,
              scr.category.toUpperCase(),
              completedSessions,
              totalMinutes,
              `${complianceRate}%`,
              'TRUE',
            ].join(',')
          );
        });
      }
    });

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCSV(content: string, filename = 'MENTARI_Research_Dataset_Pseudonym.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

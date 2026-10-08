export type UserRole = 'ibu' | 'bidan' | 'ahli_materi' | 'peneliti' | 'admin';

export type PerinatalStage = 'hamil' | 'nifas';

export type TriageCategory = 'rendah' | 'waspada' | 'tinggi' | 'red_flag';

export type CaseStatus = 'baru' | 'dikonfirmasi' | 'ditangani' | 'dirujuk' | 'dipantau' | 'ditutup';

export interface TPMB {
  id: string;
  name: string;
  midwifeName: string;
  phone: string;
  address: string;
  codePrefix: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  tpmbId: string;
  responderCode?: string; // e.g. MNT-001 for research pseudonym
  avatar?: string;
  // Perinatal data for Ibu
  perinatalStage?: PerinatalStage;
  gestationalWeeks?: number; // if pregnant
  hpht?: string; // Hari Pertama Haid Terakhir
  hpl?: string; // Hari Perkiraan Lahir
  postpartumDays?: number; // if postpartum
  deliveryDate?: string;
  activeCaseId?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  consentGiven?: {
    appUsage: boolean;
    researchParticipation: boolean;
    dataShareMidwife: boolean;
    timestamp: string;
    version: string;
  };
}

export interface EPDSItem {
  id: number;
  question: string;
  options: {
    text: string;
    score: number;
  }[];
  isReversed: boolean;
}

export interface EPDSScreeningResult {
  id: string;
  userId: string;
  responderCode: string;
  tpmbId: string;
  date: string;
  totalScore: number; // 0 - 30
  item10Score: number; // 0 - 3 (self-harm indicator)
  category: TriageCategory;
  answers: { [itemId: number]: number }; // itemId: score (0-3)
  waveType: 'T0' | 'rutin' | 'T1'; // Research wave tag
  scoringRuleVersion: string;
  followUpCaseId?: string;
}

export interface FollowUpCase {
  id: string;
  screeningId: string;
  userId: string;
  userName: string;
  userPhone: string;
  responderCode: string;
  tpmbId: string;
  category: 'tinggi' | 'red_flag';
  score: number;
  item10Score: number;
  createdAt: string;
  deadlineAt: string; // SLA (e.g. 4 hrs for red flag, 24 hrs for tinggi)
  assignedMidwifeId: string;
  assignedMidwifeName: string;
  status: CaseStatus;
  isEscalated: boolean;
  history: {
    id: string;
    timestamp: string;
    actorName: string;
    action: string;
    notes: string;
    referralTarget?: string; // e.g., 'Puskesmas Gambir' | 'Psikolog Klinis RSUD'
  }[];
}

export type SicringComponentKey = 'olah_tubuh' | 'charging' | 'healing_touch' | 'blessing_water' | 'pendampingan';

export interface SicringModule {
  id: SicringComponentKey;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  durationMinutes: number;
  targetAudience: 'ibu' | 'ibu_dan_pendamping';
  mediaType: 'audio' | 'video' | 'panduan';
  status: 'published' | 'review' | 'draft';
  safetyGuideline: string;
  textGuide?: string;
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    durationSeconds: number;
  }[];
}

export interface SicringSessionLog {
  id: string;
  userId: string;
  responderCode: string;
  moduleId: SicringComponentKey;
  moduleTitle: string;
  timestamp: string;
  durationSecondsPlayed: number;
  totalDurationSeconds: number;
  isCompleted: boolean; // played >= 80%
  postMood?: 'lebih_tenang' | 'sama_saja' | 'lebih_berat';
  journalNote?: string;
}

export interface ConsultationRequest {
  id: string;
  userId: string;
  userName: string;
  responderCode: string;
  tpmbId: string;
  preferredType: 'telepon' | 'tatap_muka';
  requestedDate: string;
  requestedTimeSlot: string;
  notes: string;
  status: 'menunggu' | 'disetujui' | 'selesai' | 'dibatalkan';
  confirmedSchedule?: string;
  midwifeNotes?: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: 'kehamilan' | 'nifas' | 'psikologis' | 'keluarga' | 'relaksasi';
  readTime: string;
  summary: string;
  content: string;
  reviewedBy: string;
  publishedDate: string;
  imageUrl?: string;
  tags?: string[];
  status?: 'published' | 'draft';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
}

export interface ThresholdConfig {
  version: string;
  updatedAt: string;
  updatedBy: string;
  lowMax: number; // default 9
  cautionMin: number; // default 10
  cautionMax: number; // default 12
  highMin: number; // default 13
  item10ImmediateRedFlag: boolean; // true
}

export interface AncVisitRecord {
  id: string;
  userId: string;
  userName: string;
  responderCode: string;
  tpmbId: string;
  type: string;
  stage: 'hamil' | 'nifas';
  date: string;
  gestationalWeeks?: number;
  postpartumDays?: number;
  midwifeName: string;
  bloodPressure: string;
  weight: string;
  lila?: string;
  tfu?: string;
  djj?: string;
  labHb?: string;
  therapy?: string;
  notes: string;
  nextScheduledDate: string;
  isOnTime: boolean;
  status: 'selesai' | 'terjadwal' | 'terlambat';
}


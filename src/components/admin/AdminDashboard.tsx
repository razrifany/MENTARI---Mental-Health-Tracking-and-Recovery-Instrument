import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Activity,
  HeartHandshake,
  Download,
  Settings,
  ShieldCheck,
  Search,
  Filter,
  Phone,
  Eye,
  Plus,
  ArrowLeft,
  CheckCircle,
  Clock,
  Calendar,
  CalendarCheck,
  Sparkles,
  TrendingDown,
  FileSpreadsheet,
  AlertCircle,
  FileCheck,
  Menu,
  X,
  LogOut,
  ChevronRight,
  BookOpen,
  Check,
  Shield,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, FollowUpCase, UserRole } from '../../types';
import { BidanPatientDetailModal } from './BidanPatientDetailModal';
import { RegisterMotherModal } from './RegisterMotherModal';
import { AhliMateriSicringView } from './AhliMateriSicringView';
import { PenelitiPortalView } from './PenelitiPortalView';
import { AdminPortalView } from './AdminPortalView';
import { TpmbClinicalDashboard } from './TpmbClinicalDashboard';
import { BidanAncManagementView } from './BidanAncManagementView';

interface AdminDashboardProps {
  onSwitchToUser: () => void;
}

export type AdminDashboardTab =
  | 'dashboard'
  | 'anc'
  | 'pasien'
  | 'pendampingan'
  | 'panduan_sicring'
  | 'riset'
  | 'ambang'
  | 'pengguna'
  | 'audit';

// Role-based allowed tabs definition
const ROLE_PERMISSIONS: Record<UserRole, AdminDashboardTab[]> = {
  bidan: ['dashboard', 'anc', 'pasien', 'pendampingan'],
  ahli_materi: ['panduan_sicring'],
  peneliti: ['dashboard', 'riset', 'ambang'],
  admin: ['pengguna', 'audit'],
  ibu: ['dashboard'], // fallback
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchToUser }) => {
  const {
    currentUser,
    users,
    cases,
    screenings,
    sicringLogs,
    consultations,
    tpmbList,
    thresholdConfig,
    auditLogs,
    ancVisits,
    loginAs,
    logout,
    updateConsultationStatus,
    exportResearchData,
  } = useApp();

  const userRole: UserRole = currentUser?.role || 'bidan';
  const allowedTabs = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.bidan;

  // Active tab state - initialize with first permitted tab (defaults to dashboard for Bidan & Peneliti)
  const [activeTab, setActiveTab] = useState<AdminDashboardTab>(allowedTabs[0]);

  // Keep active tab valid whenever role changes
  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
    }
  }, [userRole, allowedTabs, activeTab]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Selected patient for modal
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Filters for patient list (Bidan)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<'semua' | 'hamil' | 'nifas'>('semua');
  const [filterRisk, setFilterRisk] = useState<string>('semua');

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];

  // Patients registered in current TPMB
  const patients = users.filter((u) => u.role === 'ibu' && u.tpmbId === currentTpmb.id);

  // Open cases (prioritas hari ini)
  const openCases = cases.filter(
    (c) => c.status === 'baru' || c.status === 'dikonfirmasi' || c.status === 'ditangani'
  );
  const redFlagCases = openCases.filter((c) => c.category === 'red_flag');
  const highCases = openCases.filter((c) => c.category === 'tinggi');

  // Counts for fast filter pills on Daftar Pasien TPMB
  const riskCounts = {
    total: patients.length,
    red_flag: patients.filter((p) => {
      const scr = screenings.filter((s) => s.userId === p.id)[0];
      return scr && (scr.item10Score > 0 || scr.category === 'red_flag');
    }).length,
    tinggi: patients.filter((p) => {
      const scr = screenings.filter((s) => s.userId === p.id)[0];
      return scr && scr.item10Score === 0 && (scr.category === 'tinggi' || scr.totalScore >= 13);
    }).length,
    waspada: patients.filter((p) => {
      const scr = screenings.filter((s) => s.userId === p.id)[0];
      return scr && scr.item10Score === 0 && (scr.category === 'waspada' || (scr.totalScore >= 10 && scr.totalScore <= 12));
    }).length,
    rendah: patients.filter((p) => {
      const scr = screenings.filter((s) => s.userId === p.id)[0];
      return scr && scr.item10Score === 0 && scr.category === 'rendah';
    }).length,
    belum_skrining: patients.filter((p) => {
      const scr = screenings.filter((s) => s.userId === p.id)[0];
      return !scr;
    }).length,
  };

  // Filtered patients for Bidan
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.responderCode && p.responderCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.phone.includes(searchQuery);

    const matchesStage = filterStage === 'semua' || p.perinatalStage === filterStage;

    let matchesRisk = true;
    if (filterRisk !== 'semua') {
      const latestScr = screenings.filter((s) => s.userId === p.id)[0];
      if (filterRisk === 'belum_skrining') {
        matchesRisk = !latestScr;
      } else if (filterRisk === 'red_flag') {
        matchesRisk = Boolean(latestScr && (latestScr.item10Score > 0 || latestScr.category === 'red_flag'));
      } else if (filterRisk === 'tinggi') {
        matchesRisk = Boolean(latestScr && latestScr.item10Score === 0 && (latestScr.category === 'tinggi' || latestScr.totalScore >= 13));
      } else if (filterRisk === 'waspada') {
        matchesRisk = Boolean(latestScr && latestScr.item10Score === 0 && (latestScr.category === 'waspada' || (latestScr.totalScore >= 10 && latestScr.totalScore <= 12)));
      } else if (filterRisk === 'rendah') {
        matchesRisk = Boolean(latestScr && latestScr.item10Score === 0 && latestScr.category === 'rendah');
      }
    }

    return matchesSearch && matchesStage && matchesRisk;
  });

  // Scheduled ANC visits in current TPMB
  const upcomingAncCount = ancVisits.filter(
    (v) => v.tpmbId === currentTpmb.id && v.status === 'terjadwal'
  ).length;

  // Master definition of all nav items with role access
  const allNavItems = [
    // Shared / Role-specific Dashboard
    {
      id: 'dashboard' as const,
      label: userRole === 'peneliti' ? 'Dashboard Multi-TPMB' : 'Dashboard Ikhtisar',
      icon: LayoutDashboard,
      badge: userRole === 'bidan' && redFlagCases.length > 0 ? `${redFlagCases.length} Red Flag` : null,
      badgeColor: 'bg-rose-500 text-white',
      roles: ['bidan', 'peneliti'],
    },
    // Bidan items: Layanan ANC (Jadwal & Riwayat Kunjungan) menggantikan Antrian Triase
    {
      id: 'anc' as const,
      label: 'Layanan & Jadwal ANC',
      icon: CalendarCheck,
      badge: upcomingAncCount > 0 ? `${upcomingAncCount} Kontrol` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      roles: ['bidan'],
    },
    {
      id: 'pasien' as const,
      label: 'Daftar Pasien TPMB',
      icon: Users,
      badge: patients.length,
      badgeColor: 'bg-sky-100 text-sky-800',
      roles: ['bidan'],
    },
    {
      id: 'pendampingan' as const,
      label: 'Jadwal Pendampingan',
      icon: HeartHandshake,
      badge:
        consultations.filter((c) => c.status === 'menunggu').length > 0
          ? consultations.filter((c) => c.status === 'menunggu').length
          : null,
      badgeColor: 'bg-amber-500 text-white',
      roles: ['bidan'],
    },
    // Ahli Materi SICRING item
    {
      id: 'panduan_sicring' as const,
      label: 'Kelola Panduan SICRING',
      icon: BookOpen,
      badge: '5 Modul',
      badgeColor: 'bg-purple-100 text-purple-800',
      roles: ['ahli_materi'],
    },
    // Peneliti items
    {
      id: 'riset' as const,
      label: 'Modul Riset & Ekspor',
      icon: FileSpreadsheet,
      roles: ['peneliti'],
    },
    {
      id: 'ambang' as const,
      label: 'Konfigurasi Ambang EPDS',
      icon: Settings,
      badge: thresholdConfig.version,
      badgeColor: 'bg-sky-100 text-sky-700',
      roles: ['peneliti'],
    },
    // Admin items
    {
      id: 'pengguna' as const,
      label: 'Kelola Pengguna & Hak Akses',
      icon: Users,
      badge: users.length,
      badgeColor: 'bg-slate-100 text-slate-800',
      roles: ['admin'],
    },
    {
      id: 'audit' as const,
      label: 'Log Audit Sistem',
      icon: ShieldCheck,
      badge: auditLogs.length,
      badgeColor: 'bg-slate-100 text-slate-700',
      roles: ['admin'],
    },
  ];

  // Filter nav items by current user's role
  const visibleNavItems = allNavItems.filter((item) => item.roles.includes(userRole));

  // Role details config
  const getRoleHeaderInfo = () => {
    switch (userRole) {
      case 'ahli_materi':
        return {
          title: 'Portal Ahli Materi SICRING',
          badgeText: 'Ahli Materi',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
          desc: 'Penyusunan Konten & Panduan (Video, Audio, Teks)',
        };
      case 'peneliti':
        return {
          title: 'Portal Peneliti Riset Perinatal',
          badgeText: 'Peneliti',
          badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          desc: 'Dashboard Multi-TPMB, Riset & Ambang EPDS',
        };
      case 'admin':
        return {
          title: 'Portal Administrator Sistem',
          badgeText: 'Super Admin',
          badgeBg: 'bg-slate-800 text-white border-slate-700',
          desc: 'Manajemen Hak Akses Pengguna & Log Audit Sistem',
        };
      case 'bidan':
      default:
        return {
          title: 'Dashboard Klinis Bidan TPMB',
          badgeText: 'Bidan TPMB',
          badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
          desc: 'Dashboard Ikhtisar, Triase & Asuhan Pasien',
        };
    }
  };

  const roleInfo = getRoleHeaderInfo();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return userRole === 'peneliti'
          ? 'Dashboard Riset Agregat Multi-TPMB'
          : 'Dashboard Ikhtisar Klinis & Triase TPMB';
      case 'anc':
        return 'Layanan ANC & PNC: Jadwal Kunjungan Ulang & Riwayat Pemeriksaan';
      case 'pasien':
        return 'Daftar Pasien Bidan TPMB';
      case 'pendampingan':
        return 'Jadwal Konsultasi & Pendampingan';
      case 'panduan_sicring':
        return 'Pengelolaan Panduan SICRING (Video, Audio, Teks)';
      case 'riset':
        return 'Modul Analisis Riset & Ekspor Data';
      case 'ambang':
        return 'Konfigurasi Ambang Batas EPDS';
      case 'pengguna':
        return 'Kelola Pengguna & Hak Akses Sistem';
      case 'audit':
        return 'Log Audit & Keamanan Sistem';
      default:
        return 'Portal Sistem MENTARI';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Responsive Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Sidebar Brand Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
                M
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-slate-900 text-base leading-tight">MENTARI</h1>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.badgeBg}`}
                  >
                    {roleInfo.badgeText}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                  {currentTpmb.name}
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Role Switcher (Simulasi Uji Hak Akses) */}
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Simulasi Uji Peran Sistem
            </span>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-200/60 p-1.5 rounded-xl text-[11px] font-semibold">
              <button
                onClick={() => loginAs('user-bidan-1')}
                className={`py-1.5 px-2 text-center rounded-lg transition-all ${
                  userRole === 'bidan'
                    ? 'bg-white text-sky-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bidan TPMB: Dashboard, Triase, Pasien, Jadwal Konsultasi"
              >
                🩺 Bidan
              </button>
              <button
                onClick={() => loginAs('user-ahli-materi-1')}
                className={`py-1.5 px-2 text-center rounded-lg transition-all ${
                  userRole === 'ahli_materi'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Ahli Materi SICRING: Kelola Video, Audio, Teks Panduan"
              >
                🧘‍♀️ Ahli Materi
              </button>
              <button
                onClick={() => loginAs('user-peneliti-1')}
                className={`py-1.5 px-2 text-center rounded-lg transition-all ${
                  userRole === 'peneliti'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Peneliti: Dashboard Multi-TPMB, Riset, Ekspor CSV, Ambang EPDS"
              >
                🔬 Peneliti
              </button>
              <button
                onClick={() => loginAs('user-admin-1')}
                className={`py-1.5 px-2 text-center rounded-lg transition-all ${
                  userRole === 'admin'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Admin: Kelola Pengguna, Hak Akses, Log Audit Sistem"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Navigation Menu Links (Filtered by Role Permissions) */}
          <div className="p-3 flex-1 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
              Menu Hak Akses ({roleInfo.badgeText})
            </span>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? userRole === 'ahli_materi'
                        ? 'bg-purple-600 text-white shadow-xs font-bold'
                        : userRole === 'peneliti'
                        ? 'bg-indigo-600 text-white shadow-xs font-bold'
                        : userRole === 'admin'
                        ? 'bg-slate-800 text-white shadow-xs font-bold'
                        : 'bg-sky-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Action for Bidan only */}
            {userRole === 'bidan' && (
              <div className="pt-3">
                <button
                  onClick={() => {
                    setIsRegisterOpen(true);
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Daftarkan Ibu Baru</span>
                </button>
              </div>
            )}
          </div>

          {/* User Info & Bottom Controls */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser?.name.charAt(0) || 'U'
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">{roleInfo.desc}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onSwitchToUser}
                className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-colors"
                title="Buka tampilan aplikasi untuk pasien / ibu"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Aplikasi Ibu</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace on the Right */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header of Main Workspace */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              title="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {getTabTitle()}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border hidden sm:inline-block ${roleInfo.badgeBg}`}
                >
                  {roleInfo.badgeText}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {currentTpmb.name} &bull; {roleInfo.desc}
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2">
            {userRole === 'peneliti' && activeTab === 'riset' && (
              <button
                onClick={() => exportResearchData()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh Dataset</span> Riset
              </button>
            )}

            {userRole === 'bidan' && activeTab === 'pasien' && (
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Daftarkan Ibu</span>
              </button>
            )}

            <button
              onClick={onSwitchToUser}
              className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold px-3 py-1.5 rounded-xl border border-sky-200 text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode Ibu</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
          {/* ========================================================
              ROLE 1: AHLI MATERI SICRING
              Halaman kelola panduan sicring (video, audio, teks)
          ======================================================== */}
          {userRole === 'ahli_materi' && <AhliMateriSicringView />}

          {/* ========================================================
              ROLE 2: PENELITI
              Dashboard Multi-TPMB, Modul riset & ekspor, lalu konfigurasi ambang epds
          ======================================================== */}
          {userRole === 'peneliti' && (
            <PenelitiPortalView
              activeSubTab={
                activeTab === 'ambang'
                  ? 'ambang'
                  : activeTab === 'riset'
                  ? 'riset'
                  : 'dashboard'
              }
              onSubTabChange={(t) => setActiveTab(t)}
            />
          )}

          {/* ========================================================
              ROLE 3: ADMINISTRATOR
              Modul log audit sistem & kelola pengguna/hak akses
          ======================================================== */}
          {userRole === 'admin' && (
            <AdminPortalView
              activeSubTab={activeTab === 'audit' ? 'audit' : 'pengguna'}
              onSubTabChange={(t) => setActiveTab(t)}
            />
          )}

          {/* ========================================================
              ROLE 4: BIDAN TPMB
              Dashboard Ikhtisar Klinis, Antrian Triase, Pasien, Jadwal
          ======================================================== */}
          {userRole === 'bidan' && (
            <>
              {/* TAB 1: DASHBOARD IKHTISAR KLINIS (NEW) */}
              {activeTab === 'dashboard' && (
                <TpmbClinicalDashboard
                  mode="bidan"
                  initialTpmbId={currentTpmb.id}
                  onOpenPatientDetail={(patient) => setSelectedPatient(patient)}
                />
              )}

              {/* TAB 2: LAYANAN & JADWAL ANC (MENGGANTIKAN ANTRIAN TRIASE SESUAI PERMINTAAN) */}
              {activeTab === 'anc' && (
                <BidanAncManagementView
                  onOpenPatientDetail={(patient) => setSelectedPatient(patient)}
                />
              )}

              {/* TAB 3: DAFTAR PASIEN TPMB (DENGAN FILTER KATEGORI RISIKO: RED FLAG, TINGGI, WASPADA, RENDAH, BELUM SKRINING) */}
              {activeTab === 'pasien' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                  {/* Header Title & Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        Daftar Pasien Ibu di {currentTpmb.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Pantau seluruh ibu terdaftar, triase risiko EPDS, dan tindak lanjut asuhan.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsRegisterOpen(true)}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Daftarkan Ibu Baru</span>
                    </button>
                  </div>

                  {/* Fast Risk Category Filter Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Filter Kategori Risiko:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFilterRisk('semua')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          filterRisk === 'semua'
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Semua Pasien ({riskCounts.total})
                      </button>

                      <button
                        type="button"
                        onClick={() => setFilterRisk('red_flag')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          filterRisk === 'red_flag'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-rose-50 text-rose-800 border border-rose-200/80 hover:bg-rose-100'
                        }`}
                      >
                        <span>🚨 Red Flag (Item 10 &gt; 0)</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-black">
                          {riskCounts.red_flag}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFilterRisk('tinggi')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          filterRisk === 'tinggi'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
                        }`}
                      >
                        <span>⚠️ Risiko Tinggi (≥13)</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-black">
                          {riskCounts.tinggi}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFilterRisk('waspada')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          filterRisk === 'waspada'
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : 'bg-sky-50 text-sky-800 border border-sky-200/80 hover:bg-sky-100'
                        }`}
                      >
                        <span>🟡 Sedang / Waspada (10-12)</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-black">
                          {riskCounts.waspada}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFilterRisk('rendah')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          filterRisk === 'rendah'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100'
                        }`}
                      >
                        <span>🟢 Rendah / Stabil (0-9)</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-black">
                          {riskCounts.rendah}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFilterRisk('belum_skrining')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          filterRisk === 'belum_skrining'
                            ? 'bg-slate-700 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span>⚪ Belum Skrining</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-black">
                          {riskCounts.belum_skrining}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Contextual Alert Banner for Red Flag or High Risk */}
                  {filterRisk === 'red_flag' && (
                    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-rose-950">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="block font-black text-rose-900">
                            TRIASE PERHATIAN DARURAT (SLA 4 JAM)
                          </strong>
                          <span>
                            Pasien terindikasi memiliki dorongan menyakiti diri (Item 10 &gt; 0). Lakukan konfirmasi segera atau hubungi kontak darurat.
                          </span>
                        </div>
                      </div>
                      <span className="bg-rose-600 text-white font-extrabold px-3 py-1 rounded-full text-[11px] shrink-0 animate-pulse">
                        {riskCounts.red_flag} Pasien Kritis
                      </span>
                    </div>
                  )}

                  {filterRisk === 'tinggi' && (
                    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-950">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="block font-black text-amber-900">
                            TRIASE RISIKO TINGGI (SLA 24 JAM)
                          </strong>
                          <span>
                            Pasien dengan skor EPDS ≥ 13 membutuhkan konseling intensif 1-on-1, rujukan psikologis, atau kunjungan rumah Bidan.
                          </span>
                        </div>
                      </div>
                      <span className="bg-amber-600 text-white font-extrabold px-3 py-1 rounded-full text-[11px] shrink-0">
                        {riskCounts.tinggi} Kasus Butuh Asuhan
                      </span>
                    </div>
                  )}

                  {/* Search and Stage Filters Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Cari nama ibu, kode responden MNT, nomor telepon..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500"
                      />
                    </div>

                    <select
                      value={filterStage}
                      onChange={(e) => setFilterStage(e.target.value as any)}
                      className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="semua">Semua Fase (Hamil &amp; Nifas)</option>
                      <option value="hamil">Hanya Ibu Hamil</option>
                      <option value="nifas">Hanya Ibu Nifas</option>
                    </select>
                  </div>

                  {/* Patients Table */}
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                        <tr>
                          <th className="p-3.5">Kode &amp; Nama Pasien</th>
                          <th className="p-3.5">Fase Perinatal</th>
                          <th className="p-3.5">Skor Terakhir</th>
                          <th className="p-3.5">Status Triase &amp; Peringatan</th>
                          <th className="p-3.5">Kepatuhan SICRING</th>
                          <th className="p-3.5 text-right">Aksi &amp; Kontak</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPatients.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                              Tidak ada pasien yang sesuai dengan filter pencarian dan kategori risiko ini.
                            </td>
                          </tr>
                        ) : (
                          filteredPatients.map((p) => {
                            const scr = screenings.filter((s) => s.userId === p.id)[0];
                            const logs = sicringLogs.filter((l) => l.userId === p.id);
                            const completed = logs.filter((l) => l.isCompleted).length;
                            const isRedFlag = Boolean(scr && (scr.item10Score > 0 || scr.category === 'red_flag'));
                            const isTinggi = Boolean(scr && scr.item10Score === 0 && (scr.category === 'tinggi' || scr.totalScore >= 13));

                            return (
                              <tr
                                key={p.id}
                                className={`transition-colors ${
                                  isRedFlag
                                    ? 'bg-rose-50/40 hover:bg-rose-50/70'
                                    : isTinggi
                                    ? 'bg-amber-50/30 hover:bg-amber-50/60'
                                    : 'hover:bg-slate-50/80'
                                }`}
                              >
                                <td className="p-3.5">
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{p.name}</span>
                                    {isRedFlag && (
                                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block" />
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    {p.responderCode} &bull; {p.phone}
                                  </div>
                                </td>
                                <td className="p-3.5 capitalize">
                                  {p.perinatalStage === 'hamil' ? (
                                    <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-semibold">
                                      Hamil ({p.gestationalWeeks ?? 24} mg)
                                    </span>
                                  ) : (
                                    <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-semibold">
                                      Nifas ({p.postpartumDays ?? 14} hr)
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5 font-bold">
                                  {scr ? (
                                    <span
                                      className={`${
                                        isRedFlag
                                          ? 'text-rose-700 font-black'
                                          : isTinggi
                                          ? 'text-amber-700 font-black'
                                          : 'text-slate-800'
                                      }`}
                                    >
                                      {scr.totalScore} / 30
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-normal">-</span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  {scr ? (
                                    <div className="space-y-1">
                                      <span
                                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase inline-block ${
                                          isRedFlag
                                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                            : isTinggi
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : scr.category === 'waspada'
                                            ? 'bg-sky-100 text-sky-800'
                                            : 'bg-emerald-100 text-emerald-800'
                                        }`}
                                      >
                                        {isRedFlag ? 'RED FLAG' : scr.category.replace('_', ' ')}
                                      </span>
                                      {scr.item10Score > 0 && (
                                        <span className="block text-[10px] text-rose-700 font-bold">
                                          Peringatan Item 10: Skor {scr.item10Score}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">
                                      Belum Skrining
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                                      <div
                                        className="bg-emerald-500 h-full rounded-full"
                                        style={{ width: `${Math.min(100, (completed / 8) * 100)}%` }}
                                      />
                                    </div>
                                    <span className="text-[11px] font-mono font-bold text-slate-600">
                                      {completed}/8
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3.5 text-right space-x-1.5">
                                  <a
                                    href={`tel:${p.phone.replace(/[^0-9]/g, '')}`}
                                    className={`inline-flex items-center justify-center p-1.5 rounded-xl transition-colors ${
                                      isRedFlag
                                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                                    title="Hubungi Pasien"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    onClick={() => setSelectedPatient(p)}
                                    className={`font-bold px-3 py-1.5 rounded-xl text-xs transition-colors ${
                                      isRedFlag
                                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                                        : isTinggi
                                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                                        : 'bg-sky-50 hover:bg-sky-100 text-sky-700'
                                    }`}
                                  >
                                    Detail Rekam Medis
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: JADWAL PENDAMPINGAN */}
              {activeTab === 'pendampingan' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Jadwal Konsultasi &amp; Pendampingan 1-on-1
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pengajuan sesi konseling 1-on-1 dari ibu (telepon atau tatap muka di TPMB).
                    </p>
                  </div>

                  <div className="space-y-3">
                    {consultations.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        Belum ada jadwal konsultasi yang diajukan.
                      </div>
                    ) : (
                      consultations.map((cons) => (
                        <div
                          key={cons.id}
                          className="border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {cons.userName}
                              </span>
                              <span className="text-xs font-mono text-slate-400">
                                ({cons.responderCode})
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                  cons.status === 'disetujui'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : cons.status === 'menunggu'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {cons.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                              <span>
                                Metode:{' '}
                                <strong>
                                  {cons.preferredType === 'telepon'
                                    ? 'Telepon'
                                    : 'Tatap Muka di TPMB'}
                                </strong>
                              </span>
                              <span>&bull;</span>
                              <span>
                                Tanggal: <strong>{cons.requestedDate}</strong> (
                                {cons.requestedTimeSlot})
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              "{cons.notes}"
                            </p>
                          </div>

                          <div className="flex sm:flex-col gap-2 shrink-0">
                            {cons.status === 'menunggu' && (
                              <button
                                onClick={() =>
                                  updateConsultationStatus(
                                    cons.id,
                                    'disetujui',
                                    'Disetujui. Sesi dijadwalkan oleh Bidan TPMB.'
                                  )
                                }
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                              >
                                Setujui Jadwal
                              </button>
                            )}
                            {cons.status === 'disetujui' && (
                              <button
                                onClick={() =>
                                  updateConsultationStatus(
                                    cons.id,
                                    'selesai',
                                    'Sesi konseling telah selesai dilaksanakan.'
                                  )
                                }
                                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                              >
                                Tandai Selesai
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Patient Detail Modal */}
      <BidanPatientDetailModal
        patient={selectedPatient}
        isOpen={Boolean(selectedPatient)}
        onClose={() => setSelectedPatient(null)}
      />

      {/* Register Mother Modal */}
      <RegisterMotherModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
};

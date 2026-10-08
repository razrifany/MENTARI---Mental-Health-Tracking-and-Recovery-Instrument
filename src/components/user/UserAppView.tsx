import React, { useState } from 'react';
import {
  Home,
  Heart,
  Activity,
  User as UserIcon,
  Phone,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Shield,
  HeartPulse,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  HeartHandshake,
  MessageSquare,
  Clock,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EPDSScreeningResult } from '../../types';
import { EpdsScreeningModal } from './EpdsScreeningModal';
import { EpdsResultModal } from './EpdsResultModal';
import { SicringModuleView } from './SicringModuleView';
import { UserHistoryView } from './UserHistoryView';
import { UserAncHistoryView } from './UserAncHistoryView';
import { UserConsultationModal } from './UserConsultationModal';
import { UserProfileView } from './UserProfileView';
import { EmergencyHelpModal } from './EmergencyHelpModal';
import { EmergencyHelpView } from './EmergencyHelpView';
import { UserMentalEducationView } from './UserMentalEducationView';

interface UserAppViewProps {
  onSwitchToAdmin: () => void;
}

export const UserAppView: React.FC<UserAppViewProps> = ({ onSwitchToAdmin }) => {
  const { currentUser, tpmbList, articles, cases, screenings, logout } = useApp();

  const [activeTab, setActiveTab] = useState<'beranda' | 'latihan' | 'anc' | 'edukasi' | 'riwayat' | 'profil' | 'bantuan'>('beranda');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isChildDetailActive, setIsChildDetailActive] = useState(false);
  const [childDetailTitle, setChildDetailTitle] = useState<string | null>(null);

  // Reset child detail state when tab changes
  React.useEffect(() => {
    setIsChildDetailActive(false);
    setChildDetailTitle(null);
  }, [activeTab]);

  const handleDetailModeChange = (isDetail: boolean, title?: string) => {
    setIsChildDetailActive(isDetail);
    if (isDetail && title) {
      setChildDetailTitle(title);
    } else if (!isDetail) {
      setChildDetailTitle(null);
    }
  };

  const isFullDetailPage = activeTab === 'bantuan' || isChildDetailActive;

  const getDetailTitle = () => {
    if (childDetailTitle) return childDetailTitle;
    if (activeTab === 'bantuan') return 'Bantuan Bidan';
    if (activeTab === 'latihan') return 'Panduan SICRING';
    if (activeTab === 'edukasi') return 'Detail Artikel';
    if (activeTab === 'profil') return 'Detail Profil';
    return 'Detail Halaman';
  };

  const handleHeaderBack = () => {
    if (activeTab === 'bantuan') {
      setActiveTab('beranda');
    } else {
      setIsChildDetailActive(false);
      setChildDetailTitle(null);
    }
  };

  // Modals state
  const [isScreeningOpen, setIsScreeningOpen] = useState(false);
  const [screeningResult, setScreeningResult] = useState<EPDSScreeningResult | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];

  // Check if current user has an active open case
  const userActiveCase = cases.find(
    (c) => c.userId === currentUser?.id && (c.status === 'baru' || c.status === 'dikonfirmasi')
  );

  const handleScreeningFinished = (result: EPDSScreeningResult) => {
    setIsScreeningOpen(false);
    setScreeningResult(result);
    setIsResultOpen(true);
  };

  const gestationalWeeks = currentUser?.gestationalWeeks ?? 26;
  const postpartumDays = currentUser?.postpartumDays ?? 14;
  const isPregnant = currentUser?.perinatalStage === 'hamil';
  const userScreenings = screenings.filter((s) => s.userId === currentUser?.id);
  const latestScreening = userScreenings[0];

  const userNavItems = [
    {
      id: 'beranda' as const,
      label: 'Beranda',
      icon: Home,
      action: () => {
        setActiveTab('beranda');
        setIsMobileSidebarOpen(false);
      },
    },
    {
      id: 'latihan' as const,
      label: 'Modul SICRING',
      icon: Heart,
      action: () => {
        setActiveTab('latihan');
        setIsMobileSidebarOpen(false);
      },
    },
    {
      id: 'anc' as const,
      label: isPregnant ? 'Layanan ANC' : 'Layanan PNC',
      icon: HeartHandshake,
      action: () => {
        setActiveTab('anc');
        setIsMobileSidebarOpen(false);
      },
    },
    {
      id: 'edukasi' as const,
      label: 'Materi Edukasi',
      icon: BookOpen,
      action: () => {
        setActiveTab('edukasi');
        setIsMobileSidebarOpen(false);
      },
    },
    {
      id: 'profil' as const,
      label: 'Profil Saya',
      icon: UserIcon,
      action: () => {
        setActiveTab('profil');
        setIsMobileSidebarOpen(false);
      },
    },
    {
      id: 'bantuan' as const,
      label: 'Bantuan Bidan',
      icon: Phone,
      action: () => {
        setActiveTab('bantuan');
        setIsMobileSidebarOpen(false);
      },
    },
  ];

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'beranda':
        return 'Beranda & Skrining Harian';
      case 'latihan':
        return 'Modul Relaksasi SICRING';
      case 'anc':
      case 'riwayat':
        return isPregnant ? 'Pemeriksaan ANC & Riwayat Terpadu' : 'Pemeriksaan Nifas (PNC) & Riwayat Terpadu';
      case 'edukasi':
        return 'Pojok Edukasi Kesehatan Jiwa Perinatal';
      case 'profil':
        return 'Profil Ibu & Persetujuan (Informed Consent)';
      default:
        return 'Aplikasi MENTARI';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Responsive Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-sky-100 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full h-screen overflow-y-auto">
          {/* Brand & Clinic Info */}
          <div className="p-4 sm:p-5 border-b border-sky-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-xl shadow-sm shadow-sky-200">
                M
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-base tracking-tight leading-tight">
                  MENTARI
                </h1>
                <p className="text-[11px] text-sky-700 font-medium leading-none mt-0.5">
                  Kesehatan Jiwa Ibu
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

          {/* Mother's Perinatal Status Card */}
          <div
            onClick={() => {
              setActiveTab('profil');
              setIsMobileSidebarOpen(false);
            }}
            className="p-4 border-b border-sky-100/60 bg-gradient-to-b from-sky-50/70 to-transparent hover:bg-sky-50/90 cursor-pointer transition-colors group"
            title="Buka Halaman Profil Ibu & Persetujuan (Informed Consent)"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-600 group-hover:bg-sky-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs transition-colors">
                {currentUser?.name ? currentUser.name.charAt(0) : 'I'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-sky-700 transition-colors">
                    {currentUser?.name || 'Ibu Perinatal'}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-sky-800 bg-sky-100/80 px-2 py-0.2 rounded-full inline-block">
                  {currentUser?.responderCode || 'MNT-001'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-2.5 border border-sky-100 space-y-1 text-[11px] shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <HeartPulse className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>
                  {isPregnant
                    ? `Hamil: ${gestationalWeeks} Minggu`
                    : `Nifas: Hari ke-${postpartumDays}`}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 pl-5">
                {isPregnant
                  ? `HPL: ${currentUser?.hpl || '12 Jan 2027'}`
                  : `Bidan: ${currentTpmb.midwifeName}`}
              </p>
              <p className="text-[10px] text-slate-400 pl-5 truncate">
                {currentTpmb.name}
              </p>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="p-3 flex-1 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
              Menu Utama
            </span>

            {userNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'anc' && activeTab === 'riwayat');
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Emergency SOS Help Box in Sidebar */}
            <div className="pt-3">
              <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-3 text-xs">
                <div className="flex items-center gap-2 text-rose-900 font-bold mb-1">
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Bantuan Darurat 24 Jam</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-tight mb-2.5">
                  Bidan TPMB & hotline siap mendampingi bila Ibu merasa cemas berlebih.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('bantuan');
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hubungi Sekarang</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Footer Controls */}
          <div className="p-3 border-t border-sky-100/80 bg-slate-50/60 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onSwitchToAdmin}
                className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 px-2 rounded-xl text-[11px] font-semibold transition-colors"
                title="Buka Dashboard Bidan/Admin"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-sky-600" />
                <span>Portal Bidan</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 py-2 px-2 rounded-xl text-[11px] font-semibold transition-colors"
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
        {/* Sticky App Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/70 px-4 py-3 sm:px-6">
          {isFullDetailPage ? (
            /* Detail Header: Back button on left (no border, no shadow), Title centered */
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleHeaderBack}
                className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Kembali"
              >
                <ArrowLeft className="w-5 h-5 text-slate-800" />
              </button>

              <h1 className="font-semibold text-slate-900 text-base sm:text-lg tracking-tight text-center">
                {getDetailTitle()}
              </h1>

              {/* Spacer for 3-column symmetry */}
              <div className="w-9 h-9"></div>
            </div>
          ) : (
            /* Default Dashboard Header */
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  M
                </div>
                <span className="font-bold text-slate-800 text-sm tracking-tight">MENTARI</span>
              </div>

              {/* Minimalist Blue Outline Bantuan Bidan button on top right header */}
              <button
                type="button"
                onClick={() => setActiveTab('bantuan')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-sky-50 text-sky-600 border border-sky-300 shadow-2xs hover:shadow-xs flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                title="Bantuan Darurat Psikologis & Telepon Bidan 24 Jam"
              >
                <Phone className="w-4.5 h-4.5 text-sky-600" />
              </button>
            </div>
          )}
        </header>

        {/* Emergency Alert Banner if Case is Active */}
        {userActiveCase && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-center justify-between text-xs text-rose-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium text-[11px]">
                Kasus aktif terdeteksi. Bidan sedang menyiapkan tindak lanjut.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('bantuan')}
              className="text-rose-700 font-bold underline text-[11px] shrink-0 ml-2"
            >
              Hubungi Bidan
            </button>
          </div>
        )}

        {/* Main Tab Content Body (Natural Window Scroll, Spacious Layout) */}
        <main className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto">
          {activeTab === 'beranda' && (
            <div className="space-y-4">
              {/* 1. Sapaan & Informasi Perinatal (Hamil / Nifas) - Solid Sky 500 Card */}
              <div className="bg-sky-500 text-white rounded-3xl p-4.5 sm:p-5 shadow-sm shadow-sky-200/50 relative overflow-hidden space-y-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    Hai, Ibu {currentUser?.name ? currentUser.name.replace(/^Ny\.\s*/, '') : 'Bunda'}
                  </h2>
                  <p className="text-xs text-sky-100 mt-0.5">
                    {isPregnant
                      ? 'Semoga Ibu dan calon buah hati senantiasa sehat dan tenang hari ini.'
                      : 'Semoga masa pemulihan Ibu dan buah hati senantiasa lancar.'}
                  </p>
                </div>

                {/* Informasi Detail Kehamilan atau Nifas - Clean 2-Column Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {isPregnant ? (
                    <>
                      <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-3 border border-white/30 shadow-2xs">
                        <span className="text-[10px] font-bold text-sky-100 block uppercase tracking-wider">
                          Usia Kehamilan
                        </span>
                        <span className="text-base sm:text-lg font-black text-white block leading-tight mt-0.5">
                          {gestationalWeeks} Minggu
                        </span>
                        <span className="text-[10px] text-sky-100 font-medium block mt-0.5">
                          Trimester {gestationalWeeks <= 12 ? 'I' : gestationalWeeks <= 27 ? 'II' : 'III'}
                        </span>
                      </div>

                      <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-3 border border-white/30 shadow-2xs">
                        <span className="text-[10px] font-bold text-sky-100 block uppercase tracking-wider">
                          Perkiraan Lahir (HPL)
                        </span>
                        <span className="text-base sm:text-lg font-black text-white block leading-tight mt-0.5">
                          {currentUser?.hpl || '12 Jan 2027'}
                        </span>
                        <span className="text-[10px] text-sky-100 font-medium block mt-0.5 truncate">
                          Bidan Pembina TPMB
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-3 border border-white/30 shadow-2xs">
                        <span className="text-[10px] font-bold text-sky-100 block uppercase tracking-wider">
                          Masa Nifas
                        </span>
                        <span className="text-base sm:text-lg font-black text-white block leading-tight mt-0.5">
                          Hari ke-{postpartumDays}
                        </span>
                        <span className="text-[10px] text-sky-100 font-medium block mt-0.5">
                          Pasca Persalinan
                        </span>
                      </div>

                      <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-3 border border-white/30 shadow-2xs">
                        <span className="text-[10px] font-bold text-sky-100 block uppercase tracking-wider">
                          Tanggal Lahir
                        </span>
                        <span className="text-base sm:text-lg font-black text-white block leading-tight mt-0.5 truncate">
                          {currentUser?.deliveryDate
                            ? new Date(currentUser.deliveryDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '23 Sep 2026'}
                        </span>
                        <span className="text-[10px] text-sky-100 font-medium block mt-0.5 truncate">
                          Bidan Pembina TPMB
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 2. Bagian Skrining EPDS (Dibuat Seragam Seperti SICRING) */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-600" />
                    <span>Skrining Kesehatan Mental (EPDS)</span>
                  </h3>
                  <button
                    onClick={() => setIsScreeningOpen(true)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    Mulai Cek (10 Soal)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setIsScreeningOpen(true)}
                    className="p-3.5 bg-sky-50/70 hover:bg-sky-100/70 rounded-2xl border border-sky-100 cursor-pointer transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 block">Cek Kabar 7 Hari Terakhir</span>
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                          10 Pertanyaan
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Instrumen Edinburgh Postnatal Depression Scale standar tervalidasi untuk mendeteksi kecemasan atau kesedihan ibu secara dini (hanya ±3 menit).
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-sky-200/50 flex items-center justify-between text-[11px] font-bold text-sky-700">
                      <span>Buka Skrining Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('anc')}
                    className="p-3.5 bg-sky-50/70 hover:bg-sky-100/70 rounded-2xl border border-sky-100 cursor-pointer transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 block">Riwayat & Hasil Terakhir</span>
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                          {latestScreening ? `Skor ${latestScreening.totalScore}/30` : 'Belum Skrining'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {latestScreening
                          ? `Kategori: ${
                              latestScreening.category === 'red_flag'
                                ? 'Prioritas / Red Flag'
                                : latestScreening.category === 'tinggi'
                                ? 'Perlu Perhatian Khusus'
                                : latestScreening.category === 'waspada'
                                ? 'Waspada Ringan'
                                : 'Rendah & Stabil'
                            }. Hasil telah terhubung ke portal pantauan Bidan TPMB.`
                          : 'Ibu belum mengisi skrining minggu ini. Rutin melakukan evaluasi sangat membantu menjaga ketenangan jiwa.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-sky-200/50 flex items-center justify-between text-[11px] font-bold text-sky-700">
                      <span>Lihat Grafik & Evaluasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Bagian ANC (Antenatal Care) / PNC (Postnatal Care) - Terhubung ke Halaman ANC & Riwayat */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-sky-600" />
                    <span>{isPregnant ? 'Pemeriksaan Rutin ANC (Antenatal Care)' : 'Pemeriksaan Rutin Nifas (PNC)'}</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('anc')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    Buka Jadwal & Riwayat
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setActiveTab('anc')}
                    className="p-3.5 bg-sky-50/70 hover:bg-sky-100/70 rounded-2xl border border-sky-100 cursor-pointer transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 block">
                          {isPregnant ? 'Pemeriksaan Kehamilan ANC' : 'Pemeriksaan Fisik Masa Nifas'}
                        </span>
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                          {isPregnant ? 'Standar Kemenkes' : 'Masa Pulih'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {isPregnant
                          ? 'Pantau tekanan darah, kenaikan berat badan, tinggi fundus, dan denyut jantung janin (DJJ) berkala di TPMB.'
                          : 'Pemeriksaan involusi rahim, pengeluaran cairan lochea, penyembuhan luka perineum, dan kelancaran ASI.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-sky-200/50 flex items-center justify-between text-[11px] font-bold text-sky-700">
                      <span>Jadwalkan Kunjungan TPMB</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('anc')}
                    className="p-3.5 bg-sky-50/70 hover:bg-sky-100/70 rounded-2xl border border-sky-100 cursor-pointer transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 block">Konseling & Tanya Jawab Bidan</span>
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                          Tatap Muka / Telepon
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Konsultasikan keluhan mual/pusing, kekhawatiran menjelang persalinan, atau perawatan bayi baru lahir langsung dengan Bidan {currentTpmb.midwifeName}.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-sky-200/50 flex items-center justify-between text-[11px] font-bold text-sky-700">
                      <span>Buat Janji Konsultasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Quick Access SICRING Card */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Latihan Ketenangan SICRING</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('latihan')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    Lihat Semua (5)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setActiveTab('latihan')}
                    className="p-3.5 bg-sky-50/70 hover:bg-sky-100/70 rounded-2xl border border-sky-100 cursor-pointer transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 block">Olah Tubuh Relaksasi</span>
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                          Modul 1
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Teknik pernapasan diafragma 4-4-6 untuk menurunkan hormon stres dan menenangkan denyut nadi ibu.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-sky-200/50 flex items-center justify-between text-[11px] font-bold text-sky-700">
                      <span>Mulai Sesi Olah Tubuh</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('latihan')}
                    className="p-3.5 bg-purple-50/70 hover:bg-purple-100/70 rounded-2xl border border-purple-100 cursor-pointer transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 block">Charging Ruhani & Afirmasi</span>
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                          Modul 2
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Hening batin, afirmasi penerimaan cinta diri, menjalin ikatan kasih dengan buah hati, dan doa berserah.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-purple-200/50 flex items-center justify-between text-[11px] font-bold text-purple-700">
                      <span>Mulai Sesi Ruhani</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Bagian Edukasi Kesehatan Jiwa Ibu (Seragam Seperti SICRING) */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Edukasi Kesehatan Jiwa Ibu</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('edukasi')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
                  >
                    Buka Semua Materi ({articles.length})
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {articles.slice(0, 4).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        setSelectedArticleId(art.id);
                        setActiveTab('edukasi');
                      }}
                      className="p-3.5 bg-slate-50/80 hover:bg-sky-50/70 rounded-2xl border border-slate-200/80 hover:border-sky-200 cursor-pointer transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                            {art.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {art.readTime}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs mt-1.5 leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-sky-700">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'latihan' && (
            <SicringModuleView
              onOpenConsultationModal={() => setIsConsultationOpen(true)}
              onDetailModeChange={handleDetailModeChange}
              isDetailActive={isChildDetailActive}
            />
          )}

          {(activeTab === 'anc' || activeTab === 'riwayat') && (
            <UserAncHistoryView
              onStartScreening={() => setIsScreeningOpen(true)}
              onOpenConsultationModal={() => setIsConsultationOpen(true)}
              onGoToSicring={() => setActiveTab('latihan')}
            />
          )}

          {activeTab === 'edukasi' && (
            <UserMentalEducationView
              onStartScreening={() => setIsScreeningOpen(true)}
              onGoToSicring={() => setActiveTab('latihan')}
              onDetailModeChange={handleDetailModeChange}
              isDetailActive={isChildDetailActive}
              initialArticleId={selectedArticleId}
              onClearInitialArticle={() => setSelectedArticleId(null)}
            />
          )}

          {activeTab === 'profil' && (
            <UserProfileView
              onBackToHome={() => setActiveTab('beranda')}
              onSwitchToAdmin={onSwitchToAdmin}
              onDetailModeChange={handleDetailModeChange}
              isDetailActive={isChildDetailActive}
            />
          )}

          {activeTab === 'bantuan' && (
            <EmergencyHelpView onBack={() => setActiveTab('beranda')} />
          )}
        </main>

        {/* Mobile Fixed Bottom Navigation Bar - Hidden on full page detail views */}
        {!isFullDetailPage && (
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 z-40 flex items-center justify-around shadow-lg select-none">
            <button
              onClick={() => setActiveTab('beranda')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
                activeTab === 'beranda'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Home className="w-4.5 h-4.5" />
              <span className="text-[10px]">Beranda</span>
            </button>

            <button
              onClick={() => setActiveTab('latihan')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
                activeTab === 'latihan'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Heart className="w-4.5 h-4.5" />
              <span className="text-[10px]">SICRING</span>
            </button>

            <button
              onClick={() => setActiveTab('anc')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
                activeTab === 'anc' || activeTab === 'riwayat'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <HeartHandshake className="w-4.5 h-4.5" />
              <span className="text-[10px]">ANC</span>
            </button>

            <button
              onClick={() => setActiveTab('edukasi')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
                activeTab === 'edukasi'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span className="text-[10px]">Edukasi</span>
            </button>

            <button
              onClick={() => setActiveTab('profil')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
                activeTab === 'profil'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <UserIcon className="w-4.5 h-4.5" />
              <span className="text-[10px]">Profil</span>
            </button>
          </nav>
        )}
      </div>

      {/* Modals */}
      <EpdsScreeningModal
        isOpen={isScreeningOpen}
        onClose={() => setIsScreeningOpen(false)}
        onFinished={handleScreeningFinished}
      />

      <EpdsResultModal
        result={screeningResult}
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        onStartSicring={() => {
          setIsResultOpen(false);
          setActiveTab('latihan');
        }}
        onOpenEmergency={() => {
          setIsResultOpen(false);
          setActiveTab('bantuan');
        }}
      />

      <UserConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
};

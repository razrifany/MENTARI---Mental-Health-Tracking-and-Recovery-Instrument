import React, { useState } from 'react';
import {
  HeartHandshake,
  Calendar,
  Clock,
  MapPin,
  Bell,
  BellRing,
  Activity,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ChevronRight,
  Plus,
  X,
  Stethoscope,
  Info,
  ShieldCheck,
  Phone,
  Check,
  Copy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConsultationRequest, EPDSScreeningResult } from '../../types';

interface UserAncHistoryViewProps {
  onStartScreening: () => void;
  onOpenConsultationModal: () => void;
  onGoToSicring: () => void;
}

export const UserAncHistoryView: React.FC<UserAncHistoryViewProps> = ({
  onStartScreening,
  onOpenConsultationModal,
  onGoToSicring,
}) => {
  const { currentUser, tpmbList, screenings, sicringLogs, consultations } = useApp();

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFullAncHistoryOpen, setIsFullAncHistoryOpen] = useState(false);
  const [isCopiedToast, setIsCopiedToast] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'semua' | 'anc' | 'epds' | 'sicring'>('semua');

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];
  const isPregnant = currentUser?.perinatalStage === 'hamil';
  const gestationalWeeks = currentUser?.gestationalWeeks ?? 26;
  const postpartumDays = currentUser?.postpartumDays ?? 14;

  // Filtered User data
  const userScreenings = screenings.filter((s) => s.userId === currentUser?.id);
  const latestScreening = userScreenings[0];
  const userLogs = sicringLogs.filter((l) => l.userId === currentUser?.id);
  const userConsultations = consultations.filter((c) => c.userId === currentUser?.id);

  const completedSessions = userLogs.filter((l) => l.isCompleted).length;
  const totalMinutes = Math.round(
    userLogs.reduce((acc, curr) => acc + curr.durationSecondsPlayed, 0) / 60
  );

  // Active / Upcoming Scheduled Consultation (if any)
  const upcomingConsultation = userConsultations.find(
    (c) => c.status === 'disetujui' || c.status === 'menunggu'
  );

  // Fallback upcoming recommended visit based on trimester or postpartum
  const upcomingVisitInfo = upcomingConsultation
    ? {
        title:
          upcomingConsultation.preferredType === 'tatap_muka'
            ? 'Konsultasi & Pemeriksaan Tatap Muka di TPMB'
            : 'Konsultasi Telepon / Daring dengan Bidan',
        date: new Date(upcomingConsultation.requestedDate).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        time: upcomingConsultation.requestedTimeSlot,
        location:
          upcomingConsultation.preferredType === 'tatap_muka'
            ? currentTpmb.name
            : 'Panggilan Telepon Bidan',
        midwife: currentTpmb.midwifeName,
        status: upcomingConsultation.status === 'disetujui' ? 'Dikonfirmasi Bidan' : 'Menunggu Konfirmasi',
        statusColor:
          upcomingConsultation.status === 'disetujui'
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-amber-100 text-amber-800',
        notes: upcomingConsultation.notes,
        isCustom: true,
      }
    : isPregnant
    ? {
        title: `Pemeriksaan Rutin ANC Trimester ${gestationalWeeks <= 12 ? 'I' : gestationalWeeks <= 27 ? 'II' : 'III'} (Kunjungan Berikutnya)`,
        date: 'Jumat, 16 Oktober 2026',
        time: '09:00 - 10:30 WIB',
        location: currentTpmb.name,
        midwife: currentTpmb.midwifeName,
        status: 'Jadwal Terencana',
        statusColor: 'bg-sky-100 text-sky-800',
        notes: 'Pemeriksaan tensi, kenaikan BB, tinggi fundus, DJJ janin, & penyerahan vitamin tablet Fe.',
        isCustom: false,
      }
    : {
        title: `Kunjungan Nifas Berikutnya (${postpartumDays <= 3 ? 'KF 1: 6-48 Jam' : postpartumDays <= 7 ? 'KF 2: Hari ke 3-7' : postpartumDays <= 28 ? 'KF 3: Hari ke 8-28' : 'KF 4: Hari ke 29-42'})`,
        date: 'Kamis, 15 Oktober 2026',
        time: '10:00 - 11:00 WIB',
        location: currentTpmb.name,
        midwife: currentTpmb.midwifeName,
        status: 'Jadwal Terencana',
        statusColor: 'bg-emerald-100 text-emerald-800',
        notes: 'Pemeriksaan involusi uteri, evaluasi penyembuhan luka perineum, pemantauan laktasi ASI, dan konseling batin.',
        isCustom: false,
      };

  // Structured past visit records (ANC / PNC History)
  const pastAncVisits = isPregnant
    ? [
        {
          id: 'anc-visit-3',
          type: 'Pemeriksaan ANC Trimester II (K3)',
          date: '12 September 2026',
          gestationalInfo: 'Usia 22 Minggu',
          midwife: currentTpmb.midwifeName,
          location: currentTpmb.name,
          bloodPressure: '115/75 mmHg',
          weight: '57.4 kg (+2.2 kg)',
          lila: '26.0 cm (Normal)',
          tfu: '18 cm',
          djj: '142 bpm (Detak Janin Teratur)',
          labHb: '12.0 g/dL (Bagus)',
          therapy: 'Tablet Fe (Zat Besi) 30 butir, Kalsium 500mg',
          epdsScore: 'Skor EPDS: 4 (Emosi Stabil)',
          notes: 'Gerakan janin aktif, ibu dianjurkan rutin melakukan pernapasan diafragma 4-4-6 untuk mengatasi sulit tidur.',
          status: 'Selesai',
        },
        {
          id: 'anc-visit-2',
          type: 'Pemeriksaan ANC Trimester II (K2)',
          date: '15 Agustus 2026',
          gestationalInfo: 'Usia 18 Minggu',
          midwife: currentTpmb.midwifeName,
          location: currentTpmb.name,
          bloodPressure: '112/72 mmHg',
          weight: '56.1 kg (+0.9 kg)',
          lila: '25.8 cm (Normal)',
          tfu: '15 cm',
          djj: '138 bpm (Doppler)',
          labHb: '12.1 g/dL',
          therapy: 'Tablet Fe 30 butir, Asam Folat 400mcg',
          epdsScore: 'Skor EPDS: 5 (Stabil)',
          notes: 'Nafsu makan membaik, keluhan mual berkurang. Edukasi nutrisi gizi seimbang dan hidrasi cairan yang cukup.',
          status: 'Selesai',
        },
        {
          id: 'anc-visit-1',
          type: 'Pemeriksaan ANC Trimester I (K1 Kontak Pertama)',
          date: '08 Juli 2026',
          gestationalInfo: 'Usia 12 Minggu',
          midwife: currentTpmb.midwifeName,
          location: currentTpmb.name,
          bloodPressure: '110/70 mmHg',
          weight: '55.2 kg',
          lila: '25.5 cm (Normal)',
          tfu: '3 jari di atas simfisis',
          djj: 'DJJ terdeteksi jelas (Doppler)',
          labHb: '12.1 g/dL, Gol. Darah O+, Triple Eliminasi (HIV/Sifilis/Hepatitis B): Non-Reaktif',
          therapy: 'Vitamin B6, Asam Folat 400mcg, Buku KIA Digital diserahkan',
          epdsScore: 'Skor EPDS: 6 (Waspada Ringan)',
          notes: 'Ibu sempat mengeluh mual dan cemas menghadapi perubahan kehamilan. Diberikan suplemen Fe & panduan SICRING.',
          status: 'Selesai',
        },
      ]
    : [
        {
          id: 'pnc-visit-3',
          type: 'Kunjungan Nifas KF 3 (Hari ke-14)',
          date: '07 Oktober 2026',
          gestationalInfo: 'Hari ke-14 Pasca Salin',
          midwife: currentTpmb.midwifeName,
          location: currentTpmb.name,
          bloodPressure: '115/75 mmHg',
          weight: '57.2 kg',
          lila: '25.6 cm (Normal)',
          tfu: 'Tidak teraba di atas simfisis (Involusi normal)',
          djj: 'Lochea Alba (Kekuningan/Putih normal)',
          labHb: '12.2 g/dL (Pemulihan baik)',
          therapy: 'Kapsul Vitamin A dosis ke-2, Tablet Fe 30 butir',
          epdsScore: 'Skor EPDS: 5 (Membaik & Tenang)',
          notes: 'Luka perineum sembuh sempurna. ASI eksklusif lancar. Konseling metode kontrasepsi (KB pasca salin) dan apresiasi latihan SICRING.',
          status: 'Selesai',
        },
        {
          id: 'pnc-visit-2',
          type: 'Kunjungan Nifas KF 2 (Hari ke-6)',
          date: '29 September 2026',
          gestationalInfo: 'Hari ke-6 Pasca Salin',
          midwife: currentTpmb.midwifeName,
          location: currentTpmb.name,
          bloodPressure: '118/78 mmHg',
          weight: '58.0 kg',
          lila: '25.7 cm (Normal)',
          tfu: 'Pertengahan simfisis & pusat',
          djj: 'Lochea Serosa wajar',
          labHb: '11.8 g/dL',
          therapy: 'Tablet Fe, Parasetamol bila perlu, Kalsium',
          epdsScore: 'Skor EPDS: 11 (Waspada/Perlu Dukungan)',
          notes: 'Ibu merasa lelah dan sering menangis di malam hari. Bidan memberikan konseling 1-on-1 dan mengaktifkan pendampingan.',
          status: 'Selesai',
        },
        {
          id: 'pnc-visit-1',
          type: 'Kunjungan Nifas KF 1 (Hari ke-2 / 6-48 Jam)',
          date: '25 September 2026',
          gestationalInfo: 'Hari ke-2 Pasca Salin',
          midwife: currentTpmb.midwifeName,
          location: currentTpmb.name,
          bloodPressure: '120/80 mmHg',
          weight: '59.5 kg',
          lila: '25.8 cm (Normal)',
          tfu: '2 jari di bawah pusat',
          djj: 'Lochea Rubra merah segar',
          labHb: '11.5 g/dL',
          therapy: 'Kapsul Vitamin A dosis ke-1 (200.000 IU), Tablet Fe',
          epdsScore: 'Skor EPDS: 7 (Stabil)',
          notes: 'ASI mulai keluar, kontraksi rahim baik, luka jahitan bersih tanpa tanda infeksi.',
          status: 'Selesai',
        },
      ];

  const handleToggleNotification = () => {
    setIsNotificationEnabled((prev) => {
      const next = !prev;
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 3000);
      return next;
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Feedback */}
      {showNotificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <BellRing className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isNotificationEnabled
              ? 'Pengingat notifikasi jadwal kunjungan ANC & skrining telah DIAKTIFKAN.'
              : 'Pengingat notifikasi jadwal kunjungan dinonaktifkan.'}
          </span>
        </div>
      )}

      {/* 1. POSISI PALING ATAS: JADWAL KUNJUNGAN TERDEKAT (BISA DILIHAT DETAIL) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-300 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-sky-50/30 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md">
                  Jadwal Kunjungan Terdekat
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {isPregnant ? 'Pemeriksaan Rutin ANC' : 'Kunjungan Masa Nifas (PNC)'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight mt-0.5">
                {upcomingVisitInfo.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${upcomingVisitInfo.statusColor}`}>
              {upcomingVisitInfo.status}
            </span>
          </div>
        </div>

        {/* Visit Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4 text-xs text-slate-700">
          <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-100 flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Waktu Kunjungan</span>
              <span className="font-bold text-slate-900 block mt-0.5">{upcomingVisitInfo.date}</span>
              <span className="text-[11px] text-sky-700 font-medium">{upcomingVisitInfo.time}</span>
            </div>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-100 flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Tempat / Fasilitas</span>
              <span className="font-bold text-slate-900 block mt-0.5 truncate">{upcomingVisitInfo.location}</span>
              <span className="text-[11px] text-slate-500 truncate block">{currentTpmb.address}</span>
            </div>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-100 flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Bidan Pembina</span>
              <span className="font-bold text-slate-900 block mt-0.5 truncate">{upcomingVisitInfo.midwife}</span>
              <span className="text-[11px] text-slate-500">{currentTpmb.phone}</span>
            </div>
          </div>
        </div>

        {/* Note snippet */}
        <div className="mt-3.5 p-3.5 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs text-sky-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">
            <strong>Fokus Pemeriksaan:</strong> {upcomingVisitInfo.notes}
          </p>
        </div>

        {/* Footer Actions of Upcoming Visit */}
        <div className="mt-4 pt-3.5 border-t border-sky-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Harap membawa Buku KIA saat datang ke klinik TPMB.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs shadow-sky-200"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lihat Detail Kunjungan</span>
            </button>
            <button
              onClick={onOpenConsultationModal}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ubah / Buat Jadwal Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BAGIAN PENGATURAN NOTIFIKASI PENGINGAT (Tepat di bawah Jadwal Terdekat) */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-200/80 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              isNotificationEnabled
                ? 'bg-sky-600 text-white shadow-xs shadow-sky-200'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {isNotificationEnabled ? <BellRing className="w-5 h-5 animate-pulse" /> : <Bell className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm">
                Pengingat Notifikasi Jadwal & Skrining
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isNotificationEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isNotificationEnabled ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-lg">
              Kirimkan pengingat otomatis pada <strong>H-1</strong> dan <strong>2 jam sebelum kunjungan</strong> melalui notifikasi aplikasi serta WhatsApp ke {currentUser?.phone || 'nomor terdaftar'}.
            </p>
          </div>
        </div>

        {/* Notification Toggle Switch */}
        <button
          type="button"
          onClick={handleToggleNotification}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shrink-0 ${
            isNotificationEnabled
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
          }`}
        >
          <span>{isNotificationEnabled ? 'Notifikasi Aktif' : 'Aktifkan Pengingat'}</span>
          <div
            className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
              isNotificationEnabled ? 'bg-white text-emerald-600' : 'bg-transparent'
            }`}
          >
            {isNotificationEnabled && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
          </div>
        </button>
      </div>

      {/* 3. RINGKASAN STATUS IBU & METRIK TERPADU */}
      <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-full">
                {isPregnant ? 'Layanan ANC Terpadu' : 'Layanan PNC Terpadu'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Kode Responden: <strong>{currentUser?.responderCode || 'MNT-001'}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">
              {isPregnant ? 'Pemeriksaan ANC & Riwayat Terpadu' : 'Pemeriksaan Nifas (PNC) & Riwayat Terpadu'}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              Pantau jadwal pemeriksaan fisik berkala di TPMB, riwayat hasil konsultasi, serta grafik perkembangan kesehatan jiwa EPDS & latihan SICRING.
            </p>
          </div>

          <button
            onClick={onOpenConsultationModal}
            className="self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Konsultasi Baru</span>
          </button>
        </div>

        {/* Aggregated Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-sky-50/70 rounded-2xl p-3 border border-sky-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Fase Saat Ini</span>
            <div className="text-sm font-bold text-sky-950 mt-0.5">
              {isPregnant ? `${gestationalWeeks} Minggu` : `Hari ke-${postpartumDays}`}
            </div>
            <span className="text-[10px] text-sky-700">
              {isPregnant ? `HPL: ${currentUser?.hpl || '12 Jan 2027'}` : 'Masa Nifas Aktif'}
            </span>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Skrining EPDS</span>
            <div className="text-sm font-bold text-emerald-950 mt-0.5">
              {userScreenings.length} Kali Dilakukan
            </div>
            <span className="text-[10px] text-emerald-700">
              {latestScreening ? `Skor Terbaru: ${latestScreening.totalScore}/30` : 'Belum Ada'}
            </span>
          </div>

          <div className="bg-purple-50/70 rounded-2xl p-3 border border-purple-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Sesi SICRING</span>
            <div className="text-sm font-bold text-purple-950 mt-0.5">
              {completedSessions} Selesai
            </div>
            <span className="text-[10px] text-purple-700">Total {totalMinutes} menit relaksasi</span>
          </div>

          <div className="bg-blue-50/70 rounded-2xl p-3 border border-blue-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Kunjungan Terdata</span>
            <div className="text-sm font-bold text-blue-950 mt-0.5">
              {pastAncVisits.length + userConsultations.length} Kunjungan
            </div>
            <span className="text-[10px] text-blue-700">{currentTpmb.midwifeName.split(',')[0]}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs for History */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('semua')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeFilter === 'semua'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Riwayat
        </button>
        <button
          onClick={() => setActiveFilter('anc')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeFilter === 'anc'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Riwayat Pemeriksaan ANC/PNC ({pastAncVisits.length})
        </button>
        <button
          onClick={() => setActiveFilter('epds')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeFilter === 'epds'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Skrining EPDS ({userScreenings.length})
        </button>
        <button
          onClick={() => setActiveFilter('sicring')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeFilter === 'sicring'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Latihan SICRING ({userLogs.length})
        </button>
      </div>

      {/* 3. RIWAYAT KUNJUNGAN ANC / PNC & KONSULTASI BIDAN */}
      {(activeFilter === 'semua' || activeFilter === 'anc') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-sky-600" />
                <span>Riwayat Pemeriksaan Fisik & Kunjungan Bidan</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Buku KIA Digital TPMB &bull; Asuhan Perinatal Terpadu Kemenkes
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFullAncHistoryOpen(true)}
              className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-2xs hover:shadow-xs active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Lihat Riwayat Selengkapnya</span>
              <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
            </button>
          </div>

          <div className="space-y-3">
            {pastAncVisits.map((visit) => (
              <div
                key={visit.id}
                className="bg-slate-50/80 hover:bg-sky-50/40 rounded-2xl border border-slate-200 p-4 transition-colors space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-200/60 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{visit.type}</span>
                    <span className="text-[11px] text-sky-700 font-semibold ml-2">
                      ({visit.gestationalInfo})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{visit.date}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {visit.status}
                    </span>
                  </div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white rounded-xl p-2 border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">Tekanan Darah</span>
                    <span className="font-bold text-slate-800">{visit.bloodPressure}</span>
                  </div>
                  <div className="bg-white rounded-xl p-2 border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">Berat Badan</span>
                    <span className="font-bold text-slate-800">{visit.weight}</span>
                  </div>
                  <div className="bg-white rounded-xl p-2 border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">{isPregnant ? 'Tinggi Fundus' : 'Involusi'}</span>
                    <span className="font-bold text-slate-800">{visit.tfu}</span>
                  </div>
                  <div className="bg-white rounded-xl p-2 border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">{isPregnant ? 'DJJ Janin' : 'Lochea'}</span>
                    <span className="font-bold text-slate-800 truncate">{visit.djj}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-200/60 flex items-start gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Catatan Bidan:</strong> {visit.notes} ({visit.epdsScore})
                  </p>
                </div>
              </div>
            ))}

            {/* Custom Submitted Consultations from state */}
            {userConsultations.map((cons) => (
              <div
                key={cons.id}
                className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Pengajuan Konsultasi: {cons.preferredType === 'tatap_muka' ? 'Tatap Muka di TPMB' : 'Telepon Bidan'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {cons.requestedTimeSlot}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 capitalize">
                    {cons.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Tanggal: {new Date(cons.requestedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} &bull; Catatan: {cons.notes}
                </p>
                {cons.midwifeNotes && (
                  <div className="text-[11px] text-sky-900 bg-sky-50 p-2 rounded-xl border border-sky-100">
                    <strong>Respon Bidan:</strong> {cons.midwifeNotes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Button to View Complete History */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Menampilkan {pastAncVisits.length} kunjungan terdata & {userConsultations.length} pengajuan konsultasi.
            </span>
            <button
              type="button"
              onClick={() => setIsFullAncHistoryOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-sky-200 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Lihat Riwayat Selengkapnya (Buku KIA Lengkap)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. RIWAYAT SKRINING KESEHATAN MENTAL (EPDS) */}
      {(activeFilter === 'semua' || activeFilter === 'epds') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Riwayat Skrining Kesehatan Mental (EPDS)</span>
            </h3>
            <button
              onClick={onStartScreening}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
            >
              + Skrining EPDS Baru
            </button>
          </div>

          {userScreenings.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
              Belum ada riwayat skrining. Luangkan waktu 3 menit untuk evaluasi berkala!
            </div>
          ) : (
            <div className="space-y-2.5">
              {userScreenings.map((scr) => {
                const formattedDate = new Date(scr.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={scr.id}
                    className="bg-slate-50/70 hover:bg-sky-50/50 rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          scr.category === 'rendah'
                            ? 'bg-emerald-100 text-emerald-700'
                            : scr.category === 'waspada'
                            ? 'bg-sky-100 text-sky-700'
                            : scr.category === 'tinggi'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {scr.totalScore}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 capitalize">
                            Kondisi {scr.category.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.2 rounded-full">
                            Gelombang {scr.waveType}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{formattedDate}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        scr.category === 'rendah'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : scr.category === 'waspada'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : scr.category === 'tinggi'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {scr.category === 'rendah'
                        ? 'Emosi Stabil'
                        : scr.category === 'waspada'
                        ? 'Waspada Ringan'
                        : scr.category === 'tinggi'
                        ? 'Perlu Perhatian'
                        : 'Prioritas Red Flag'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. RIWAYAT AKTIVITAS LATIHAN SICRING */}
      {(activeFilter === 'semua' || activeFilter === 'sicring') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Riwayat Aktivitas Ketenangan SICRING</span>
            </h3>
            <button
              onClick={onGoToSicring}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
            >
              Mulai Sesi Baru
            </button>
          </div>

          {userLogs.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
              Belum ada sesi latihan tersimpan. Buka tab SICRING untuk memulai latihan!
            </div>
          ) : (
            <div className="space-y-2.5">
              {userLogs.map((log) => {
                const formattedDate = new Date(log.timestamp).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={log.id}
                    className="bg-slate-50/70 hover:bg-purple-50/40 rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {Math.round(log.durationSecondsPlayed / 60)}m
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{log.moduleTitle}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {formattedDate} &bull; Respon batin:{' '}
                          <strong className="text-purple-900">
                            {log.postMood === 'lebih_tenang'
                              ? 'Lebih Tenang 😊'
                              : log.postMood === 'lebih_berat'
                              ? 'Masih Cemas 😔'
                              : 'Sama Saja 😐'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {log.isCompleted ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                        Tuntas
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">
                        Sebagian
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL JADWAL KUNJUNGAN TERDEKAT */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 p-6 text-slate-800 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                  Rincian Kunjungan Klinis
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {upcomingVisitInfo.title}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs">
              {/* Timing & Place */}
              <div className="bg-sky-50/80 rounded-2xl p-3.5 border border-sky-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hari & Tanggal:</span>
                  <span className="font-bold text-slate-900">{upcomingVisitInfo.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estimasi Waktu:</span>
                  <span className="font-bold text-slate-900">{upcomingVisitInfo.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Lokasi TPMB:</span>
                  <span className="font-bold text-slate-900">{currentTpmb.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bidan Penanggung Jawab:</span>
                  <span className="font-bold text-sky-800">{currentTpmb.midwifeName}</span>
                </div>
              </div>

              {/* 10T Service Standards in ANC */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-sky-600" />
                  <span>Item Pemeriksaan Standar Kemenkes (10T)</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    &bull; Timbang BB & Ukur TB
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    &bull; Ukur Tekanan Darah
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    &bull; Nilai Status Gizi (LILA)
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    &bull; Ukur Tinggi Fundus Uteri
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    &bull; Presentasi Janin & DJJ
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    &bull; Skrining Mental EPDS & SICRING
                  </div>
                </div>
              </div>

              {/* Preparation Advice */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-950 space-y-1 text-[11px]">
                <strong className="block text-emerald-900">Persiapan Sebelum Datang ke TPMB:</strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Membawa Buku KIA (Kesehatan Ibu dan Anak).</li>
                  <li>Mencatat keluhan tidur, gerak janin, atau kekhawatiran yang dirasakan.</li>
                  <li>Makan ringan dan minum air putih yang cukup sebelum pemeriksaan.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  onOpenConsultationModal();
                }}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Ubah atau Jadwalkan Ulang
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full History Modal: Buku KIA Digital & Rekam Medis Kunjungan Fisik Lengkap */}
      {isFullAncHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                      Buku KIA Digital
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Rekam Medis TPMB Terpadu
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    Riwayat Lengkap Pemeriksaan Fisik & Kunjungan Bidan
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFullAncHistoryOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                title="Tutup dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with smooth scroll */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Copy Feedback Toast */}
              {isCopiedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ringkasan rekam medis berhasil disalin ke papan klip.</span>
                </div>
              )}

              {/* Patient Profile & Clinic Identity Banner */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">Nama Pasien</span>
                  <span className="font-bold text-slate-900">{currentUser?.name || 'Ibu Hamil/Nifas'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">Kode Responden</span>
                  <span className="font-bold text-sky-700">{currentUser?.responderCode || 'MNT-001'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">Fase & Usia</span>
                  <span className="font-bold text-slate-900">
                    {isPregnant ? `${gestationalWeeks} Minggu (HPL: ${currentUser?.hpl || '12 Jan 2027'})` : `Nifas Hari ke-${postpartumDays}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">Bidan & Klinik</span>
                  <span className="font-bold text-slate-900 truncate block">{currentTpmb.midwifeName.split(',')[0]}</span>
                </div>
              </div>

              {/* Clinical Metrics Summary Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-2xl">
                  <span className="text-[10px] font-semibold text-sky-800 uppercase block">Kunjungan Terdata</span>
                  <span className="text-lg font-black text-sky-950 mt-0.5">{pastAncVisits.length} Kali</span>
                  <span className="text-[10px] text-sky-600 block">Selesai terverifikasi</span>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                  <span className="text-[10px] font-semibold text-emerald-800 uppercase block">Tekanan Darah Terakhir</span>
                  <span className="text-lg font-black text-emerald-950 mt-0.5">{pastAncVisits[0]?.bloodPressure.split(' ')[0]}</span>
                  <span className="text-[10px] text-emerald-600 block">Normotensi stabil</span>
                </div>

                <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl">
                  <span className="text-[10px] font-semibold text-purple-800 uppercase block">Status Gizi (LiLA)</span>
                  <span className="text-lg font-black text-purple-950 mt-0.5">{pastAncVisits[0]?.lila.split(' ')[0]}</span>
                  <span className="text-[10px] text-purple-600 block">Bebas risiko KEK</span>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl">
                  <span className="text-[10px] font-semibold text-amber-800 uppercase block">Suplemen Fe Diberikan</span>
                  <span className="text-lg font-black text-amber-950 mt-0.5">90 Tablet</span>
                  <span className="text-[10px] text-amber-600 block">Kepatuhan baik</span>
                </div>
              </div>

              {/* Detailed Chronological History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-sky-600" />
                    <span>Daftar Lengkap Rekam Pemeriksaan Fisik (Standar 10T Kemenkes):</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Urutan Terkini ke Terdahulu
                  </span>
                </div>

                <div className="space-y-3">
                  {pastAncVisits.map((visit, idx) => (
                    <div
                      key={visit.id}
                      className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3 hover:border-sky-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                              {visit.type}
                            </h5>
                            <span className="text-[11px] text-sky-700 font-semibold">
                              {visit.gestationalInfo} &bull; {visit.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                            {visit.midwife.split(',')[0]}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            {visit.status}
                          </span>
                        </div>
                      </div>

                      {/* 10T Vitals & Measurements */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Tekanan Darah (TD)</span>
                          <span className="font-bold text-slate-800">{visit.bloodPressure}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Berat Badan (BB)</span>
                          <span className="font-bold text-slate-800">{visit.weight}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {isPregnant ? 'Tinggi Fundus (TFU)' : 'Involusi Uteri'}
                          </span>
                          <span className="font-bold text-slate-800">{visit.tfu}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {isPregnant ? 'Denyut Jantung Janin' : 'Karakteristik Lochea'}
                          </span>
                          <span className="font-bold text-slate-800 truncate block">{visit.djj}</span>
                        </div>
                      </div>

                      {/* Lab & Therapy details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100/80">
                          <strong className="text-blue-900 block mb-0.5">Pemeriksaan Lab & Gizi (LiLA):</strong>
                          <p className="text-blue-950">LiLA: {visit.lila} &bull; {visit.labHb}</p>
                        </div>
                        <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100/80">
                          <strong className="text-emerald-900 block mb-0.5">Pemberian Terapi & Suplemen:</strong>
                          <p className="text-emerald-950">{visit.therapy}</p>
                        </div>
                      </div>

                      {/* Midwife Clinical Note & Mental Health */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-sky-600" />
                            Catatan Bidan:
                          </span>
                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                            {visit.epdsScore}
                          </span>
                        </div>
                        <p className="leading-relaxed text-slate-600">{visit.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation Requests History */}
              {userConsultations.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-sky-600" />
                    <span>Riwayat Pengajuan Konsultasi & Respon Bidan:</span>
                  </h4>
                  <div className="space-y-2">
                    {userConsultations.map((cons) => (
                      <div
                        key={cons.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {cons.preferredType === 'tatap_muka' ? 'Tatap Muka di TPMB' : 'Telepon Bidan'} &bull; Slot: {cons.requestedTimeSlot}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 capitalize">
                            {cons.status}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          Tanggal: {new Date(cons.requestedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} &bull; Catatan: {cons.notes}
                        </p>
                        {cons.midwifeNotes && (
                          <div className="text-[11px] text-sky-900 bg-sky-50 p-2 rounded-lg border border-sky-100 mt-1">
                            <strong>Respon Bidan:</strong> {cons.midwifeNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const summaryText = `REKAM MEDIS BUKU KIA DIGITAL TPMB\nNama: ${currentUser?.name}\nKode: ${currentUser?.responderCode}\nFase: ${isPregnant ? `Hamil ${gestationalWeeks} Minggu` : `Nifas Hari ke-${postpartumDays}`}\nTPMB: ${currentTpmb.name}\nBidan: ${currentTpmb.midwifeName}\nTotal Kunjungan: ${pastAncVisits.length} kali\nTD Terakhir: ${pastAncVisits[0]?.bloodPressure}\nLiLA: ${pastAncVisits[0]?.lila}\nCatatan: Terverifikasi dalam sistem asuhan kebidanan perinatal.`;
                  navigator.clipboard?.writeText(summaryText);
                  setIsCopiedToast(true);
                  setTimeout(() => setIsCopiedToast(false), 3000);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Salin Ringkasan Rekam Medis</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsFullAncHistoryOpen(false);
                    onOpenConsultationModal();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Ajukan Konsultasi Baru
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullAncHistoryOpen(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

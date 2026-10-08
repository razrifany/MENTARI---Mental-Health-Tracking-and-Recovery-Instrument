import React, { useState } from 'react';
import {
  Calendar,
  CalendarCheck,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Heart,
  Baby,
  Activity,
  FileText,
  User,
  Phone,
  ArrowRight,
  ChevronRight,
  X,
  Save,
  Pill,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AncVisitRecord, User as UserType } from '../../types';

interface BidanAncViewProps {
  onOpenPatientDetail: (patient: UserType) => void;
}

export const BidanAncView: React.FC<BidanAncViewProps> = ({ onOpenPatientDetail }) => {
  const { currentUser, users, tpmbList, ancVisits, addAncVisit } = useApp();

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];

  // Sub-tabs: 'jadwal' (Jadwal Kunjungan Ulang) or 'riwayat' (Riwayat Kunjungan)
  const [activeSubTab, setActiveSubTab] = useState<'jadwal' | 'riwayat'>('jadwal');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<'semua' | 'hamil' | 'nifas'>('semua');
  const [filterScheduleStatus, setFilterScheduleStatus] = useState<string>('semua');

  // Input Modal state
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [selectedMotherId, setSelectedMotherId] = useState<string>('');
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Form fields
  const [visitType, setVisitType] = useState<string>('Pemeriksaan ANC K3 (Trimester II)');
  const [visitDate, setVisitDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(24);
  const [postpartumDays, setPostpartumDays] = useState<number>(7);
  const [bloodPressure, setBloodPressure] = useState<string>('115/75');
  const [weight, setWeight] = useState<string>('58.0');
  const [lila, setLila] = useState<string>('26.0');
  const [tfu, setTfu] = useState<string>('20');
  const [djj, setDjj] = useState<string>('140');
  const [labHb, setLabHb] = useState<string>('12.0');
  const [therapy, setTherapy] = useState<string>('Tablet Fe (Zat Besi) 30 butir, Kalsium 500mg');
  const [notes, setNotes] = useState<string>(
    'Kondisi ibu dan janin dalam batas normal. Diberikan bimbingan latihan pernapasan diafragma SICRING.'
  );
  const [nextScheduledDate, setNextScheduledDate] = useState<string>(() => {
    const next = new Date();
    next.setDate(next.getDate() + 28); // 4 weeks later
    return next.toISOString().split('T')[0];
  });

  // TPMB mothers list
  const tpmbMothers = users.filter((u) => u.role === 'ibu' && u.tpmbId === currentTpmb.id);

  // Filtered visits for this TPMB
  const tpmbVisits = ancVisits.filter((v) => v.tpmbId === currentTpmb.id);

  // Handle opening modal with pre-selected mother
  const handleOpenInputForMother = (motherId: string) => {
    setSelectedMotherId(motherId);
    const mother = tpmbMothers.find((m) => m.id === motherId);
    if (mother) {
      if (mother.perinatalStage === 'hamil') {
        setVisitType('Pemeriksaan ANC K3 (Trimester II)');
        setGestationalWeeks(mother.gestationalWeeks || 24);
      } else {
        setVisitType('Kunjungan Nifas KF 2 (Hari ke 3-7)');
        setPostpartumDays(mother.postpartumDays || 7);
      }
    }
    setIsInputModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmitVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMotherId) {
      alert('Pilih ibu pasien terlebih dahulu');
      return;
    }

    const mother = tpmbMothers.find((m) => m.id === selectedMotherId);
    if (!mother) return;

    addAncVisit({
      userId: mother.id,
      userName: mother.name,
      responderCode: mother.responderCode || 'MNT-XXX',
      tpmbId: currentTpmb.id,
      type: visitType,
      stage: mother.perinatalStage || 'hamil',
      date: visitDate,
      gestationalWeeks: mother.perinatalStage === 'hamil' ? Number(gestationalWeeks) : undefined,
      postpartumDays: mother.perinatalStage === 'nifas' ? Number(postpartumDays) : undefined,
      midwifeName: currentUser?.name || currentTpmb.midwifeName,
      bloodPressure: bloodPressure.includes('mmHg') ? bloodPressure : `${bloodPressure} mmHg`,
      weight: weight.includes('kg') ? weight : `${weight} kg`,
      lila: lila ? (lila.includes('cm') ? lila : `${lila} cm`) : undefined,
      tfu: tfu ? (tfu.includes('cm') ? tfu : `${tfu} cm`) : undefined,
      djj: djj ? (djj.includes('dpm') ? djj : `${djj} dpm`) : undefined,
      labHb: labHb ? (labHb.includes('g/dL') ? labHb : `${labHb} g/dL`) : undefined,
      therapy,
      notes,
      nextScheduledDate,
      isOnTime: true,
      status: 'selesai',
    });

    setIsInputModalOpen(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  // Upcoming Visits List (Derived from scheduled visits or nextScheduledDate)
  const scheduledVisits = tpmbVisits
    .filter((v) => v.nextScheduledDate)
    .map((v) => {
      const mother = users.find((u) => u.id === v.userId);
      const scheduleDate = new Date(v.nextScheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      scheduleDate.setHours(0, 0, 0, 0);

      const diffTime = scheduleDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let scheduleStatus: 'hari_ini' | 'minggu_ini' | 'akan_datang' | 'terlambat' = 'akan_datang';
      if (diffDays < 0) scheduleStatus = 'terlambat';
      else if (diffDays === 0) scheduleStatus = 'hari_ini';
      else if (diffDays <= 7) scheduleStatus = 'minggu_ini';

      return {
        ...v,
        mother,
        diffDays,
        scheduleStatus,
      };
    })
    .sort((a, b) => new Date(a.nextScheduledDate).getTime() - new Date(b.nextScheduledDate).getTime());

  // Filtered Scheduled Visits
  const filteredScheduledVisits = scheduledVisits.filter((item) => {
    const matchesSearch =
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.responderCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'semua' || item.stage === filterStage;
    const matchesStatus =
      filterScheduleStatus === 'semua' || item.scheduleStatus === filterScheduleStatus;
    return matchesSearch && matchesStage && matchesStatus;
  });

  // Filtered History Visits
  const filteredHistoryVisits = tpmbVisits.filter((v) => {
    const matchesSearch =
      v.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.responderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'semua' || v.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  // Counters for Quick Summary
  const countToday = scheduledVisits.filter((v) => v.scheduleStatus === 'hari_ini').length;
  const countThisWeek = scheduledVisits.filter((v) => v.scheduleStatus === 'minggu_ini').length;
  const countOverdue = scheduledVisits.filter((v) => v.scheduleStatus === 'terlambat').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-700 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-500/40 text-teal-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-300/30">
              Layanan Kebidanan TPMB
            </span>
            <span className="text-xs text-teal-200 font-semibold">{currentTpmb.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Pemeriksaan ANC &amp; Jadwal Kunjungan Ulang
          </h2>
          <p className="text-xs text-teal-100 mt-1 max-w-xl leading-relaxed">
            Kelola jadwal kunjungan ulang ibu hamil (K1-K6) dan nifas (KF1-KF4), serta input data
            hasil pemeriksaan fisik, tanda vital, dan terapi kebidanan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedMotherId(tpmbMothers[0]?.id || '');
            setIsInputModalOpen(true);
          }}
          className="bg-white hover:bg-teal-50 text-teal-900 font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md shrink-0 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 text-teal-700" />
          <span>+ Input Data Kunjungan Baru</span>
        </button>
      </div>

      {/* Save Success Toast */}
      {saveSuccessToast && (
        <div className="bg-emerald-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Data kunjungan dan jadwal kunjungan ulang berhasil disimpan ke rekam medis!</span>
        </div>
      )}

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('jadwal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeSubTab === 'jadwal'
              ? 'bg-teal-700 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Jadwal Kunjungan Ulang ({scheduledVisits.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('riwayat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeSubTab === 'riwayat'
              ? 'bg-teal-700 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Riwayat Kunjungan Pasien ({tpmbVisits.length})</span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: JADWAL KUNJUNGAN ULANG
      ======================================================== */}
      {activeSubTab === 'jadwal' && (
        <div className="space-y-4">
          {/* Quick Schedule Status Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              onClick={() => setFilterScheduleStatus('semua')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                filterScheduleStatus === 'semua'
                  ? 'border-teal-600 bg-teal-50 shadow-2xs font-bold'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Terjadwal</span>
              <span className="text-xl font-black text-slate-900">{scheduledVisits.length} Jadwal</span>
              <span className="text-[10px] text-teal-700 block mt-0.5">Semua ibu binaan</span>
            </div>

            <div
              onClick={() => setFilterScheduleStatus('hari_ini')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                filterScheduleStatus === 'hari_ini'
                  ? 'border-sky-600 bg-sky-50 shadow-2xs font-bold'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-bold text-sky-700 uppercase block">Jadwal Hari Ini</span>
              <span className="text-xl font-black text-sky-800">{countToday} Pasien</span>
              <span className="text-[10px] text-sky-600 block mt-0.5">Siap dilayani</span>
            </div>

            <div
              onClick={() => setFilterScheduleStatus('minggu_ini')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                filterScheduleStatus === 'minggu_ini'
                  ? 'border-purple-600 bg-purple-50 shadow-2xs font-bold'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-bold text-purple-700 uppercase block">Minggu Ini</span>
              <span className="text-xl font-black text-purple-900">{countThisWeek} Pasien</span>
              <span className="text-[10px] text-purple-600 block mt-0.5">Jadwal 7 hari ke depan</span>
            </div>

            <div
              onClick={() => setFilterScheduleStatus('terlambat')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                filterScheduleStatus === 'terlambat'
                  ? 'border-rose-600 bg-rose-50 shadow-2xs font-bold'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-bold text-rose-600 uppercase block">Perlu Diingatkan</span>
              <span className="text-xl font-black text-rose-700">{countOverdue} Pasien</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Lewat tanggal kontrol</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama ibu atau kode responden..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as any)}
              className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="semua">Semua Fase (Hamil &amp; Nifas)</option>
              <option value="hamil">Hanya Ibu Hamil (ANC)</option>
              <option value="nifas">Hanya Ibu Nifas (PNC)</option>
            </select>
          </div>

          {/* Scheduled Cards List */}
          <div className="space-y-3">
            {filteredScheduledVisits.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
                Tidak ada jadwal kunjungan ulang yang sesuai dengan filter pencarian.
              </div>
            ) : (
              filteredScheduledVisits.map((item) => {
                const mother = item.mother || users.find((u) => u.id === item.userId);
                const isOverdue = item.scheduleStatus === 'terlambat';
                const isToday = item.scheduleStatus === 'hari_ini';

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl border p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-teal-300 ${
                      isOverdue
                        ? 'border-rose-300 bg-rose-50/30'
                        : isToday
                        ? 'border-sky-300 bg-sky-50/30'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.userName}</span>
                        <span className="text-xs font-mono text-slate-400">({item.responderCode})</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            item.stage === 'hamil'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {item.stage === 'hamil'
                            ? `Hamil (${item.gestationalWeeks ?? 24} mg)`
                            : `Nifas (${item.postpartumDays ?? 7} hr)`}
                        </span>

                        {isOverdue && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Terlambat Kontrol</span>
                          </span>
                        )}
                        {isToday && (
                          <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                            Jadwal Hari Ini
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5 font-semibold text-teal-900">
                          <CalendarCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>
                            Jadwal Kontrol:{' '}
                            {new Date(item.nextScheduledDate).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </span>
                        <span>&bull;</span>
                        <span className="text-slate-500">
                          Pemeriksaan Terakhir: <strong>{item.type}</strong> ({item.date})
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <strong>Catatan Bidan:</strong> {item.notes}
                      </p>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenInputForMother(item.userId)}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Catat Kunjungan Baru</span>
                      </button>

                      {mother && (
                        <div className="flex gap-1.5">
                          <a
                            href={`tel:${mother.phone.replace(/[^0-9]/g, '')}`}
                            className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            title="Hubungi Ibu untuk Pengingat"
                          >
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>Hubungi</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => onOpenPatientDetail(mother)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors"
                          >
                            Rekam Medis
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: RIWAYAT KUNJUNGAN PASIEN
      ======================================================== */}
      {activeSubTab === 'riwayat' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Riwayat Pemeriksaan ANC &amp; Kunjungan Nifas
              </h3>
              <p className="text-xs text-slate-500">
                Log pemeriksaan fisik, tanda vital, terapi obat, dan evaluasi berkala ibu di {currentTpmb.name}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari ibu atau jenis kunjungan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs p-2 pl-3 rounded-xl border border-slate-200"
              />
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value as any)}
                className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="semua">Semua Fase</option>
                <option value="hamil">ANC Hamil</option>
                <option value="nifas">PNC Nifas</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Tanggal &amp; Pasien</th>
                  <th className="p-3.5">Jenis Kunjungan</th>
                  <th className="p-3.5">Pemeriksaan Fisik &amp; Vital</th>
                  <th className="p-3.5">Terapi &amp; Catatan Asuhan</th>
                  <th className="p-3.5">Jadwal Kontrol Berikutnya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistoryVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 align-top">
                      <div className="font-bold text-slate-900">{v.userName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {v.responderCode} &bull; {v.date}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Bidan: {v.midwifeName}
                      </span>
                    </td>

                    <td className="p-3.5 align-top">
                      <span className="font-semibold text-slate-800 block">{v.type}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize inline-block mt-1 ${
                          v.stage === 'hamil'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {v.stage === 'hamil' ? 'Kehamilan' : 'Nifas'}
                      </span>
                    </td>

                    <td className="p-3.5 align-top space-y-0.5 text-[11px] text-slate-700">
                      <div>TD: <strong>{v.bloodPressure}</strong></div>
                      <div>BB: <strong>{v.weight}</strong> {v.lila ? `• LiLA: ${v.lila}` : ''}</div>
                      {v.tfu && <div>TFU: <strong>{v.tfu}</strong></div>}
                      {v.djj && <div>DJJ: <strong>{v.djj}</strong></div>}
                      {v.labHb && <div>Hb: <strong>{v.labHb}</strong></div>}
                    </td>

                    <td className="p-3.5 align-top max-w-xs text-[11px]">
                      {v.therapy && (
                        <div className="text-teal-900 font-medium mb-1">
                          💊 {v.therapy}
                        </div>
                      )}
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                        {v.notes}
                      </p>
                    </td>

                    <td className="p-3.5 align-top text-xs font-semibold text-teal-800">
                      <div className="flex items-center gap-1.5">
                        <CalendarCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>{v.nextScheduledDate}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1 font-bold">
                        Tercatat
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: INPUT DATA KUNJUNGAN BARU
      ======================================================== */}
      {isInputModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Pencatatan Kunjungan ANC / PNC Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input hasil pemeriksaan antenatal atau nifas berkala di {currentTpmb.name}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInputModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitVisit} className="space-y-4">
              {/* Select Mother */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pilih Ibu Pasien Terdaftar:
                </label>
                <select
                  value={selectedMotherId}
                  onChange={(e) => {
                    setSelectedMotherId(e.target.value);
                    const m = tpmbMothers.find((mom) => mom.id === e.target.value);
                    if (m) {
                      if (m.perinatalStage === 'hamil') {
                        setVisitType('Pemeriksaan ANC K3 (Trimester II)');
                        setGestationalWeeks(m.gestationalWeeks || 24);
                      } else {
                        setVisitType('Kunjungan Nifas KF 2 (Hari ke 3-7)');
                        setPostpartumDays(m.postpartumDays || 7);
                      }
                    }
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
                  required
                >
                  <option value="">-- Pilih Ibu Pasien --</option>
                  {tpmbMothers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.responderCode}) - {m.perinatalStage === 'hamil' ? `Hamil ${m.gestationalWeeks ?? 24} mg` : `Nifas ${m.postpartumDays ?? 7} hr`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visit Type & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Jenis Pemeriksaan / Kunjungan:
                  </label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <optgroup label="Asuhan Kehamilan (ANC)">
                      <option value="Pemeriksaan ANC K1 (Trimester I)">ANC K1 (Kontak Pertama Trimester I)</option>
                      <option value="Pemeriksaan ANC K2 (Trimester II)">ANC K2 (Trimester II Awal)</option>
                      <option value="Pemeriksaan ANC K3 (Trimester II)">ANC K3 (Trimester II Lanjutan)</option>
                      <option value="Pemeriksaan ANC K4 (Trimester II Lanjutan)">ANC K4 (Trimester II Akhir)</option>
                      <option value="Pemeriksaan ANC K5 (Trimester III)">ANC K5 (Trimester III Awal)</option>
                      <option value="Pemeriksaan ANC K6 (Trimester III Akhir)">ANC K6 (Persiapan Persalinan Trimester III)</option>
                    </optgroup>
                    <optgroup label="Asuhan Nifas (PNC / KF)">
                      <option value="Kunjungan Nifas KF 1 (6-48 Jam)">KF 1 (6-48 Jam Pascasalin)</option>
                      <option value="Kunjungan Nifas KF 2 (Hari ke 3-7)">KF 2 (Hari ke 3-7 Pascasalin)</option>
                      <option value="Kunjungan Nifas KF 3 (Hari ke 8-28)">KF 3 (Hari ke 8-28 Pascasalin)</option>
                      <option value="Kunjungan Nifas KF 4 (Hari ke 29-42)">KF 4 (Hari ke 29-42 Pascasalin)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tanggal Pemeriksaan:
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              {/* Vital Signs Grid */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-600 uppercase block">
                  Pemeriksaan Fisik &amp; Tanda Vital:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Tensi Darah (mmHg)
                    </label>
                    <input
                      type="text"
                      placeholder="115/75"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Berat Badan (kg)
                    </label>
                    <input
                      type="text"
                      placeholder="58.0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      TFU (cm)
                    </label>
                    <input
                      type="text"
                      placeholder="20"
                      value={tfu}
                      onChange={(e) => setTfu(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      DJJ Janin (dpm)
                    </label>
                    <input
                      type="text"
                      placeholder="140"
                      value={djj}
                      onChange={(e) => setDjj(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Lingkar Lengan LiLA (cm)
                    </label>
                    <input
                      type="text"
                      placeholder="26.0"
                      value={lila}
                      onChange={(e) => setLila(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Kadar Hb (g/dL)
                    </label>
                    <input
                      type="text"
                      placeholder="12.0"
                      value={labHb}
                      onChange={(e) => setLabHb(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Therapy / Suplemen */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Terapi / Suplemen Diberikan:
                </label>
                <input
                  type="text"
                  value={therapy}
                  onChange={(e) => setTherapy(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                  placeholder="Contoh: Tablet Fe 30 butir, Kalsium 500mg, Vitamin C"
                />
              </div>

              {/* Notes / Asuhan Bidan */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catatan Asuhan &amp; Konseling Bidan:
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 leading-relaxed"
                  placeholder="Catatan kondisi fisik, respons emosional, edukasi intervensi psikospiritual SICRING..."
                />
              </div>

              {/* Next Scheduled Return Date */}
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200 space-y-1.5">
                <label className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-teal-700" />
                  <span>Tetapkan Jadwal Kunjungan Ulang Berikutnya:</span>
                </label>
                <p className="text-[11px] text-teal-800">
                  Tanggal ini akan langsung tercatat di jadwal kunjungan ulang TPMB dan kalender pengingat Ibu.
                </p>
                <input
                  type="date"
                  value={nextScheduledDate}
                  onChange={(e) => setNextScheduledDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-teal-300 bg-white font-bold text-teal-900"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInputModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Data Pemeriksaan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

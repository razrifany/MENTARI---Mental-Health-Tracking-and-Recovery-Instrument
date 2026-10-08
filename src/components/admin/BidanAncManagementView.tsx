import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CalendarCheck,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Stethoscope,
  Activity,
  Heart,
  ChevronRight,
  TrendingUp,
  User,
  X,
  Check,
  Eye,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AncVisitRecord, User as UserType } from '../../types';

interface BidanAncManagementViewProps {
  onOpenPatientDetail: (patient: UserType) => void;
}

export const BidanAncManagementView: React.FC<BidanAncManagementViewProps> = ({
  onOpenPatientDetail,
}) => {
  const {
    currentUser,
    users,
    tpmbList,
    ancVisits,
    addAncVisit,
    updateAncVisit,
    screenings,
  } = useApp();

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];

  // Patients in this TPMB
  const tpmbPatients = useMemo(
    () => users.filter((u) => u.role === 'ibu' && u.tpmbId === currentTpmb.id),
    [users, currentTpmb.id]
  );

  // ANC visits for this TPMB
  const tpmbVisits = useMemo(
    () => ancVisits.filter((v) => v.tpmbId === currentTpmb.id),
    [ancVisits, currentTpmb.id]
  );

  // Active view toggle: 'jadwal' vs 'riwayat'
  const [activeSubTab, setActiveSubTab] = useState<'jadwal' | 'riwayat'>('jadwal');

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'semua' | 'hamil' | 'nifas'>('semua');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'terjadwal' | 'selesai' | 'terlambat'>('semua');

  // Input Modal state
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [prefilledPatientId, setPrefilledPatientId] = useState<string>('');

  // Form state
  const [formUserId, setFormUserId] = useState('');
  const [formType, setFormType] = useState('Pemeriksaan ANC K2 (Trimester II)');
  const [formStage, setFormStage] = useState<'hamil' | 'nifas'>('hamil');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formGestationalWeeks, setFormGestationalWeeks] = useState<number>(24);
  const [formPostpartumDays, setFormPostpartumDays] = useState<number>(7);
  const [formBp, setFormBp] = useState('118/76 mmHg');
  const [formWeight, setFormWeight] = useState('56.5 kg');
  const [formLila, setFormLila] = useState('25.5 cm');
  const [formTfu, setFormTfu] = useState('22 cm');
  const [formDjj, setFormDjj] = useState('140 dpm');
  const [formLabHb, setFormLabHb] = useState('11.6 g/dL');
  const [formTherapy, setFormTherapy] = useState('Tablet Tambah Darah (Fe) 30 tablet, Kalsium 500mg');
  const [formNotes, setFormNotes] = useState('Kondisi fisik ibu dan denyut jantung janin baik dalam batas normal.');
  const [formNextScheduledDate, setFormNextScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return d.toISOString().split('T')[0];
  });
  const [formIsOnTime, setFormIsOnTime] = useState(true);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Selected visit for viewing full examination record
  const [viewingVisit, setViewingVisit] = useState<AncVisitRecord | null>(null);

  // Reschedule Modal
  const [reschedulingVisit, setReschedulingVisit] = useState<AncVisitRecord | null>(null);
  const [newScheduleDate, setNewScheduleDate] = useState('');

  // When patient is selected in the form, automatically prefill stage and gestational weeks / days
  const handlePatientSelectChange = (patientId: string) => {
    setFormUserId(patientId);
    const p = tpmbPatients.find((u) => u.id === patientId);
    if (p) {
      const stage = p.perinatalStage || 'hamil';
      setFormStage(stage);
      if (stage === 'hamil') {
        const weeks = p.gestationalWeeks || 24;
        setFormGestationalWeeks(weeks);
        setFormType(
          weeks <= 12
            ? 'Pemeriksaan ANC K1 (Trimester I)'
            : weeks <= 24
            ? 'Pemeriksaan ANC K2 (Trimester II)'
            : weeks <= 32
            ? 'Pemeriksaan ANC K4 (Trimester III)'
            : 'Pemeriksaan ANC K6 (Trimester III)'
        );
      } else {
        const days = p.postpartumDays || 7;
        setFormPostpartumDays(days);
        setFormType(
          days <= 2
            ? 'Kunjungan Nifas KF 1 (6-48 jam)'
            : days <= 7
            ? 'Kunjungan Nifas KF 2 (3-7 hari)'
            : days <= 28
            ? 'Kunjungan Nifas KF 3 (8-28 hari)'
            : 'Kunjungan Nifas KF 4 (29-42 hari)'
        );
      }
    }
  };

  const openInputModalWithPatient = (patient?: UserType) => {
    if (patient) {
      handlePatientSelectChange(patient.id);
    } else if (tpmbPatients.length > 0) {
      handlePatientSelectChange(tpmbPatients[0].id);
    }
    setIsInputModalOpen(true);
  };

  // Submit new visit
  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = tpmbPatients.find((u) => u.id === formUserId);
    if (!patient) return;

    addAncVisit({
      userId: patient.id,
      userName: patient.name,
      responderCode: patient.responderCode || 'MNT-000',
      tpmbId: currentTpmb.id,
      type: formType,
      stage: formStage,
      date: formDate,
      gestationalWeeks: formStage === 'hamil' ? Number(formGestationalWeeks) : undefined,
      postpartumDays: formStage === 'nifas' ? Number(formPostpartumDays) : undefined,
      midwifeName: currentUser?.name || currentTpmb.midwifeName,
      bloodPressure: formBp,
      weight: formWeight,
      lila: formStage === 'hamil' ? formLila : undefined,
      tfu: formTfu,
      djj: formStage === 'hamil' ? formDjj : undefined,
      labHb: formLabHb,
      therapy: formTherapy,
      notes: formNotes,
      nextScheduledDate: formNextScheduledDate,
      isOnTime: formIsOnTime,
      status: 'selesai',
    });

    setFormSuccessMessage(`Pemeriksaan ${formType} untuk ${patient.name} berhasil disimpan!`);
    setTimeout(() => {
      setFormSuccessMessage(null);
      setIsInputModalOpen(false);
    }, 1500);
  };

  // Schedule cards (upcoming, overdue, today)
  const scheduledVisits = useMemo(() => {
    return tpmbVisits.filter((v) => {
      const matchesSearch =
        v.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.responderCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage = stageFilter === 'semua' || v.stage === stageFilter;
      const matchesStatus = statusFilter === 'semua' || v.status === statusFilter;
      return matchesSearch && matchesStage && matchesStatus;
    });
  }, [tpmbVisits, searchQuery, stageFilter, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = tpmbVisits.length;
    const selesai = tpmbVisits.filter((v) => v.status === 'selesai').length;
    const terjadwal = tpmbVisits.filter((v) => v.status === 'terjadwal').length;
    const onTimeCount = tpmbVisits.filter((v) => v.isOnTime).length;
    const complianceRate = total > 0 ? Math.round((onTimeCount / total) * 100) : 94;

    return {
      total,
      selesai,
      terjadwal,
      complianceRate,
    };
  }, [tpmbVisits]);

  return (
    <div className="space-y-6">
      {/* ========================================================
          TOP HEADER & SUMMARY
      ======================================================== */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              🩺 Layanan Klinis TPMB
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {currentTpmb.name}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
            Jadwal Kunjungan Ulang &amp; Riwayat ANC / PNC
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola jadwal kontrol ulang antenatal dan pascasalin, pantau riwayat pemeriksaan fisik, dan catat asuhan baru.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => openInputModalWithPatient()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Data Kunjungan Baru</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          KPI CARDS
      ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Kunjungan
            </span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.total}
            </span>
            <span className="text-xs text-slate-500 ml-1">Pemeriksaan</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Tercatat di TPMB ini</p>
        </div>

        <div className="bg-white border border-sky-100 rounded-3xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
              Jadwal Kontrol
            </span>
            <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-sky-700">
              {stats.terjadwal}
            </span>
            <span className="text-xs text-sky-600 ml-1">Ibu Terjadwal</span>
          </div>
          <p className="text-[10px] text-sky-600/80 mt-2">Menunggu kunjungan ulang</p>
        </div>

        <div className="bg-white border border-emerald-100 rounded-3xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Selesai Diperiksa
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              {stats.selesai}
            </span>
            <span className="text-xs text-emerald-600 ml-1">Selesai</span>
          </div>
          <p className="text-[10px] text-emerald-600/80 mt-2">Data fisik lengkap</p>
        </div>

        <div className="bg-white border border-indigo-100 rounded-3xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              Kepatuhan Jadwal
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-700">
              {stats.complianceRate}%
            </span>
            <span className="text-xs text-indigo-600 ml-1">Tepat Waktu</span>
          </div>
          <p className="text-[10px] text-indigo-600/80 mt-2">Standar klinis TPMB</p>
        </div>
      </div>

      {/* ========================================================
          SUB-TAB NAVIGATION & CONTROLS
      ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          {/* Sub-tab pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('jadwal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'jadwal'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal Kunjungan Ulang ({stats.terjadwal})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('riwayat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'riwayat'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Riwayat Pemeriksaan Fisik ({stats.total})</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Total {tpmbPatients.length} Ibu Terdaftar di {currentTpmb.name}
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama ibu atau kode responden MNT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as any)}
            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="semua">Semua Fase (Hamil &amp; Nifas)</option>
            <option value="hamil">Hanya Ibu Hamil</option>
            <option value="nifas">Hanya Ibu Nifas</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="semua">Semua Status Kunjungan</option>
            <option value="terjadwal">Menunggu Kunjungan Ulang</option>
            <option value="selesai">Pemeriksaan Selesai</option>
            <option value="terlambat">Lewat Jadwal / Terlambat</option>
          </select>
        </div>

        {/* ========================================================
            VIEW 1: JADWAL KUNJUNGAN ULANG
        ======================================================== */}
        {activeSubTab === 'jadwal' && (
          <div className="space-y-4 pt-2">
            {scheduledVisits.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">Tidak ada jadwal kunjungan yang cocok.</p>
                <p className="mt-1">Gunakan tombol "+ Input Data Kunjungan Baru" untuk menambahkan rekam kunjungan baru.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {scheduledVisits.map((visit) => {
                  const patientObj = users.find((u) => u.id === visit.userId);
                  const latestScr = screenings.filter((s) => s.userId === visit.userId)[0];

                  return (
                    <div
                      key={visit.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Header card */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {visit.userName}
                              </span>
                              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                {visit.responderCode}
                              </span>
                            </div>
                            <span className="text-xs text-emerald-800 font-semibold block mt-0.5">
                              {visit.type}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize shrink-0 ${
                              visit.status === 'selesai'
                                ? 'bg-emerald-100 text-emerald-800'
                                : visit.status === 'terjadwal'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {visit.status}
                          </span>
                        </div>

                        {/* Schedule & Gestational Details */}
                        <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-xl text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              Jadwal Kunjungan Berikutnya
                            </span>
                            <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              {new Date(visit.nextScheduledDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              Fase / Usia Kehamilan
                            </span>
                            <span className="font-bold text-slate-800 mt-0.5 block capitalize">
                              {visit.stage === 'hamil'
                                ? `Hamil (${visit.gestationalWeeks ?? '-'} mg)`
                                : `Nifas (${visit.postpartumDays ?? '-'} hari)`}
                            </span>
                          </div>

                          <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">
                              Tekanan Darah: <strong>{visit.bloodPressure}</strong>
                            </span>
                            <span className="text-slate-500">
                              BB: <strong>{visit.weight}</strong>
                            </span>
                            {visit.djj && (
                              <span className="text-slate-500">
                                DJJ: <strong>{visit.djj}</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        {visit.notes && (
                          <p className="text-xs text-slate-600 line-clamp-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/60">
                            <strong>Catatan Bidan:</strong> {visit.notes}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                        {patientObj && (
                          <a
                            href={`tel:${patientObj.phone.replace(/[^0-9]/g, '')}`}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-xl text-xs flex items-center justify-center transition-colors"
                            title="Hubungi Ibu via Telepon"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => {
                            setReschedulingVisit(visit);
                            setNewScheduleDate(visit.nextScheduledDate);
                          }}
                          className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Atur Jadwal</span>
                        </button>

                        <button
                          onClick={() => setViewingVisit(visit)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2 px-3 rounded-xl text-xs flex-1 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail Rekam</span>
                        </button>

                        {patientObj && (
                          <button
                            onClick={() => onOpenPatientDetail(patientObj)}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1 transition-colors"
                            title="Buka Rekam Medis & Riwayat EPDS/SICRING Pasien"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>Pasien</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            VIEW 2: RIWAYAT PEMERIKSAAN FISIK LENGKAP
        ======================================================== */}
        {activeSubTab === 'riwayat' && (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-3.5">Tanggal &amp; Tipe Kunjungan</th>
                  <th className="p-3.5">Pasien &amp; Kode MNT</th>
                  <th className="p-3.5">Pemeriksaan Fisik</th>
                  <th className="p-3.5">TFU / DJJ / LiLA</th>
                  <th className="p-3.5">Terapi &amp; Catatan</th>
                  <th className="p-3.5">Jadwal Ulang</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scheduledVisits.map((visit) => {
                  const patientObj = users.find((u) => u.id === visit.userId);
                  return (
                    <tr key={visit.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">
                          {new Date(visit.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-semibold">
                          {visit.type}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{visit.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {visit.responderCode} &bull;{' '}
                          <span className="capitalize">
                            {visit.stage === 'hamil'
                              ? `Hamil (${visit.gestationalWeeks ?? '-'} mg)`
                              : `Nifas (${visit.postpartumDays ?? '-'} hr)`}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5 font-medium">
                        <div>TD: <strong>{visit.bloodPressure}</strong></div>
                        <div className="text-slate-500 text-[11px]">BB: {visit.weight}</div>
                        {visit.labHb && (
                          <div className="text-slate-500 text-[11px]">Hb: {visit.labHb}</div>
                        )}
                      </td>

                      <td className="p-3.5 font-medium">
                        {visit.tfu && <div>TFU: {visit.tfu}</div>}
                        {visit.djj && <div className="text-emerald-700 font-bold">DJJ: {visit.djj}</div>}
                        {visit.lila && <div className="text-slate-500 text-[11px]">LiLA: {visit.lila}</div>}
                      </td>

                      <td className="p-3.5 max-w-[200px]">
                        <div className="text-[11px] text-slate-700 truncate" title={visit.therapy}>
                          {visit.therapy || '-'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5" title={visit.notes}>
                          {visit.notes}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">
                          {new Date(visit.nextScheduledDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            visit.isOnTime
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {visit.isOnTime ? 'Tepat Waktu' : 'Terlambat'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => setViewingVisit(visit)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors"
                        >
                          Detail
                        </button>
                        {patientObj && (
                          <button
                            onClick={() => onOpenPatientDetail(patientObj)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors"
                          >
                            Pasien
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL: INPUT DATA KUNJUNGAN BARU
      ======================================================== */}
      {isInputModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Input Data Kunjungan ANC / PNC Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pencatatan pemeriksaan fisik dan penjadwalan ulang untuk {currentTpmb.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInputModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveVisit} className="p-6 overflow-y-auto space-y-4">
              {formSuccessMessage && (
                <div className="bg-emerald-100 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccessMessage}</span>
                </div>
              )}

              {/* Patient Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Ibu Terdaftar *
                </label>
                <select
                  value={formUserId}
                  onChange={(e) => handlePatientSelectChange(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-hidden focus:border-emerald-500"
                  required
                >
                  <option value="">-- Pilih Nama Pasien Ibu --</option>
                  {tpmbPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.responderCode || 'MNT'}) - {p.perinatalStage === 'hamil' ? `Hamil (${p.gestationalWeeks ?? 24} mg)` : `Nifas (${p.postpartumDays ?? 7} hr)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipe Kunjungan & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jenis Kunjungan *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Pemeriksaan ANC K1 (Trimester I)">Pemeriksaan ANC K1 (Trimester I)</option>
                    <option value="Pemeriksaan ANC K2 (Trimester II)">Pemeriksaan ANC K2 (Trimester II)</option>
                    <option value="Pemeriksaan ANC K3 (Trimester II)">Pemeriksaan ANC K3 (Trimester II)</option>
                    <option value="Pemeriksaan ANC K4 (Trimester III)">Pemeriksaan ANC K4 (Trimester III)</option>
                    <option value="Pemeriksaan ANC K5 (Trimester III)">Pemeriksaan ANC K5 (Trimester III)</option>
                    <option value="Pemeriksaan ANC K6 (Trimester III)">Pemeriksaan ANC K6 (Trimester III)</option>
                    <option value="Kunjungan Nifas KF 1 (6-48 jam)">Kunjungan Nifas KF 1 (6-48 jam)</option>
                    <option value="Kunjungan Nifas KF 2 (3-7 hari)">Kunjungan Nifas KF 2 (3-7 hari)</option>
                    <option value="Kunjungan Nifas KF 3 (8-28 hari)">Kunjungan Nifas KF 3 (8-28 hari)</option>
                    <option value="Kunjungan Nifas KF 4 (29-42 hari)">Kunjungan Nifas KF 4 (29-42 hari)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pemeriksaan *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Usia Kehamilan / Nifas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fase Perinatal
                  </label>
                  <select
                    value={formStage}
                    onChange={(e) => setFormStage(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="hamil">Ibu Hamil</option>
                    <option value="nifas">Ibu Nifas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {formStage === 'hamil' ? 'Usia Gestasi (Minggu)' : 'Hari Pascasalin (Hari)'}
                  </label>
                  <input
                    type="number"
                    value={formStage === 'hamil' ? formGestationalWeeks : formPostpartumDays}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (formStage === 'hamil') setFormGestationalWeeks(val);
                      else setFormPostpartumDays(val);
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Vital Signs / Pemeriksaan Fisik */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Hasil Pengukuran Fisik Ibu
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tekanan Darah
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 120/80 mmHg"
                      value={formBp}
                      onChange={(e) => setFormBp(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Berat Badan
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 58.5 kg"
                      value={formWeight}
                      onChange={(e) => setFormWeight(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kadar Hb
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 11.8 g/dL"
                      value={formLabHb}
                      onChange={(e) => setFormLabHb(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      TFU (Fundus Uteri)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 24 cm"
                      value={formTfu}
                      onChange={(e) => setFormTfu(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  {formStage === 'hamil' && (
                    <>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          DJJ (Detak Janin)
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: 142 dpm"
                          value={formDjj}
                          onChange={(e) => setFormDjj(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          LiLA (Lingkar Lengan)
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: 26.5 cm"
                          value={formLila}
                          onChange={(e) => setFormLila(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Terapi & Catatan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Terapi / Suplemen Diberikan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tablet Fe 30 tablet, Kalsium 500mg, Asam Folat"
                  value={formTherapy}
                  onChange={(e) => setFormTherapy(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Klinis Bidan &amp; Rekomendasi SICRING
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan kondisi emosional ibu, keluhan fisik, atau motivasi latihan SICRING..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Jadwal Kunjungan Ulang & Kepatuhan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jadwal Kunjungan Ulang Berikutnya *
                  </label>
                  <input
                    type="date"
                    value={formNextScheduledDate}
                    onChange={(e) => setFormNextScheduledDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formIsOnTime}
                      onChange={(e) => setFormIsOnTime(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-sm"
                    />
                    <span>Kunjungan Tepat Waktu (On-Time)</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInputModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!formUserId}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Rekam Kunjungan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: LIHAT DETAIL PEMERIKSAAN
      ======================================================== */}
      {viewingVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Rekam Medis Kunjungan
                </span>
                <h3 className="font-black text-slate-900 text-base">{viewingVisit.userName}</h3>
                <span className="text-xs text-slate-500 font-mono">
                  {viewingVisit.responderCode} &bull; {viewingVisit.type}
                </span>
              </div>
              <button
                onClick={() => setViewingVisit(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 block text-[10px]">Tanggal Pemeriksaan</span>
                <span className="font-bold text-slate-900">{viewingVisit.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Bidan Pemeriksa</span>
                <span className="font-bold text-slate-900">{viewingVisit.midwifeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tekanan Darah</span>
                <span className="font-bold text-slate-900">{viewingVisit.bloodPressure}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Berat Badan</span>
                <span className="font-bold text-slate-900">{viewingVisit.weight}</span>
              </div>
              {viewingVisit.tfu && (
                <div>
                  <span className="text-slate-400 block text-[10px]">TFU</span>
                  <span className="font-bold text-slate-900">{viewingVisit.tfu}</span>
                </div>
              )}
              {viewingVisit.djj && (
                <div>
                  <span className="text-slate-400 block text-[10px]">DJJ</span>
                  <span className="font-bold text-emerald-700">{viewingVisit.djj}</span>
                </div>
              )}
              {viewingVisit.lila && (
                <div>
                  <span className="text-slate-400 block text-[10px]">LiLA</span>
                  <span className="font-bold text-slate-900">{viewingVisit.lila}</span>
                </div>
              )}
              {viewingVisit.labHb && (
                <div>
                  <span className="text-slate-400 block text-[10px]">Kadar Hb</span>
                  <span className="font-bold text-slate-900">{viewingVisit.labHb}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 block">Terapi / Resep:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                  {viewingVisit.therapy || '-'}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">Catatan Klinis:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                  {viewingVisit.notes || '-'}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold block">
                    Jadwal Kontrol Berikutnya
                  </span>
                  <span className="font-black text-emerald-950 text-sm">
                    {viewingVisit.nextScheduledDate}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    viewingVisit.isOnTime
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {viewingVisit.isOnTime ? 'On-Time' : 'Terlambat'}
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewingVisit(null)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-xl text-xs"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: RESCHEDULE JADWAL KUNJUNGAN
      ======================================================== */}
      {reschedulingVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Atur Jadwal Kunjungan Ulang</h4>
                <p className="text-xs text-slate-500">{reschedulingVisit.userName}</p>
              </div>
              <button
                onClick={() => setReschedulingVisit(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Kontrol Baru
              </label>
              <input
                type="date"
                value={newScheduleDate}
                onChange={(e) => setNewScheduleDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500 font-semibold"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReschedulingVisit(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  updateAncVisit(reschedulingVisit.id, {
                    nextScheduledDate: newScheduleDate,
                    status: 'terjadwal',
                  });
                  setReschedulingVisit(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Simpan Jadwal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  User,
  FollowUpCase,
  EPDSScreeningResult,
  SicringSessionLog,
  CaseStatus,
} from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  AlertTriangle,
  Phone,
  Calendar,
  Clock,
  Activity,
  Heart,
  Shield,
  FileText,
  UserCheck,
  Send,
  ExternalLink,
} from 'lucide-react';

interface BidanPatientDetailModalProps {
  patient: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BidanPatientDetailModal: React.FC<BidanPatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
}) => {
  const { screenings, cases, sicringLogs, updateCaseStatus, addAuditLog } = useApp();

  const [newStatus, setNewStatus] = useState<CaseStatus>('dikonfirmasi');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [referralTarget, setReferralTarget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !patient) return null;

  const patientScreenings = screenings.filter((s) => s.userId === patient.id);
  const patientCases = cases.filter((c) => c.userId === patient.id);
  const activeCase = patientCases.find(
    (c) => c.status === 'baru' || c.status === 'dikonfirmasi' || c.status === 'ditangani' || c.status === 'dipantau'
  );

  const patientLogs = sicringLogs.filter((l) => l.userId === patient.id);
  const completedSessions = patientLogs.filter((l) => l.isCompleted).length;
  const totalMinutes = Math.round(
    patientLogs.reduce((acc, curr) => acc + curr.durationSecondsPlayed, 0) / 60
  );
  const compliancePercent = Math.min(100, Math.round((completedSessions / 8) * 100));

  const latestScreening = patientScreenings[0];

  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;
    setIsSubmitting(true);
    setTimeout(() => {
      updateCaseStatus(
        activeCase.id,
        newStatus,
        followUpNotes.trim() || 'Tindak lanjut tercatat oleh Bidan.',
        newStatus === 'dirujuk' ? referralTarget : undefined
      );
      setIsSubmitting(false);
      setFollowUpNotes('');
      setReferralTarget('');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-sky-50 border-b border-sky-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{patient.name}</h3>
                <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {patient.responderCode || 'MNT-001'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                No. HP: <strong>{patient.phone}</strong> &bull; Fase:{' '}
                <strong className="capitalize">
                  {patient.perinatalStage === 'hamil'
                    ? `Hamil (${patient.gestationalWeeks ?? 24} mg)`
                    : `Nifas (${patient.postpartumDays ?? 14} hari)`}
                </strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Case Warning if Red Flag / High */}
          {activeCase && (
            <div
              className={`rounded-2xl p-4 border ${
                activeCase.category === 'red_flag'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                      activeCase.category === 'red_flag' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wide">
                      Kasus Terbuka: {activeCase.category === 'red_flag' ? 'RED FLAG (Item 10 > 0)' : 'EPDS Tinggi (≥13)'}
                    </span>
                    <p className="text-xs mt-0.5">
                      Tenggat SLA:{' '}
                      <strong>
                        {new Date(activeCase.deadlineAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        WIB
                      </strong>{' '}
                      &bull; Status:{' '}
                      <span className="uppercase font-bold underline">{activeCase.status}</span>
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${patient.phone.replace(/[^0-9]/g, '')}`}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  Telepon Ibu
                </a>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* EPDS Score */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Skor EPDS Terakhir
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">
                  {latestScreening?.totalScore ?? '-'}
                </span>
                <span className="text-xs font-semibold text-slate-400">/ 30</span>
              </div>
              <span
                className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  latestScreening?.category === 'red_flag'
                    ? 'bg-rose-100 text-rose-800'
                    : latestScreening?.category === 'tinggi'
                    ? 'bg-amber-100 text-amber-800'
                    : latestScreening?.category === 'waspada'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                Kategori {latestScreening?.category.replace('_', ' ') || 'Belum Ada'}
              </span>
            </div>

            {/* Item 10 Self-Harm status */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Item 10 (Pikiran Menyakiti Diri)
              </span>
              <div className="text-2xl font-black mt-1">
                {latestScreening?.item10Score !== undefined ? (
                  latestScreening.item10Score > 0 ? (
                    <span className="text-rose-600">{latestScreening.item10Score} (POSITIF)</span>
                  ) : (
                    <span className="text-emerald-600">0 (Negatif)</span>
                  )
                ) : (
                  '-'
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block">
                {latestScreening?.item10Score && latestScreening.item10Score > 0
                  ? 'Wajib konfirmasi segera'
                  : 'Aman'}
              </span>
            </div>

            {/* SICRING Engagement (X3) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Keterlibatan SICRING (X₃)
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-sky-700">{compliancePercent}%</span>
                <span className="text-xs text-slate-400">Kepatuhan</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block">
                {completedSessions} sesi tuntas &bull; {totalMinutes} menit aktif
              </span>
            </div>
          </div>

          {/* Screening History Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              Riwayat Skrining EPDS Pasien
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {patientScreenings.length === 0 ? (
                <div className="p-4 text-xs text-slate-400 text-center">Belum ada riwayat skrining.</div>
              ) : (
                patientScreenings.map((scr) => (
                  <div key={scr.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                        {scr.totalScore}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          Skor {scr.totalScore} &bull; Kategori {scr.category.toUpperCase()}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(scr.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          &bull; Gelombang {scr.waveType}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      Item 10: {scr.item10Score}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Follow-up Action Form (if active case exists) */}
          {activeCase && (
            <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-sky-950 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                Catat Tindak Lanjut Klinis Bidan
              </h4>

              <form onSubmit={handleSaveFollowUp} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Ubah Status Kasus:
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as CaseStatus)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="dikonfirmasi">Dikonfirmasi (Sudah Dihubungi)</option>
                      <option value="ditangani">Ditangani (Telah Dilakukan Konseling/Home Visit)</option>
                      <option value="dirujuk">Dirujuk (Rujukan Medis Lanjutan)</option>
                      <option value="dipantau">Dipantau (Pengawasan Berkala)</option>
                      <option value="ditutup">Ditutup (Kasus Selesai / Skor Membaik)</option>
                    </select>
                  </div>

                  {newStatus === 'dirujuk' && (
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Tujuan Rujukan:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Puskesmas Sleman / Psikolog RSUD"
                        value={referralTarget}
                        onChange={(e) => setReferralTarget(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Catatan Klinis & Evaluasi:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan temuan wawancara klinis, keluhan utama ibu, keterlibatan suami/keluarga, dan rencana intervensi..."
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Tindak Lanjut'}</span>
                  </button>
                </div>
              </form>

              {/* Case Action History Timeline */}
              {activeCase.history.length > 0 && (
                <div className="pt-3 border-t border-sky-200">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2 uppercase">
                    Timeline Riwayat Tindakan Kasus:
                  </span>
                  <div className="space-y-2">
                    {activeCase.history.map((h) => (
                      <div key={h.id} className="text-xs bg-white rounded-xl p-3 border border-slate-200">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-bold text-sky-800">{h.actorName}</span>
                          <span>
                            {new Date(h.timestamp).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            WIB
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 block">{h.action}</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{h.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-5 py-2 rounded-xl text-xs transition-colors"
          >
            Tutup Rekam Medis
          </button>
        </div>
      </div>
    </div>
  );
};

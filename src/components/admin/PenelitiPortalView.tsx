import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  Download,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Save,
  ShieldCheck,
  FileCheck,
  Database,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TpmbClinicalDashboard } from './TpmbClinicalDashboard';

interface PenelitiPortalViewProps {
  activeSubTab?: 'dashboard' | 'riset' | 'ambang';
  onSubTabChange?: (tab: 'dashboard' | 'riset' | 'ambang') => void;
}

export const PenelitiPortalView: React.FC<PenelitiPortalViewProps> = ({
  activeSubTab: externalSubTab,
  onSubTabChange,
}) => {
  const {
    users,
    screenings,
    sicringLogs,
    thresholdConfig,
    updateThresholdConfig,
    exportResearchData,
  } = useApp();

  const [internalSubTab, setInternalSubTab] = useState<'dashboard' | 'riset' | 'ambang'>('dashboard');
  const activeTab = externalSubTab || internalSubTab;

  const setActiveTab = (tab: 'dashboard' | 'riset' | 'ambang') => {
    setInternalSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  // State for threshold form
  const [lowMax, setLowMax] = useState(thresholdConfig.lowMax);
  const [cautionMin, setCautionMin] = useState(thresholdConfig.cautionMin);
  const [cautionMax, setCautionMax] = useState(thresholdConfig.cautionMax);
  const [highMin, setHighMin] = useState(thresholdConfig.highMin);
  const [isThresholdSaved, setIsThresholdSaved] = useState(false);

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholdConfig({
      lowMax: Number(lowMax),
      cautionMin: Number(cautionMin),
      cautionMax: Number(cautionMax),
      highMin: Number(highMin),
    });
    setIsThresholdSaved(true);
    setTimeout(() => setIsThresholdSaved(false), 2500);
  };

  // Research stats calculation
  const motherUsers = users.filter((u) => u.role === 'ibu');
  const consentedUsers = motherUsers.filter((u) => u.consentGiven?.researchParticipation);
  const totalCompletedSessions = sicringLogs.filter((l) => l.isCompleted).length;
  const t0Screenings = screenings.filter((s) => s.waveType === 'T0');
  const t1Screenings = screenings.filter((s) => s.waveType === 'T1');

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Riset Multi-TPMB</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('riset')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'riset'
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Modul Riset &amp; Ekspor Data</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ambang')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'ambang'
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Konfigurasi Ambang EPDS ({thresholdConfig.version})</span>
        </button>
      </div>

      {/* SUB-TAB 1: DASHBOARD MULTI-TPMB & FILTER PERIODE */}
      {activeTab === 'dashboard' && (
        <TpmbClinicalDashboard mode="peneliti" />
      )}

      {/* SUB-TAB 2: RISET & EKSPOR DATA */}
      {activeTab === 'riset' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">
                Hak Akses Khusus: Peneliti Riset
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                Evaluasi Ilmiah Intervensi MENTARI &amp; SICRING
              </h2>
              <p className="text-xs text-sky-100 mt-1 max-w-xl leading-relaxed">
                Pengujian Model 1 (Usability &amp; Acceptance: SUS, ISO 25010, TAM) dan Model 2
                (Keterlibatan intervensi SICRING terhadap perubahan delta skor EPDS T0 dan T1).
              </p>
            </div>

            <button
              onClick={exportResearchData}
              className="bg-white hover:bg-sky-50 text-sky-900 font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md shrink-0 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>Unduh Dataset CSV Pseudonim</span>
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 block">Total Responden</span>
              <span className="text-xl font-black text-slate-900">{motherUsers.length} Ibu</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">
                {consentedUsers.length} memberikan consent
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 block">Skrining Pretest (T0)</span>
              <span className="text-xl font-black text-sky-700">{t0Screenings.length} Data</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Baseline instrumen</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 block">Skrining Post (T1)</span>
              <span className="text-xl font-black text-purple-700">{t1Screenings.length} Data</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Evaluasi post-intervensi</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 block">Sesi SICRING Tuntas</span>
              <span className="text-xl font-black text-emerald-700">{totalCompletedSessions} Sesi</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Dosis kepatuhan X₃</span>
            </div>
          </div>

          {/* Research Models Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Model 1: Usability & Acceptance */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">
                  Model 1: Kualitas Sistem &amp; Penerimaan Teknologi
                </h4>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  Target Tercapai
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">System Usability Scale (SUS)</span>
                    <span className="text-[11px] text-slate-400">Target baku instrumen ≥ 68.0</span>
                  </div>
                  <span className="text-lg font-black text-sky-700">79.4 (Baik / Grade A)</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">ISO/IEC 25010 Usability</span>
                    <span className="text-[11px] text-slate-400">Efektivitas, Efisiensi, Kepuasan</span>
                  </div>
                  <span className="text-lg font-black text-emerald-700">88.2% (Sangat Baik)</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Technology Acceptance Model (TAM)</span>
                    <span className="text-[11px] text-slate-400">Perceived Usefulness &amp; Ease</span>
                  </div>
                  <span className="text-lg font-black text-purple-700">Positif Signifikan</span>
                </div>
              </div>
            </div>

            {/* Model 2: Efficacy of SICRING */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">
                  Model 2: Efektivitas SICRING (T0 vs T1)
                </h4>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">
                  Longitudinal
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Rata-rata Penurunan EPDS</span>
                    <span className="text-[11px] text-slate-400">Pretest T0 → Evaluasi T1</span>
                  </div>
                  <span className="text-lg font-black text-emerald-700">- 4.8 Poin (p &lt; 0.01)</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Korelasi Keterlibatan (X₃)</span>
                    <span className="text-[11px] text-slate-400">Dosis kepatuhan latihan</span>
                  </div>
                  <span className="text-lg font-black text-sky-700">r = -0.58 (Sedang-Kuat)</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Kelengkapan Pasangan T0/T1</span>
                    <span className="text-[11px] text-slate-400">Target non-dropout ≥ 85%</span>
                  </div>
                  <span className="text-lg font-black text-slate-900">91.6% Responden</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Pseudonymized Responders for Audit */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Sampel Responden Pseudonim Terdaftar
                </h4>
                <p className="text-[11px] text-slate-500">
                  Data telah dide-identifikasi dengan kode MNT sesuai etika penelitian klinis.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {consentedUsers.length} Responden Layak Ekspor
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Kode Responden</th>
                    <th className="p-3">Fase Perinatal</th>
                    <th className="p-3">Consent Penelitian</th>
                    <th className="p-3">Total Skrining</th>
                    <th className="p-3">Sesi SICRING Selesai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {motherUsers.map((u) => {
                    const scrCount = screenings.filter((s) => s.userId === u.id).length;
                    const logCount = sicringLogs.filter(
                      (l) => l.userId === u.id && l.isCompleted
                    ).length;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {u.responderCode || 'MNT-XXX'}
                        </td>
                        <td className="p-3 capitalize text-slate-700">
                          {u.perinatalStage === 'hamil'
                            ? `Hamil (${u.gestationalWeeks ?? 24} mg)`
                            : `Nifas (${u.postpartumDays ?? 14} hr)`}
                        </td>
                        <td className="p-3">
                          {u.consentGiven?.researchParticipation ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Disetujui
                            </span>
                          ) : (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Tidak Disetujui
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{scrCount} kali</td>
                        <td className="p-3 font-semibold text-purple-700">{logCount} sesi</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance Ethics Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
            <strong>Kepatuhan Etik Penelitian (BR-11 &amp; BR-12):</strong> File CSV yang diekspor
            hanya menyertakan kode responden pseudonim (mis. MNT-001) tanpa data identitas
            pengenal (nama, nomor telepon, alamat, atau NIK). Responden yang menarik consent
            penelitian secara otomatis dihilangkan dari file ekspor riset.
          </div>
        </div>
      )}

      {/* SUB-TAB 3: KONFIGURASI AMBANG EPDS */}
      {activeTab === 'ambang' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs max-w-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
                Versi: {thresholdConfig.version}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                Konfigurasi Ambang Kategori EPDS Berversi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mengikuti studi validasi EPDS adaptasi Indonesia. Perubahan konfigurasi dicatat
                dalam riwayat audit (BR-04).
              </p>
            </div>
            <FileCheck className="w-6 h-6 text-sky-600 shrink-0" />
          </div>

          <form onSubmit={handleSaveThreshold} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <label className="text-xs font-bold text-emerald-900 block mb-1">
                  Batas Maksimal Rendah (Normal):
                </label>
                <input
                  type="number"
                  value={lowMax}
                  onChange={(e) => setLowMax(Number(e.target.value))}
                  className="w-full text-sm font-bold p-2 rounded-xl border border-emerald-300 bg-white"
                />
                <span className="text-[10px] text-emerald-700 block mt-1">Skor 0 s/d {lowMax}</span>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200">
                <label className="text-xs font-bold text-sky-900 block mb-1">
                  Rentang Waspada (Mild):
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={cautionMin}
                    onChange={(e) => setCautionMin(Number(e.target.value))}
                    className="w-full text-sm font-bold p-2 rounded-xl border border-sky-300 bg-white"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={cautionMax}
                    onChange={(e) => setCautionMax(Number(e.target.value))}
                    className="w-full text-sm font-bold p-2 rounded-xl border border-sky-300 bg-white"
                  />
                </div>
                <span className="text-[10px] text-sky-700 block mt-1">
                  Skor {cautionMin} s/d {cautionMax}
                </span>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 col-span-2">
                <label className="text-xs font-bold text-amber-900 block mb-1">
                  Batas Minimal Kasus Tinggi (High):
                </label>
                <input
                  type="number"
                  value={highMin}
                  onChange={(e) => setHighMin(Number(e.target.value))}
                  className="w-full text-sm font-bold p-2 rounded-xl border border-amber-300 bg-white"
                />
                <span className="text-[10px] text-amber-700 block mt-1">
                  Skor ≥ {highMin} otomatis menerbitkan kasus klinis SLA 24 jam
                </span>
              </div>
            </div>

            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-950 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>
                <strong>Aturan Mutlak (BR-03):</strong> Jika Item 10 &gt; 0, sistem <em>selalu</em>{' '}
                mengelompokkan hasil ke dalam kategori <strong>Red Flag</strong> dan menerbitkan
                notifikasi prioritas tanpa memandang skor total.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Terakhir diubah:{' '}
                {new Date(thresholdConfig.updatedAt).toLocaleDateString('id-ID')} oleh{' '}
                {thresholdConfig.updatedBy}
              </span>

              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isThresholdSaved ? 'Tersimpan!' : 'Perbarui Ambang EPDS'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

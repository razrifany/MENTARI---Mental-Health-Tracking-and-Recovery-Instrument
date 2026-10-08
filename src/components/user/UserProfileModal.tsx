import React, { useState } from 'react';
import { User, Shield, Check, LogOut, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const { currentUser, updateConsent, tpmbList } = useApp();

  const [appUsage, setAppUsage] = useState(
    currentUser?.consentGiven?.appUsage ?? true
  );
  const [research, setResearch] = useState(
    currentUser?.consentGiven?.researchParticipation ?? true
  );
  const [midwifeShare, setMidwifeShare] = useState(
    currentUser?.consentGiven?.dataShareMidwife ?? true
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !currentUser) return null;

  const currentTpmb = tpmbList.find((t) => t.id === currentUser.tpmbId) || tpmbList[0];

  const handleSaveConsent = () => {
    updateConsent(currentUser.id, appUsage, research, midwifeShare);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-sky-50 border-b border-sky-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{currentUser.name}</h3>
              <span className="text-xs text-sky-700 font-medium">
                Kode Responden: <strong>{currentUser.responderCode || 'MNT-001'}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Perinatal Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Informasi Perinatal
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Fase:</span>
                <span className="font-bold text-slate-800 capitalize">
                  {currentUser.perinatalStage === 'hamil' ? 'Ibu Hamil' : 'Ibu Nifas'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">
                  {currentUser.perinatalStage === 'hamil' ? 'Usia Kandungan:' : 'Masa Nifas:'}
                </span>
                <span className="font-bold text-slate-800">
                  {currentUser.perinatalStage === 'hamil'
                    ? `${currentUser.gestationalWeeks ?? 26} Minggu`
                    : `Hari ke-${currentUser.postpartumDays ?? 14}`}
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200">
                <span className="text-slate-400 block">Faskes / TPMB Binaan:</span>
                <span className="font-semibold text-sky-900">{currentTpmb.name}</span>
                <span className="text-slate-500 block text-[11px]">Bidan: {currentTpmb.midwifeName}</span>
              </div>
            </div>
          </div>

          {/* 3-Tier Consent Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <Shield className="w-4 h-4 text-sky-600" />
                Persetujuan & Privasi (Consent)
              </span>
              <span className="text-[10px] text-slate-400">Versi 1.0.0</span>
            </div>

            <div className="space-y-2.5">
              {/* Tier 1 */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appUsage}
                  onChange={(e) => setAppUsage(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-sky-600 rounded-xs border-slate-300 focus:ring-sky-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">1. Penggunaan Aplikasi MENTARI</span>
                  <span className="text-slate-500 text-[11px] leading-tight block mt-0.5">
                    Saya menyetujui pemanfaatan instrumen skrining mandiri & modul latihan SICRING.
                  </span>
                </div>
              </label>

              {/* Tier 2 */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={research}
                  onChange={(e) => setResearch(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-sky-600 rounded-xs border-slate-300 focus:ring-sky-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">2. Partisipasi Penelitian Ilmiah</span>
                  <span className="text-slate-500 text-[11px] leading-tight block mt-0.5">
                    Data jawaban diolah secara pseudonim (tanpa identitas/nama/NIK) untuk pengembangan ilmu kebidanan.
                  </span>
                </div>
              </label>

              {/* Tier 3 */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={midwifeShare}
                  onChange={(e) => setMidwifeShare(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-sky-600 rounded-xs border-slate-300 focus:ring-sky-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">3. Berbagi Data dengan Bidan TPMB</span>
                  <span className="text-slate-500 text-[11px] leading-tight block mt-0.5">
                    Mengizinkan Bidan penanggung jawab melihat skor & menghubungi jika terdapat hasil red flag.
                  </span>
                </div>
              </label>
            </div>

            <button
              onClick={handleSaveConsent}
              className="w-full bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Persetujuan Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Perubahan Persetujuan</span>
              )}
            </button>
          </div>

          {/* Emergency Contact */}
          {currentUser.emergencyContact && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[11px]">Kontak Darurat Tersimpan:</span>
              <span className="font-bold text-slate-900">{currentUser.emergencyContact.name}</span>
              <span className="text-slate-600 block">{currentUser.emergencyContact.phone}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar Akun
          </button>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

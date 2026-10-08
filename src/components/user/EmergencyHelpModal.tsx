import React from 'react';
import { Phone, AlertTriangle, ShieldCheck, Heart, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, tpmbList } = useApp();

  if (!isOpen) return null;

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-rose-900 text-lg leading-tight">Bantuan Darurat Psikologis</h3>
              <p className="text-xs text-rose-700 mt-0.5">Ibu tidak sendirian. Kami siap mendengarkan.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 rounded-lg p-1 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Calming message */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5 text-xs text-sky-900 leading-relaxed flex gap-2.5">
            <Heart className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p>
              Tarik napas perlahan, Bu. Perasaan berat ini adalah sinyal bahwa tubuh dan pikiran Ibu butuh jeda dan pelukan pertolongan. Segera hubungi saluran bantuan di bawah ini.
            </p>
          </div>

          {/* Primary Action: Direct Call Midwife */}
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-4 text-white shadow-md">
            <div className="text-xs uppercase tracking-wider font-semibold text-sky-100">Bidan Penanggung Jawab TPMB</div>
            <div className="font-bold text-base mt-1">{currentTpmb.midwifeName}</div>
            <div className="text-xs text-sky-100 mt-0.5">{currentTpmb.name}</div>
            <div className="mt-3 flex items-center gap-2">
              <a
                href={`tel:${currentTpmb.phone.replace(/[^0-9]/g, '')}`}
                className="flex-1 bg-white text-sky-700 hover:bg-sky-50 font-bold py-2.5 px-3 rounded-lg text-center text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-sky-600" />
                Telepon Bidan ({currentTpmb.phone})
              </a>
            </div>
          </div>

          {/* Emergency Hotlines */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Layanan Krisis Nasional (24 Jam Bebas Pulsa)
            </div>

            {/* Hotline SEJIWA 119 ext 8 */}
            <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:border-sky-300 transition-colors bg-white">
              <div>
                <div className="font-semibold text-sm text-slate-900">Layanan Psikologi Sejiwa</div>
                <div className="text-xs text-slate-500">Kementerian Kesehatan RI (24 Jam)</div>
              </div>
              <a
                href="tel:119"
                className="bg-sky-100 text-sky-700 hover:bg-sky-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Hubungi 119
              </a>
            </div>

            {/* Halo Kemenkes 1500-567 */}
            <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:border-sky-300 transition-colors bg-white">
              <div>
                <div className="font-semibold text-sm text-slate-900">Halo Kemenkes RI</div>
                <div className="text-xs text-slate-500">Layanan Darurat & Konsultasi Medis</div>
              </div>
              <a
                href="tel:1500567"
                className="bg-sky-100 text-sky-700 hover:bg-sky-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                1500-567
              </a>
            </div>

            {/* Emergency Contact */}
            {currentUser?.emergencyContact && (
              <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-slate-900">Kontak Darurat Keluarga</div>
                  <div className="text-xs text-slate-600">
                    {currentUser.emergencyContact.name} ({currentUser.emergencyContact.relation})
                  </div>
                </div>
                <a
                  href={`tel:${currentUser.emergencyContact.phone.replace(/[^0-9]/g, '')}`}
                  className="bg-amber-500 text-white hover:bg-amber-600 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Hubungi
                </a>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-normal">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Catatan:</strong> Aplikasi MENTARI adalah instrumen skrining dan dukungan mandiri, bukan layanan medis gawat darurat langsung. Jika ada ancaman fisik segera, hubungi keluarga terdekat atau faskes terdekat.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 rounded-xl text-sm transition-colors"
          >
            Tutup Layar Bantuan
          </button>
        </div>
      </div>
    </div>
  );
};

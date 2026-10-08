import React, { useEffect } from 'react';
import {
  Heart,
  Smile,
  AlertCircle,
  AlertTriangle,
  Phone,
  Sparkles,
  BookOpen,
  Calendar,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EPDSScreeningResult } from '../../types';
import { useApp } from '../../context/AppContext';

interface EpdsResultModalProps {
  result: EPDSScreeningResult | null;
  isOpen: boolean;
  onClose: () => void;
  onStartSicring: () => void;
  onOpenEmergency: () => void;
}

export const EpdsResultModal: React.FC<EpdsResultModalProps> = ({
  result,
  isOpen,
  onClose,
  onStartSicring,
  onOpenEmergency,
}) => {
  const { tpmbList, currentUser } = useApp();

  useEffect(() => {
    if (isOpen && result && (result.category === 'rendah' || result.category === 'waspada')) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#0284c7', '#34d399', '#fef08a'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header styling according to category */}
        {result.category === 'red_flag' && (
          <div className="bg-rose-50 border-b border-rose-200 p-6 text-center">
            <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
              Prioritas Perhatian Khusus
            </span>
            <h3 className="text-xl font-bold text-rose-950 mt-2">
              Ibu Berharga, Jangan Ragu Menerima Bantuan
            </h3>
            <p className="text-xs text-rose-800 mt-1 max-w-sm mx-auto">
              Perasaan berat yang Ibu alami hari ini adalah sinyal bahwa Ibu membutuhkan pendampingan segera.
            </p>
          </div>
        )}

        {result.category === 'tinggi' && (
          <div className="bg-amber-50 border-b border-amber-200 p-6 text-center">
            <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <AlertCircle className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Perlu Dukungan Tambahan
            </span>
            <h3 className="text-xl font-bold text-amber-950 mt-2">
              Terima Kasih Sudah Jujur, Bu
            </h3>
            <p className="text-xs text-amber-800 mt-1 max-w-sm mx-auto">
              Menjadi ibu adalah perjalanan besar. Jawaban Ibu menunjukkan saat ini Ibu butuh ruang istirahat dan dukungan ekstra.
            </p>
          </div>
        )}

        {result.category === 'waspada' && (
          <div className="bg-sky-50 border-b border-sky-200 p-6 text-center">
            <div className="w-14 h-14 bg-sky-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
              Kondisi Butuh Relaksasi
            </span>
            <h3 className="text-xl font-bold text-sky-950 mt-2">
              Jeda Sejenak untuk Diri Sendiri
            </h3>
            <p className="text-xs text-sky-800 mt-1 max-w-sm mx-auto">
              Ada sedikit kelelahan dan kecemasan yang terasa. Luangkan waktu untuk istirahat dan menenangkan pikiran.
            </p>
          </div>
        )}

        {result.category === 'rendah' && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-6 text-center">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Smile className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Kondisi Emosional Stabil
            </span>
            <h3 className="text-xl font-bold text-emerald-950 mt-2">
              Kabar Baik Hari Ini!
            </h3>
            <p className="text-xs text-emerald-800 mt-1 max-w-sm mx-auto">
              Alhamdulillah, suasana hati Ibu relatif baik dan terkendali. Tetap jaga pola istirahat dan asupan gizi ya, Bu.
            </p>
          </div>
        )}

        {/* Body & Recommendations */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Detailed guidance card */}
          {result.category === 'red_flag' && (
            <div className="space-y-3">
              <div className="bg-white border-2 border-rose-300 rounded-2xl p-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Bidan Akan Menghubungi Ibu</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Sistem telah mengirimkan notifikasi prioritas ke <strong>{currentTpmb.midwifeName}</strong>. Bidan akan segera menghubungi Ibu untuk memastikan kondisi Ibu aman.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-100 flex flex-col gap-2">
                  <a
                    href={`tel:${currentTpmb.phone.replace(/[^0-9]/g, '')}`}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Telepon Bidan Sekarang ({currentTpmb.phone})
                  </a>
                  <button
                    onClick={onOpenEmergency}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
                  >
                    Buka Saluran Bantuan Psikologis Nasional (119 ext 8)
                  </button>
                </div>
              </div>
            </div>
          )}

          {result.category === 'tinggi' && (
            <div className="space-y-3">
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
                <h4 className="font-bold text-amber-900 text-sm">Langkah Berikutnya:</h4>
                <ul className="text-xs text-amber-950 mt-2 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Bidan TPMB akan menghubungi Ibu</strong> paling lambat 1x24 jam untuk mendengarkan keluhan dan menyusun rencana pemulihan.
                  </li>
                  <li>
                    Cobalah latihan hening <strong>Charging Ruhani SICRING</strong> untuk melepaskan beban di dada.
                  </li>
                  <li>Jangan ragu meminta bantuan suami atau keluarga terdekat untuk bergantian mengurus si kecil.</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${currentTpmb.phone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-3 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Telepon Bidan ({currentTpmb.midwifeName})
                </a>
                <button
                  onClick={onStartSicring}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-3 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5" />
                  Mulai SICRING Mandiri
                </button>
              </div>
            </div>
          )}

          {result.category === 'waspada' && (
            <div className="space-y-3">
              <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-4">
                <h4 className="font-bold text-sky-950 text-sm">Saran Perawatan Mandiri:</h4>
                <p className="text-xs text-sky-900 mt-1 leading-relaxed">
                  Lakukan modul <strong>Olah Tubuh Sadar</strong> atau <strong>Blessing Water</strong> hari ini. Cek kabar ulang akan dijadwalkan kembali dalam 2 minggu ke depan.
                </p>
              </div>
              <button
                onClick={onStartSicring}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Mulai Latihan Relaksasi SICRING
              </button>
            </div>
          )}

          {result.category === 'rendah' && (
            <div className="space-y-3">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 leading-relaxed">
                <p>
                  Ibu hebat! Pertahankan rutinitas positif ini. Ibu tetap dapat melakukan modul relaksasi <strong>SICRING</strong> kapan saja untuk merawat kedamaian batin.
                </p>
                <div className="mt-2 flex items-center gap-2 text-emerald-800 font-medium pt-2 border-t border-emerald-200/60">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Jadwal skrining rutin berikutnya: 2 minggu lagi</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onStartSicring}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Latihan SICRING
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          )}

          {/* Research note */}
          <div className="text-[11px] text-slate-400 text-center pt-2">
            Kode Responden: <strong>{result.responderCode}</strong> &bull; Instrumen: EPDS Versi Indonesia (Cox et al.)
          </div>
        </div>

        {/* Close button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

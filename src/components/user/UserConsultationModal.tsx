import React, { useState } from 'react';
import { HeartHandshake, Calendar, Phone, MapPin, CheckCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserConsultationModal: React.FC<UserConsultationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { requestConsultation, tpmbList, currentUser } = useApp();

  const [type, setType] = useState<'telepon' | 'tatap_muka'>('telepon');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('09:00 - 10:00 WIB');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestConsultation({
      preferredType: type,
      requestedDate: date,
      requestedTimeSlot: timeSlot,
      notes: notes.trim() || 'Konsultasi kesehatan mental dan perkembangan perinatal.',
    });
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-sky-50 border-b border-sky-100 p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pendampingan Bersama Bidan</h3>
              <p className="text-xs text-sky-700">Komponen 5 SICRING: Konseling 1-on-1</p>
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
        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">
              Pengajuan Pendampingan Terkirim!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Bidan <strong>{currentTpmb.midwifeName}</strong> telah menerima jadwal konsultasi Ibu. Bidan akan mengonfirmasi via notifikasi atau telepon sebelum waktu yang dipilih.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Kembali ke Aplikasi
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Midwife info card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Bidan TPMB</span>
                <span className="text-xs font-bold text-slate-900">{currentTpmb.midwifeName}</span>
                <span className="text-[11px] text-slate-500 block">{currentTpmb.name}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2.5 py-1 rounded-full">
                Tersedia
              </span>
            </div>

            {/* Type selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Metode Konseling yang Nyaman:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('telepon')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    type === 'telepon'
                      ? 'border-sky-500 bg-sky-50 text-sky-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  Telepon / Suara
                </button>
                <button
                  type="button"
                  onClick={() => setType('tatap_muka')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    type === 'tatap_muka'
                      ? 'border-sky-500 bg-sky-50 text-sky-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-purple-600" />
                  Tatap Muka di TPMB
                </button>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pilih Tanggal:
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pilihan Jam:
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500"
                >
                  <option value="09:00 - 10:00 WIB">09:00 - 10:00 WIB</option>
                  <option value="11:00 - 12:00 WIB">11:00 - 12:00 WIB</option>
                  <option value="14:00 - 15:00 WIB">14:00 - 15:00 WIB</option>
                  <option value="16:00 - 17:00 WIB">16:00 - 17:00 WIB</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Topik atau Hal yang Ingin Dibicarakan:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Contoh: Merasa sering cemas jelang melahirkan, sulit tidur, atau butuh saran seputar menyusui..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
              >
                Ajukan Jadwal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

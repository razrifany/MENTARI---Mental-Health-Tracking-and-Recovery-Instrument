import React, { useState } from 'react';
import { UserPlus, CheckCircle, X, QrCode, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

interface RegisterMotherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterMotherModal: React.FC<RegisterMotherModalProps> = ({ isOpen, onClose }) => {
  const { registerNewMother, currentUser, tpmbList } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState<'hamil' | 'nifas'>('hamil');
  const [weeks, setWeeks] = useState(24);
  const [days, setDays] = useState(7);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  if (!isOpen) return null;

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = registerNewMother({
      name: name.trim(),
      phone: phone.trim(),
      tpmbId: currentTpmb.id,
      stage,
      weeks: stage === 'hamil' ? Number(weeks) : undefined,
      days: stage === 'nifas' ? Number(days) : undefined,
      emergencyName: emergencyName.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() || undefined,
    });
    setCreatedUser(newUser);
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setCreatedUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-sky-50 border-b border-sky-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pendaftaran Pasien Ibu Baru</h3>
              <p className="text-xs text-sky-700">{currentTpmb.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Success Screen */}
        {createdUser ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">Pendaftaran Berhasil!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Pasien telah terdaftar dan siap mengakses aplikasi mobile MENTARI.
              </p>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Nama Pasien:</span>
                <span className="font-bold text-slate-900">{createdUser.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Kode Responden:</span>
                <span className="font-black text-sky-700 text-sm bg-white px-2 py-0.5 rounded-md border border-sky-200">
                  {createdUser.responderCode}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Nomor HP:</span>
                <span className="font-bold text-slate-900">{createdUser.phone}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Kode Undangan TPMB:</span>
                <span className="font-mono font-bold text-slate-800">
                  {currentTpmb.codePrefix}-2026
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Ibu dapat langsung login menggunakan nomor HP di aplikasi Android atau web.
            </p>

            <button
              onClick={handleReset}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Selesai & Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Lengkap Ibu:
              </label>
              <input
                type="text"
                placeholder="Contoh: Ny. Ratna Sari"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nomor HP (WhatsApp):
              </label>
              <input
                type="tel"
                placeholder="Contoh: 0812-3344-5566"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-sky-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Fase Perinatal:
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as 'hamil' | 'nifas')}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="hamil">Ibu Hamil</option>
                  <option value="nifas">Ibu Nifas (Pasca Salin)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {stage === 'hamil' ? 'Usia Kehamilan (Minggu):' : 'Hari ke- Pasca Persalinan:'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={stage === 'hamil' ? 42 : 60}
                  value={stage === 'hamil' ? weeks : days}
                  onChange={(e) =>
                    stage === 'hamil'
                      ? setWeeks(Number(e.target.value))
                      : setDays(Number(e.target.value))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-600 uppercase block mb-2">
                Kontak Darurat Keluarga (Opsional)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nama Suami/Keluarga"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-300"
                />
                <input
                  type="tel"
                  placeholder="No. HP Darurat"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
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
                Daftarkan Pasien
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

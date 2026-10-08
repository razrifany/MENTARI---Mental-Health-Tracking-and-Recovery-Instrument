import React, { useState } from 'react';
import {
  Heart,
  Stethoscope,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginViewProps {
  onLoginSuccess: (target: 'user' | 'admin') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { users, loginAs } = useApp();

  const [roleGroup, setRoleGroup] = useState<'user' | 'admin'>('user');
  const [phone, setPhone] = useState('0812-1111-2222');
  const [pin, setPin] = useState('123456');
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBypassId, setSelectedBypassId] = useState('');

  // Handle standard submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanInputPhone = phone.replace(/[^0-9]/g, '');

    if (roleGroup === 'user') {
      const matchedUser = users.find(
        (u) =>
          u.role === 'ibu' &&
          (u.phone.replace(/[^0-9]/g, '').includes(cleanInputPhone) ||
            cleanInputPhone.includes(u.phone.replace(/[^0-9]/g, '')) ||
            u.phone.includes(phone.trim()))
      );

      if (matchedUser) {
        loginAs(matchedUser.id);
        onLoginSuccess('user');
      } else {
        const defaultUser = users.find((u) => u.role === 'ibu') || users[0];
        loginAs(defaultUser.id);
        onLoginSuccess('user');
      }
    } else {
      const matchedAdmin = users.find(
        (u) =>
          (u.role === 'bidan' || u.role === 'ahli_materi' || u.role === 'peneliti' || u.role === 'admin') &&
          (u.phone.replace(/[^0-9]/g, '').includes(cleanInputPhone) ||
            cleanInputPhone.includes(u.phone.replace(/[^0-9]/g, '')) ||
            u.phone.includes(phone.trim()))
      );

      if (matchedAdmin) {
        loginAs(matchedAdmin.id);
        onLoginSuccess('admin');
      } else {
        const defaultAdmin = users.find((u) => u.role === 'bidan') || users[3];
        loginAs(defaultAdmin.id);
        onLoginSuccess('admin');
      }
    }
  };

  // Handle quick bypass dropdown selection
  const handleBypassChange = (userId: string) => {
    setSelectedBypassId(userId);
    if (!userId) return;

    const user = users.find((u) => u.id === userId);
    if (!user) return;

    setPhone(user.phone);
    setPin('123456');

    if (user.role === 'ibu') {
      setRoleGroup('user');
      loginAs(user.id);
      onLoginSuccess('user');
    } else {
      setRoleGroup('admin');
      loginAs(user.id);
      onLoginSuccess('admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-700">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl border border-sky-100 shadow-lg shadow-sky-100/50 p-6 sm:p-8">
        
        {/* Brand & Title (Clean, not overly bold) */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-bold text-lg mx-auto mb-2.5 shadow-sm shadow-sky-200">
            M
          </div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            MENTARI
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Mental Health Tracking &amp; Recovery Instrument
          </p>
        </div>

        {/* Quick Bypass Dropdown */}
        <div className="mb-4 bg-sky-50/70 border border-sky-200/80 rounded-xl p-2.5">
          <label className="text-[11px] font-medium text-sky-800 flex items-center gap-1.5 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Bypass Akun (Simulasi Demo Cepat):</span>
          </label>
          <select
            value={selectedBypassId}
            onChange={(e) => handleBypassChange(e.target.value)}
            className="w-full text-xs font-normal p-2 rounded-lg border border-sky-200 bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-400 cursor-pointer"
          >
            <option value="">-- Pilih Akun untuk Masuk Langsung --</option>
            <optgroup label="Aplikasi Ibu (User)">
              <option value="user-ibu-1">
                Ny. Siti Rahmawardani (Ibu Hamil 26 mg - Normal)
              </option>
              <option value="user-ibu-2">
                Ny. Anisa Dewi (Ibu Nifas 14 hr - Kasus Red Flag)
              </option>
              <option value="user-ibu-3">
                Ny. Fitri Ayu (Ibu Hamil 34 mg - Waspada)
              </option>
            </optgroup>
            <optgroup label="Tenaga Kesehatan & Tim Sistem">
              <option value="user-bidan-1">
                Bdn. Hj. Sri Wahyuni (Bidan TPMB - Layanan Triase & Pasien)
              </option>
              <option value="user-ahli-materi-1">
                Ns. Dian Kusuma, M.Kep (Ahli Materi SICRING)
              </option>
              <option value="user-peneliti-1">
                Dr. Ratna Indrawati (Peneliti Riset)
              </option>
              <option value="user-admin-1">
                Bagus Prakoso (Super Admin)
              </option>
            </optgroup>
          </select>
        </div>

        {/* Role Selector Tabs (Clean & Medium weight) */}
        <div className="mb-4 bg-slate-100/90 p-1 rounded-xl flex border border-slate-200/70">
          <button
            type="button"
            onClick={() => {
              setRoleGroup('user');
              setPhone('0812-1111-2222');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-all ${
              roleGroup === 'user'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-sky-600" />
            <span>Aplikasi Ibu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleGroup('admin');
              setPhone('0812-3456-7890');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-all ${
              roleGroup === 'admin'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
            <span>Tim Medis &amp; Sistem</span>
          </button>
        </div>

        {/* Staff Sub-Role Preset Pills */}
        {roleGroup === 'admin' && (
          <div className="mb-3.5 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
              Pilih Peran Staf:
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setPhone('0812-3456-7890')}
                className={`py-1 px-2 rounded-lg text-left transition-colors font-medium ${
                  phone === '0812-3456-7890'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🩺 Bidan TPMB
              </button>
              <button
                type="button"
                onClick={() => setPhone('0813-7890-1234')}
                className={`py-1 px-2 rounded-lg text-left transition-colors font-medium ${
                  phone === '0813-7890-1234'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🧘‍♀️ Ahli Materi
              </button>
              <button
                type="button"
                onClick={() => setPhone('0818-4567-8901')}
                className={`py-1 px-2 rounded-lg text-left transition-colors font-medium ${
                  phone === '0818-4567-8901'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🔬 Peneliti Riset
              </button>
              <button
                type="button"
                onClick={() => setPhone('0811-2345-6789')}
                className={`py-1 px-2 rounded-lg text-left transition-colors font-medium ${
                  phone === '0811-2345-6789'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                🛡️ Administrator
              </button>
            </div>
          </div>
        )}

        {/* Standard Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          {/* Phone Input */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Nomor Handphone Terdaftar
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                placeholder="Contoh: 0812-3456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all font-normal"
                required
              />
            </div>
          </div>

          {/* PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-600">
                PIN Keamanan
              </label>
              <button
                type="button"
                className="text-[11px] text-sky-600 hover:text-sky-700 font-normal"
                onClick={() => alert('PIN default untuk demo: 123456')}
              >
                Lupa PIN?
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-xs pl-9 pr-9 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all font-mono tracking-widest"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-slate-400 hover:text-slate-600 absolute right-3 top-2.5 p-0.5"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 text-sky-600 rounded-xs border-slate-300 focus:ring-sky-500"
              />
              <span className="text-slate-500 text-[11px]">Ingat sesi</span>
            </label>
            <span className="text-[11px] text-slate-400">TPMB Kasih Bunda</span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <span>
              Masuk ke {roleGroup === 'user' ? 'Aplikasi Ibu' : 'Dashboard Admin'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Aplikasi Kesehatan Jiwa Perinatal &bull; Versi 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

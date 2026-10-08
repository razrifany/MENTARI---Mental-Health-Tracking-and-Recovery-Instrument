import React, { useState } from 'react';
import {
  LogOut,
  Heart,
  Phone,
  Edit3,
  Save,
  CheckCircle2,
  ExternalLink,
  Shield,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserProfileViewProps {
  onBackToHome: () => void;
  onSwitchToAdmin: () => void;
  onDetailModeChange?: (isDetail: boolean, title?: string) => void;
  isDetailActive?: boolean;
}

type SubMenu = 'edit' | 'perinatal' | 'emergency' | null;

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onSwitchToAdmin,
  onDetailModeChange,
  isDetailActive,
}) => {
  const { currentUser, updateUserProfile, tpmbList, logout } = useApp();

  const [activeSubMenu, setActiveSubMenu] = useState<SubMenu>(null);

  const prevIsDetailActiveRef = React.useRef(isDetailActive);

  // Sync activeSubMenu state with parent layout header & full page detail mode
  React.useEffect(() => {
    if (onDetailModeChange) {
      let title: string | undefined = undefined;
      if (activeSubMenu === 'edit') title = 'Ubah Data Diri';
      if (activeSubMenu === 'perinatal') title = 'Kondisi Perinatal & Faskes';
      if (activeSubMenu === 'emergency') title = 'Pendamping Siaga';
      onDetailModeChange(activeSubMenu !== null, title);
    }
  }, [activeSubMenu, onDetailModeChange]);

  React.useEffect(() => {
    if (prevIsDetailActiveRef.current === true && isDetailActive === false && activeSubMenu !== null) {
      setActiveSubMenu(null);
    }
    prevIsDetailActiveRef.current = isDetailActive;
  }, [isDetailActive, activeSubMenu]);

  // Form states for profile editing
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editEmergencyName, setEditEmergencyName] = useState(currentUser?.emergencyContact?.name || '');
  const [editEmergencyRelation, setEditEmergencyRelation] = useState(currentUser?.emergencyContact?.relation || 'Suami');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(currentUser?.emergencyContact?.phone || '');
  const [isSavedProfile, setIsSavedProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!currentUser) return null;

  const currentTpmb = tpmbList.find((t) => t.id === currentUser.tpmbId) || tpmbList[0];
  const isPregnant = currentUser.perinatalStage === 'hamil';
  const gestationalWeeks = currentUser.gestationalWeeks ?? 26;
  const postpartumDays = currentUser.postpartumDays ?? 14;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      name: editName.trim() || currentUser.name,
      phone: editPhone.trim() || currentUser.phone,
      emergencyContact: {
        name: editEmergencyName.trim() || (currentUser.emergencyContact?.name ?? 'Suami'),
        relation: editEmergencyRelation.trim() || (currentUser.emergencyContact?.relation ?? 'Suami'),
        phone: editEmergencyPhone.trim() || (currentUser.emergencyContact?.phone ?? '081234567890'),
      },
    });
    setIsSavedProfile(true);
    setActiveSubMenu(null);
    setTimeout(() => setIsSavedProfile(false), 2500);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12 animate-in fade-in">
      {/* Success Notification */}
      {isSavedProfile && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Data profil dan kontak darurat berhasil diperbarui.</span>
        </div>
      )}

      {/* Main Profile Header Banner - Only shown on main profile list view */}
      {activeSubMenu === null && (
        <div className="bg-sky-500 text-white rounded-3xl p-4.5 sm:p-5 shadow-sm shadow-sky-200/50 relative overflow-hidden space-y-3">
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center font-bold text-xl shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {currentUser.name}
                </h2>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                  {isPregnant ? 'Hamil' : 'Nifas'}
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-1 leading-relaxed">
                Kode: <strong className="font-mono">{currentUser.responderCode || 'MNT-001'}</strong> &bull; Binaan: <strong>{currentTpmb.name}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MENU DETAIL VIEWS (WHEN A MENU IS CLICKED) */}
      {activeSubMenu !== null && (
        <div className="space-y-4 animate-in fade-in duration-200">

          {/* SubMenu 1: Edit Profile */}
          {activeSubMenu === 'edit' && (
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-sky-600" />
                  <span>Ubah Data Diri</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Ibu</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:border-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WA</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:border-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Pendamping</label>
                  <input
                    type="text"
                    value={editEmergencyName}
                    onChange={(e) => setEditEmergencyName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:border-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hubungan</label>
                  <select
                    value={editEmergencyRelation}
                    onChange={(e) => setEditEmergencyRelation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:border-sky-500 font-medium bg-white"
                  >
                    <option value="Suami">Suami</option>
                    <option value="Ibu Kandung">Ibu Kandung</option>
                    <option value="Mertua">Ibu Mertua</option>
                    <option value="Saudara Kandung">Saudara Kandung</option>
                    <option value="Kerabat">Kerabat Lainnya</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Telepon Pendamping</label>
                  <input
                    type="tel"
                    value={editEmergencyPhone}
                    onChange={(e) => setEditEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:border-sky-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubMenu(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          )}

          {/* SubMenu 2: Kondisi Perinatal & Faskes */}
          {activeSubMenu === 'perinatal' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-sky-600" />
                  <span>Kondisi Perinatal &amp; Faskes</span>
                </h3>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                  KIA Digital
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium block">Fase Perinatal</span>
                  <span className="font-bold text-slate-800 text-sm block">
                    {isPregnant ? `Sedang Hamil (${gestationalWeeks} Minggu)` : `Masa Nifas (Hari ke-${postpartumDays})`}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium block">
                    {isPregnant ? 'Perkiraan Lahir (HPL)' : 'Tanggal Persalinan'}
                  </span>
                  <span className="font-bold text-slate-800 text-sm block">
                    {isPregnant ? (currentUser.hpl || '12 Jan 2027') : (currentUser.deliveryDate || '23 Sep 2026')}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Lokasi TPMB Binaan</span>
                  <span className="font-bold text-slate-900 text-sm block mt-0.5">{currentTpmb.name}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Bidan: {currentTpmb.midwifeName}</span>
                </div>

                <a
                  href={`tel:${currentTpmb.phone}`}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Hubungi TPMB</span>
                </a>
              </div>
            </div>
          )}

          {/* SubMenu 3: Pendamping Siaga */}
          {activeSubMenu === 'emergency' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-600" />
                  <span>Pendamping Siaga</span>
                </h3>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Nama Pendamping:</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {currentUser.emergencyContact?.name || 'Bpk. Muhammad Ilham'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-xl">
                    {currentUser.emergencyContact?.relation || 'Suami'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Nomor Telepon:</span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {currentUser.emergencyContact?.phone || '0813-8899-7711'}
                    </span>
                  </div>

                  <a
                    href={`tel:${currentUser.emergencyContact?.phone || '081388997711'}`}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Panggil Darurat</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MAIN MENU LIST TILES (WHEN NO SUBMENU IS OPEN) */}
      {activeSubMenu === null && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {/* Menu Item 1: Ubah Data Diri */}
          <button
            type="button"
            onClick={() => setActiveSubMenu('edit')}
            className="w-full p-3.5 sm:p-4 text-left hover:bg-sky-50/50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-100 flex items-center justify-center shrink-0 transition-colors">
                <Edit3 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-sky-700 transition-colors">
                Ubah Data Diri
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Menu Item 2: Kondisi Perinatal & Faskes */}
          <button
            type="button"
            onClick={() => setActiveSubMenu('perinatal')}
            className="w-full p-3.5 sm:p-4 text-left hover:bg-sky-50/50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-100 flex items-center justify-center shrink-0 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-sky-700 transition-colors">
                Kondisi Perinatal &amp; Faskes
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Menu Item 3: Pendamping Siaga */}
          <button
            type="button"
            onClick={() => setActiveSubMenu('emergency')}
            className="w-full p-3.5 sm:p-4 text-left hover:bg-sky-50/50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-100 flex items-center justify-center shrink-0 transition-colors">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-sky-700 transition-colors">
                Pendamping Siaga
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Menu Item 4: Switch to Admin Portal */}
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="w-full p-3.5 sm:p-4 text-left hover:bg-sky-50/50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-100 flex items-center justify-center shrink-0 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-sky-700 transition-colors">
                Portal Bidan / Admin
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Menu Item 5: Logout */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full p-3.5 sm:p-4 text-left hover:bg-rose-50/60 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-100 flex items-center justify-center shrink-0 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-semibold text-rose-700 text-xs sm:text-sm transition-colors">
                Keluar
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-base">Keluar dari Akun?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Sesi Ibu <strong>{currentUser.name}</strong> akan diakhiri pada perangkat ini.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

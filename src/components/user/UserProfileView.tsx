import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Check,
  LogOut,
  ArrowLeft,
  Heart,
  Phone,
  Calendar,
  Building2,
  FileText,
  Printer,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserProfileViewProps {
  onBackToHome: () => void;
  onSwitchToAdmin: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onBackToHome,
  onSwitchToAdmin,
}) => {
  const { currentUser, updateConsent, updateUserProfile, tpmbList, logout, screenings } = useApp();

  // Form states for consent
  const [appUsage, setAppUsage] = useState(
    currentUser?.consentGiven?.appUsage ?? true
  );
  const [research, setResearch] = useState(
    currentUser?.consentGiven?.researchParticipation ?? true
  );
  const [midwifeShare, setMidwifeShare] = useState(
    currentUser?.consentGiven?.dataShareMidwife ?? true
  );
  const [isSavedConsent, setIsSavedConsent] = useState(false);

  // Form states for profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editEmergencyName, setEditEmergencyName] = useState(
    currentUser?.emergencyContact?.name || ''
  );
  const [editEmergencyRelation, setEditEmergencyRelation] = useState(
    currentUser?.emergencyContact?.relation || 'Suami'
  );
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(
    currentUser?.emergencyContact?.phone || ''
  );
  const [isSavedProfile, setIsSavedProfile] = useState(false);

  // Accordion for full informed consent text
  const [isFullDocumentOpen, setIsFullDocumentOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!currentUser) return null;

  const currentTpmb = tpmbList.find((t) => t.id === currentUser.tpmbId) || tpmbList[0];
  const isPregnant = currentUser.perinatalStage === 'hamil';
  const gestationalWeeks = currentUser.gestationalWeeks ?? 26;
  const postpartumDays = currentUser.postpartumDays ?? 14;

  const userScreenings = screenings.filter((s) => s.userId === currentUser.id);
  const latestScreening = userScreenings[0];

  const handleSaveConsent = () => {
    updateConsent(currentUser.id, appUsage, research, midwifeShare);
    setIsSavedConsent(true);
    setTimeout(() => setIsSavedConsent(false), 2500);
  };

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
    setIsEditingProfile(false);
    setTimeout(() => setIsSavedProfile(false), 2500);
  };

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* 1. Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBackToHome}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shrink-0"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                Akun & Privasi Ibu
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Versi Regulasi 1.0.0
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              Profil Ibu & Lembar Persetujuan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data diri, faskes binaan TPMB, kontak darurat keluarga, dan persetujuan medis (*Informed Consent*).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrintDocument}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            title="Cetak Salinan Persetujuan"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Success Notification for Profile Update */}
      {isSavedProfile && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Data profil dan kontak darurat Ibu berhasil disimpan dan diperbarui!
          </span>
        </div>
      )}

      {/* 2. Main Profile Hero Card */}
      <div className="bg-gradient-to-br from-sky-600 via-sky-600 to-indigo-700 rounded-3xl p-5 sm:p-7 text-white shadow-sm shadow-sky-200 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-36 h-36 bg-sky-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shrink-0">
              {currentUser.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {currentUser.name}
                </h2>
                <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  {isPregnant ? 'Fase Kehamilan' : 'Fase Nifas & Menyusui'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sky-100">
                <span className="flex items-center gap-1">
                  <strong>Kode Responden:</strong>{' '}
                  <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-white font-bold">
                    {currentUser.responderCode || 'MNT-001'}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <strong>Telepon:</strong> {currentUser.phone || '0812-xxxx-xxxx'}
                </span>
              </div>

              <p className="text-xs text-sky-100/90 pt-1 leading-relaxed max-w-xl">
                Terdaftar di <strong>{currentTpmb.name}</strong> di bawah asuhan{' '}
                <strong>Bidan {currentTpmb.midwifeName}</strong>. Data rekam medis dan privasi Ibu terlindungi dengan protokol pseudonim etik.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t border-white/15 sm:border-0">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 rounded-xl bg-white text-sky-700 hover:bg-sky-50 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Batal Edit' : 'Ubah Data Diri'}</span>
            </button>
            <span className="text-[11px] text-sky-100/80">
              {currentUser.consentGiven ? 'Informed Consent: Aktif' : 'Persetujuan: Perlu Konfirmasi'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Edit Form Drawer (If Editing) */}
      {isEditingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-200 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Edit3 className="w-4 h-4 text-sky-600" />
              <span>Formulir Pembaruan Data Profil & Kontak Darurat</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Ibu
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Contoh: Ny. Siti Rahmawati"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="0812-xxxx-xxxx"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Kontak Darurat (Suami / Keluarga)
              </label>
              <input
                type="text"
                value={editEmergencyName}
                onChange={(e) => setEditEmergencyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Contoh: Bpk. Muhammad Ilham"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hubungan Pendamping
              </label>
              <select
                value={editEmergencyRelation}
                onChange={(e) => setEditEmergencyRelation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="Suami">Suami</option>
                <option value="Ibu Kandung">Ibu Kandung</option>
                <option value="Mertua">Ibu Mertua</option>
                <option value="Saudara Kandung">Saudara Kandung</option>
                <option value="Kerabat">Kerabat Lainnya</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon Kontak Darurat
              </label>
              <input
                type="tel"
                value={editEmergencyPhone}
                onChange={(e) => setEditEmergencyPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Contoh: 0813-8899-7711"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. Detail Grid: Data Klinis Perinatal & Faskes Bidan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Informasi Klinis Perinatal */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Kondisi Perinatal</span>
            </div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
              Buku KIA Digital
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Status Fase:</span>
              <span className="text-xs font-bold text-slate-800">
                {isPregnant ? 'Sedang Mengandung (Antenatal)' : 'Masa Nifas (Postnatal)'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">
                {isPregnant ? 'Usia Kandungan Saat Ini:' : 'Masa Nifas Saat Ini:'}
              </span>
              <span className="text-xs font-bold text-sky-800">
                {isPregnant ? `${gestationalWeeks} Minggu` : `Hari ke-${postpartumDays} Pasca Lahir`}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">
                {isPregnant ? 'Hari Perkiraan Lahir (HPL):' : 'Tanggal Bersalin:'}
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {isPregnant ? (currentUser.hpl || '12 Januari 2027') : (currentUser.deliveryDate || '23 September 2026')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Faskes TPMB Binaan */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>Faskes TPMB Binaan</span>
            </div>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Terverifikasi
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Tempat Praktik Mandiri Bidan:</span>
              <span className="text-xs font-bold text-slate-900 block">{currentTpmb.name}</span>
              <span className="text-[11px] text-slate-500 leading-tight block">{currentTpmb.address}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Bidan Penanggung Jawab:</span>
              <span className="text-xs font-bold text-sky-800">Bidan {currentTpmb.midwifeName}</span>
              <span className="text-[11px] text-slate-500 block">STRB & SIPB Resmi IBI</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Telepon TPMB:</span>
                <span className="text-xs font-bold text-slate-800">{currentTpmb.phone}</span>
              </div>
              <a
                href={`tel:${currentTpmb.phone}`}
                className="px-2.5 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>Hubungi</span>
              </a>
            </div>
          </div>
        </div>

        {/* Card 3: Kontak Darurat Suami & Pendamping */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Pendamping Siaga</span>
            </div>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-[11px] font-bold text-sky-700 hover:underline"
            >
              Ubah
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Nama Pendamping:</span>
              <span className="text-xs font-bold text-slate-900 block">
                {currentUser.emergencyContact?.name || 'Bpk. Muhammad Ilham'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Hubungan: {currentUser.emergencyContact?.relation || 'Suami'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">No. Telepon Siaga:</span>
                <span className="text-xs font-bold text-slate-800">
                  {currentUser.emergencyContact?.phone || '0813-8899-7711'}
                </span>
              </div>
              <a
                href={`tel:${currentUser.emergencyContact?.phone || '081388997711'}`}
                className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>Panggil</span>
              </a>
            </div>

            <div className="p-2.5 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 leading-snug">
              Pendamping akan dihubungi jika terjadi kondisi red flag atau situasi kegawatdaruratan psikologis/kebidanan.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Pengaturan Lembar Persetujuan 3-Tier (Informed Consent Management) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Persetujuan & Privasi Data Medis (*Informed Consent*)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ibu memiliki kendali penuh atas persetujuan data. Sesuai etika penelitian kebidanan dan hak pasien, partisipasi bersifat sukarela dan dapat diperbarui kapan saja.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Persetujuan Aktif (v1.0.0)
            </span>
          </div>
        </div>

        {/* 3-Tier Consent Cards */}
        <div className="space-y-3.5">
          {/* Tier 1 */}
          <div
            onClick={() => setAppUsage(!appUsage)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              appUsage
                ? 'bg-sky-50/70 border-sky-200 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              checked={appUsage}
              onChange={(e) => setAppUsage(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 w-5 h-5 text-sky-600 rounded-md border-slate-300 focus:ring-sky-500 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  1. Pemanfaatan Aplikasi MENTARI (Skrining & Relaksasi)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    appUsage
                      ? 'bg-sky-200/80 text-sky-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {appUsage ? 'Disetujui' : 'Tidak Aktif'}
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Saya menyetujui penggunaan aplikasi untuk mengisi skrining mandiri kesehatan jiwa (*Edinburgh Postnatal Depression Scale / EPDS*) secara berkala serta mengikuti panduan latihan relaksasi mandiri <strong>SICRING</strong> (Olah Tubuh, Pernapasan Dalam, Relaksasi Otot Progresif, Terapi Zikir/Doa, dan Refleksi Bersyukur).
              </p>
            </div>
          </div>

          {/* Tier 2 */}
          <div
            onClick={() => setResearch(!research)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              research
                ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              checked={research}
              onChange={(e) => setResearch(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 w-5 h-5 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  2. Partisipasi Penelitian Ilmiah & Evaluasi Klinis (Pseudonim)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    research
                      ? 'bg-indigo-200/80 text-indigo-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {research ? 'Disetujui' : 'Tidak Aktif'}
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Saya mengizinkan data jawaban skrining dan catatan latihan relaksasi dianalisis secara agregat untuk penelitian kebidanan dan kesehatan reproduksi. <strong>Identitas nama asli, NIK, dan nomor telepon tidak akan dipublikasikan</strong> dan hanya diidentifikasi dengan kode acak pseudonim ({currentUser.responderCode || 'MNT-001'}).
              </p>
            </div>
          </div>

          {/* Tier 3 */}
          <div
            onClick={() => setMidwifeShare(!midwifeShare)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              midwifeShare
                ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              checked={midwifeShare}
              onChange={(e) => setMidwifeShare(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 w-5 h-5 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  3. Berbagi Data Klinis dengan Bidan TPMB Penanggung Jawab
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    midwifeShare
                      ? 'bg-emerald-200/80 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {midwifeShare ? 'Disetujui' : 'Tidak Aktif'}
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Saya mengizinkan <strong>Bidan {currentTpmb.midwifeName}</strong> di {currentTpmb.name} untuk melihat riwayat skor skrining, perkembangan kondisi emosional, serta memberikan konfirmasi tindak lanjut atau pendampingan bila terdeteksi skor risiko tinggi (*red flag*).
              </p>
            </div>
          </div>
        </div>

        {/* Action Save Consent Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Persetujuan terakhir diperbarui: {currentUser.consentGiven?.timestamp ? new Date(currentUser.consentGiven.timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Hari ini'}</span>
          </div>

          <button
            onClick={handleSaveConsent}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
              isSavedConsent
                ? 'bg-emerald-600 text-white'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            {isSavedConsent ? (
              <>
                <Check className="w-4 h-4" />
                <span>Persetujuan Berhasil Disimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Persetujuan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5. Naskah Resmi Lembar Persetujuan (Accordion & Full Viewable Document) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <button
          onClick={() => setIsFullDocumentOpen(!isFullDocumentOpen)}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 bg-slate-50/60 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Naskah Lengkap Lembar Persetujuan (*Informed Consent Document*)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Baca penjelasan resmi kode etik penelitian, hak responden, jaminan kerahasiaan, dan protokol keselamatan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 shrink-0">
            <span>{isFullDocumentOpen ? 'Sembunyikan Naskah' : 'Buka Naskah'}</span>
            {isFullDocumentOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {isFullDocumentOpen && (
          <div className="p-5 sm:p-7 border-t border-slate-200 bg-white space-y-4 text-xs text-slate-700 leading-relaxed font-normal animate-in fade-in">
            <div className="text-center pb-4 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                LEMBAR PENJELASAN DAN PERSETUJUAN SETELAH PENJELASAN
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Penerapan Aplikasi MENTARI Terintegrasi Modul Relaksasi SICRING di TPMB Binaan
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-1">
                  1. Latar Belakang & Tujuan
                </h5>
                <p>
                  Aplikasi MENTARI dikembangkan sebagai sarana penapisan dini (*skrining*) dan pemantauan kesehatan jiwa ibu pada masa kehamilan dan nifas, sekaligus menghadirkan intervensi relaksasi komplementer berbasis modul SICRING (Olah Tubuh, Nafas Dalam, Relaksasi Otot, Zikir/Doa, dan Refleksi Syukur). Penelitian ini bertujuan untuk meningkatkan kesejahteraan emosional ibu dan mencegah depresi perinatal.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-1">
                  2. Kesukarelaan Menjadi Responden
                </h5>
                <p>
                  Keikutsertaan Ibu dalam program MENTARI bersifat <strong>sepenuhnya sukarela</strong>. Ibu berhak menolak atau mengundurkan diri sewaktu-waktu tanpa dikenakan sanksi dan tanpa mengurangi hak Ibu untuk mendapatkan pelayanan kebidanan rutin di TPMB.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-1">
                  3. Jaminan Kerahasiaan Data (Pseudonimisasi)
                </h5>
                <p>
                  Semua informasi yang diperoleh dari kuesioner dan latihan akan dijaga kerahasiaannya sesuai kode etik penelitian kesehatan. Data identitas Ibu akan digantikan dengan nomor kode responden unik ({currentUser.responderCode || 'MNT-001'}). Laporan penelitian hanya akan menyajikan data ringkasan agregat tanpa menampilkan identitas individu.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-1">
                  4. Manfaat yang Diperoleh
                </h5>
                <p>
                  Ibu memperoleh akses mandiri terhadap panduan audio, video, dan timer latihan relaksasi komplementer SICRING, pemantauan status kesehatan mental secara objektif, serta jalur komunikasi terhubung dengan Bidan penanggung jawab bila membutuhkan dukungan konseling.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-1">
                  5. Protokol Tindak Lanjut Risiko (*Red Flag Protocol*)
                </h5>
                <p>
                  Bila skor skrining EPDS Ibu menunjukkan indikasi risiko tinggi atau terdapat jawaban yang menunjukkan beban emosional berat (termasuk item penapisan nomor 10), sistem akan secara otomatis memberikan rujukan terarah dan memberitahukan Bidan TPMB untuk melakukan pendampingan hangat secara langsung.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-1">
                  6. Kontak Pengembang & Informasi Layanan
                </h5>
                <p>
                  Bila terdapat pertanyaan mengenai aplikasi, latihan SICRING, atau hak-hak partisipan, Ibu dapat menghubungi Bidan di {currentTpmb.name} melalui nomor telepon {currentTpmb.phone}.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 italic">
                Dokumen Informed Consent Digital resmi TPMB Binaan Terdaftar.
              </span>
              <button
                type="button"
                onClick={handlePrintDocument}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Informed Consent</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Navigasi Cepat & Manajemen Akun */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Aksi & Keamanan Akun
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onSwitchToAdmin}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/60 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Buka Portal Bidan & Admin
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Beralih ke tampilan monitoring klinik & penanganan kasus
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-sky-600 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-3.5 rounded-2xl border border-rose-200 hover:bg-rose-50/70 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-rose-700 text-xs block">
                Keluar dari Akun Ibu
              </span>
              <span className="text-[11px] text-rose-600/80 block mt-0.5">
                Akhiri sesi masuk pada perangkat ini
              </span>
            </div>
            <LogOut className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-slate-900 text-base">
                Keluar dari Akun?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ibu <strong>{currentUser.name}</strong> akan keluar dari aplikasi. Ibu dapat masuk kembali kapan saja dengan akun terdaftar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-2xs"
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

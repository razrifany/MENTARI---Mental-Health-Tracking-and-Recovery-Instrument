import React from 'react';
import { Phone, Heart, ShieldCheck, ArrowLeft, MessageSquare, ExternalLink, Headphones } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmergencyHelpViewProps {
  onBack?: () => void;
}

export const EmergencyHelpView: React.FC<EmergencyHelpViewProps> = () => {
  const { currentUser, tpmbList } = useApp();

  const currentTpmb = tpmbList.find((t) => t.id === currentUser?.tpmbId) || tpmbList[0];
  const formattedPhone = currentTpmb.phone.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-10">
      {/* 1. Primary Action Card: Bidan TPMB Penanggung Jawab */}
      <div className="bg-sky-500 text-white rounded-3xl p-5 sm:p-6 shadow-sm shadow-sky-200/50 relative overflow-hidden space-y-4 border border-sky-400">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
            Bidan Pendamping Ibu
          </span>
          <span className="text-xs text-sky-100 font-medium">TPMB Terdaftar</span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            {currentTpmb.midwifeName}
          </h2>
          <p className="text-xs text-sky-100 mt-0.5 font-medium">{currentTpmb.name}</p>
          <p className="text-[11px] text-sky-200 mt-1">
            Siap mendampingi dan memberikan konsultasi kesehatan mental & perinatal Ibu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <a
            href={`tel:${formattedPhone}`}
            className="w-full bg-white hover:bg-sky-50 text-sky-700 font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer text-center"
          >
            <Phone className="w-4 h-4 text-sky-600" />
            Telepon ({currentTpmb.phone})
          </a>

          <a
            href={`https://wa.me/${formattedPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/30 shadow-xs transition-colors cursor-pointer text-center"
          >
            <MessageSquare className="w-4 h-4" />
            Chat WhatsApp Bidan
          </a>
        </div>
      </div>

      {/* 2. Calming Moral Support Box - Clean White Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4.5 sm:p-5 text-slate-800 shadow-2xs flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 shadow-2xs mt-0.5">
          <Heart className="w-5 h-5 fill-sky-100 stroke-sky-600" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-slate-900">Ibu Tidak Sendirian</h3>
          <p className="text-xs leading-relaxed text-slate-600">
            Tarik napas perlahan, Bu. Perasaan cemas atau kelelahan adalah sinyal bahwa tubuh dan pikiran Ibu membutuhkan jeda. Jangan ragu berkonsultasi dengan Bidan atau menghubungi saluran krisis resmi di bawah ini.
          </p>
        </div>
      </div>

      {/* 3. Emergency Hotlines - Layanan Krisis Nasional */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Headphones className="w-4 h-4 text-sky-600" />
          Layanan Krisis Nasional (24 Jam Bebas Pulsa)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* SEJIWA 119 ext 8 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-sky-300 transition-colors flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Layanan SEJIWA 119</h4>
              <p className="text-xs text-slate-500 mt-0.5">Psikologi Kemenkes RI (Ext. 8)</p>
            </div>
            <a
              href="tel:119"
              className="bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              119 (Ext 8)
            </a>
          </div>

          {/* Halo Kemenkes 1500-567 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-sky-300 transition-colors flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Halo Kemenkes RI</h4>
              <p className="text-xs text-slate-500 mt-0.5">Konsultasi Medis & Darurat</p>
            </div>
            <a
              href="tel:1500567"
              className="bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              1500-567
            </a>
          </div>
        </div>
      </div>

      {/* 4. Family Emergency Contact (If set) */}
      {currentUser?.emergencyContact && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900">Kontak Darurat Keluarga</h4>
            <p className="font-semibold text-sm text-slate-900 mt-0.5">
              {currentUser.emergencyContact.name} ({currentUser.emergencyContact.relation})
            </p>
          </div>
          <a
            href={`tel:${currentUser.emergencyContact.phone.replace(/[^0-9]/g, '')}`}
            className="bg-amber-500 text-white hover:bg-amber-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            Telepon
          </a>
        </div>
      )}

      {/* 5. Security & Disclaimer Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Catatan Privasi & Keamanan:</strong> MENTARI adalah instrumen skrining dan pendampingan psikologis mandiri. Apabila Ibu mengalami kegawatdaruratan fisik atau membutuhkan pertolongan medis segera, mohon menuju ke fasilitas kesehatan/RS terdekat atau hubungi keluarga pendamping.
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Activity, Calendar, Clock, Smile, Sparkles, TrendingDown, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserHistoryViewProps {
  onStartScreening: () => void;
}

export const UserHistoryView: React.FC<UserHistoryViewProps> = ({ onStartScreening }) => {
  const { screenings, sicringLogs, currentUser } = useApp();

  const userScreenings = screenings.filter((s) => s.userId === currentUser?.id);
  const userLogs = sicringLogs.filter((l) => l.userId === currentUser?.id);

  const completedSessions = userLogs.filter((l) => l.isCompleted).length;
  const totalMinutes = Math.round(
    userLogs.reduce((acc, curr) => acc + curr.durationSecondsPlayed, 0) / 60
  );

  return (
    <div className="space-y-5 pb-8">
      {/* Top Header Card */}
      <div className="bg-white border border-sky-100 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
              Catatan Kemajuan
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-2">Riwayat & Perkembangan</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {currentUser?.responderCode || 'MNT-001'}
          </span>
        </div>

        {/* Aggregate KPI */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-sky-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Sesi SICRING</span>
            </div>
            <div className="text-xl font-black text-sky-950 mt-1">{completedSessions} Selesai</div>
            <span className="text-[10px] text-slate-400">Total {totalMinutes} menit aktif</span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Cek Kabar EPDS</span>
            </div>
            <div className="text-xl font-black text-emerald-950 mt-1">{userScreenings.length} Kali</div>
            <span className="text-[10px] text-slate-400">Terjadwal & rutin</span>
          </div>
        </div>
      </div>

      {/* EPDS Screening History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            Riwayat Cek Kabar (EPDS)
          </h3>
          <button
            onClick={onStartScreening}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
          >
            + Skrining Baru
          </button>
        </div>

        {userScreenings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
            Belum ada data cek kabar. Yuk mulai cek kabar pertama Ibu hari ini!
          </div>
        ) : (
          <div className="space-y-2.5">
            {userScreenings.map((scr) => {
              const formattedDate = new Date(scr.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={scr.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-2xs hover:border-sky-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        scr.category === 'rendah'
                          ? 'bg-emerald-100 text-emerald-700'
                          : scr.category === 'waspada'
                          ? 'bg-sky-100 text-sky-700'
                          : scr.category === 'tinggi'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {scr.totalScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs capitalize">
                          Kondisi {scr.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {scr.waveType}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{formattedDate}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      scr.category === 'rendah'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : scr.category === 'waspada'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : scr.category === 'tinggi'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {scr.category === 'rendah'
                      ? 'Emosi Stabil'
                      : scr.category === 'waspada'
                      ? 'Butuh Relaksasi'
                      : scr.category === 'tinggi'
                      ? 'Dukungan Bidan'
                      : 'Prioritas'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SICRING Session History */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Aktivitas Latihan SICRING
        </h3>

        {userLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
            Belum ada sesi latihan tersimpan. Mulai latihan mandiri di tab Latihan.
          </div>
        ) : (
          <div className="space-y-2.5">
            {userLogs.slice(0, 5).map((log) => {
              const formattedDate = new Date(log.timestamp).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
              });

              return (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      {Math.round(log.durationSecondsPlayed / 60)}m
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{log.moduleTitle}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {formattedDate} &bull; Mood:{' '}
                        {log.postMood === 'lebih_tenang'
                          ? 'Lebih Tenang 😊'
                          : log.postMood === 'lebih_berat'
                          ? 'Lebih Berat 😔'
                          : 'Sama Saja 😐'}
                      </div>
                    </div>
                  </div>

                  {log.isCompleted ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Tuntas
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Sebagian
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

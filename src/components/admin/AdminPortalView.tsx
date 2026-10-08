import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  Clock,
  Lock,
  KeyRound,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AdminPortalViewProps {
  activeSubTab?: 'pengguna' | 'audit';
  onSubTabChange?: (tab: 'pengguna' | 'audit') => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  activeSubTab: externalSubTab,
  onSubTabChange,
}) => {
  const { users, auditLogs, tpmbList, updateUserRole } = useApp();

  const [internalSubTab, setInternalSubTab] = useState<'pengguna' | 'audit'>('pengguna');
  const activeTab = externalSubTab || internalSubTab;

  const setActiveTab = (tab: 'pengguna' | 'audit') => {
    setInternalSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  // State for user management filter & search
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('semua');
  const [roleChangeSuccessToast, setRoleChangeSuccessToast] = useState<string | null>(null);

  // State for audit log search & category filter
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState<string>('semua');

  // Role badge helper
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ibu':
        return {
          label: 'Ibu Perinatal',
          className: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      case 'bidan':
        return {
          label: 'Bidan TPMB',
          className: 'bg-sky-100 text-sky-800 border-sky-200',
        };
      case 'ahli_materi':
        return {
          label: 'Ahli Materi SICRING',
          className: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'peneliti':
        return {
          label: 'Peneliti Riset',
          className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        };
      case 'admin':
        return {
          label: 'Administrator Sistem',
          className: 'bg-slate-800 text-white border-slate-700',
        };
      default:
        return {
          label: role,
          className: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.phone.includes(userSearchQuery) ||
      (u.responderCode && u.responderCode.toLowerCase().includes(userSearchQuery.toLowerCase()));
    const matchesRole = filterRole === 'semua' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Filtered audit logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchQuery.toLowerCase());
    const matchesAction =
      auditActionFilter === 'semua' ||
      log.action.toLowerCase().includes(auditActionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  const handleRoleChange = (userId: string, newRole: UserRole, userName: string) => {
    updateUserRole(userId, newRole);
    setRoleChangeSuccessToast(`Hak akses untuk ${userName} berhasil diubah menjadi ${newRole.toUpperCase()}`);
    setTimeout(() => setRoleChangeSuccessToast(null), 3000);
  };

  // Stats calculation
  const totalIbu = users.filter((u) => u.role === 'ibu').length;
  const totalBidan = users.filter((u) => u.role === 'bidan').length;
  const totalAhli = users.filter((u) => u.role === 'ahli_materi').length;
  const totalPeneliti = users.filter((u) => u.role === 'peneliti').length;
  const totalAdmin = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('pengguna')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'pengguna'
              ? 'bg-slate-800 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Pengguna &amp; Hak Akses ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'audit'
              ? 'bg-slate-800 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Log Audit &amp; Keamanan Sistem ({auditLogs.length})</span>
        </button>
      </div>

      {/* Role Change Toast */}
      {roleChangeSuccessToast && (
        <div className="bg-emerald-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{roleChangeSuccessToast}</span>
        </div>
      )}

      {/* TAB 1: KELOLA PENGGUNA & HAK AKSES */}
      {activeTab === 'pengguna' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Hak Akses Khusus: Administrator Sistem
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                Manajemen Pengguna &amp; Tata Kelola Hak Akses (RBAC)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Kelola akun pengguna, lakukan promosi/mutasi hak akses (Role-Based Access Control)
                antara Bidan, Ahli Materi SICRING, Peneliti Riset, dan Administrator.
              </p>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0">
              <span className="text-xs text-slate-300 block">Total Pengguna Terdaftar</span>
              <span className="text-2xl font-black text-white">{users.length} Akun</span>
            </div>
          </div>

          {/* Role Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ibu Perinatal</span>
              <span className="text-lg font-black text-rose-600">{totalIbu}</span>
              <span className="text-[10px] text-slate-400 block">Pengguna Aplikasi</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Bidan TPMB</span>
              <span className="text-lg font-black text-sky-700">{totalBidan}</span>
              <span className="text-[10px] text-slate-400 block">Triase &amp; Klinis</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ahli Materi</span>
              <span className="text-lg font-black text-purple-700">{totalAhli}</span>
              <span className="text-[10px] text-slate-400 block">Kurasi SICRING</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Peneliti</span>
              <span className="text-lg font-black text-indigo-700">{totalPeneliti}</span>
              <span className="text-[10px] text-slate-400 block">Riset &amp; Ambang</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Administrator</span>
              <span className="text-lg font-black text-slate-900">{totalAdmin}</span>
              <span className="text-[10px] text-slate-400 block">Tata Kelola &amp; Audit</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama pengguna, nomor HP, atau kode responden..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-slate-800"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="semua">Semua Peran / Role</option>
              <option value="ibu">Ibu Perinatal</option>
              <option value="bidan">Bidan TPMB</option>
              <option value="ahli_materi">Ahli Materi SICRING</option>
              <option value="peneliti">Peneliti Riset</option>
              <option value="admin">Administrator Sistem</option>
            </select>
          </div>

          {/* User Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Nama &amp; Identitas Pengguna</th>
                    <th className="p-3.5">Kontak &amp; TPMB</th>
                    <th className="p-3.5">Peran Aktif</th>
                    <th className="p-3.5">Ubah Hak Akses / Peran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const badge = getRoleBadge(u.role);
                    const tpmb = tpmbList.find((t) => t.id === u.tpmbId);

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs overflow-hidden">
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                u.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                ID: {u.id} {u.responderCode ? `• ${u.responderCode}` : ''}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-medium text-slate-800">{u.phone}</div>
                          <div className="text-[11px] text-slate-400">
                            {tpmb?.name || 'TPMB Induk'}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value as UserRole, u.name)
                            }
                            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-slate-800 cursor-pointer"
                          >
                            <option value="bidan">Bidan TPMB</option>
                            <option value="ahli_materi">Ahli Materi SICRING</option>
                            <option value="peneliti">Peneliti Riset</option>
                            <option value="admin">Administrator Sistem</option>
                            <option value="ibu">Ibu Perinatal</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOG AUDIT SISTEM */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Audit Log Keamanan &amp; Jejak Akses Sistem
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan rekam jejak digital pembukaan data rekam medis, ekspor data riset,
                perubahan hak akses, dan modifikasi konten SICRING (BR-07 &amp; BR-11).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                Total: {filteredAuditLogs.length} Catatan
              </span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari aktor, kata kunci tindakan, atau detail..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <select
              value={auditActionFilter}
              onChange={(e) => setAuditActionFilter(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="semua">Semua Kategori Peristiwa</option>
              <option value="Skrining">Skrining EPDS</option>
              <option value="Kasus">Triase &amp; Kasus Klinis</option>
              <option value="Export">Ekspor Data Riset</option>
              <option value="SICRING">Konten &amp; Panduan SICRING</option>
              <option value="Role">Perubahan Role / Hak Akses</option>
              <option value="Ambang">Konfigurasi Ambang EPDS</option>
              <option value="Pendampingan">Jadwal Pendampingan</option>
            </select>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Waktu (WIB)</th>
                  <th className="p-3">Aktor &amp; Peran</th>
                  <th className="p-3">Tindakan</th>
                  <th className="p-3">Rincian Peristiwa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">
                      {log.actorName}
                      <span className="block text-[10px] text-sky-700 uppercase font-bold">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-800">{log.action}</td>
                    <td className="p-3 text-slate-600 max-w-md">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

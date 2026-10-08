import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  Headphones,
  FileText,
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Clock,
  User,
  Check,
  Eye,
  Layers,
  Volume2,
  ShieldAlert,
  Heart,
  Music,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SicringComponentKey } from '../../types';
import {
  DEFAULT_SICRING_TEXT_GUIDES,
  SICRING_DETAILED_GUIDES,
  SicringDetailedGuide,
} from '../../data/sicringGuides';

export const AhliMateriSicringView: React.FC = () => {
  const {
    sicringDetailedGuides,
    sicringTextGuides,
    updateSicringDetailedGuide,
    updateSicringTextGuide,
    resetSicringGuideToDefault,
  } = useApp();

  const [selectedModuleId, setSelectedModuleId] = useState<SicringComponentKey>('olah_tubuh');
  const [contentTypeTab, setContentTypeTab] = useState<'teks' | 'video' | 'audio' | 'preview'>('teks');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isResetToast, setIsResetToast] = useState(false);

  // Local editable draft for detailed guide
  const [currentGuideDraft, setCurrentGuideDraft] = useState<SicringDetailedGuide>(() => {
    return (
      sicringDetailedGuides[selectedModuleId] ||
      JSON.parse(JSON.stringify(SICRING_DETAILED_GUIDES[selectedModuleId]))
    );
  });

  // Local editable text for quick text guide
  const [rawTextGuide, setRawTextGuide] = useState<string>('');

  // Sync draft when selected module or external context changes
  useEffect(() => {
    const guide =
      sicringDetailedGuides[selectedModuleId] ||
      JSON.parse(JSON.stringify(SICRING_DETAILED_GUIDES[selectedModuleId]));
    setCurrentGuideDraft(JSON.parse(JSON.stringify(guide)));

    const textGuide =
      sicringTextGuides[selectedModuleId] ||
      DEFAULT_SICRING_TEXT_GUIDES[selectedModuleId] ||
      '';
    setRawTextGuide(textGuide);
  }, [selectedModuleId, sicringDetailedGuides, sicringTextGuides]);

  // Handle saving all current changes
  const handleSaveAll = () => {
    updateSicringDetailedGuide(selectedModuleId, currentGuideDraft);
    if (rawTextGuide) {
      updateSicringTextGuide(selectedModuleId, rawTextGuide);
    }
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  // Handle reset to default
  const handleResetToDefault = () => {
    if (
      window.confirm(
        `Kembalikan modul ${selectedModuleId.toUpperCase().replace('_', ' ')} ke protokol standar bawaan ahli?`
      )
    ) {
      resetSicringGuideToDefault(selectedModuleId);
      const defaultGuide = JSON.parse(JSON.stringify(SICRING_DETAILED_GUIDES[selectedModuleId]));
      setCurrentGuideDraft(defaultGuide);
      setRawTextGuide(DEFAULT_SICRING_TEXT_GUIDES[selectedModuleId]);
      setIsResetToast(true);
      setTimeout(() => setIsResetToast(false), 2500);
    }
  };

  // Video Chapter helpers
  const handleAddVideoChapter = () => {
    setCurrentGuideDraft((prev) => ({
      ...prev,
      video: {
        ...prev.video,
        chapters: [
          ...prev.video.chapters,
          {
            time: '00:00',
            seconds: 0,
            title: 'Babak Baru',
            detail: 'Tuliskan deskripsi gerakan atau petunjuk visual di sini.',
          },
        ],
      },
    }));
  };

  const handleRemoveVideoChapter = (index: number) => {
    setCurrentGuideDraft((prev) => ({
      ...prev,
      video: {
        ...prev.video,
        chapters: prev.video.chapters.filter((_, i) => i !== index),
      },
    }));
  };

  // Audio Script Lines helpers
  const handleAddAudioScript = () => {
    setCurrentGuideDraft((prev) => ({
      ...prev,
      audio: {
        ...prev.audio,
        scriptLines: [
          ...prev.audio.scriptLines,
          {
            time: '00:00',
            text: 'Tuliskan baris narasi panduan hening atau doa penenang di sini.',
          },
        ],
      },
    }));
  };

  const handleRemoveAudioScript = (index: number) => {
    setCurrentGuideDraft((prev) => ({
      ...prev,
      audio: {
        ...prev.audio,
        scriptLines: prev.audio.scriptLines.filter((_, i) => i !== index),
      },
    }));
  };

  // Visual Tips helpers
  const handleAddVisualTip = () => {
    setCurrentGuideDraft((prev) => ({
      ...prev,
      video: {
        ...prev.video,
        keyVisualTips: [
          ...prev.video.keyVisualTips,
          'Tips visual klinis baru untuk instruktur atau ibu.',
        ],
      },
    }));
  };

  const handleRemoveVisualTip = (index: number) => {
    setCurrentGuideDraft((prev) => ({
      ...prev,
      video: {
        ...prev.video,
        keyVisualTips: prev.video.keyVisualTips.filter((_, i) => i !== index),
      },
    }));
  };

  const modulesList = [
    { id: 'olah_tubuh' as const, num: 1, label: 'Olah Tubuh Sadar', icon: '🧘‍♀️' },
    { id: 'charging' as const, num: 2, label: 'Charging Ruhani', icon: '✨' },
    { id: 'healing_touch' as const, num: 3, label: 'Healing Touch', icon: '🤲' },
    { id: 'blessing_water' as const, num: 4, label: 'Blessing Water', icon: '💧' },
    { id: 'pendampingan' as const, num: 5, label: 'Pendampingan Bidan', icon: '🩺' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-500/40 text-purple-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-300/30">
              Hak Akses Eksklusif: Ahli Materi SICRING
            </span>
            <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Sistem Penulis Konten
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Studio Penyusunan &amp; Kurasi Panduan SICRING
          </h2>
          <p className="text-xs text-purple-100 mt-1 max-w-2xl leading-relaxed">
            Anda memiliki wewenang penuh untuk menyusun materi intervensi psikospiritual 5 modul
            SICRING: kurasi panduan video, narasi audio berkesadaran, serta protokol teks klinis
            yang langsung disajikan kepada ibu.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="bg-purple-900/60 hover:bg-purple-900 text-purple-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-purple-400/30 flex items-center gap-1.5 transition-colors"
            title="Kembalikan modul terpilih ke protokol baku"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baku</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="bg-white hover:bg-purple-50 text-purple-900 text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4 text-purple-700" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      {isSavedToast && (
        <div className="bg-emerald-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Perubahan konten panduan SICRING berhasil disimpan dan diperbarui di aplikasi Ibu!</span>
        </div>
      )}
      {isResetToast && (
        <div className="bg-amber-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md animate-in fade-in">
          <RotateCcw className="w-4 h-4" />
          <span>Modul berhasil direset ke konfigurasi protokol standar awal.</span>
        </div>
      )}

      {/* Module Selector Buttons */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Pilih Modul Intervensi SICRING:
          </span>
          <span className="text-[11px] text-purple-700 font-semibold">
            Modul Aktif: {currentGuideDraft.number}. {currentGuideDraft.title}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {modulesList.map((m) => {
            const isSelected = selectedModuleId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModuleId(m.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 text-purple-950 font-bold shadow-2xs ring-2 ring-purple-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span className="text-base">{m.icon}</span>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block font-medium">Modul {m.num}</span>
                  <span className="text-xs truncate block">{m.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Mode Tabs (Video, Audio, Teks, Live Preview) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setContentTypeTab('teks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            contentTypeTab === 'teks'
              ? 'bg-purple-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Panduan Teks &amp; Doa</span>
        </button>

        <button
          type="button"
          onClick={() => setContentTypeTab('video')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            contentTypeTab === 'video'
              ? 'bg-purple-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Konten Video ({currentGuideDraft.video.chapters.length} Babak)</span>
        </button>

        <button
          type="button"
          onClick={() => setContentTypeTab('audio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            contentTypeTab === 'audio'
              ? 'bg-purple-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Konten Audio ({currentGuideDraft.audio.scriptLines.length} Naskah)</span>
        </button>

        <button
          type="button"
          onClick={() => setContentTypeTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            contentTypeTab === 'preview'
              ? 'bg-purple-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Pratinjau Interaktif Ibu</span>
        </button>
      </div>

      {/* TAB 1: PANDUAN TEKS & DOA */}
      {contentTypeTab === 'teks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Raw Textarea */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Editor Panduan Teks Lengkap
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Teks panduan komprehensif yang langsung dibaca oleh Ibu pada tab panduan tertulis.
                </p>
              </div>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                Format Teks Terstruktur
              </span>
            </div>

            <textarea
              rows={18}
              value={rawTextGuide}
              onChange={(e) => setRawTextGuide(e.target.value)}
              className="w-full text-xs sm:text-sm p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-purple-500 focus:bg-white focus:outline-hidden font-mono leading-relaxed"
              placeholder="Tuliskan teks panduan di sini..."
            />

            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>{rawTextGuide.length} karakter</span>
              <button
                type="button"
                onClick={() => setRawTextGuide(DEFAULT_SICRING_TEXT_GUIDES[selectedModuleId])}
                className="text-purple-600 hover:text-purple-800 underline font-medium"
              >
                Muat Teks Baku Bawaan
              </button>
            </div>
          </div>

          {/* Structured Text Fields (Doa, Manfaat, Keselamatan) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">
                Parameter Spiritual &amp; Asuhan Keselamatan
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Konfigurasi doa afirmasi, ringkasan manfaat klinis, dan instruksi keselamatan.
              </p>
            </div>

            {/* Doa / Afirmasi */}
            <div className="space-y-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Doa Afirmasi &amp; Ketenangan Jiwa:</span>
              </label>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Judul Doa/Afirmasi:</span>
                <input
                  type="text"
                  value={currentGuideDraft.text.affirmationDoa?.title || ''}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      text: {
                        ...prev.text,
                        affirmationDoa: {
                          ...prev.text.affirmationDoa,
                          title: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Teks Lafal / Doa:</span>
                <input
                  type="text"
                  value={currentGuideDraft.text.affirmationDoa?.arabicOrFormula || ''}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      text: {
                        ...prev.text,
                        affirmationDoa: {
                          ...prev.text.affirmationDoa,
                          arabicOrFormula: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full text-sm p-2 rounded-xl border border-slate-200 bg-white font-semibold text-purple-950"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Arti &amp; Makna Batin:</span>
                <textarea
                  rows={2}
                  value={currentGuideDraft.text.affirmationDoa?.meaning || ''}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      text: {
                        ...prev.text,
                        affirmationDoa: {
                          ...prev.text.affirmationDoa,
                          meaning: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Subtitle / Ringkasan Singkat */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Sub-judul Modul:
              </label>
              <input
                type="text"
                value={currentGuideDraft.subtitle}
                onChange={(e) =>
                  setCurrentGuideDraft((prev) => ({
                    ...prev,
                    subtitle: e.target.value,
                  }))
                }
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            {/* Ringkasan Ringkas */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ringkasan Klinis &amp; Fisiologis:
              </label>
              <textarea
                rows={4}
                value={currentGuideDraft.text.summary}
                onChange={(e) =>
                  setCurrentGuideDraft((prev) => ({
                    ...prev,
                    text: {
                      ...prev.text,
                      summary: e.target.value,
                    },
                  }))
                }
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KONTEN VIDEO */}
      {contentTypeTab === 'video' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>Metadata &amp; Instruksi Video Demonstrasi</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Kelola judul video, profil narasumber peraga, durasi, dan tips visual untuk Ibu.
                </p>
              </div>
              <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">
                Video Guide Authoring
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Judul Video Tutorial:
                </label>
                <input
                  type="text"
                  value={currentGuideDraft.video.title}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      video: { ...prev.video, title: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Durasi Video (MM:SS):
                </label>
                <input
                  type="text"
                  value={currentGuideDraft.video.duration}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      video: { ...prev.video, duration: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Instruktur / Peraga:
                </label>
                <input
                  type="text"
                  value={currentGuideDraft.video.instructor}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      video: { ...prev.video, instructor: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Peran / Keahlian Instruktur:
                </label>
                <input
                  type="text"
                  value={currentGuideDraft.video.role}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      video: { ...prev.video, role: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Deskripsi Visual / Panduan Gerakan:
                </label>
                <textarea
                  rows={2}
                  value={currentGuideDraft.video.description}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      video: { ...prev.video, description: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Chapters / Babak Video Management */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Daftar Babak (Chapters) Video</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ibu dapat melompat ke bagian gerakan tertentu menggunakan babak penunjuk waktu ini.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddVideoChapter}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Babak</span>
              </button>
            </div>

            <div className="space-y-3">
              {currentGuideDraft.video.chapters.map((ch, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={ch.time}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentGuideDraft((prev) => ({
                          ...prev,
                          video: {
                            ...prev.video,
                            chapters: prev.video.chapters.map((c, i) =>
                              i === idx ? { ...c, time: val } : c
                            ),
                          },
                        }));
                      }}
                      className="w-20 font-mono font-bold text-xs p-1.5 rounded-lg border border-slate-200 bg-white text-center"
                      placeholder="00:00"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-1.5">
                    <input
                      type="text"
                      value={ch.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentGuideDraft((prev) => ({
                          ...prev,
                          video: {
                            ...prev.video,
                            chapters: prev.video.chapters.map((c, i) =>
                              i === idx ? { ...c, title: val } : c
                            ),
                          },
                        }));
                      }}
                      className="w-full font-bold text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                      placeholder="Judul Babak Gerakan"
                    />
                    <input
                      type="text"
                      value={ch.detail}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentGuideDraft((prev) => ({
                          ...prev,
                          video: {
                            ...prev.video,
                            chapters: prev.video.chapters.map((c, i) =>
                              i === idx ? { ...c, detail: val } : c
                            ),
                          },
                        }));
                      }}
                      className="w-full text-[11px] p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600"
                      placeholder="Petunjuk detail gerakan"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveVideoChapter(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg shrink-0 transition-colors"
                    title="Hapus babak"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Key Visual Tips */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Tips Visual Klinis</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Poin panduan keselamatan posisi yang ditampilkan di bawah pemutar video.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVisualTip}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs px-3 py-1 rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tips</span>
              </button>
            </div>

            <div className="space-y-2">
              {currentGuideDraft.video.keyVisualTips?.map((tip, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentGuideDraft((prev) => ({
                        ...prev,
                        video: {
                          ...prev.video,
                          keyVisualTips: prev.video.keyVisualTips.map((t, i) =>
                            i === idx ? val : t
                          ),
                        },
                      }));
                    }}
                    className="flex-1 text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVisualTip(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KONTEN AUDIO */}
      {contentTypeTab === 'audio' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-purple-600" />
                  <span>Metadata Audio Bimbingan Relaksasi</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Atur soundscape latar, frekuensi getaran penenang (Hz), durasi, dan nama narator.
                </p>
              </div>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                Audio Waveform Config
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Judul Audio Sesi:
                </label>
                <input
                  type="text"
                  value={currentGuideDraft.audio.title}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      audio: { ...prev.audio, title: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Narator / Pembimbing:
                </label>
                <input
                  type="text"
                  value={currentGuideDraft.audio.narrator}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      audio: { ...prev.audio, narrator: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Latar Suara Relaksasi (Soundscape):
                </label>
                <input
                  type="text"
                  value={currentGuideDraft.audio.bgSound}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      audio: { ...prev.audio, bgSound: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  placeholder="Contoh: Debur ombak pantai & nada akustik lembut"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Frekuensi Terapi (Hz):
                </label>
                <input
                  type="text"
                  value={currentGuideDraft.audio.frequency}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      audio: { ...prev.audio, frequency: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-medium text-purple-900"
                  placeholder="Contoh: 432 Hz Solfeggio Relaxation"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Deskripsi Overview Audio:
                </label>
                <textarea
                  rows={2}
                  value={currentGuideDraft.audio.overview}
                  onChange={(e) =>
                    setCurrentGuideDraft((prev) => ({
                      ...prev,
                      audio: { ...prev.audio, overview: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Script Lines / Narasi Bertahap */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-600" />
                  <span>Naskah Narasi Batin (Script Lines Terpandu)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Transkrip panduan hening yang bergulir sinkron saat Ibu mendengarkan audio relaksasi.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAudioScript}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris Narasi</span>
              </button>
            </div>

            <div className="space-y-3">
              {currentGuideDraft.audio.scriptLines.map((line, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-purple-50/40 rounded-2xl border border-purple-100 flex items-start gap-3"
                >
                  <input
                    type="text"
                    value={line.time}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentGuideDraft((prev) => ({
                        ...prev,
                        audio: {
                          ...prev.audio,
                          scriptLines: prev.audio.scriptLines.map((s, i) =>
                            i === idx ? { ...s, time: val } : s
                          ),
                        },
                      }));
                    }}
                    className="w-18 font-mono font-bold text-xs p-2 rounded-xl border border-purple-200 bg-white text-center text-purple-900 shrink-0"
                    placeholder="00:00"
                  />

                  <textarea
                    rows={2}
                    value={line.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentGuideDraft((prev) => ({
                        ...prev,
                        audio: {
                          ...prev.audio,
                          scriptLines: prev.audio.scriptLines.map((s, i) =>
                            i === idx ? { ...s, text: val } : s
                          ),
                        },
                      }));
                    }}
                    className="flex-1 text-xs p-2 rounded-xl border border-purple-200 bg-white leading-relaxed"
                    placeholder="Kalimat bimbingan hening atau doa..."
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveAudioScript(idx)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg shrink-0 transition-colors"
                    title="Hapus baris narasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRATINJAU INTERAKTIF APLIKASI IBU */}
      {contentTypeTab === 'preview' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                Simulasi Real-Time
              </span>
              <h4 className="font-bold text-slate-900 text-base mt-1">
                Pratinjau Modul di Aplikasi Ibu: {currentGuideDraft.title}
              </h4>
              <p className="text-xs text-slate-500">
                Tampilan interaktif ini merefleksikan tepat apa yang dinikmati oleh Ibu saat membuka modul SICRING.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveAll}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan &amp; Terapkan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Video & Audio mockup */}
            <div className="space-y-4">
              {/* Video Mockup Card */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-slate-900 text-white p-4 relative min-h-[160px] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-purple-600 px-2 py-0.5 rounded-md">
                      VIDEO DEMO ({currentGuideDraft.video.duration})
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      {currentGuideDraft.video.instructor}
                    </span>
                  </div>

                  <div className="text-center my-2">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto ring-4 ring-white/30 cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-white border-b-8 border-b-transparent ml-1" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 font-medium truncate">
                    {currentGuideDraft.video.title}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Babak Gerakan ({currentGuideDraft.video.chapters.length} Babak):
                  </span>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {currentGuideDraft.video.chapters.map((ch, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded-lg border border-slate-200/70">
                        <span className="font-semibold text-slate-800 truncate">{ch.title}</span>
                        <span className="font-mono text-purple-700 font-bold shrink-0">{ch.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audio Mockup Card */}
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">{currentGuideDraft.audio.title}</h5>
                      <span className="text-[10px] text-purple-700 font-medium">
                        {currentGuideDraft.audio.frequency} &bull; {currentGuideDraft.audio.bgSound}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-600">{currentGuideDraft.audio.duration}</span>
                </div>

                {/* Animated Waveform Simulation */}
                <div className="flex items-center justify-center gap-1 py-1">
                  {[40, 70, 30, 90, 60, 100, 45, 80, 50, 75, 35, 85, 60, 95, 40].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h * 0.28}px` }}
                      className="w-1.5 bg-purple-500 rounded-full"
                    />
                  ))}
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-purple-100 text-xs text-slate-700 italic">
                  "{currentGuideDraft.audio.scriptLines[0]?.text || 'Bismillah... Pejamkan mata Ibu dengan lembut...'}"
                </div>
              </div>
            </div>

            {/* Right: Text Guide Mockup */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-[460px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Protokol Tertulis Lengkap</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                  Terpublikasi
                </span>
              </div>

              {/* Doa Callout */}
              {currentGuideDraft.text.affirmationDoa?.title && (
                <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-purple-700 uppercase block">
                    {currentGuideDraft.text.affirmationDoa.title}
                  </span>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed font-arabic">
                    {currentGuideDraft.text.affirmationDoa.arabicOrFormula}
                  </p>
                  <p className="text-[11px] text-slate-600 italic">
                    {currentGuideDraft.text.affirmationDoa.meaning}
                  </p>
                </div>
              )}

              {/* Formatted Guide Body */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                {rawTextGuide}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

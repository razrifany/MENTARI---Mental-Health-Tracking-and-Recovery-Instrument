import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Clock,
  User,
  CheckCircle2,
  Save,
  RotateCcw,
  X,
  Check,
  Tag,
  Calendar,
  Sparkles,
  FileText,
  AlertCircle,
  HelpCircle,
  Share2,
  Bookmark,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EducationalArticle } from '../../types';

interface AhliMateriArticlesViewProps {
  onSwitchToSicring?: () => void;
}

export const AhliMateriArticlesView: React.FC<AhliMateriArticlesViewProps> = ({
  onSwitchToSicring,
}) => {
  const { articles, addArticle, updateArticle, deleteArticle, resetArticlesToDefault, currentUser } =
    useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('semua');

  // Modal states
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [previewArticle, setPreviewArticle] = useState<EducationalArticle | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<EducationalArticle['category']>('kehamilan');
  const [formReadTime, setFormReadTime] = useState('4 menit');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formReviewedBy, setFormReviewedBy] = useState(() => currentUser?.name || 'Tim Ahli Materi SICRING & Psikologi Perinatal');
  const [formPublishedDate, setFormPublishedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formTags, setFormTags] = useState('Perinatal, Edukasi, Mental');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = selectedCategory === 'semua' || art.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'semua' ||
        (selectedStatus === 'published' && (art.status === 'published' || !art.status)) ||
        (selectedStatus === 'draft' && art.status === 'draft');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, searchQuery, selectedCategory, selectedStatus]);

  // Stats
  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter((a) => a.status === 'published' || !a.status).length;
    const draft = articles.filter((a) => a.status === 'draft').length;
    return { total, published, draft };
  }, [articles]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreateModal = () => {
    setEditingArticleId(null);
    setFormTitle('');
    setFormCategory('kehamilan');
    setFormReadTime('3-4 menit');
    setFormSummary('');
    setFormContent('');
    setFormReviewedBy(currentUser?.name || 'Tim Ahli Materi SICRING & Psikologi Perinatal');
    setFormPublishedDate(new Date().toISOString().split('T')[0]);
    setFormTags('KesehatanMental, Ibu, Panduan');
    setFormStatus('published');
    setIsEditorModalOpen(true);
  };

  const handleOpenEditModal = (article: EducationalArticle) => {
    setEditingArticleId(article.id);
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormReadTime(article.readTime);
    setFormSummary(article.summary);
    setFormContent(article.content);
    setFormReviewedBy(article.reviewedBy);
    setFormPublishedDate(article.publishedDate);
    setFormTags(article.tags ? article.tags.join(', ') : '');
    setFormStatus(article.status || 'published');
    setIsEditorModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim() || !formContent.trim()) {
      alert('Mohon lengkapi judul, ringkasan, dan isi konten materi.');
      return;
    }

    const tagArray = formTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (editingArticleId) {
      updateArticle(editingArticleId, {
        title: formTitle.trim(),
        category: formCategory,
        readTime: formReadTime.trim(),
        summary: formSummary.trim(),
        content: formContent.trim(),
        reviewedBy: formReviewedBy.trim(),
        publishedDate: formPublishedDate,
        tags: tagArray,
        status: formStatus,
      });
      showToast(`Materi "${formTitle}" berhasil diperbarui!`);
    } else {
      addArticle({
        title: formTitle.trim(),
        category: formCategory,
        readTime: formReadTime.trim(),
        summary: formSummary.trim(),
        content: formContent.trim(),
        reviewedBy: formReviewedBy.trim(),
        publishedDate: formPublishedDate,
        tags: tagArray,
        status: formStatus,
      });
      showToast(`Materi baru "${formTitle}" berhasil diterbitkan untuk ibu!`);
    }

    setIsEditorModalOpen(false);
  };

  const handleDeleteArticle = (id: string, title: string) => {
    if (window.confirm(`Yakin ingin menghapus materi edukasi "${title}"?`)) {
      deleteArticle(id);
      showToast(`Materi "${title}" berhasil dihapus.`);
    }
  };

  const handleResetToStandard = () => {
    if (
      window.confirm(
        'Kembalikan seluruh materi edukasi kesehatan mental ke kurikulum standar baku awal MENTARI?'
      )
    ) {
      resetArticlesToDefault();
      showToast('Seluruh materi berhasil dikembalikan ke kurikulum standar.');
    }
  };

  const getCategoryBadge = (cat: EducationalArticle['category']) => {
    switch (cat) {
      case 'kehamilan':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'nifas':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'psikologis':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'keluarga':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'relaksasi':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Sub-Tab Switcher for Ahli Materi */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {onSwitchToSicring && (
          <button
            type="button"
            onClick={onSwitchToSicring}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Panduan Intervensi SICRING (5 Modul)</span>
          </button>
        )}

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-xs cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Materi Edukasi Kesehatan Mental ({articles.length})</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-sky-800 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
              ✍️ Studio Manajemen Konten Edukasi
            </span>
            <span className="bg-purple-400/30 text-purple-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Kesehatan Jiwa Perinatal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Penyusunan Materi &amp; Artikel Kesehatan Mental
          </h2>
          <p className="text-xs text-purple-100 mt-1 max-w-2xl leading-relaxed">
            Kelola artikel edukasi, modul psikoedukasi, dan panduan pencegahan baby blues/PPD.
            Setiap materi yang Anda publikasikan dapat langsung diakses dan dibaca oleh ibu terdaftar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToStandard}
            className="bg-white/10 hover:bg-white/20 text-purple-100 text-xs font-semibold px-3 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset ke daftar materi kurikulum baku"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baku</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="bg-white hover:bg-purple-50 text-purple-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-purple-700" />
            <span>+ Tulis Materi Baru</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-2xl flex items-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Materi
            </span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.total}
            </span>
            <span className="text-xs text-slate-500 ml-1">Artikel</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Tersedia dalam kurikulum</p>
        </div>

        <div className="bg-white border border-emerald-100 rounded-3xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Diterbitkan
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              {stats.published}
            </span>
            <span className="text-xs text-emerald-600 ml-1">Aktif</span>
          </div>
          <p className="text-[10px] text-emerald-600/80 mt-2">Dapat dibaca oleh ibu</p>
        </div>

        <div className="bg-white border border-amber-100 rounded-3xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Draf Ahli
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">
              {stats.draft}
            </span>
            <span className="text-xs text-amber-600 ml-1">Draf</span>
          </div>
          <p className="text-[10px] text-amber-600/80 mt-2">Sedang disusun</p>
        </div>

        <div className="bg-white border border-indigo-100 rounded-3xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              Kategori Terpadu
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-700">5</span>
            <span className="text-xs text-indigo-600 ml-1">Topik</span>
          </div>
          <p className="text-[10px] text-indigo-600/80 mt-2">Hamil, Nifas, Jiwa, Keluarga, Relaks</p>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari judul materi, kata kunci topik (#BabyBlues, kecemasan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-500 font-medium"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="semua">Semua Kategori Materi</option>
            <option value="kehamilan">Masa Kehamilan</option>
            <option value="nifas">Masa Nifas &amp; Pascasalin</option>
            <option value="psikologis">Psikologis &amp; Regulasi Emosi</option>
            <option value="keluarga">Dukungan Keluarga &amp; Suami</option>
            <option value="relaksasi">Relaksasi &amp; Self-Care</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="semua">Semua Status</option>
            <option value="published">Diterbitkan (Published)</option>
            <option value="draft">Draf (Disimpan)</option>
          </select>
        </div>

        {/* List of Articles */}
        <div className="space-y-3 pt-2">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Tidak ada materi edukasi yang cocok.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Gunakan tombol "+ Tulis Materi Baru" untuk menyusun artikel pertama.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white border border-slate-200 hover:border-purple-300 rounded-2xl p-4.5 shadow-2xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getCategoryBadge(
                            art.category
                          )}`}
                        >
                          {art.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {art.readTime}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          art.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {art.status === 'draft' ? 'Draf' : 'Terbit'}
                      </span>
                    </div>

                    {/* Title & Summary */}
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>

                    {/* Tags */}
                    {art.tags && art.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {art.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Reviewer & Date */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[200px]" title={art.reviewedBy}>
                        Ditinjau: <strong>{art.reviewedBy}</strong>
                      </span>
                      <span>
                        {new Date(art.publishedDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setPreviewArticle(art)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Pratinjau Ibu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(art)}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Edit Materi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(art.id, art.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-auto cursor-pointer"
                      title="Hapus materi ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          MODAL: TULIS / EDIT MATERI EDUKASI
      ======================================================== */}
      {isEditorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingArticleId ? 'Edit Materi Edukasi Kesehatan Mental' : 'Tulis Materi Edukasi Baru'}
                </h3>
                <p className="text-xs text-purple-200">
                  Materi akan disajikan pada tab Edukasi aplikasi Ibu MENTARI
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorModalOpen(false)}
                className="p-1.5 text-purple-200 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-4">
              {/* Judul Artikel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Materi / Artikel *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Mengenal Baby Blues vs Depresi Pascapersalinan"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-600 font-bold"
                  required
                />
              </div>

              {/* Kategori & Waktu Baca */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Topik *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-hidden focus:border-purple-600"
                  >
                    <option value="kehamilan">Masa Kehamilan</option>
                    <option value="nifas">Masa Nifas &amp; Pascasalin</option>
                    <option value="psikologis">Psikologis &amp; Regulasi Emosi</option>
                    <option value="keluarga">Dukungan Keluarga &amp; Suami</option>
                    <option value="relaksasi">Relaksasi &amp; Self-Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimasi Waktu Baca
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 3 menit"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Ringkasan Singkat (Summary) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Singkat (Excerpt / Highlight) *
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan 2–3 kalimat yang muncul pada kartu artikel..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-600 leading-relaxed"
                  required
                />
              </div>

              {/* Isi Lengkap Artikel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Lengkap Konten Materi Edukasi *
                </label>
                <textarea
                  rows={8}
                  placeholder="Tuliskan isi materi lengkap. Gunakan baris baru antar paragraf, poin-poin penjelasan, atau panduan langkah demi langkah..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-600 leading-relaxed font-mono"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tips: Tuliskan dengan bahasa yang empatik, menenangkan, dan sertakan tips praktis yang dapat langsung diterapkan ibu di rumah.
                </p>
              </div>

              {/* Peninjau Ahli & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ditinjau Oleh / Ahli Materi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Bdn. Hj. Sri Wahyuni, S.ST, M.Keb"
                    value={formReviewedBy}
                    onChange={(e) => setFormReviewedBy(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Publikasi
                  </label>
                  <input
                    type="date"
                    value={formPublishedDate}
                    onChange={(e) => setFormPublishedDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Tag Kata Kunci & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kata Kunci / Tag (Pisahkan dengan Koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Nifas, BabyBlues, Relaksasi"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Materi
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-hidden focus:border-purple-600"
                  >
                    <option value="published">Diterbitkan (Tampil di Aplikasi Ibu)</option>
                    <option value="draft">Draf (Hanya Terlihat oleh Ahli Materi)</option>
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingArticleId ? 'Simpan Pembaruan' : 'Publikasikan Materi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: PRATINJAU TAMPILAN IBU (PREVIEW)
      ======================================================== */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  Pratinjau Tampilan Pasien / Ibu
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {previewArticle.readTime}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border inline-block ${getCategoryBadge(
                  previewArticle.category
                )}`}
              >
                {previewArticle.category}
              </span>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {previewArticle.title}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Ditinjau oleh: <strong>{previewArticle.reviewedBy}</strong></span>
                <span>&bull;</span>
                <span>{previewArticle.publishedDate}</span>
              </div>

              <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 text-xs text-purple-950 font-medium leading-relaxed italic">
                "{previewArticle.summary}"
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-2">
                {previewArticle.content}
              </div>

              {previewArticle.tags && previewArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {previewArticle.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

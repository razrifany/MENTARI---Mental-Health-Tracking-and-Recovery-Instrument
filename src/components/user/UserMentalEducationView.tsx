import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  User,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Sparkles,
  Heart,
  Share2,
  X,
  CheckCircle2,
  Activity,
  ChevronRight,
  ShieldCheck,
  Calendar,
  ThumbsUp,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EducationalArticle } from '../../types';

interface UserMentalEducationViewProps {
  onStartScreening: () => void;
  onGoToSicring: () => void;
  onDetailModeChange?: (isDetail: boolean) => void;
  isDetailActive?: boolean;
}

export const UserMentalEducationView: React.FC<UserMentalEducationViewProps> = ({
  onStartScreening,
  onGoToSicring,
  onDetailModeChange,
  isDetailActive,
}) => {
  const { articles, currentUser } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Bookmarked articles stored in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mentari_bookmarked_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Full Reading state
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  const prevIsDetailActiveRef = React.useRef(isDetailActive);

  // Sync activeArticle state with parent layout header & full page detail mode
  React.useEffect(() => {
    if (onDetailModeChange) {
      onDetailModeChange(!!activeArticle);
    }
  }, [activeArticle, onDetailModeChange]);

  React.useEffect(() => {
    if (prevIsDetailActiveRef.current === true && isDetailActive === false && activeArticle) {
      setActiveArticle(null);
    }
    prevIsDetailActiveRef.current = isDetailActive;
  }, [isDetailActive, activeArticle]);

  // Toggle bookmark
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('mentari_bookmarked_articles', JSON.stringify(updated));
      return updated;
    });
  };

  // Only show published articles to mother
  const publishedArticles = useMemo(() => {
    return articles.filter((a) => a.status === 'published' || !a.status);
  }, [articles]);

  // Filtered list
  const filteredArticles = useMemo(() => {
    return publishedArticles.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = selectedCategory === 'semua' || art.category === selectedCategory;
      const matchesBookmark = !onlyBookmarked || bookmarkedIds.includes(art.id);

      return matchesSearch && matchesCategory && matchesBookmark;
    });
  }, [publishedArticles, searchQuery, selectedCategory, onlyBookmarked, bookmarkedIds]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      semua: publishedArticles.length,
      kehamilan: 0,
      nifas: 0,
      psikologis: 0,
      keluarga: 0,
      relaksasi: 0,
    };
    publishedArticles.forEach((a) => {
      if (counts[a.category] !== undefined) {
        counts[a.category]++;
      }
    });
    return counts;
  }, [publishedArticles]);

  const getCategoryTheme = (cat: EducationalArticle['category']) => {
    switch (cat) {
      case 'kehamilan':
        return {
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
          label: 'Masa Kehamilan',
          icon: '🤰',
        };
      case 'nifas':
        return {
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
          label: 'Masa Nifas & Pascasalin',
          icon: '👶',
        };
      case 'psikologis':
        return {
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
          label: 'Psikologis & Emosi',
          icon: '🧠',
        };
      case 'keluarga':
        return {
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
          label: 'Dukungan Keluarga',
          icon: '👨‍👩‍👧',
        };
      case 'relaksasi':
        return {
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
          label: 'Relaksasi & Self-Care',
          icon: '🌸',
        };
      default:
        return {
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
          label: 'Kesehatan Mental',
          icon: '✨',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* ========================================================
          HERO BANNER - Clean Solid Sky Blue Card
      ======================================================== */}
      <div className="bg-sky-500 text-white rounded-3xl p-4.5 sm:p-5 shadow-sm shadow-sky-200/50 relative overflow-hidden space-y-3">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-xs">
              📚 Pojok Edukasi &amp; Psikoedukasi
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-bold leading-tight tracking-tight text-white">
            Ruang Belajar &amp; Ketenangan Jiwa Ibu
          </h1>

          <p className="text-xs text-sky-100 mt-1 leading-relaxed">
            Panduan praktis kesehatan perinatal, penanganan cemas, memahami baby blues, dan perawatan mandiri dari Bidan TPMB.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs">
            <button
              onClick={onStartScreening}
              className="bg-white hover:bg-sky-50 text-sky-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>Cek EPDS</span>
            </button>

            <button
              onClick={onGoToSicring}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <Heart className="w-3.5 h-3.5 text-white" />
              <span>Latihan SICRING</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          SEARCH & CATEGORY FILTER BAR
      ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
        {/* Search & Bookmark quick toggle */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari topik bacaan, misal: baby blues, panik, kelelahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium bg-slate-50/50"
            />
          </div>

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
              onlyBookmarked
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {onlyBookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <span>Artikel Tersimpan ({bookmarkedIds.length})</span>
          </button>
        </div>

        {/* Category Filter Pills - Unified Sky Blue Theme */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedCategory('semua')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'semua'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-sky-50/80 text-sky-800 border border-sky-200/70 hover:bg-sky-100'
            }`}
          >
            Semua ({categoryCounts.semua})
          </button>

          <button
            onClick={() => setSelectedCategory('kehamilan')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'kehamilan'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-sky-50/80 text-sky-800 border border-sky-200/70 hover:bg-sky-100'
            }`}
          >
            <span>🤰 Kehamilan</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-200/60 font-bold">
              {categoryCounts.kehamilan}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('nifas')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'nifas'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-sky-50/80 text-sky-800 border border-sky-200/70 hover:bg-sky-100'
            }`}
          >
            <span>👶 Nifas &amp; Pascasalin</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-200/60 font-bold">
              {categoryCounts.nifas}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('psikologis')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'psikologis'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-sky-50/80 text-sky-800 border border-sky-200/70 hover:bg-sky-100'
            }`}
          >
            <span>🧠 Psikologis &amp; Emosi</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-200/60 font-bold">
              {categoryCounts.psikologis}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('keluarga')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'keluarga'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-sky-50/80 text-sky-800 border border-sky-200/70 hover:bg-sky-100'
            }`}
          >
            <span>👨‍👩‍👧 Dukungan Keluarga</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-200/60 font-bold">
              {categoryCounts.keluarga}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('relaksasi')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'relaksasi'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-sky-50/80 text-sky-800 border border-sky-200/70 hover:bg-sky-100'
            }`}
          >
            <span>🌸 Relaksasi</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-200/60 font-bold">
              {categoryCounts.relaksasi}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================
          ARTICLE CARDS GRID
      ======================================================== */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">Materi Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Tidak ada artikel yang cocok dengan pencarian atau filter yang dipilih. Coba pilih kategori
            lain atau reset pencarian.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('semua');
              setOnlyBookmarked(false);
            }}
            className="mt-3 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            Tampilkan Semua Materi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((art) => {
            const theme = getCategoryTheme(art.category);
            const isBookmarked = bookmarkedIds.includes(art.id);

            return (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Top Category Badge & Bookmark */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${theme.badge} flex items-center gap-1`}
                    >
                      <span>{theme.icon}</span>
                      <span>{theme.label}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(art.id, e)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        isBookmarked
                          ? 'text-purple-600 bg-purple-50'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isBookmarked ? 'Hapus dari simpanan' : 'Simpan artikel ini'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 fill-purple-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-sky-700 transition-colors">
                    {art.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>

                  {/* Tags */}
                  {art.tags && art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {art.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Info & Read CTA */}
                <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {art.readTime}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-sky-600 group-hover:text-sky-700 flex items-center gap-1">
                    <span>Baca Materi</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          HALAMAN BACA ARTIKEL LENGKAP (FULL PAGE READING VIEW)
      ======================================================== */}
      {activeArticle && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Sticky Navigation Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20">
            <button
              type="button"
              onClick={() => {
                setActiveArticle(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 rotate-180 text-sky-700" />
              <span>Kembali ke Daftar Artikel</span>
            </button>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                  getCategoryTheme(activeArticle.category).badge
                }`}
              >
                {getCategoryTheme(activeArticle.category).label}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {activeArticle.readTime}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Font Size Toggle */}
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Ubah Ukuran Huruf"
              >
                Huruf: {fontSize === 'normal' ? 'Besar (A+)' : 'Normal (A-)'}
              </button>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => toggleBookmark(activeArticle.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  bookmarkedIds.includes(activeArticle.id)
                    ? 'text-purple-700 bg-purple-100 border border-purple-200'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
                title="Simpan Materi"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    bookmarkedIds.includes(activeArticle.id) ? 'fill-purple-700' : ''
                  }`}
                />
                <span className="hidden sm:inline">
                  {bookmarkedIds.includes(activeArticle.id) ? 'Tersimpan' : 'Simpan'}
                </span>
              </button>
            </div>
          </div>

          {/* Full Page Reading Article Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Article Title & Metadata Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                  📖 Edukasi Kesehatan Mental Perinatal
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {activeArticle.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-4 pb-4 border-b border-slate-100 font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-sky-600" />
                  <span>Ditinjau oleh: <strong className="text-slate-800">{activeArticle.reviewedBy}</strong></span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>
                    {new Date(activeArticle.publishedDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dokumen Terverifikasi Tim Medis TPMB</span>
                </span>
              </div>
            </div>

            {/* Psikoedukasi Key Takeaway Box */}
            <div className="bg-gradient-to-r from-sky-50 via-indigo-50/50 to-purple-50/40 border border-sky-200/80 rounded-2xl p-4 sm:p-5 text-sky-950 text-xs sm:text-sm leading-relaxed font-medium italic shadow-2xs">
              <span className="not-italic font-bold text-sky-900 block mb-1">
                💡 Ringkasan Psikoedukasi:
              </span>
              "{activeArticle.summary}"
            </div>

            {/* Article Body Content */}
            <div
              className={`space-y-4 text-slate-800 leading-relaxed whitespace-pre-line font-normal ${
                fontSize === 'large' ? 'text-base sm:text-lg leading-loose' : 'text-sm sm:text-base'
              }`}
            >
              {activeArticle.content}
            </div>

            {/* Clinical Guidance Box from Midwife */}
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-5 space-y-2 mt-8 shadow-2xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-950">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Pesan Ketenangan & Asuhan Bidan TPMB</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                Perasaan lelah, cemas, atau kewalahan adalah respon manusiawi saat memasuki gerbang menjadi ibu. Ibu tidak sendirian. Bila Ibu membutuhkan teman bicara atau penanganan klinis, Bidan pembina TPMB siap mendampingi Ibu kapan saja.
              </p>
            </div>

            {/* Tags */}
            {activeArticle.tags && activeArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-bold mr-1 self-center">Topik:</span>
                {activeArticle.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Interactivity & Quick Actions */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setHasLiked((prev) => ({
                    ...prev,
                    [activeArticle.id]: !prev[activeArticle.id],
                  }));
                }}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                  hasLiked[activeArticle.id]
                    ? 'bg-sky-100 border-sky-300 text-sky-800 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-sky-600" />
                <span>
                  {hasLiked[activeArticle.id]
                    ? 'Terima Kasih! Artikel Ini Sangat Bermanfaat'
                    : 'Tandai Materi Bermanfaat'}
                </span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveArticle(null);
                    onStartScreening();
                  }}
                  className="flex-1 sm:flex-initial bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Activity className="w-4 h-4" />
                  <span>Cek Skor EPDS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveArticle(null);
                    onGoToSicring();
                  }}
                  className="flex-1 sm:flex-initial bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Heart className="w-4 h-4" />
                  <span>Latihan SICRING</span>
                </button>
              </div>
            </div>
          </div>

          {/* Related Recommended Articles */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Rekomendasi Materi Edukasi Lainnya</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {publishedArticles
                .filter((a) => a.id !== activeArticle.id)
                .slice(0, 2)
                .map((rel) => {
                  const theme = getCategoryTheme(rel.category);
                  return (
                    <div
                      key={rel.id}
                      onClick={() => {
                        setActiveArticle(rel);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${theme.badge}`}>
                          {theme.label}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs mt-2 line-clamp-1">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {rel.summary}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-[11px] text-sky-600 font-bold">
                        <span>Baca Artikel Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveArticle(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              ← Kembali ke Semua Daftar Artikel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

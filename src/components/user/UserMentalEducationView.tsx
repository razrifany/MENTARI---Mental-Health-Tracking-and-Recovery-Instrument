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
}

export const UserMentalEducationView: React.FC<UserMentalEducationViewProps> = ({
  onStartScreening,
  onGoToSicring,
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

  // Full Reading Modal state
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

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
          badge: 'bg-pink-100 text-pink-800 border-pink-200',
          label: 'Masa Kehamilan',
          icon: '🤰',
        };
      case 'nifas':
        return {
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Masa Nifas & Pascasalin',
          icon: '👶',
        };
      case 'psikologis':
        return {
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          label: 'Psikologis & Emosi',
          icon: '🧠',
        };
      case 'keluarga':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Dukungan Keluarga',
          icon: '👨‍👩‍👧',
        };
      case 'relaksasi':
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Relaksasi & Self-Care',
          icon: '🌸',
        };
      default:
        return {
          badge: 'bg-sky-100 text-sky-800 border-sky-200',
          label: 'Kesehatan Mental',
          icon: '✨',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          HERO BANNER
      ======================================================== */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-xs">
              📚 Pojok Edukasi &amp; Psikoedukasi
            </span>
            <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Ditinjau Ahli &amp; Bidan TPMB
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
            Ruang Belajar &amp; Ketenangan Jiwa Ibu
          </h1>

          <p className="text-xs sm:text-sm text-sky-100 mt-2 leading-relaxed">
            Menjadi ibu adalah perjalanan suci yang penuh perubahan raga dan rasa. Di sini, Ibu dapat
            membaca panduan praktis mengatasi kecemasan, memahami baby blues, serta memperkuat ikatan
            cinta dengan buah hati dan keluarga.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
            <button
              onClick={onStartScreening}
              className="bg-white hover:bg-sky-50 text-sky-800 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>Cek Kesehatan Jiwa (EPDS)</span>
            </button>

            <button
              onClick={onGoToSicring}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Latihan Relaksasi SICRING</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* ========================================================
          SEARCH & CATEGORY FILTER BAR
      ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        {/* Search & Bookmark quick toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari topik bacaan, misal: baby blues, panik, kelelahan, suami..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium"
            />
          </div>

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              onlyBookmarked
                ? 'bg-purple-600 text-white shadow-2xs'
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

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedCategory('semua')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'semua'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Materi ({categoryCounts.semua})
          </button>

          <button
            onClick={() => setSelectedCategory('kehamilan')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'kehamilan'
                ? 'bg-pink-600 text-white shadow-2xs'
                : 'bg-pink-50 text-pink-800 border border-pink-200/80 hover:bg-pink-100'
            }`}
          >
            <span>🤰 Kehamilan</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold">
              {categoryCounts.kehamilan}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('nifas')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'nifas'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-purple-50 text-purple-800 border border-purple-200/80 hover:bg-purple-100'
            }`}
          >
            <span>👶 Nifas &amp; Pascasalin</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold">
              {categoryCounts.nifas}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('psikologis')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'psikologis'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200/80 hover:bg-indigo-100'
            }`}
          >
            <span>🧠 Psikologis &amp; Emosi</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold">
              {categoryCounts.psikologis}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('keluarga')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'keluarga'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
            }`}
          >
            <span>👨‍👩‍👧 Dukungan Keluarga</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold">
              {categoryCounts.keluarga}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('relaksasi')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'relaksasi'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100'
            }`}
          >
            <span>🌸 Relaksasi &amp; Self-Care</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold">
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
          FULL READER MODAL
      ======================================================== */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
            {/* Modal Top Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    getCategoryTheme(activeArticle.category).badge
                  }`}
                >
                  {getCategoryTheme(activeArticle.category).label}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeArticle.readTime}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Font Size Toggle */}
                <button
                  type="button"
                  onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                  className="px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Ubah Ukuran Huruf"
                >
                  {fontSize === 'normal' ? 'A+' : 'A-'}
                </button>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={() => toggleBookmark(activeArticle.id)}
                  className={`p-1.5 rounded-xl transition-colors ${
                    bookmarkedIds.includes(activeArticle.id)
                      ? 'text-purple-600 bg-purple-100/60'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Simpan Materi"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedIds.includes(activeArticle.id) ? 'fill-purple-600' : ''
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reading Content Body */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {activeArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2.5 pb-4 border-b border-slate-100">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ditinjau oleh: <strong>{activeArticle.reviewedBy}</strong></span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(activeArticle.publishedDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </span>
                </div>
              </div>

              {/* Summary Callout Box */}
              <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-4 text-xs sm:text-sm text-sky-950 leading-relaxed font-medium italic">
                "{activeArticle.summary}"
              </div>

              {/* Article Paragraphs */}
              <div
                className={`space-y-4 text-slate-700 leading-relaxed whitespace-pre-line ${
                  fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                }`}
              >
                {activeArticle.content}
              </div>

              {/* Clinical Advice Box from TPMB Midwife */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 mt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pesan Ketenangan dari Bidan TPMB</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Perasaan lelah atau cemas bukanlah kegagalan menjadi ibu. Bila Ibu merasa hari-hari ini
                  terlalu berat untuk dipikul sendirian, jangan ragu untuk bercerita kepada bidan Anda
                  atau lakukan skrining kesehatan jiwa berkala pada aplikasi ini.
                </p>
              </div>

              {/* Tags */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {activeArticle.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasLiked((prev) => ({
                      ...prev,
                      [activeArticle.id]: !prev[activeArticle.id],
                    }));
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    hasLiked[activeArticle.id]
                      ? 'bg-sky-50 border-sky-300 text-sky-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{hasLiked[activeArticle.id] ? 'Materi Sangat Bermanfaat' : 'Materi Bermanfaat'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveArticle(null);
                    onStartScreening();
                  }}
                  className="flex-1 sm:flex-initial bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Cek Skor EPDS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveArticle(null);
                    onGoToSicring();
                  }}
                  className="flex-1 sm:flex-initial bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Latihan SICRING</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

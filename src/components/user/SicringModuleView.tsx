import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Users,
  Smile,
  Meh,
  Frown,
  Check,
  ChevronRight,
  Heart,
  Volume2,
  VolumeX,
  Video,
  FileText,
  BookOpen,
  Headphones,
  Maximize2,
  Info,
  Calendar,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Layers,
  Activity,
  Award,
  Edit3,
  Save,
  Copy,
} from 'lucide-react';
import { SicringModule, SicringComponentKey } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  SICRING_DETAILED_GUIDES,
  SicringDetailedGuide,
  DEFAULT_SICRING_TEXT_GUIDES,
} from '../../data/sicringGuides';

interface SicringModuleViewProps {
  onOpenConsultationModal: () => void;
  onDetailModeChange?: (isDetail: boolean) => void;
  isDetailActive?: boolean;
}

export const SicringModuleView: React.FC<SicringModuleViewProps> = ({
  onOpenConsultationModal,
  onDetailModeChange,
  isDetailActive,
}) => {
  const {
    sicringModules,
    sicringLogs,
    recordSicringSession,
    currentUser,
    sicringTextGuides,
    sicringDetailedGuides,
    updateSicringTextGuide,
  } = useApp();

  // Mode: 'exercise' (Latihan Mandiri Interaktif - default/halaman pertama) or 'panduan' (Panduan Video/Audio/Teks)
  const [activeMode, setActiveMode] = useState<'panduan' | 'exercise'>('exercise');

  // Track previous parent detail active prop value to prevent race condition flashing
  const prevIsDetailActiveRef = useRef(isDetailActive);

  // Sync with parent layout header back button & full page detail state
  useEffect(() => {
    if (onDetailModeChange) {
      onDetailModeChange(activeMode === 'panduan');
    }
  }, [activeMode, onDetailModeChange]);

  useEffect(() => {
    if (prevIsDetailActiveRef.current === true && isDetailActive === false && activeMode === 'panduan') {
      setActiveMode('exercise');
    }
    prevIsDetailActiveRef.current = isDetailActive;
  }, [isDetailActive, activeMode]);

  // Currently viewed guide component
  const [selectedGuideKey, setSelectedGuideKey] = useState<SicringComponentKey>('olah_tubuh');
  // Currently active media tab inside the guide: 'video' | 'audio' | 'teks'
  const [guideMediaTab, setGuideMediaTab] = useState<'video' | 'audio' | 'teks'>('video');

  // Simple Text Guide editor state
  const [isEditingTextGuide, setIsEditingTextGuide] = useState(false);
  const [editTextContent, setEditTextContent] = useState('');
  const [copiedTextToast, setCopiedTextToast] = useState(false);
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null);

  // Video player simulation state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgressSeconds, setVideoProgressSeconds] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Audio player simulation state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgressSeconds, setAudioProgressSeconds] = useState(0);
  const [audioVolume, setAudioVolume] = useState<number>(0.8);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioOscillatorRef = useRef<OscillatorNode | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);

  // Exercise Session states (existing exercise flow)
  const [selectedModule, setSelectedModule] = useState<SicringModule | null>(null);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [isSafetyAcknowledged, setIsSafetyAcknowledged] = useState(false);
  const [isExercisePlaying, setIsExercisePlaying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [totalSecondsPlayed, setTotalSecondsPlayed] = useState(0);
  const [showMoodCheckModal, setShowMoodCheckModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'lebih_tenang' | 'sama_saja' | 'lebih_berat'>('lebih_tenang');
  const [journalNote, setJournalNote] = useState('');

  // Current detailed guide data
  const currentGuide: SicringDetailedGuide =
    SICRING_DETAILED_GUIDES[selectedGuideKey] || SICRING_DETAILED_GUIDES['olah_tubuh'];

  // User logs & stats
  const userLogs = sicringLogs.filter((l) => l.userId === currentUser?.id);
  const completedCount = userLogs.filter((l) => l.isCompleted).length;
  const totalMinutes = Math.round(
    userLogs.reduce((acc, curr) => acc + curr.durationSecondsPlayed, 0) / 60
  );

  // Stop video/audio when switching modules or tabs
  useEffect(() => {
    setIsVideoPlaying(false);
    setVideoProgressSeconds(0);
    setIsAudioPlaying(false);
    setAudioProgressSeconds(0);
    stopSynthTone();
  }, [selectedGuideKey, guideMediaTab]);

  // Video playback timer ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVideoPlaying && currentGuide) {
      timer = setInterval(() => {
        setVideoProgressSeconds((prev) => {
          if (prev >= currentGuide.video.durationSeconds) {
            setIsVideoPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isVideoPlaying, playbackSpeed, currentGuide]);

  // Audio playback timer ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAudioPlaying && currentGuide) {
      timer = setInterval(() => {
        setAudioProgressSeconds((prev) => {
          if (prev >= currentGuide.audio.durationSeconds) {
            setIsAudioPlaying(false);
            stopSynthTone();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAudioPlaying, currentGuide]);

  // Web Audio API synthesis for soothing gentle sound tone
  const startSynthTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Stop previous
      stopSynthTone();

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Soothing 432 Hz frequency for relaxation
      osc.frequency.setValueAtTime(432, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04 * audioVolume, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      audioOscillatorRef.current = osc;
      audioGainRef.current = gain;
    } catch {
      // Audio autoplay may be prevented, fallback silently
    }
  };

  const stopSynthTone = () => {
    try {
      if (audioGainRef.current && audioContextRef.current) {
        audioGainRef.current.gain.setValueAtTime(audioGainRef.current.gain.value, audioContextRef.current.currentTime);
        audioGainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.5);
      }
      setTimeout(() => {
        if (audioOscillatorRef.current) {
          audioOscillatorRef.current.stop();
          audioOscillatorRef.current.disconnect();
          audioOscillatorRef.current = null;
        }
      }, 600);
    } catch {
      // Ignore
    }
  };

  const toggleAudioPlayback = () => {
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      stopSynthTone();
    } else {
      setIsAudioPlaying(true);
      startSynthTone();
    }
  };

  // Launch exercise flow for a specific module
  const handleLaunchExercise = (moduleKey: SicringComponentKey) => {
    if (moduleKey === 'pendampingan') {
      onOpenConsultationModal();
      return;
    }
    const targetModule = sicringModules.find((m) => m.id === moduleKey) || sicringModules[0];
    setSelectedModule(targetModule);
    setShowSafetyModal(true);
    setIsSafetyAcknowledged(false);
    setCurrentStepIdx(0);
    setTotalSecondsPlayed(0);
    setIsExercisePlaying(false);
  };

  const handleStartSession = () => {
    if (!selectedModule) return;
    setShowSafetyModal(false);
    const firstStepDuration = selectedModule.steps[0]?.durationSeconds || 60;
    setSecondsRemaining(firstStepDuration);
    setIsExercisePlaying(true);
  };

  // Timer loop for active exercise session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExercisePlaying && selectedModule && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
        setTotalSecondsPlayed((prev) => prev + 1);
      }, 1000);
    } else if (isExercisePlaying && secondsRemaining === 0 && selectedModule) {
      if (currentStepIdx < selectedModule.steps.length - 1) {
        const nextIdx = currentStepIdx + 1;
        setCurrentStepIdx(nextIdx);
        setSecondsRemaining(selectedModule.steps[nextIdx].durationSeconds);
      } else {
        setIsExercisePlaying(false);
        setShowMoodCheckModal(true);
      }
    }
    return () => clearInterval(interval);
  }, [isExercisePlaying, secondsRemaining, selectedModule, currentStepIdx]);

  const handleFinishSession = () => {
    if (!selectedModule) return;
    const totalModuleDuration = selectedModule.steps.reduce((a, b) => a + b.durationSeconds, 0);
    const isCompleted = totalSecondsPlayed >= totalModuleDuration * 0.8 || totalSecondsPlayed >= 30;

    recordSicringSession({
      userId: currentUser?.id || 'guest',
      moduleId: selectedModule.id as SicringComponentKey,
      moduleTitle: selectedModule.title,
      durationSecondsPlayed: Math.max(totalSecondsPlayed, 60),
      totalDurationSeconds: totalModuleDuration,
      isCompleted,
      postMood: selectedMood,
      journalNote: journalNote.trim() || undefined,
    });

    setShowMoodCheckModal(false);
    setSelectedModule(null);
    setJournalNote('');
  };

  const formatSecondsToMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ======================================================================= */}
      {/* MODE 1: PANDUAN SICRING PER BAGIAN (VIDEO, AUDIO & PANDUAN TEKS)        */}
      {/* ======================================================================= */}
      {activeMode === 'panduan' && (
        <div className="space-y-4 pb-28 sm:pb-24 animate-in fade-in duration-200">
            {/* Guide Header Banner */}
            <div className="pb-4 sm:pb-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                    Bagian {currentGuide.number}: {currentGuide.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Panduan Klinis TPMB
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {currentGuide.title}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                  {currentGuide.subtitle}
                </p>
              </div>

              {/* Media Sub-Tab Selector: Video / Audio / Teks */}
              <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setGuideMediaTab('video')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    guideMediaTab === 'video'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGuideMediaTab('audio')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    guideMediaTab === 'audio'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGuideMediaTab('teks')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    guideMediaTab === 'teks'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Panduan Teks</span>
                </button>
              </div>
            </div>

            {/* Media Tab 1: VIDEO PANDUAN */}
            {guideMediaTab === 'video' && (
              <div className="p-5 sm:p-6 space-y-5 animate-in fade-in duration-150">
                {/* Interactive Simulated Video Player Interface */}
                <div className="rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md text-white relative">
                  {/* Video Viewport / Simulated Screen */}
                  <div className={`relative aspect-video sm:aspect-21/9 bg-gradient-to-tr ${currentGuide.video.thumbnailGradient} flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden`}>
                    {/* Animated Pulsing Guide Graphic in Video */}
                    <div className="relative flex items-center justify-center mb-3">
                      <div className={`w-28 h-28 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center transition-all duration-1000 ${
                        isVideoPlaying ? 'scale-110 shadow-lg shadow-white/20' : 'scale-100'
                      }`}>
                        <div className={`w-16 h-16 rounded-full bg-white/30 flex items-center justify-center transition-transform duration-700 ${
                          isVideoPlaying ? 'scale-105' : 'scale-95'
                        }`}>
                          {isVideoPlaying ? (
                            <Sparkles className="w-8 h-8 text-white animate-pulse" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 max-w-lg">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 bg-black/30 px-3 py-1 rounded-full backdrop-blur-xs">
                        {currentGuide.video.instructor}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white mt-2 leading-tight">
                        {currentGuide.video.title}
                      </h4>
                      <p className="text-xs text-white/80 mt-1 line-clamp-2">
                        {currentGuide.video.description}
                      </p>
                    </div>

                    {/* Big Overlay Play/Pause Button */}
                    <button
                      type="button"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group cursor-pointer"
                      title={isVideoPlaying ? 'Jeda Video' : 'Putar Video'}
                    >
                      <div className="w-16 h-16 rounded-full bg-white/90 text-slate-900 group-hover:scale-110 transition-transform flex items-center justify-center shadow-xl">
                        {isVideoPlaying ? (
                          <Pause className="w-7 h-7 text-sky-700" />
                        ) : (
                          <Play className="w-7 h-7 text-sky-700 ml-1" />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Video Control Bar */}
                  <div className="p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 flex flex-col gap-2">
                    {/* Scrub Timeline */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-400">
                        {formatSecondsToMinutes(videoProgressSeconds)}
                      </span>
                      <div
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const pos = (e.clientX - rect.left) / rect.width;
                          setVideoProgressSeconds(Math.floor(pos * currentGuide.video.durationSeconds));
                        }}
                        className="flex-1 h-2 bg-slate-700 rounded-full cursor-pointer relative overflow-hidden group"
                      >
                        <div
                          className="h-full bg-sky-500 rounded-full transition-all"
                          style={{
                            width: `${(videoProgressSeconds / currentGuide.video.durationSeconds) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {currentGuide.video.duration}
                      </span>
                    </div>

                    {/* Secondary Actions Row */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-200 transition-colors flex items-center gap-1.5"
                        >
                          {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span className="hidden sm:inline">{isVideoPlaying ? 'Jeda' : 'Putar'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVideoProgressSeconds(0)}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                          title="Ulangi dari awal"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsVideoMuted(!isVideoMuted)}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
                        >
                          {isVideoMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                          <span className="hidden sm:inline">{isVideoMuted ? 'Bisu' : 'Audio Aktif'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Playback speed toggle */}
                        <button
                          type="button"
                          onClick={() => setPlaybackSpeed((prev) => (prev === 1 ? 1.25 : prev === 1.25 ? 1.5 : 1))}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono font-bold"
                          title="Kecepatan putar"
                        >
                          {playbackSpeed}x
                        </button>

                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                          HD 1080p
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Chapters / Poin Pembahasan */}
                <div className="space-y-2.5">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span>Bab Video & Poin Gerakan (Klik untuk Lompat):</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentGuide.video.chapters.map((ch, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setVideoProgressSeconds(ch.seconds);
                          setIsVideoPlaying(true);
                        }}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-sky-300 bg-slate-50/60 hover:bg-sky-50/50 text-left transition-colors flex items-start gap-2.5 group"
                      >
                        <span className="font-mono text-[11px] font-bold text-sky-700 bg-sky-100 group-hover:bg-sky-600 group-hover:text-white px-2 py-0.5 rounded-md transition-colors shrink-0">
                          {ch.time}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block group-hover:text-sky-900">
                            {ch.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                            {ch.detail}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tips Visual Penting dari Bidan */}
                <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-100 text-xs text-sky-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sky-900">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>Catatan Pengamatan Bidan saat Menonton:</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-[11px] sm:text-xs text-slate-700">
                    {currentGuide.video.keyVisualTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Media Tab 2: AUDIO RELAKSASI */}
            {guideMediaTab === 'audio' && (
              <div className="p-5 sm:p-6 space-y-5 animate-in fade-in duration-150">
                {/* Interactive Audio Player Card */}
                <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-sky-900/50 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md transition-colors ${
                        isAudioPlaying
                          ? 'bg-sky-500 text-white shadow-sky-500/30'
                          : 'bg-white/10 text-slate-300'
                      }`}>
                        <Headphones className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-900/60 px-2.5 py-0.5 rounded-full border border-sky-700/50">
                          {currentGuide.audio.frequency}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                          {currentGuide.audio.title}
                        </h4>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          Narator: {currentGuide.audio.narrator} &bull; Latar: {currentGuide.audio.bgSound}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleAudioPlayback}
                      className={`self-start sm:self-auto py-2.5 px-5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 shrink-0 ${
                        isAudioPlaying
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                          : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30'
                      }`}
                    >
                      {isAudioPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Jeda Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Putar Audio Relaksasi</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Audio Visualizer Waves Simulator */}
                  <div className="my-5 flex items-center justify-center gap-1.5 h-14 bg-black/30 rounded-2xl p-3 border border-white/5">
                    {[12, 28, 45, 60, 32, 50, 75, 90, 55, 30, 68, 85, 42, 25, 60, 48, 80, 64, 30, 52].map((height, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          isAudioPlaying
                            ? 'bg-sky-400 animate-pulse'
                            : 'bg-slate-700'
                        }`}
                        style={{
                          height: isAudioPlaying ? `${Math.max(15, (height * (1 + Math.sin(audioProgressSeconds + i) * 0.4)))}%` : '20%',
                          animationDelay: `${i * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Progress scrubber */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{formatSecondsToMinutes(audioProgressSeconds)}</span>
                      <span className="text-[11px] text-sky-300 font-sans">
                        {isAudioPlaying ? 'Sedang Memutar Suara Ketenangan...' : 'Siap Diputar'}
                      </span>
                      <span>{currentGuide.audio.duration}</span>
                    </div>

                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        setAudioProgressSeconds(Math.floor(pos * currentGuide.audio.durationSeconds));
                      }}
                      className="w-full h-2.5 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all"
                        style={{
                          width: `${(audioProgressSeconds / currentGuide.audio.durationSeconds) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-sky-400" />
                      <span>Volume Audio:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={audioVolume}
                        onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                        className="w-24 accent-sky-500 cursor-pointer h-1.5"
                      />
                      <span className="text-[11px] font-mono">{Math.round(audioVolume * 100)}%</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAudioProgressSeconds(0)}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Putar Ulang</span>
                    </button>
                  </div>
                </div>

                {/* Audio Script Lines / Teks Narasi yang Diucapkan */}
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-sky-600" />
                      <span>Naskah Narasi Bimbingan Audio:</span>
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      Bisa dibaca sambil mendengarkan
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentGuide.audio.scriptLines.map((line, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs flex items-start gap-3 shadow-2xs"
                      >
                        <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                          {line.time}
                        </span>
                        <p className="text-slate-700 leading-relaxed italic">
                          "{line.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab 3: PANDUAN TEKS SEDERHANA (DAPAT DIUPDATE OLEH ADMIN/BIDAN) */}
            {guideMediaTab === 'teks' && (
              <div className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-150 text-slate-800">
                {/* Save Toast Feedback */}
                {saveToastMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{saveToastMessage}</span>
                    </div>
                    <button
                      onClick={() => setSaveToastMessage(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold"
                    >
                      &times;
                    </button>
                  </div>
                )}

                {/* Sub-Header: Title & Mode Toggle (View / Edit) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                      Panduan Teks
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Format Teks Bersih &middot; Terbuka untuk Pembaruan Bidan
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy text button */}
                    <button
                      type="button"
                      onClick={() => {
                        const textToCopy =
                          sicringTextGuides?.[selectedGuideKey] ||
                          DEFAULT_SICRING_TEXT_GUIDES[selectedGuideKey] ||
                          '';
                        navigator.clipboard.writeText(textToCopy);
                        setCopiedTextToast(true);
                        setTimeout(() => setCopiedTextToast(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Salin teks panduan ini"
                    >
                      {copiedTextToast ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Salin Teks</span>
                        </>
                      )}
                    </button>

                    {/* Admin / Midwife Edit Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!isEditingTextGuide) {
                          setEditTextContent(
                            sicringTextGuides?.[selectedGuideKey] ||
                              DEFAULT_SICRING_TEXT_GUIDES[selectedGuideKey] ||
                              ''
                          );
                          setIsEditingTextGuide(true);
                        } else {
                          setIsEditingTextGuide(false);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isEditingTextGuide
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingTextGuide ? 'Tutup Editor' : 'Edit Teks (Admin)'}</span>
                    </button>
                  </div>
                </div>

                {/* EDIT MODE: TEXTAREA EDITOR */}
                {isEditingTextGuide ? (
                  <div className="space-y-3 bg-purple-50/50 p-4 sm:p-5 rounded-2xl border border-purple-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-950 flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-purple-600" />
                        <span>Editor Teks Panduan (Bidan / Admin)</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Format teks bebas (paragraf, poin penomoran, kutipan)
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Ketik atau edit materi panduan di bawah ini. Format sederhana ini memudahkan Bidan menyesuaikan instruksi klinis atau bahasa kultural setempat. Perubahan akan langsung tersimpan di sistem.
                    </p>

                    <textarea
                      rows={14}
                      value={editTextContent}
                      onChange={(e) => setEditTextContent(e.target.value)}
                      className="w-full text-xs sm:text-sm p-4 bg-white rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-hidden font-mono leading-relaxed"
                      placeholder="Tuliskan teks panduan di sini..."
                    />

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingTextGuide(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Batal
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateSicringTextGuide(selectedGuideKey, editTextContent);
                          setIsEditingTextGuide(false);
                          setSaveToastMessage('Teks panduan berhasil disimpan dan diperbarui!');
                          setTimeout(() => setSaveToastMessage(null), 3000);
                        }}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan Teks</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* READ MODE: CLEAN TYPOGRAPHIC TEXT READER */
                  <div className="py-2 space-y-5">
                    {(() => {
                      const text =
                        sicringTextGuides?.[selectedGuideKey] ||
                        DEFAULT_SICRING_TEXT_GUIDES[selectedGuideKey] ||
                        '';
                      const paragraphs = text.split('\n\n');

                      return (
                        <div className="space-y-5">
                          {paragraphs.map((para, pIdx) => {
                            const trimmed = para.trim();
                            if (!trimmed) return null;

                            // Heading line (e.g. "PANDUAN OLAH TUBUH...")
                            if (pIdx === 0 && trimmed.toUpperCase() === trimmed) {
                              return (
                                <div key={pIdx} className="pb-3 border-b border-slate-200">
                                  <h4 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                                    {trimmed}
                                  </h4>
                                </div>
                              );
                            }

                            // Section with number e.g. "1. Tujuan & Manfaat:"
                            if (/^\d+\.\s/.test(trimmed)) {
                              const lines = trimmed.split('\n');
                              const title = lines[0];
                              const contentLines = lines.slice(1);

                              return (
                                <div key={pIdx} className="space-y-2 pt-1">
                                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                                      {title.match(/^\d+/)?.[0]}
                                    </span>
                                    <span>{title.replace(/^\d+\.\s*/, '')}</span>
                                  </h5>

                                  {contentLines.length > 0 && (
                                    <div className="space-y-1.5 pl-7 text-xs sm:text-sm text-slate-600 leading-relaxed">
                                      {contentLines.map((line, lIdx) => {
                                        const cleanLine = line.trim();
                                        if (cleanLine.startsWith('•') || cleanLine.startsWith('-')) {
                                          return (
                                            <div key={lIdx} className="flex items-start gap-2">
                                              <span className="text-sky-600 font-bold">•</span>
                                              <span>{cleanLine.replace(/^[•-]\s*/, '')}</span>
                                            </div>
                                          );
                                        }
                                        if (cleanLine.startsWith('"') && cleanLine.endsWith('"')) {
                                          return (
                                            <div
                                              key={lIdx}
                                              className="my-2 p-3 bg-purple-50/80 rounded-xl border border-purple-200 text-purple-950 italic font-medium"
                                            >
                                              {cleanLine}
                                            </div>
                                          );
                                        }
                                        return <p key={lIdx}>{cleanLine}</p>;
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            // Quote / Affirmation
                            if (trimmed.startsWith('"')) {
                              return (
                                <div
                                  key={pIdx}
                                  className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 text-purple-950 italic text-xs sm:text-sm leading-relaxed"
                                >
                                  {trimmed}
                                </div>
                              );
                            }

                            // Regular paragraph
                            return (
                              <p key={pIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                {trimmed}
                              </p>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* Simple Footer footnote */}
                    <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Materi Panduan Standar Asuhan Kebidanan Perinatal</span>
                      <span className="flex items-center gap-1 text-sky-700 font-medium">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Terverifikasi Bidan TPMB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footnote inside guide */}
            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Materi Panduan Standar Asuhan Kebidanan Perinatal</span>
              <span className="flex items-center gap-1 text-sky-700 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Terverifikasi Bidan TPMB
              </span>
            </div>

          {/* Fixed Bottom Navigation Bar */}
          <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3.5 sm:p-4 shadow-lg animate-in slide-in-from-bottom-2 duration-200">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              <div className="hidden sm:block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">Siap Melakukan Latihan?</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{currentGuide.title}</h4>
              </div>

              <div className="w-full sm:w-auto">
                {selectedGuideKey === 'pendampingan' ? (
                  <button
                    type="button"
                    onClick={onOpenConsultationModal}
                    className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Jadwalkan Konsultasi Bidan</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLaunchExercise(selectedGuideKey)}
                    className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-200 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Mulai Latihan Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODE 2: LATIHAN MANDIRI (EXERCISE TIMER & BREATHING ANIMATION)          */}
      {/* ======================================================================= */}
      {activeMode === 'exercise' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Banner & Aggregate Kemajuan - Clean Solid Sky 500 Card */}
          <div className="bg-sky-500 text-white rounded-3xl p-4.5 sm:p-5 shadow-sm shadow-sky-200/50 relative overflow-hidden space-y-3">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-xs">
                  ✨ Intervensi Psikospiritual SICRING Perinatal
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Latihan Mandiri &amp; Pemulihan Batin
              </h2>

              <p className="text-xs text-sky-100 mt-1 leading-relaxed">
                Praktikkan latihan ketenangan terarah dengan timer interaktif, panduan video, audio relaksasi, dan teks.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-xs">
                <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
                  <span className="text-[10px] text-sky-100 uppercase tracking-wider font-bold block">Sesi Tuntas</span>
                  <span className="text-base sm:text-lg font-bold text-white mt-0.5">{completedCount} Sesi</span>
                </div>

                <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
                  <span className="text-[10px] text-sky-100 uppercase tracking-wider font-bold block">Total Menit</span>
                  <span className="text-base sm:text-lg font-bold text-white mt-0.5">{totalMinutes} Menit</span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-sky-100 uppercase tracking-wider font-bold block">Status Modul</span>
                    <span className="text-xs sm:text-sm font-bold text-white mt-0.5">5 Modul Lengkap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                  Latihan Mandiri (Exercise Timer)
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  5 Komponen Terarah
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" />
                <span>Pilih Sesi Latihan Mandiri Hari Ini</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dianjurkan 1-2 sesi per hari dalam suasana tenang dan posisi nyaman.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedGuideKey('olah_tubuh');
                setActiveMode('panduan');
              }}
              className="px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-2xs hover:shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Panduan Per Bagian (Video, Audio & Teks)</span>
              <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>

          <div className="space-y-3">
            {sicringModules.map((module) => {
              const isPendampingan = module.id === 'pendampingan';
              const logsForThis = userLogs.filter((l) => l.moduleId === module.id);
              const hasDone = logsForThis.length > 0;

              return (
                <div
                  key={module.id}
                  onClick={() => {
                    setSelectedGuideKey(module.id as SicringComponentKey);
                    setActiveMode('panduan');
                  }}
                  className={`rounded-3xl p-4 sm:p-4.5 transition-all shadow-2xs hover:shadow-md flex items-center justify-between gap-3.5 border cursor-pointer active:scale-[0.99] ${
                    isPendampingan
                      ? 'bg-purple-50/50 border-purple-200/80 hover:border-purple-300'
                      : 'bg-white border-slate-200/90 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 ${
                        isPendampingan
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {module.number}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-bold text-sm ${isPendampingan ? 'text-purple-950' : 'text-slate-900'}`}>
                          {module.title}
                        </h4>
                        {isPendampingan && (
                          <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            🩺 Fitur Bidan TPMB
                          </span>
                        )}
                        {hasDone && (
                          <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5 text-sky-600" />
                            Selesai
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${isPendampingan ? 'text-purple-800/80 font-medium' : 'text-slate-500'}`}>
                        {module.subtitle}
                      </p>
                      <div className="flex items-center gap-2.5 mt-1.5 text-[11px] text-slate-400 font-medium">
                        <span className={isPendampingan ? 'text-purple-700 font-bold' : 'text-slate-600 font-semibold'}>
                          ⏱ {module.durationMinutes} menit
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          {module.targetAudience === 'ibu_dan_pendamping' ? (
                            <>
                              <Users className="w-3 h-3 text-amber-500" /> Bersama Suami/Keluarga
                            </>
                          ) : isPendampingan ? (
                            <>
                              <Heart className="w-3 h-3 text-purple-600" /> Sesi 1-on-1 Bidan TPMB
                            </>
                          ) : (
                            <>
                              <Heart className="w-3 h-3 text-sky-500" /> Mandiri di Rumah
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Right Chevron Indicator */}
                  <div className="shrink-0 text-slate-400 pl-1">
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safety Guideline Modal prior to Exercise */}
      {showSafetyModal && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 p-6 text-slate-800">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Panduan Keamanan {selectedModule.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Demi keselamatan Ibu dan buah hati, mohon perhatikan petunjuk klinis di bawah sebelum memulai latihan:
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 my-4 text-xs text-amber-900 leading-relaxed">
              <strong className="block text-amber-950 mb-1">Catatan Keamanan Klinis:</strong>
              {selectedModule.safetyGuideline}
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSafetyAcknowledged}
                onChange={(e) => setIsSafetyAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-sky-600 rounded-xs border-slate-300 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-700 leading-tight">
                Saya memahami petunjuk keamanan ini dan siap melakukan latihan dalam posisi nyaman.
              </span>
            </label>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => setShowSafetyModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!isSafetyAcknowledged}
                onClick={handleStartSession}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                  isSafetyAcknowledged
                    ? 'bg-sky-600 hover:bg-sky-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                Mulai Latihan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Exercise Session Player (Breathing Visualizer & Timer) */}
      {selectedModule && !showSafetyModal && !showMoodCheckModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-sky-50/90 border-b border-sky-100 px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                  Latihan Mandiri Sedang Berlangsung
                </span>
                <h3 className="font-bold text-slate-900 text-base">{selectedModule.title}</h3>
              </div>
              <button
                onClick={() => {
                  setIsExercisePlaying(false);
                  setShowMoodCheckModal(true);
                }}
                className="text-xs bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-medium"
              >
                Selesaikan Sesi
              </button>
            </div>

            {/* Breathing Animation Visualizer */}
            <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-b from-sky-50/50 to-white">
              <div className="relative flex items-center justify-center w-48 h-48 my-2">
                {/* Outer pulsing ring */}
                <div
                  className={`absolute inset-0 rounded-full bg-sky-200/50 transition-all duration-1000 ${
                    isExercisePlaying ? 'animate-ping opacity-30' : ''
                  }`}
                />
                {/* Middle breathing circle */}
                <div
                  className={`w-36 h-36 rounded-full bg-sky-400/20 border-2 border-sky-400 flex items-center justify-center transition-transform duration-1000 ${
                    isExercisePlaying ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-3xl font-black text-sky-800 tracking-tight">
                      {formatSecondsToMinutes(secondsRemaining)}
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-sky-600 mt-1">
                      {isExercisePlaying ? 'Tarik & Hembuskan Napas' : 'Dijeda'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Audio tone indicator */}
              <div className="flex items-center gap-2 text-xs text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 mt-2">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio Relaksasi Gelombang Alfa & Suara Alam</span>
              </div>
            </div>

            {/* Step Instructions */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-bold text-sky-700 mb-2">
                <span>
                  Langkah {currentStepIdx + 1} dari {selectedModule.steps.length}
                </span>
                <span>
                  {selectedModule.steps[currentStepIdx]?.title}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 leading-relaxed shadow-2xs">
                {selectedModule.steps[currentStepIdx]?.instruction}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSecondsRemaining(selectedModule.steps[currentStepIdx]?.durationSeconds || 60);
                }}
                className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
                title="Ulangi Langkah Ini"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsExercisePlaying(!isExercisePlaying)}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-sky-200 transition-all text-sm"
              >
                {isExercisePlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Jeda Sejenak</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Lanjutkan Latihan</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentStepIdx < selectedModule.steps.length - 1) {
                    const next = currentStepIdx + 1;
                    setCurrentStepIdx(next);
                    setSecondsRemaining(selectedModule.steps[next].durationSeconds);
                  } else {
                    setIsExercisePlaying(false);
                    setShowMoodCheckModal(true);
                  }
                }}
                className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Langkah Berikut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mood Rating & Reflection Modal (Feeds into Research log) */}
      {showMoodCheckModal && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 p-6 text-slate-800">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Latihan Selesai! Bagaimana Perasaan Ibu?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Catatan ini membantu Ibu dan Bidan memantau efektivitas modul SICRING.
            </p>

            {/* 3 Mood Choices */}
            <div className="grid grid-cols-3 gap-2.5 my-4">
              <button
                type="button"
                onClick={() => setSelectedMood('lebih_tenang')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                  selectedMood === 'lebih_tenang'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Smile className="w-7 h-7 text-emerald-500" />
                <span className="text-xs font-bold">Lebih Tenang</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMood('sama_saja')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                  selectedMood === 'sama_saja'
                    ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Meh className="w-7 h-7 text-sky-500" />
                <span className="text-xs font-bold">Sama Saja</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMood('lebih_berat')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                  selectedMood === 'lebih_berat'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Frown className="w-7 h-7 text-amber-500" />
                <span className="text-xs font-bold">Lebih Berat</span>
              </button>
            </div>

            {/* Optional Reflection Note */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Jurnal Refleksi Singkat (Opsional):
              </label>
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                rows={2}
                placeholder="Contoh: Pundak terasa lebih ringan setelah latihan napas 4-4-6..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <button
              type="button"
              onClick={handleFinishSession}
              className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-2xl text-sm shadow-md shadow-sky-200 transition-colors"
            >
              Simpan & Catat Kemajuan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

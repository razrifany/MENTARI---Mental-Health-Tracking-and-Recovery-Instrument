import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Shield, HeartHandshake } from 'lucide-react';
import { EPDS_ITEMS } from '../../data/mockData';
import { EPDSScreeningResult } from '../../types';
import { useApp } from '../../context/AppContext';

interface EpdsScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinished: (result: EPDSScreeningResult) => void;
  waveType?: 'T0' | 'rutin' | 'T1';
}

export const EpdsScreeningModal: React.FC<EpdsScreeningModalProps> = ({
  isOpen,
  onClose,
  onFinished,
  waveType = 'rutin',
}) => {
  const { submitEPDSScreening } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [itemId: number]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentItem = EPDS_ITEMS[currentIndex];
  const totalQuestions = EPDS_ITEMS.length;
  const currentAnswer = answers[currentItem.id];
  const isAnswered = currentAnswer !== undefined;

  const handleSelectOption = (score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentItem.id]: score,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all 10 items
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const result = submitEPDSScreening(answers, waveType);
        setIsSubmitting(false);
        onFinished(result);
      } catch (err) {
        setIsSubmitting(false);
        console.error(err);
      }
    }, 600);
  };

  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-sky-50/80 border-b border-sky-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              M
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Cek Kabar Perasaan (EPDS)</h2>
              <span className="text-[11px] text-sky-700 font-medium">
                {waveType === 'T0' ? 'Skrining Awal (Pretest)' : waveType === 'T1' ? 'Skrining Evaluasi (Posttest)' : 'Skrining Berkala 7 Hari Terakhir'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            Batal
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-sky-100/60 h-1.5">
          <div
            className="bg-sky-500 h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Question Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
          <div>
            {/* Step & Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100/70 px-3 py-1 rounded-full">
                Pertanyaan {currentIndex + 1} dari {totalQuestions}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {progressPercentage}% Selesai
              </span>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentItem.question}
              </h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                Pilihlah satu jawaban yang paling mendekati perasaan Ibu dalam 7 hari terakhir.
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentItem.options.map((option, optIdx) => {
                const isSelected = currentAnswer === option.score;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(option.score)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between min-h-[58px] ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <span className="text-sm sm:text-base leading-relaxed pr-3">
                      {option.text}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-sky-600 bg-sky-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>Jawaban Ibu aman, rahasia, dan hanya digunakan oleh Bidan TPMB untuk memantau kesehatan Ibu.</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
              currentIndex === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isAnswered || isSubmitting}
            className={`flex-1 max-w-[200px] py-2.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              !isAnswered || isSubmitting
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200'
            }`}
          >
            {isSubmitting ? (
              <span>Menyimpan...</span>
            ) : currentIndex === totalQuestions - 1 ? (
              <span>Selesai & Lihat Hasil</span>
            ) : (
              <>
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

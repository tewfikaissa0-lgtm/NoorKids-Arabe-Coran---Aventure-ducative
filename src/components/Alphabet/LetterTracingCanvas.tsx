import React, { useRef, useState, useEffect } from 'react';
import { ArabicLetter, Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Eraser, Check, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LetterTracingCanvasProps {
  letter: ArabicLetter;
  lang: Language;
  onComplete: () => void;
}

export const LetterTracingCanvas: React.FC<LetterTracingCanvasProps> = ({ letter, lang, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [brushColor, setBrushColor] = useState('#f59e0b');

  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];

  const clearCanvas = () => {
    sound.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleValidate = () => {
    sound.playStarChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    onComplete();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-3xl border-2 border-amber-200 dark:border-slate-700">
      <div className="w-full flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
          ✍️ {lang === 'ar' ? 'تتبع ورسم الحرف بالإصبع أو الفأرة' : lang === 'en' ? 'Trace the letter with finger or mouse' : 'Trace la lettre sur le modèle'}
        </span>
        <div className="flex items-center gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => {
                sound.playPop();
                setBrushColor(c);
              }}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                brushColor === c ? 'scale-125 border-slate-900 dark:border-white shadow-xs' : 'border-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Canvas Area with Outlined Letter in background */}
      <div className="relative w-full max-w-sm h-64 bg-amber-50/70 dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-amber-300 dark:border-slate-700 flex items-center justify-center shadow-inner">
        {/* Outlined Guide Letter in center */}
        <div
          className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-700 text-9xl font-['Amiri'] font-bold select-none pointer-events-none"
          dir="rtl"
        >
          {letter.letter}
        </div>

        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={360}
          height={256}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-10 w-full h-full cursor-crosshair touch-none"
        />
      </div>

      {/* Guide instructions */}
      <div className="w-full mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        {letter.strokeGuide.map((step, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold text-[10px]">
              {idx + 1}
            </span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4 w-full">
        <button
          onClick={clearCanvas}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{lang === 'ar' ? 'مسح' : 'Effacer'}</span>
        </button>

        <button
          onClick={handleValidate}
          disabled={!hasDrawn}
          className={`flex-2 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
            hasDrawn
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-102 active:scale-98 shadow-emerald-500/20'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'ar' ? 'رائع ! تأكيد الإتقان (+10 ⭐)' : 'Super ! Valider le tracé (+10 ⭐)'}</span>
        </button>
      </div>
    </div>
  );
};

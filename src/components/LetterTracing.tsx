import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCcw, CheckCircle2, Search } from 'lucide-react';
import { playClickSound, playSuccessSound } from './EnglishProficiencyTest/Button';

export type LetterTracingProps = {
  letter?: string;
  onComplete: (completedLetter: string) => void;
  onBack?: () => void;
};

type Step = 'selection' | 'intro' | 'tracing' | 'result';

export function LetterTracing({ letter: initialLetter = 'A', onComplete, onBack }: LetterTracingProps) {
  const [step, setStep] = useState<Step>('selection');
  const [selectedLetter, setSelectedLetter] = useState(initialLetter);
  const [isPortrait, setIsPortrait] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [canvasOpacity, setCanvasOpacity] = useState(1);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Landscape Orientation Guard
  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsCorrect(null);
    setCanvasOpacity(1);
  };

  const checkTracing = () => {
    if (canvasOpacity < 1) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d')!;

    tCtx.font = 'bold 40rem Fredoka';
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';
    tCtx.fillStyle = 'black';
    tCtx.fillText(selectedLetter, tempCanvas.width / 2, tempCanvas.height / 2);

    const userImg = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const templateImg = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;

    let matchCount = 0;
    let totalTemplatePixels = 0;
    let strayPixels = 0;

    for (let i = 3; i < templateImg.length; i += 4) {
      const isTemplateFilled = templateImg[i] > 0;
      const isUserFilled = userImg[i] > 0;

      if (isTemplateFilled) {
        totalTemplatePixels++;
        if (isUserFilled) matchCount++;
      } else if (isUserFilled) {
        strayPixels++;
      }
    }

    const coverage = totalTemplatePixels > 0 ? matchCount / totalTemplatePixels : 0;
    const strayRatio = totalTemplatePixels > 0 ? strayPixels / totalTemplatePixels : 0;
    
    // 判定逻辑：有效覆盖 > 20%，出界 < 30%
    if (coverage > 0.2 && strayRatio < 0.3) { 
      playSuccessSound();
      setStep('result');
    } else {
      setIsCorrect(false);
      setCanvasOpacity(0);
      setTimeout(() => {
        clearCanvas();
        setIsCorrect(null);
      }, 1500); 
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (canvasOpacity < 1) return;
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || canvasOpacity < 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineWidth = 45;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#4A90E2';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#F0F9FF] font-['Fredoka'] z-[1000]">
      <AnimatePresence>
        {isPortrait && (
          <motion.div
            key="portrait-guard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#ED7470] z-[1100] flex flex-col items-center justify-center p-8 text-white text-center"
          >
            <motion.div animate={{ rotate: 90 }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="mb-8">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">请横屏使用</h2>
            <p className="text-xl opacity-90">为了更好的书写体验，请将手机横过来哦！</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-4 flex justify-between items-center z-10 shrink-0">
        <button
          onClick={() => { 
            playClickSound(); 
            if (step === 'selection') onBack?.(); 
            else setStep('selection');
          }}
          className="p-3 rounded-full bg-white shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="text-slate-700" size={24} />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-[#4A90E2] tracking-wider">
            {step === 'selection' ? 'Select a Letter' : `Tracing: ${selectedLetter}`}
          </h1>
        </div>
        <div className="w-12" />
      </div>

      <main className="flex-1 overflow-hidden p-4 relative">
        <AnimatePresence mode="wait">
          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full w-full max-w-6xl mx-auto overflow-y-auto no-scrollbar pb-8"
            >
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-4 p-4">
                {alphabet.map((l) => (
                  <motion.button
                    key={l}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playClickSound();
                      setSelectedLetter(l);
                      setStep('intro');
                    }}
                    className={`aspect-square flex items-center justify-center text-4xl font-bold rounded-2xl shadow-sm border-b-4 transition-all ${
                      selectedLetter === l 
                        ? 'bg-[#4A90E2] text-white border-blue-700' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#4A90E2]'
                    }`}
                  >
                    {l}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mx-auto bg-white p-12 rounded-3xl shadow-xl text-center max-w-md border-4 border-[#FFD93D]"
            >
              <div className="text-8xl font-bold text-[#4A90E2] mb-8">{selectedLetter}</div>
              <p className="text-2xl text-slate-600 mb-8">Ready to trace the letter {selectedLetter}?</p>
              <button
                onClick={() => { playClickSound(); setStep('tracing'); }}
                className="px-10 py-4 bg-[#FFD93D] hover:bg-[#FFC93C] text-[#2F3640] font-bold text-2xl rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Let's Go!
              </button>
            </motion.div>
          )}

          {step === 'tracing' && (
            <motion.div
              key="tracing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full h-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border-8 border-dashed border-slate-200 flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="text-[40rem] font-bold text-slate-100/50 leading-none">{selectedLetter}</span>
              </div>
              <motion.canvas
                ref={canvasRef}
                width={800}
                height={600}
                initial={{ opacity: 1 }}
                animate={{ opacity: canvasOpacity }}
                transition={{ duration: 0.8 }}
                className="w-full h-full cursor-crosshair relative z-20 touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <div className="absolute bottom-6 right-6 flex gap-4 z-30">
                <button
                  onClick={() => { playClickSound(); clearCanvas(); }}
                  className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl shadow transition-colors"
                >
                  <RefreshCcw size={28} className="text-slate-600" />
                </button>
                <button
                  onClick={() => { playClickSound(); checkTracing(); }}
                  className="p-4 bg-[#6BCB77] hover:bg-[#5BB464] text-white rounded-2xl shadow-lg transition-colors"
                >
                  <CheckCircle2 size={28} />
                </button>
              </div>
              <AnimatePresence>
                {isCorrect === false && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute inset-x-0 top-10 flex justify-center z-40">
                    <div className="bg-[#ED7470] text-white px-8 py-4 rounded-2xl shadow-xl font-bold text-xl flex items-center gap-3">
                      <span>Oops! Try to follow the lines! ✍️</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto bg-white p-12 rounded-3xl shadow-xl text-center max-w-md border-4 border-[#6BCB77]"
            >
              <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-8xl mb-6">🌟</motion.div>
              <h2 className="text-4xl font-bold text-[#2F3640] mb-4">Great Job!</h2>
              <p className="text-xl text-slate-600 mb-8">You traced the letter {selectedLetter} perfectly!</p>
              <button
                onClick={() => { playClickSound(); onComplete(selectedLetter); }}
                className="px-10 py-4 bg-[#6BCB77] text-white font-bold text-2xl rounded-2xl shadow-lg hover:bg-[#5BB464] transition-all"
              >
                Finish
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

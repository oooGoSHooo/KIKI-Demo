import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, CheckCircle, ChevronLeft, Play, Pause, Star } from 'lucide-react';
import { EBOOK_PAGES } from './EbookReader';

interface EbookFollowReadProps {
  onFinish: () => void;
  onBack: () => void;
}

export const EbookFollowRead: React.FC<EbookFollowReadProps> = ({ onFinish, onBack }) => {
  // Filter for inner pages that have audio (these are the ones to read along)
  const followReadPages = EBOOK_PAGES.filter(p => p.id !== 'cover' && p.id !== 'backcover' && p.audio !== null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [direction, setDirection] = useState(1);

  const currentPage = followReadPages[currentIndex];

  const handleToggleModelAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingModel) {
      audioRef.current.pause();
      setIsPlayingModel(false);
    } else {
      audioRef.current.play();
      setIsPlayingModel(true);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setShowScore(false);
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      const randomScore = Math.floor(Math.random() * 21) + 80; // 80-100
      setScore(randomScore);
      setShowScore(true);
    }, 3000);
  };

  const handleConfirm = () => {
    if (currentIndex < followReadPages.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
      setShowScore(false);
    } else {
      onFinish();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <div className="relative h-full w-full bg-slate-50 z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800 overflow-hidden">
      <header className="h-[10%] min-h-[60px] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100 shrink-0 z-10">
        <button onClick={onBack} className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 transition-colors">
          <ChevronLeft size={28} />
        </button>
        <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] uppercase text-slate-600">绘本跟读 ({currentIndex + 1}/{followReadPages.length})</h2>
        <button onClick={onFinish} className="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold text-[clamp(12px,3vw,14px)] active:scale-95 transition-all whitespace-nowrap">
          跳过本环节
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-[4%] relative">
        <div className="w-full max-w-4xl flex-1 relative flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full flex flex-col items-center"
            >
              {/* Page Image Display */}
              <div className="w-full h-[60%] bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white relative">
                <img 
                  src={currentPage.image} 
                  alt="Follow Read Page" 
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: currentPage.position === 'right' ? 'right' : currentPage.position === 'left' ? 'left' : 'center'
                  }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Model Audio Button */}
                <button 
                  onClick={handleToggleModelAudio}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-blue-500 active:scale-90 transition-transform"
                >
                  {isPlayingModel ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
              </div>

              {/* Interaction Area */}
              <div className="flex-1 w-full flex flex-col items-center justify-center space-y-8 mt-8">
                {!showScore ? (
                  <div className="flex flex-col items-center space-y-4">
                    <button 
                      onClick={startRecording}
                      disabled={isRecording}
                      className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}
                    >
                      <Mic size={40} color="white" />
                    </button>
                    <p className="font-black text-xl text-slate-600 tracking-wider">
                      {isRecording ? '正在录音中...' : '点击麦克风开始跟读'}
                    </p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center space-y-6"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-1 mb-2">
                        {[1, 2, 3].map(i => (
                          <Star key={i} size={32} fill={score >= 80 + (i-1)*7 ? "#f59e0b" : "none"} color="#f59e0b" />
                        ))}
                      </div>
                      <div className="text-6xl font-black text-blue-500 italic">{score}</div>
                      <div className="text-xl font-bold text-slate-500 mt-2">太棒了！发音很准哦</div>
                    </div>

                    <button 
                      onClick={handleConfirm}
                      className="px-12 py-4 bg-green-500 text-white rounded-2xl font-black text-2xl shadow-xl active:scale-95 transition-all flex items-center space-x-3"
                    >
                      <span>确定</span>
                      <CheckCircle size={28} />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Hidden Audio Element */}
      {currentPage.audio && (
        <audio 
          ref={audioRef} 
          src={currentPage.audio} 
          onEnded={() => setIsPlayingModel(false)}
        />
      )}
    </div>
  );
};

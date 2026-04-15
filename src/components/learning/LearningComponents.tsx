import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, Check, FileText, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

const FLASHCARDS_DATA = [
  {
    word: "calculator",
    pos: "n.",
    pron: "/ˈkæl.kjə.leɪ.tər/",
    meaning: "计算器",
    example: "I need a calculator for my math homework.",
    image: "/cards/calculator (noun 计算器).png",
    audio: "/mp3/calculator.wav",
  },
  {
    word: "gel",
    pos: "n.",
    pron: "/dʒel/",
    meaning: "凝胶",
    example: "He uses hair gel every morning.",
    image: "/cards/gel (noun 凝胶).png",
    audio: "/mp3/gel.wav",
  },
  {
    word: "hate",
    pos: "v.",
    pron: "/heɪt/",
    meaning: "讨厌，憎恨",
    example: "I hate waking up early on weekends.",
    image: "/cards/hate (verb 讨厌，憎恨).png",
    audio: "/mp3/hate.wav",
  },
  {
    word: "invention",
    pos: "n.",
    pron: "/ɪnˈven.ʃən/",
    meaning: "发明；发明物",
    example: "The telephone is a great invention.",
    image: "/cards/invention (noun 发明；发明物).png",
    audio: "/mp3/invention.wav",
  },
  {
    word: "remote control",
    pos: "n.",
    pron: "/rɪˌmoʊt kənˈtroʊl/",
    meaning: "遥控器",
    example: "Where is the TV remote control?",
    image: "/cards/remote control (noun 遥控器).png",
    audio: "/mp3/remote control.wav",
  },
];

export const FlashcardLearning = ({
  onFinish,
  onBack,
}: {
  onFinish: () => void;
  onBack: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showLearnModal, setShowLearnModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    playAudio();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < FLASHCARDS_DATA.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30, delay: 0.08 },
        opacity: { duration: 0.2, delay: 0.08 },
      },
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        },
      };
    },
  };

  return (
    <div className="relative h-full w-full bg-[#f8f9fa] z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800 overflow-hidden">
      <audio
        ref={audioRef}
        src={FLASHCARDS_DATA[currentIndex].audio}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
      <header className="h-[10%] min-h-[60px] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100 shrink-0 z-10">
        <button
          onClick={onBack}
          className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 transition-colors"
        >
          <X size={28} />
        </button>
        <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] text-slate-600">
          单词卡 ({currentIndex + 1}/{FLASHCARDS_DATA.length})
        </h2>
        <div className="w-[clamp(36px,10vw,48px)]" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-[clamp(12px,3vw,16px)] sm:p-[clamp(20px,5vw,32px)] relative">
        {/* Navigation Buttons and Card Container */}
        <div className="relative w-full max-w-5xl flex items-center justify-center h-full">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className={`absolute left-0 md:-left-6 z-20 w-12 h-12 text-white rounded-full flex items-center justify-center shadow-md transition-all ${currentIndex === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff3b30] active:bg-[#d32f2f]'}`}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={32} strokeWidth={3} />
          </button>

          {/* Card and Button Container */}
          <div className="w-full max-w-4xl relative flex items-center justify-center mx-8 md:mx-12 h-full">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                {/* Card */}
                <div className="w-full aspect-[4/5] md:aspect-[1.8/1] bg-white rounded-[40px] shadow-xl flex flex-col md:flex-row overflow-hidden p-[clamp(16px,4vw,32px)] gap-[clamp(20px,5vw,40px)] shrink-0">
                  {/* Image Container */}
                  <div className="w-full md:w-1/2 flex items-center justify-center shrink-0 h-full">
                    <div className="relative h-full aspect-[500/640] rounded-[24px] overflow-hidden bg-slate-100">
                      <img
                        src={FLASHCARDS_DATA[currentIndex].image}
                        alt={FLASHCARDS_DATA[currentIndex].word}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Text Container */}
                  <div className="w-full md:w-1/2 h-full flex flex-col justify-center py-4 pr-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <button
                        onClick={playAudio}
                        className={`w-10 h-8 bg-[#e63946] rounded-lg flex items-center justify-center text-white shrink-0 active:bg-[#d32f2f] transition-colors ${isPlaying ? 'animate-pulse' : ''}`}
                      >
                        <Volume2 size={20} fill="currentColor" />
                      </button>
                      <h1 className="text-[clamp(32px,6vw,48px)] font-black text-[#1c1c1e] leading-none tracking-tight">
                        {FLASHCARDS_DATA[currentIndex].word}
                      </h1>
                    </div>
                    
                    <div className="pl-[52px]">
                      <p className="text-[clamp(18px,4vw,22px)] font-bold text-slate-500 mb-6">
                        {FLASHCARDS_DATA[currentIndex].pron}
                      </p>

                      <p className="text-[clamp(20px,4.5vw,26px)] font-black text-[#1c1c1e] mb-10">
                        ({FLASHCARDS_DATA[currentIndex].pos === 'n.' ? '名词' : FLASHCARDS_DATA[currentIndex].pos === 'v.' ? '动词' : FLASHCARDS_DATA[currentIndex].pos}) {FLASHCARDS_DATA[currentIndex].meaning}
                      </p>

                      <p className="text-[clamp(16px,3.5vw,20px)] font-medium text-slate-600 italic leading-relaxed">
                        "{FLASHCARDS_DATA[currentIndex].example}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Learn Word Button */}
                <div className="mt-[clamp(16px,4vw,24px)] z-10 flex flex-col items-center shrink-0">
                  <button
                    onClick={() => setShowLearnModal(true)}
                    className="active:brightness-75 transition-all"
                  >
                    <img src="/学单词.png" alt="学单词" className="h-[clamp(60px,15vw,80px)] object-contain drop-shadow-md" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 md:-right-6 z-20 w-12 h-12 bg-[#ff3b30] text-white rounded-full flex items-center justify-center shadow-md active:bg-[#d32f2f] transition-all"
          >
            {currentIndex < FLASHCARDS_DATA.length - 1 ? (
              <ChevronRight size={32} strokeWidth={3} />
            ) : (
              <Check size={32} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-1.5 bg-blue-500 transition-all duration-500 z-50 rounded-r-full"
        style={{
          width: `${((currentIndex + 1) / FLASHCARDS_DATA.length) * 100}%`,
        }}
      />

      {/* Learn Modal */}
      <AnimatePresence>
        {showLearnModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowLearnModal(false)}
          >
            <div 
              className="relative w-full max-w-4xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/学单词弹窗.png" alt="学习卡片" className="w-full h-auto object-contain" />
              <button
                onClick={() => setShowLearnModal(false)}
                className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-10 h-10 md:w-12 md:h-12 bg-[#ff3b30] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-white"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ReportGenerator = ({ onBack }: { onBack: () => void }) => {
  const [status, setStatus] = useState<
    "idle" | "generating" | "success" | "error"
  >("generating");
  const [progress, setProgress] = useState(0);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (status === "generating") {
      setProgress(0);
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setStatus("success");
          setReportUrl(
            "https://cyberai.dev.xrunda.com/creator-review/cw_1769655106291_39479145/page_1769655912709_ebd8bc1a?version=2016709183749292033",
          );
        }
        setProgress(currentProgress);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="max-w-4xl mx-auto py-[clamp(16px,4vw,24px)]">
      {status === "generating" && (
        <div className="bg-white rounded-[32px] p-[clamp(32px,8vw,48px)] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative w-[clamp(96px,30vw,128px)] h-[clamp(96px,30vw,128px)] flex items-center justify-center">
            <svg
              className="animate-spin w-full h-full text-blue-100"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75 text-blue-500"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[clamp(22px,5.5vw,28px)] font-black text-blue-500">
                {progress}%
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-[clamp(22px,5.5vw,28px)] font-black text-slate-800 mb-[clamp(6px,2vw,8px)]">
              AIGC 报告生成中...
            </h3>
            <p className="text-slate-500 font-bold">
              {progress < 20
                ? "正在创建课件..."
                : progress < 40
                  ? "获取模板信息..."
                  : progress < 80
                    ? "调用 AI 生成内容..."
                    : "保存结果中..."}
            </p>
          </div>
          <div className="w-full max-w-md bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="bg-white rounded-[32px] p-[clamp(32px,8vw,48px)] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-[clamp(16px,4vw,24px)]">
          <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)]">
            <Check size={48} strokeWidth={3} />
          </div>
          <h3 className="text-[clamp(24px,6vw,32px)] font-black text-slate-800">
            报告生成成功！
          </h3>
          <p className="text-slate-500 font-bold text-[clamp(18px,4.5vw,20px)] max-w-xl">
            学习报告已成功生成，您可以点击下方按钮预览报告。
          </p>
          <div className="pt-6 w-full max-w-sm space-y-[clamp(12px,3vw,16px)]">
            <button
              onClick={() => setShowPreview(true)}
              className="w-full py-[clamp(12px,3vw,16px)] bg-green-500 text-white rounded-[clamp(12px,3vw,16px)] font-black text-[clamp(20px,5vw,24px)] shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-[clamp(6px,2vw,8px)]"
            >
              <FileText size={24} />
              <span>预览报告</span>
            </button>
          </div>
        </div>
      )}

      {showPreview && reportUrl && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <header className="h-[10%] min-h-[60px] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100 shrink-0">
            <button
              onClick={() => setShowPreview(false)}
              className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
            >
              <ChevronLeft size={28} />
            </button>
            <h2 className="font-black text-slate-800 text-[clamp(20px,5vw,24px)] tracking-widest">
              学习报告预览
            </h2>
            <div className="w-[clamp(36px,10vw,48px)]" />
          </header>
          <div className="flex-1 w-full h-full bg-slate-50">
            <iframe
              src={reportUrl}
              className="w-full h-full border-none"
              title="学习报告预览"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, X, RotateCcw, Star, Volume2, Play, Pause, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EBOOK_PAGES } from './EbookReader';

type ReadAloudPage = (typeof EBOOK_PAGES)[number];

const MOCK_AUDIO_DATA_URI = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

const FOLLOW_READ_PAGES = EBOOK_PAGES.filter(
  (page): page is ReadAloudPage & { audio: string } => page.id !== 'cover' && page.id !== 'backcover' && Boolean(page.audio)
);

const buildFallbackWaveform = () => Array.from({ length: 50 }, () => Math.random() * 0.5 + 0.15);

export const ReadAloud = ({ onFinish, onBack, onSkip }: { onFinish: () => void; onBack: () => void; onSkip: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'scoring' | 'scored'>('idle');
  const [stars, setStars] = useState(0);
  const [direction, setDirection] = useState(1);
  const [audioDuration, setAudioDuration] = useState(3);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isOriginalPlaying, setIsOriginalPlaying] = useState(false);
  const [originalPlaybackProgress, setOriginalPlaybackProgress] = useState(0);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isUserPlaying, setIsUserPlaying] = useState(false);
  const [userPlaybackProgress, setUserPlaybackProgress] = useState(0);
  const [precalculatedWaveforms, setPrecalculatedWaveforms] = useState<Record<number, number[]>>({});

  const audioRef = useRef<HTMLAudioElement>(null);
  const userAudioRef = useRef<HTMLAudioElement>(null);
  const recordingStartTimeRef = useRef(0);
  const progressAnimationRef = useRef<number>();
  const scoringTimeoutRef = useRef<number>();

  const currentPage = FOLLOW_READ_PAGES[currentIndex];
  const currentWaveform = useMemo(
    () => precalculatedWaveforms[currentIndex] || Array(50).fill(0.15),
    [currentIndex, precalculatedWaveforms]
  );

  const playCelebrationSound = () => {
    try {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;
      const context = new AudioContextCtor();
      const playTone = (frequency: number, startOffset: number, duration: number) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, context.currentTime + startOffset);
        gainNode.gain.setValueAtTime(0, context.currentTime + startOffset);
        gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + startOffset + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + startOffset + duration);
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.start(context.currentTime + startOffset);
        oscillator.stop(context.currentTime + startOffset + duration);
      };

      playTone(523.25, 0, 0.25);
      playTone(659.25, 0.12, 0.3);
      playTone(783.99, 0.24, 0.35);

      window.setTimeout(() => {
        void context.close();
      }, 1000);
    } catch {
      // Ignore unsupported audio APIs.
    }
  };

  const stopAllPlayback = () => {
    if (audioRef.current) audioRef.current.pause();
    if (userAudioRef.current) userAudioRef.current.pause();
  };

  const resetUserRecording = () => {
    stopAllPlayback();
    setRecordingState('idle');
    setStars(0);
    setRecordingProgress(0);
    setOriginalPlaybackProgress(0);
    setUserPlaybackProgress(0);
    if (userAudioUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(userAudioUrl);
    }
    setUserAudioUrl(null);
  };

  const playOriginalAudio = () => {
    if (isUserPlaying && userAudioRef.current) {
      userAudioRef.current.pause();
    }
    if (!audioRef.current) return;
    if (isOriginalPlaying) {
      audioRef.current.pause();
      return;
    }
    audioRef.current.currentTime = 0;
    void audioRef.current.play().catch(() => {
      setIsOriginalPlaying(false);
    });
  };

  const playUserAudio = () => {
    if (!userAudioRef.current || !userAudioUrl) return;
    if (isOriginalPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    if (isUserPlaying) {
      userAudioRef.current.pause();
      return;
    }
    userAudioRef.current.currentTime = 0;
    void userAudioRef.current.play().catch(() => {
      setIsUserPlaying(false);
    });
  };

  useEffect(() => {
    let isMounted = true;

    const calculateWaveforms = async () => {
      const waveforms: Record<number, number[]> = {};
      await Promise.all(
        FOLLOW_READ_PAGES.map(async (page, index) => {
          try {
            const response = await fetch(page.audio);
            const buffer = await response.arrayBuffer();
            const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!AudioContextCtor) {
              waveforms[index] = buildFallbackWaveform();
              return;
            }
            const context = new AudioContextCtor();
            const audioBuffer = await context.decodeAudioData(buffer.slice(0));
            const channelData = audioBuffer.getChannelData(0);
            const sampleCount = 50;
            const blockSize = Math.max(1, Math.floor(channelData.length / sampleCount));
            const rawWaveform: number[] = [];

            for (let waveformIndex = 0; waveformIndex < sampleCount; waveformIndex += 1) {
              const start = waveformIndex * blockSize;
              let sum = 0;
              for (let sampleIndex = 0; sampleIndex < blockSize; sampleIndex += 1) {
                sum += Math.abs(channelData[start + sampleIndex] || 0);
              }
              rawWaveform.push(sum / blockSize);
            }

            const maxAmplitude = Math.max(...rawWaveform, 0.0001);
            waveforms[index] = rawWaveform.map((value) => Math.max(0.1, value / maxAmplitude));
            void context.close();
          } catch {
            waveforms[index] = buildFallbackWaveform();
          }
        })
      );

      if (isMounted) {
        setPrecalculatedWaveforms(waveforms);
      }
    };

    void calculateWaveforms();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAudioDuration = async () => {
      try {
        const response = await fetch(currentPage.audio);
        const buffer = await response.arrayBuffer();
        const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextCtor) {
          if (isMounted) setAudioDuration(3);
          return;
        }
        const context = new AudioContextCtor();
        const audioBuffer = await context.decodeAudioData(buffer.slice(0));
        if (isMounted) {
          setAudioDuration(audioBuffer.duration || 3);
          setRecordingProgress(0);
        }
        void context.close();
      } catch {
        if (isMounted) {
          setAudioDuration(3);
          setRecordingProgress(0);
        }
      }
    };

    void loadAudioDuration();

    return () => {
      isMounted = false;
      if (progressAnimationRef.current) cancelAnimationFrame(progressAnimationRef.current);
    };
  }, [currentPage.audio]);

  useEffect(() => {
    return () => {
      if (progressAnimationRef.current) cancelAnimationFrame(progressAnimationRef.current);
      if (scoringTimeoutRef.current) window.clearTimeout(scoringTimeoutRef.current);
      stopAllPlayback();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (userAudioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(userAudioUrl);
      }
    };
  }, [userAudioUrl]);

  const finishRecording = () => {
    if (progressAnimationRef.current) cancelAnimationFrame(progressAnimationRef.current);
    setUserAudioUrl(MOCK_AUDIO_DATA_URI);
    setRecordingState('scoring');

    scoringTimeoutRef.current = window.setTimeout(() => {
      const simulatedScore = Math.floor(Math.random() * 41) + 60;
      const calculatedStars = simulatedScore >= 90 ? 3 : simulatedScore >= 70 ? 2 : simulatedScore >= 40 ? 1 : 0;
      setStars(calculatedStars);
      setRecordingState('scored');

      if (calculatedStars === 3) {
        playCelebrationSound();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
          zIndex: 2000,
        });
      }
    }, 800);
  };

  const startRecordingProcess = async () => {
    if (recordingState !== 'idle') return;

    stopAllPlayback();
    setRecordingState('recording');
    setRecordingProgress(0);
    setUserAudioUrl((previousUrl) => {
      if (previousUrl?.startsWith('blob:')) URL.revokeObjectURL(previousUrl);
      return null;
    });
    recordingStartTimeRef.current = performance.now();

    const updateProgress = (timestamp: number) => {
      const elapsed = (timestamp - recordingStartTimeRef.current) / 1000;
      const progress = Math.min(1, elapsed / Math.max(audioDuration, 1));
      setRecordingProgress(progress);

      if (progress < 1) {
        progressAnimationRef.current = requestAnimationFrame(updateProgress);
      } else {
        finishRecording();
      }
    };

    progressAnimationRef.current = requestAnimationFrame(updateProgress);
  };

  const handleRecordClick = () => {
    void startRecordingProcess();
  };

  const handleNext = () => {
    if (currentIndex < FOLLOW_READ_PAGES.length - 1) {
      setDirection(1);
      setCurrentIndex((previousIndex) => previousIndex + 1);
      resetUserRecording();
      return;
    }
    onFinish();
  };

  const variants = {
    enter: (nextDirection: number) => ({ x: nextDirection > 0 ? '100%' : '-100%', opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (nextDirection: number) => ({
      x: nextDirection < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="relative h-full w-full bg-slate-50 z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800 overflow-hidden">
      <header className="h-[10%] min-h-[60px] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100 shrink-0 z-10">
        <button onClick={onBack} className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 transition-colors">
          <X size={28} />
        </button>
        <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] uppercase text-slate-600">
          绘本跟读 ({currentIndex + 1}/{FOLLOW_READ_PAGES.length})
        </h2>
        <button onClick={onSkip} className="px-[clamp(10px,2.5vw,16px)] h-[clamp(40px,12vw,56px)] bg-amber-100 text-amber-700 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center font-black text-[clamp(12px,3vw,16px)] whitespace-nowrap transition-colors">
          跳过本环节
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center p-[clamp(16px,4vw,24px)] relative overflow-hidden">
        <div className="w-full h-[50%] sm:h-[60%] relative flex justify-center items-center">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentPage.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full flex justify-center items-center"
            >
              <img
                src={currentPage.image}
                alt={`Page ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-lg border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 right-4 flex flex-col space-y-3">
                <button onClick={playOriginalAudio} className="w-16 h-16 bg-white/90 backdrop-blur-sm text-purple-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all">
                  {isOriginalPlaying ? (
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Volume2 size={32} />
                    </motion.div>
                  ) : (
                    <Volume2 size={32} />
                  )}
                </button>
                <button
                  onClick={playUserAudio}
                  disabled={!userAudioUrl}
                  className={`w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all ${
                    userAudioUrl ? 'text-green-500 active:scale-95' : 'text-slate-300 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isUserPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <audio
          ref={audioRef}
          src={currentPage.audio}
          onPlay={() => setIsOriginalPlaying(true)}
          onPause={() => setIsOriginalPlaying(false)}
          onEnded={() => {
            setIsOriginalPlaying(false);
            setOriginalPlaybackProgress(0);
          }}
          onTimeUpdate={(event) => {
            const audioElement = event.currentTarget;
            if (audioElement.duration) {
              setOriginalPlaybackProgress(audioElement.currentTime / audioElement.duration);
            }
          }}
        />

        {userAudioUrl && (
          <audio
            ref={userAudioRef}
            src={userAudioUrl}
            onPlay={() => setIsUserPlaying(true)}
            onPause={() => setIsUserPlaying(false)}
            onEnded={() => {
              setIsUserPlaying(false);
              setUserPlaybackProgress(0);
            }}
            onTimeUpdate={(event) => {
              const audioElement = event.currentTarget;
              if (audioElement.duration) {
                setUserPlaybackProgress(audioElement.currentTime / audioElement.duration);
              }
            }}
          />
        )}

        <div className="w-full flex-1 mt-6 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-sm mb-4 px-4 relative h-12">
            <AnimatePresence>
              <motion.div
                key={currentPage.id}
                className="absolute inset-0 flex items-end justify-between gap-[3px] w-full"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.3 / 50 } },
                  exit: { transition: { staggerChildren: 0.3 / 50, staggerDirection: 1 } },
                }}
              >
                {(isOriginalPlaying || isUserPlaying) && (
                  <motion.div
                    className={`absolute top-0 bottom-0 w-1 rounded-full z-10 ${
                      isOriginalPlaying ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
                    }`}
                    style={{ left: `${(isOriginalPlaying ? originalPlaybackProgress : userPlaybackProgress) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                )}
                {currentWaveform.map((amplitude, waveformIndex) => {
                  const activeProgress = isOriginalPlaying ? originalPlaybackProgress : isUserPlaying ? userPlaybackProgress : recordingProgress;
                  const isFilled = waveformIndex / currentWaveform.length <= activeProgress;
                  const fillColor = isOriginalPlaying ? 'bg-purple-400' : isUserPlaying ? 'bg-green-400' : 'bg-blue-500';
                  return (
                    <motion.div
                      key={waveformIndex}
                      className={`flex-1 rounded-full ${isFilled ? fillColor : 'bg-slate-200'}`}
                      variants={{
                        hidden: { height: 0 },
                        visible: { height: `${Math.max(12, amplitude * 100)}%`, transition: { duration: 0.3, ease: 'easeOut' } },
                        exit: { height: 0, transition: { duration: 0.3, ease: 'easeIn' } },
                      }}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {recordingState === 'idle' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <button onClick={handleRecordClick} className="w-[clamp(80px,20vw,100px)] h-[clamp(80px,20vw,100px)] bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(59,130,246,0.4)] active:scale-95 transition-all">
                <Mic size={48} />
              </button>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500 rounded-full recording-pulse opacity-20" />
                <div className="absolute inset-0 bg-red-500 rounded-full recording-pulse recording-pulse-delayed opacity-15" />
                <button onClick={finishRecording} className="w-[clamp(80px,20vw,100px)] h-[clamp(80px,20vw,100px)] bg-red-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(239,68,68,0.4)] relative z-10 active:scale-95 transition-all">
                  <Square size={36} fill="currentColor" />
                </button>
              </div>
            </div>
          )}

          {recordingState === 'scoring' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="w-[clamp(80px,20vw,100px)] h-[clamp(80px,20vw,100px)] bg-amber-400 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(251,191,36,0.4)]">
                <Star size={48} className="animate-spin" />
              </div>
            </div>
          )}

          {recordingState === 'scored' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 w-full max-w-md">
              <div className="flex items-center justify-center space-x-2 mb-8">
                {[1, 2, 3].map((starIndex) => (
                  <div key={starIndex} className="relative flex items-center justify-center w-16 h-16">
                    <Star size={64} className="text-slate-200 fill-slate-200" />
                    {starIndex <= stars && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', delay: starIndex * 0.15, bounce: 0.6, duration: 0.6 }}
                      >
                        <Star size={64} className="text-amber-400 fill-amber-400 drop-shadow-md" />
                      </motion.div>
                    )}
                    {starIndex <= stars && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                        <motion.div
                          initial={{ x: '-150%' }}
                          animate={{ x: '150%' }}
                          transition={{ delay: starIndex * 0.15 + 0.2, duration: 0.8, ease: 'easeInOut' }}
                          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 mix-blend-overlay opacity-80"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-4 w-full px-4">
                <button onClick={resetUserRecording} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl active:scale-95 transition-all flex items-center justify-center">
                  <RotateCcw size={32} />
                </button>
                <button onClick={handleNext} className="flex-1 py-4 bg-green-500 text-white rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center">
                  <ArrowRight size={32} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
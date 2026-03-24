import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Check, X, RotateCcw, Star, Volume2, Play, Pause, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const READ_ALOUD_PAGES = [
  { id: 'page1', image: '/U6%20L1%20D1/01.jpg', audio: '/U6%20L1%20D1/01.MP3' },
  { id: 'page2', image: '/U6%20L1%20D1/02.jpg', audio: '/U6%20L1%20D1/02.MP3' },
  { id: 'page3', image: '/U6%20L1%20D1/03.jpg', audio: '/U6%20L1%20D1/03.MP3' },
  { id: 'page4', image: '/U6%20L1%20D1/04.jpg', audio: '/U6%20L1%20D1/04.MP3' },
  { id: 'page5', image: '/U6%20L1%20D1/05.jpg', audio: '/U6%20L1%20D1/05.MP3' },
  { id: 'page6', image: '/U6%20L1%20D1/06.jpg', audio: '/U6%20L1%20D1/06.MP3' },
  { id: 'page7', image: '/U6%20L1%20D1/07.jpg', audio: '/U6%20L1%20D1/07.MP3' },
  { id: 'page8', image: '/U6%20L1%20D1/08.jpg', audio: '/U6%20L1%20D1/08.MP3' },
];

export const ReadAloud = ({ onFinish, onBack }: { onFinish: () => void, onBack: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'scoring' | 'scored'>('idle');
  const [stars, setStars] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  const [audioDuration, setAudioDuration] = useState(3);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isOriginalPlaying, setIsOriginalPlaying] = useState(false);
  const [originalPlaybackProgress, setOriginalPlaybackProgress] = useState(0);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isUserPlaying, setIsUserPlaying] = useState(false);
  const [userPlaybackProgress, setUserPlaybackProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const userAudioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const progressAnimationRef = useRef<number>();
  
  const [precalculatedWaveforms, setPrecalculatedWaveforms] = useState<Record<number, number[]>>({});

  const playCelebrationSound = () => {
    try {
      const audio = new Audio('/sounds/success.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  const playOriginalAudio = () => {
    if (isUserPlaying && userAudioRef.current) {
      userAudioRef.current.pause();
    }
    if (audioRef.current) {
      if (isOriginalPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Error playing original audio:", e));
      }
    }
  };

  const playUserAudio = () => {
    if (isOriginalPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    if (userAudioRef.current && userAudioUrl) {
      if (isUserPlaying) {
        userAudioRef.current.pause();
      } else {
        userAudioRef.current.currentTime = 0;
        userAudioRef.current.play().catch(e => console.error("Error playing user audio:", e));
      }
    }
  };

  useEffect(() => {
    const calculateWaveforms = async () => {
      const waveforms: Record<number, number[]> = {};
      
      await Promise.all(READ_ALOUD_PAGES.map(async (page, i) => {
        const url = page.audio;
        if (url) {
          try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const channelData = audioBuffer.getChannelData(0);
            
            const samples = 50;
            const blockSize = Math.floor(channelData.length / samples);
            const rawWaveform: number[] = [];
            
            for (let j = 0; j < samples; j++) {
              const start = j * blockSize;
              let sum = 0;
              for (let k = 0; k < blockSize; k++) {
                sum += Math.abs(channelData[start + k]);
              }
              rawWaveform.push(sum / blockSize);
            }
            
            const max = Math.max(...rawWaveform);
            waveforms[i] = rawWaveform.map(val => max ? Math.max(0.1, val / max) : 0.1);
          } catch (e) {
            console.error("Failed to decode audio for waveform", e);
            waveforms[i] = Array.from({ length: 50 }, () => Math.random() * 0.5 + 0.1);
          }
        } else {
          waveforms[i] = Array.from({ length: 50 }, () => Math.random() * 0.5 + 0.1);
        }
      }));
      
      setPrecalculatedWaveforms(waveforms);
    };
    
    calculateWaveforms();
  }, []);

  const currentWaveform = precalculatedWaveforms[currentIndex] || Array(50).fill(0.1);

  useEffect(() => {
    let isMounted = true;
    const loadAudioDuration = async () => {
      const url = READ_ALOUD_PAGES[currentIndex].audio;
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        if (!isMounted) return;
        setAudioDuration(audioBuffer.duration);
        setRecordingProgress(0);
      } catch (e) {
        console.error("Audio duration error:", e);
        if (isMounted) {
          setAudioDuration(3);
          setRecordingProgress(0);
        }
      }
    };
    loadAudioDuration();
    return () => { 
      isMounted = false; 
      if (progressAnimationRef.current) cancelAnimationFrame(progressAnimationRef.current);
    };
  }, [currentIndex]);
  
  const handleRecordClick = () => {
    if (isOriginalPlaying && audioRef.current) audioRef.current.pause();
    if (isUserPlaying && userAudioRef.current) userAudioRef.current.pause();
    if (!hasMicPermission) {
      setShowPermissionModal(true);
      return;
    }
    startRecordingProcess();
  };

  const startRecordingProcess = async () => {
    if (recordingState === 'idle') {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        // Fallback for demo purposes when mic is not available
        console.log("Using mock recording mode for demo");
      }

      if (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setUserAudioUrl(audioUrl);
          }
          stream!.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
      } else {
        // Mock mode: simulate a recording
        mediaRecorderRef.current = {
          state: 'recording',
          stop: () => {
            if (mediaRecorderRef.current) {
              (mediaRecorderRef.current as any).state = 'inactive';
            }
            // Use a valid silent WAV data URI so the audio element doesn't throw "no supported sources"
            setUserAudioUrl('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
          }
        } as any;
      }

      setRecordingState('recording');
      setRecordingProgress(0);
      setUserAudioUrl(null);
      recordingStartTimeRef.current = performance.now();
      
      const updateProgress = (timestamp: number) => {
        const elapsed = (timestamp - recordingStartTimeRef.current) / 1000;
        const progress = Math.min(1, elapsed / audioDuration);
        setRecordingProgress(progress);
        
        if (progress < 1) {
          progressAnimationRef.current = requestAnimationFrame(updateProgress);
        } else {
          finishRecording();
        }
      };
      progressAnimationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const finishRecording = () => {
    if (progressAnimationRef.current) cancelAnimationFrame(progressAnimationRef.current);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setRecordingState('scoring');
    
    setTimeout(() => {
      const simulatedScore = Math.floor(Math.random() * 101);
      let calculatedStars = 0;
      if (simulatedScore >= 90) calculatedStars = 3;
      else if (simulatedScore >= 70) calculatedStars = 2;
      else if (simulatedScore >= 40) calculatedStars = 1;
      
      setStars(calculatedStars);
      setRecordingState('scored');

      if (calculatedStars === 3) {
        playCelebrationSound();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
          zIndex: 2000
        });
      }
    }, 1500);
  };

  const handleStopRecording = () => {
    if (recordingState === 'recording') {
      finishRecording();
    }
  };

  const handleNext = () => {
    if (audioRef.current) audioRef.current.pause();
    if (userAudioRef.current) userAudioRef.current.pause();
    if (currentIndex < READ_ALOUD_PAGES.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
      setRecordingState('idle');
      setStars(0);
      setRecordingProgress(0);
      setOriginalPlaybackProgress(0);
      setUserPlaybackProgress(0);
      if (userAudioUrl && userAudioUrl.startsWith('blob:')) URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    } else {
      onFinish();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
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
      x: direction < 0 ? '100%' : '-100%',
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
          <X size={28} />
        </button>
        <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] uppercase text-slate-600">
          绘本跟读 ({currentIndex + 1}/{READ_ALOUD_PAGES.length})
        </h2>
        <button onClick={onFinish} className="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold text-[clamp(12px,3vw,14px)] active:scale-95 transition-all whitespace-nowrap">
          跳过本环节
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center p-[clamp(16px,4vw,24px)] relative overflow-hidden">
        {/* Image Area */}
        <div className="w-full h-[50%] sm:h-[60%] relative flex justify-center items-center">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full flex justify-center items-center"
            >
              <img 
                src={READ_ALOUD_PAGES[currentIndex].image} 
                alt={`Page ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-lg border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 right-4 flex flex-col space-y-3">
                <button
                  onClick={playOriginalAudio}
                  className="w-16 h-16 bg-white/90 backdrop-blur-sm text-purple-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                  {isOriginalPlaying ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
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
          src={READ_ALOUD_PAGES[currentIndex].audio} 
          onPlay={() => setIsOriginalPlaying(true)}
          onPause={() => setIsOriginalPlaying(false)}
          onEnded={() => { setIsOriginalPlaying(false); setOriginalPlaybackProgress(0); }}
          onTimeUpdate={(e) => {
            const audio = e.currentTarget;
            if (audio.duration) {
              setOriginalPlaybackProgress(audio.currentTime / audio.duration);
            }
          }}
        />
        {userAudioUrl && (
          <audio 
            ref={userAudioRef} 
            src={userAudioUrl} 
            onPlay={() => setIsUserPlaying(true)}
            onPause={() => setIsUserPlaying(false)}
            onEnded={() => { setIsUserPlaying(false); setUserPlaybackProgress(0); }}
            onTimeUpdate={(e) => {
              const audio = e.currentTarget;
              if (audio.duration) {
                setUserPlaybackProgress(audio.currentTime / audio.duration);
              }
            }}
          />
        )}

        {/* Interaction Area */}
        <div className="w-full flex-1 mt-6 flex flex-col items-center justify-center relative">
          
          {/* Waveform Progress Bar */}
          <div className="w-full max-w-sm mb-4 px-4 relative h-12">
            <AnimatePresence>
              <motion.div 
                key={currentIndex} 
                className="absolute inset-0 flex items-end justify-between gap-[3px] w-full"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.3 / 50,
                    }
                  },
                  exit: {
                    transition: {
                      staggerChildren: 0.3 / 50,
                      staggerDirection: 1
                    }
                  }
                }}
              >
                {(isOriginalPlaying || isUserPlaying) && (
                  <motion.div 
                    className={`absolute top-0 bottom-0 w-1 rounded-full z-10 ${isOriginalPlaying ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`}
                    style={{ left: `${(isOriginalPlaying ? originalPlaybackProgress : userPlaybackProgress) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                )}
                {currentWaveform.map((amp, idx) => {
                  const activeProgress = isOriginalPlaying ? originalPlaybackProgress : (isUserPlaying ? userPlaybackProgress : recordingProgress);
                  const isFilled = (idx / currentWaveform.length) <= activeProgress;
                  const fillColor = isOriginalPlaying ? 'bg-purple-400' : (isUserPlaying ? 'bg-green-400' : 'bg-blue-500');
                  return (
                    <motion.div
                      key={idx}
                      className={`flex-1 rounded-full ${isFilled ? fillColor : 'bg-slate-200'}`}
                      variants={{
                        hidden: { height: 0 },
                        visible: { height: `${Math.max(12, amp * 100)}%`, transition: { duration: 0.3, ease: "easeOut" } },
                        exit: { height: 0, transition: { duration: 0.3, ease: "easeIn" } }
                      }}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {recordingState === 'idle' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <button 
                onClick={handleRecordClick}
                className="w-[clamp(80px,20vw,100px)] h-[clamp(80px,20vw,100px)] bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(59,130,246,0.4)] active:scale-95 transition-all"
              >
                <Mic size={48} />
              </button>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
                <button 
                  onClick={handleStopRecording}
                  className="w-[clamp(80px,20vw,100px)] h-[clamp(80px,20vw,100px)] bg-red-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(239,68,68,0.4)] relative z-10 active:scale-95 transition-all"
                >
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
              <p className="mt-4 text-[clamp(18px,4.5vw,20px)] font-bold text-amber-500">AI 评分中...</p>
            </div>
          )}

          {recordingState === 'scored' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 w-full max-w-md">
              <div className="flex items-center justify-center space-x-2 mb-8">
                {[1, 2, 3].map((starIndex) => (
                  <motion.div 
                    key={starIndex}
                    className="relative flex items-center justify-center"
                    initial={{ scale: starIndex <= stars ? 0 : 1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: starIndex <= stars ? starIndex * 0.15 : 0, bounce: 0.6, duration: 0.6 }}
                  >
                    <Star 
                      size={64} 
                      className={`${starIndex <= stars ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-slate-200 fill-slate-200'} transition-colors duration-500`} 
                    />
                    {starIndex <= stars && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                        <motion.div
                          initial={{ x: '-150%' }}
                          animate={{ x: '150%' }}
                          transition={{ delay: starIndex * 0.15 + 0.2, duration: 0.8, ease: "easeInOut" }}
                          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 mix-blend-overlay opacity-80"
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="flex space-x-4 w-full px-4">
                <button 
                  onClick={() => {
                    if (audioRef.current) audioRef.current.pause();
                    if (userAudioRef.current) userAudioRef.current.pause();
                    setRecordingState('idle');
                    setRecordingProgress(0);
                    setOriginalPlaybackProgress(0);
                    setUserPlaybackProgress(0);
                    if (userAudioUrl && userAudioUrl.startsWith('blob:')) URL.revokeObjectURL(userAudioUrl);
                    setUserAudioUrl(null);
                  }}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl active:scale-95 transition-all flex items-center justify-center"
                >
                  <RotateCcw size={32} />
                </button>
                <button 
                  onClick={handleNext}
                  className="flex-1 py-4 bg-green-500 text-white rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center"
                >
                  <ArrowRight size={32} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="absolute inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-[clamp(24px,6vw,40px)] w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <Mic size={40} />
            </div>
            <h3 className="text-[clamp(20px,5vw,24px)] font-black text-slate-800 mb-2">允许使用麦克风</h3>
            <p className="text-slate-500 font-medium mb-8">我们需要使用麦克风来听你读英语哦！请在弹出的提示中选择“允许”。</p>
            <div className="flex w-full space-x-4">
              <button 
                onClick={() => setShowPermissionModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold active:scale-95 transition-all"
              >
                稍后
              </button>
              <button 
                onClick={() => {
                  setShowPermissionModal(false);
                  setHasMicPermission(true);
                  startRecordingProcess();
                }}
                className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
              >
                好的，允许
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Play, Pause, CheckCircle } from 'lucide-react';

// Dummy data for the e-book. Replace with actual paths.
const EBOOK_PAGES = [
  { id: 'cover', image: 'https://picsum.photos/seed/cover/600/800', audio: null }, // Front Cover
  { id: 'page1', image: 'https://picsum.photos/seed/page1/600/800', audio: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { id: 'page2', image: 'https://picsum.photos/seed/page2/600/800', audio: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { id: 'page3', image: 'https://picsum.photos/seed/page3/600/800', audio: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { id: 'page4', image: 'https://picsum.photos/seed/page4/600/800', audio: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { id: 'page5', image: 'https://picsum.photos/seed/page5/600/800', audio: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { id: 'page6', image: 'https://picsum.photos/seed/page6/600/800', audio: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { id: 'page7', image: 'https://picsum.photos/seed/page7/600/800', audio: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { id: 'page8', image: 'https://picsum.photos/seed/page8/600/800', audio: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
  { id: 'backcover', image: 'https://picsum.photos/seed/backcover/600/800', audio: null }, // Back Cover
];

interface PageProps {
  page: typeof EBOOK_PAGES[0];
  number: number;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div className="page bg-white shadow-md overflow-hidden" ref={ref} data-density="hard">
      <div className="w-full h-full relative">
        <img 
          src={props.page.image} 
          alt={`Page ${props.number}`} 
          className="w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
});

export const EbookReader = ({ onFinish, onBack }: { onFinish: () => void, onBack: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bookRef = useRef<any>(null);

  const onPage = (e: any) => {
    setCurrentPage(e.data);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    }
  };

  useEffect(() => {
    const handleAudioEnded = () => setIsPlaying(false);
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.addEventListener('ended', handleAudioEnded);
    }
    return () => {
      if (audioEl) {
        audioEl.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [currentPage]);

  // Determine current audio source based on the visible pages
  // If showCover is true, page 0 is right side (cover).
  // Page 1 is left, Page 2 is right.
  // We play audio for the right page if it's a spread, or just the current page.
  // Let's just play the audio of the current right-side page, or the cover if it's page 0.
  // E.g., currentPage is the index of the left page in a spread, except for cover which is 0.
  // Actually, e.data in onPage gives the current page index.
  const currentAudioSrc = EBOOK_PAGES[currentPage]?.audio || (currentPage + 1 < EBOOK_PAGES.length ? EBOOK_PAGES[currentPage + 1]?.audio : null);

  const isLastPage = currentPage >= EBOOK_PAGES.length - 2; // If it's the last spread or back cover

  return (
    <div className="relative h-full w-full bg-slate-100 z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800">
      <header className="h-[12%] px-[4%] flex items-center justify-between bg-white border-b border-slate-200 shadow-sm z-10">
        <button onClick={onBack} className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] uppercase text-slate-600">阅读电子书</h2>
        <div className="w-[clamp(40px,12vw,56px)]" />
      </header>

      <main className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-800/5">
        <div className="w-full max-w-4xl aspect-[3/2] flex items-center justify-center">
          {/* @ts-ignore - react-pageflip types are sometimes missing or incomplete */}
          <HTMLFlipBook
            width={400}
            height={600}
            size="stretch"
            minWidth={300}
            maxWidth={600}
            minHeight={400}
            maxHeight={800}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPage}
            className="ebook-flipbook"
            ref={bookRef}
            usePortrait={false}
          >
            {EBOOK_PAGES.map((page, index) => (
              <Page key={page.id} page={page} number={index} />
            ))}
          </HTMLFlipBook>
        </div>

        {/* Audio Element */}
        {currentAudioSrc && (
          <audio ref={audioRef} src={currentAudioSrc} />
        )}

        {/* Play/Pause Button */}
        {currentAudioSrc && (
          <button 
            onClick={toggleAudio}
            className="absolute bottom-[8%] right-[8%] -translate-x-10 w-[clamp(56px,15vw,72px)] h-[clamp(56px,15vw,72px)] bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-600 transition-transform active:scale-95 z-20"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
          </button>
        )}

        {/* Complete Button on Last Page */}
        {isLastPage && (
          <button 
            onClick={onFinish}
            className="absolute top-1/2 -translate-y-1/2 right-[4%] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center space-x-3 hover:bg-green-600 transition-transform active:scale-95 z-20 animate-in fade-in slide-in-from-right-8 duration-500"
          >
            <span className="font-black text-xl tracking-wider">完成环节</span>
            <CheckCircle size={28} />
          </button>
        )}
      </main>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Play, Pause, CheckCircle } from 'lucide-react';

export const EBOOK_PAGES = [
 { id: 'cover', image: '/U6%20L1%20D1/00.jpg', audio: '/U6%20L1%20D1/00.MP3', position: 'full' },
 { id: 'page1-left', image: '/U6%20L1%20D1/01.jpg', audio: null, position: 'left' },
 { id: 'page1-right', image: '/U6%20L1%20D1/01.jpg', audio: '/U6%20L1%20D1/01.MP3', position: 'right' },
 { id: 'page2-left', image: '/U6%20L1%20D1/02.jpg', audio: null, position: 'left' },
 { id: 'page2-right', image: '/U6%20L1%20D1/02.jpg', audio: '/U6%20L1%20D1/02.MP3', position: 'right' },
 { id: 'page3-left', image: '/U6%20L1%20D1/03.jpg', audio: null, position: 'left' },
 { id: 'page3-right', image: '/U6%20L1%20D1/03.jpg', audio: '/U6%20L1%20D1/03.MP3', position: 'right' },
 { id: 'page4-left', image: '/U6%20L1%20D1/04.jpg', audio: null, position: 'left' },
 { id: 'page4-right', image: '/U6%20L1%20D1/04.jpg', audio: '/U6%20L1%20D1/04.MP3', position: 'right' },
 { id: 'page5-left', image: '/U6%20L1%20D1/05.jpg', audio: null, position: 'left' },
 { id: 'page5-right', image: '/U6%20L1%20D1/05.jpg', audio: '/U6%20L1%20D1/05.MP3', position: 'right' },
 { id: 'page6-left', image: '/U6%20L1%20D1/06.jpg', audio: null, position: 'left' },
 { id: 'page6-right', image: '/U6%20L1%20D1/06.jpg', audio: '/U6%20L1%20D1/06.MP3', position: 'right' },
 { id: 'page7-left', image: '/U6%20L1%20D1/07.jpg', audio: null, position: 'left' },
 { id: 'page7-right', image: '/U6%20L1%20D1/07.jpg', audio: '/U6%20L1%20D1/07.MP3', position: 'right' },
 { id: 'page8-left', image: '/U6%20L1%20D1/08.jpg', audio: null, position: 'left' },
 { id: 'page8-right', image: '/U6%20L1%20D1/08.jpg', audio: '/U6%20L1%20D1/08.MP3', position: 'right' },
 { id: 'backcover', image: '/U6%20L1%20D1/09.jpg', audio: null, position: 'full' },
];

interface PageProps {
 page: typeof EBOOK_PAGES[0];
 number: number;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
 const { image, position } = props.page;
 return (
 <div className="page bg-white shadow-md overflow-hidden" ref={ref} data-density="hard">
 <div className="w-full h-full relative overflow-hidden">
 <img 
 src={image} 
 alt={`Page ${props.number}`} 
 className="absolute top-0 h-full max-w-none pointer-events-none"
 style={{
 width: position === 'full' ? '100%' : '200%',
 left: position === 'right' ? '-100%' : '0',
 objectFit: 'fill'
 }}
 referrerPolicy="no-referrer"
 />
 </div>
 </div>
 );
});

export const EbookReader = ({ onFinish, onBack }: { onFinish: () => void, onBack: () => void }) => {
 const [currentPage, setCurrentPage] = useState(0);
 const [isPlaying, setIsPlaying] = useState(false);
 const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
 const [bookRatio, setBookRatio] = useState(0);
 const audioRef = useRef<HTMLAudioElement | null>(null);
 const bookRef = useRef<any>(null);
 const containerRef = useRef<HTMLDivElement>(null);
 const hasAutoFlippedRef = useRef(false);

 // 1. Calculate Book Aspect Ratio from the first representative page
 useEffect(() => {
 const samplePage = EBOOK_PAGES.find(p => p.position !== 'full') || EBOOK_PAGES[0];
 const img = new Image();
 img.src = samplePage.image;
 img.onload = () => {
 const ratio = samplePage.position === 'full' 
 ? img.width / img.height 
 : (img.width / 2) / img.height;
 setBookRatio(ratio);
 };
 }, []);

 // 2. Dynamic Sizing based on container and book ratio
 useEffect(() => {
 if (bookRatio === 0) return;

 const updateDimensions = () => {
 if (!containerRef.current) return;
 
 const containerWidth = containerRef.current.clientWidth;
 const containerHeight = containerRef.current.clientHeight;
 
 // We want to fit a spread (2 pages) into the container
 // Spread Aspect Ratio = (2 * pageWidth) / pageHeight = 2 * bookRatio
 const spreadRatio = 2 * bookRatio;
 
 let finalPageWidth, finalPageHeight;
 
 // Apply some padding
 const maxWidth = containerWidth * 0.92;
 const maxHeight = containerHeight * 0.92;

 if (maxWidth / maxHeight > spreadRatio) {
 // Height is the limiting factor
 finalPageHeight = maxHeight;
 finalPageWidth = finalPageHeight * bookRatio;
 } else {
 // Width is the limiting factor
 const finalSpreadWidth = maxWidth;
 finalPageWidth = finalSpreadWidth / 2;
 finalPageHeight = finalPageWidth / bookRatio;
 }

 setPageDimensions({
 width: Math.floor(finalPageWidth),
 height: Math.floor(finalPageHeight)
 });
 };

 const observer = new ResizeObserver(updateDimensions);
 if (containerRef.current) observer.observe(containerRef.current);
 updateDimensions();

 return () => observer.disconnect();
 }, [bookRatio]);

   const currentAudioSrc = EBOOK_PAGES[currentPage]?.audio || (currentPage + 1 < EBOOK_PAGES.length ? EBOOK_PAGES[currentPage + 1]?.audio : null);
  const isLastPage = currentPage >= EBOOK_PAGES.length - 2;

  const onPage = (e: any) => {
    setCurrentPage(e.data);
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
    let timeoutId: NodeJS.Timeout;
    
    const handleAudioEnded = () => {
      setIsPlaying(false);
      // Auto-flip to next page if on cover page (index 0) and hasn't auto-flipped yet
      if (currentPage === 0 && !hasAutoFlippedRef.current) {
        hasAutoFlippedRef.current = true;
        timeoutId = setTimeout(() => {
          if (bookRef.current && bookRef.current.pageFlip()) {
            bookRef.current.pageFlip().flipNext();
          }
        }, 1000);
      }
    };
    
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.addEventListener('ended', handleAudioEnded);
    }
    return () => {
      if (audioEl) {
        audioEl.removeEventListener('ended', handleAudioEnded);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentAudioSrc, currentPage]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // If we are on the cover page and there is no audio, flip after 2 seconds (only once)
    if (currentPage === 0 && !currentAudioSrc && !hasAutoFlippedRef.current) {
      hasAutoFlippedRef.current = true;
      timeoutId = setTimeout(() => {
        if (bookRef.current && bookRef.current.pageFlip()) {
          bookRef.current.pageFlip().flipNext();
        }
      }, 2000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentPage, currentAudioSrc]);

  useEffect(() => {
    const audioEl = audioRef.current;
    let isActive = true;

    if (audioEl && currentAudioSrc) {
      // Reset and play
      audioEl.pause();
      audioEl.currentTime = 0;
      
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (isActive) setIsPlaying(true);
        }).catch(err => {
          // Ignore AbortError which happens when play() is interrupted by pause()
          if (err.name !== 'AbortError') {
            console.error("Auto-play failed:", err);
          }
          if (isActive) setIsPlaying(false);
        });
      }
    } else if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
      if (isActive) setIsPlaying(false);
    }

    return () => {
      isActive = false;
      // When the effect re-runs (page changes) or component unmounts, 
      // we should pause the current audio to prevent it from continuing to play
      if (audioEl) {
        audioEl.pause();
      }
    };
  }, [currentAudioSrc]);

 return (
 <div className="relative h-full w-full bg-slate-100 z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800">
 <header className="h-[12%] px-[4%] flex items-center justify-between bg-white border-b border-slate-200 shadow-sm z-10">
 <button onClick={onBack} className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 transition-colors active:brightness-90">
 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
 </button>
 <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] uppercase text-slate-600">E-Book</h2>
 <button onClick={onFinish} className="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold text-[clamp(12px,3vw,14px)] active:scale-95 active:brightness-90 transition-all whitespace-nowrap">
   Skip
 </button>
 </header>

 <main ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-800/5 p-[4%]">
 <div className="w-full h-full flex items-center justify-center">
 {pageDimensions.width > 0 && (
 // @ts-ignore - react-pageflip types are sometimes missing or incomplete
 <HTMLFlipBook
 width={pageDimensions.width}
 height={pageDimensions.height}
 size="stretch"
 minWidth={100}
 maxWidth={3000}
 minHeight={100}
 maxHeight={3000}
 maxShadowOpacity={0.5}
 showCover={true}
 showPageCorners={false}
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
 )}
 </div>

 {/* Audio Element */}
 {currentAudioSrc && (
 <audio ref={audioRef} src={currentAudioSrc} />
 )}

 {/* Play/Pause Button */}
 {currentAudioSrc && (
 <button 
 onClick={toggleAudio}
 className="absolute bottom-[8%] right-[8%] -translate-x-10 w-[clamp(56px,15vw,72px)] h-[clamp(56px,15vw,72px)] bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95 z-20"
 >
 {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
 </button>
 )}

 {/* Complete Button on Last Page */}
 {isLastPage && (
 <button 
 onClick={onFinish}
 className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center space-x-3 transition-transform active:scale-95 active:brightness-90 z-20 animate-in fade-in slide-in-from-bottom-8 duration-500"
 >
 <span className="font-black text-xl tracking-wider">Finish</span>
 <CheckCircle size={28} />
 </button>
 )}
 </main>
 <div className="absolute bottom-0 left-0 h-1.5 bg-blue-500 transition-all duration-500 z-50 rounded-r-full" style={{ width: `${((currentPage + 1) / EBOOK_PAGES.length) * 100}%` }} />
 </div>
 );
};

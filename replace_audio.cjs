const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/EbookReader.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = `  const onPage = (e: any) => {
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

  const currentAudioSrc = EBOOK_PAGES[currentPage]?.audio || (currentPage + 1 < EBOOK_PAGES.length ? EBOOK_PAGES[currentPage + 1]?.audio : null);
  const isLastPage = currentPage >= EBOOK_PAGES.length - 2;`;

const replacement = `  const currentAudioSrc = EBOOK_PAGES[currentPage]?.audio || (currentPage + 1 < EBOOK_PAGES.length ? EBOOK_PAGES[currentPage + 1]?.audio : null);
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
  }, [currentAudioSrc]);

  useEffect(() => {
    const audioEl = audioRef.current;
    let isActive = true;

    if (audioEl && currentAudioSrc) {
      audioEl.pause();
      audioEl.currentTime = 0;
      
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (isActive) setIsPlaying(true);
        }).catch(err => {
          console.error("Auto-play failed:", err);
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
    };
  }, [currentAudioSrc]);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content);
  console.log('Successfully replaced content.');
} else {
  console.log('Target content not found. Trying to find with regex...');
  // Let's just do a regex replace for the whole block
  const regex = /const onPage = \(e: any\) => \{[\s\S]*?const isLastPage = currentPage >= EBOOK_PAGES\.length - 2;/;
  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content);
    console.log('Successfully replaced content using regex.');
  } else {
    console.log('Regex also failed.');
  }
}

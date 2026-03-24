const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/EbookReader.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add hasAutoFlippedRef
const refTarget = `  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bookRef = useRef<any>(null);`;
const refReplacement = `  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bookRef = useRef<any>(null);
  const hasAutoFlippedRef = useRef(false);`;

if (content.includes(refTarget)) {
  content = content.replace(refTarget, refReplacement);
  console.log('Added hasAutoFlippedRef.');
}

// 2. Update audio ended effect
const effect1Target = `  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleAudioEnded = () => {
      setIsPlaying(false);
      // Auto-flip to next page if on cover page (index 0)
      if (currentPage === 0) {
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
  }, [currentAudioSrc, currentPage]);`;

const effect1Replacement = `  useEffect(() => {
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
  }, [currentAudioSrc, currentPage]);`;

if (content.includes(effect1Target)) {
  content = content.replace(effect1Target, effect1Replacement);
  console.log('Updated audio ended effect.');
}

// 3. Update no audio effect
const effect2Target = `  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // If we are on the cover page and there is no audio, flip after 2 seconds
    if (currentPage === 0 && !currentAudioSrc) {
      timeoutId = setTimeout(() => {
        if (bookRef.current && bookRef.current.pageFlip()) {
          bookRef.current.pageFlip().flipNext();
        }
      }, 2000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentPage, currentAudioSrc]);`;

const effect2Replacement = `  useEffect(() => {
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
  }, [currentPage, currentAudioSrc]);`;

if (content.includes(effect2Target)) {
  content = content.replace(effect2Target, effect2Replacement);
  console.log('Updated no audio effect.');
}

fs.writeFileSync(filePath, content);
console.log('Done.');

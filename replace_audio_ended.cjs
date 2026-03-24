const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/EbookReader.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = `  useEffect(() => {
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
  }, [currentAudioSrc]);`;

const replacement = `  useEffect(() => {
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
  }, [currentAudioSrc, currentPage]);

  useEffect(() => {
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

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content);
  console.log('Successfully replaced content.');
} else {
  console.log('Target content not found. Trying to find with regex...');
  // Let's just do a regex replace for the whole block
  const regex = /  useEffect\(\(\) => \{\s+const handleAudioEnded = \(\) => setIsPlaying\(false\);\s+const audioEl = audioRef\.current;\s+if \(audioEl\) \{\s+audioEl\.addEventListener\('ended', handleAudioEnded\);\s+\}\s+return \(\) => \{\s+if \(audioEl\) \{\s+audioEl\.removeEventListener\('ended', handleAudioEnded\);\s+\}\s+\};\s+\}, \[currentAudioSrc\]\);/;
  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content);
    console.log('Successfully replaced content using regex.');
  } else {
    console.log('Regex also failed.');
  }
}

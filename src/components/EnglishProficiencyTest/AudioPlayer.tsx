import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { Button } from './Button';

interface AudioPlayerProps {
  text: string;
  audio?: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, audio, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (audio) {
      // Play audio file
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audioObj = new Audio(audio);
      audioRef.current = audioObj;
      
      audioObj.onplay = () => setIsPlaying(true);
      audioObj.onended = () => setIsPlaying(false);
      audioObj.onerror = () => {
        setIsPlaying(false);
        console.error('Error playing audio file:', audio);
        // Fallback to speech synthesis if file fails
        playSpeech();
      };
      
      const playPromise = audioObj.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          if (err.name === 'AbortError') {
            // Ignore interruption errors as they are expected during rapid navigation
            return;
          }
          console.error('Audio play failed:', err);
          setIsPlaying(false);
        });
      }
    } else {
      playSpeech();
    }
  };

  const playSpeech = () => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for kids
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (autoPlay) {
      // Small delay to ensure component is mounted and user has interacted
      const timer = setTimeout(() => {
        playAudio();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [text, audio, autoPlay]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <Button
      variant="secondary"
      size="icon"
      className="rounded-full w-16 h-16"
      onClick={playAudio}
      aria-label="Play audio"
    >
      <motion.div
        animate={isPlaying ? {
          scale: [1, 1.1, 1],
          opacity: [1, 0.7, 1]
        } : {
          scale: 1,
          opacity: 1
        }}
        transition={isPlaying ? {
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut"
        } : {
          duration: 0.2
        }}
      >
        <Volume2 size={32} />
      </motion.div>
    </Button>
  );
};

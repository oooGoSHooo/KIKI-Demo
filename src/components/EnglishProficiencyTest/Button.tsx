import React from 'react';
import { cn } from './utils';

let audioCtx: AudioContext | null = null;

export const playClickSound = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors
  }
};

export const playSuccessSound = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    
    // Three-tone rising sequence (C5, E5, G5)
    const tones = [523.25, 659.25, 783.99];
    
    tones.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.connect(gain);
      gain.connect(audioCtx!.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.2);
    });
  } catch (e) {
    // Ignore audio errors
  }
};

export const playWarningSound = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    [0, 0.4].forEach(delay => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.connect(gain);
      gain.connect(audioCtx!.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now + delay);
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + delay + 0.2);
      osc.start(now + delay);
      osc.stop(now + delay + 0.2);
    });
  } catch (e) {
    // Ignore audio errors
  }
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', onClick, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-semibold transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-[#ED7470] text-white shadow-[0_4px_0_#C55D59] active:shadow-[0_0px_0_#C55D59] active:translate-y-1',
      secondary: 'bg-[#4ECDC4] text-white shadow-[0_4px_0_#3baea5] active:shadow-[0_0px_0_#3baea5] active:translate-y-1',
      accent: 'bg-[#FFE66D] text-[#2F3640] shadow-[0_4px_0_#e6cf5c] active:shadow-[0_0px_0_#e6cf5c] active:translate-y-1',
      outline: 'border-2 border-[#2F3640] text-[#2F3640] bg-transparent',
      ghost: 'bg-transparent text-[#2F3640]',
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm',
      md: 'h-14 px-6 text-lg',
      lg: 'h-16 px-8 text-xl',
      icon: 'h-14 w-14',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClickSound();
      if (onClick) onClick(e);
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { 
  ChevronLeft, X, Gem, Settings, Trophy, 
  Calendar as CalendarIcon, Award, Play, 
  ArrowLeft, ArrowRight, Check, Lock, Camera,
  Footprints, Sunrise, Gift, Ear, Mic, BookOpen, 
  Repeat, CalendarCheck, ShoppingBag, Palette, 
  Zap, Star, Medal, Crown, Target, Rocket,
  ShieldCheck, BarChart3, Bell, Sliders, User,
  Clock, Map
} from 'lucide-react';

/**
 * 核心任务配置数据
 */
const TASK_DATA = [
  { id: 'listen', name: '听 (LISTEN)', color: '#3b82f6', icon: '🎧', subs: ['视频', '童谣', '听音', '互动'], rewardName: '听力能量包' },
  { id: 'speak', name: '说 (SPEAK)', color: '#22c55e', icon: '🎙️', subs: ['跟读', 'AI评测'], rewardName: '口语奖励箱' },
  { id: 'read', name: '读 (READ)', color: '#f59e0b', icon: '📖', subs: ['认读', '拼读'], rewardName: '阅读宝藏库' },
  { id: 'write', name: '写 (WRITE)', color: '#a855f7', icon: '✍️', subs: ['排序', '拼写'], rewardName: '书写大师杯' }
];

/**
 * 勋章成就数据 (包含12个预设解锁)
 */
const ACHIEVEMENTS_LIST = [
  { id: 'a1', name: '第一步', intro: '开启奇妙探险的第一步！', iconBg: 'bg-blue-100', iconColor: 'text-blue-500', IconComponent: Footprints, acquired: true },
  { id: 'a2', name: '宝箱开启者', intro: '这里面藏着魔法！', iconBg: 'bg-amber-100', iconColor: 'text-amber-500', IconComponent: Gift, acquired: true },
  { id: 'a3', name: '开口第一声', intro: '勇敢地说出来吧。', iconBg: 'bg-green-100', iconColor: 'text-green-500', IconComponent: Mic, acquired: true },
  { id: 'a4', name: '三日晨光', intro: '连续三天保持探险状态。', iconBg: 'bg-orange-100', iconColor: 'text-orange-500', IconComponent: Sunrise, acquired: true },
  { id: 'a5', name: '第一桶金', intro: '赚到了第一份学费(500钻)。', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', IconComponent: Gem, acquired: true },
  { id: 'a6', name: '小耳朵L1', intro: '我在认真听哦！(10个任务)', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-500', IconComponent: Ear, acquired: true },
  { id: 'a7', name: '读书笔记', intro: '绘本里有大世界。(5个任务)', iconBg: 'bg-teal-100', iconColor: 'text-teal-500', IconComponent: BookOpen, acquired: true },
  { id: 'a8', name: '复读机', intro: '听一遍，再说一遍。(重试3次)', iconBg: 'bg-purple-100', iconColor: 'text-purple-500', IconComponent: Repeat, acquired: true },
  { id: 'a9', name: '补救专家', intro: '哪怕迟到，也要赶到。', iconBg: 'bg-rose-100', iconColor: 'text-rose-500', IconComponent: CalendarCheck, acquired: true },
  { id: 'a10', name: '疯狂购物', intro: '我要把商场搬回家。', iconBg: 'bg-pink-100', iconColor: 'text-pink-500', IconComponent: ShoppingBag, acquired: true },
  { id: 'a11', name: '字母小画家', intro: '认识了26个好朋友。', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-500', IconComponent: Palette, acquired: true },
  { id: 'a12', name: '七日之约', intro: '第一个完整的一周。', iconBg: 'bg-lime-100', iconColor: 'text-lime-600', IconComponent: CalendarIcon, acquired: true },
  { id: 'b1', name: '习惯的魔力', intro: '21天，你变强了！', iconBg: 'bg-red-200', iconColor: 'text-red-600', IconComponent: Zap, acquired: false },
  { id: 'b2', name: '金牌小声优', intro: '你的声音真好听(10次优)。', iconBg: 'bg-fuchsia-200', iconColor: 'text-fuchsia-600', IconComponent: Star, acquired: false },
  { id: 'b3', name: '千千小勇士', intro: '成功晋升L2！', iconBg: 'bg-blue-200', iconColor: 'text-blue-700', IconComponent: Medal, acquired: false },
  { id: 'b4', name: '大满贯之星', intro: '今天的我最完美(全勤奖)。', iconBg: 'bg-yellow-200', iconColor: 'text-yellow-700', IconComponent: Award, acquired: false },
];

const MOCK_HISTORY_STATUS: Record<number, number> = {
  1: 2, 2: 2, 3: 1, 4: 0, 5: 2, 6: 2, 7: 2, 8: 1, 9: 0, 10: 2, 11: 2, 12: 2, 13: 1
};

const RADAR_DATA = [
  { subject: '说', grade: 'A', A: 80, fullMark: 100 },
  { subject: '写', grade: 'B', A: 40, fullMark: 100 },
  { subject: '读', grade: 'B-', A: 30, fullMark: 100 },
  { subject: '听', grade: 'C', A: 20, fullMark: 100 },
];

const CustomPolarGrid = ({ cx, cy, polarRadius, polarAngles }: any) => {
  if (!polarRadius || !polarAngles) return null;
  const maxRadius = Math.max(...polarRadius);
  const step = maxRadius / 4;
  return (
    <g>
      <circle cx={cx} cy={cy} r={step * 4} fill="#fff7ed" stroke="none" />
      <circle cx={cx} cy={cy} r={step * 3} fill="#ffedd5" stroke="none" />
      <circle cx={cx} cy={cy} r={step * 2} fill="#fed7aa" stroke="none" />
      <circle cx={cx} cy={cy} r={step * 1} fill="#fdba74" stroke="none" />
      {polarAngles.map((angle: number, index: number) => {
        const rad = -angle * Math.PI / 180;
        const x = cx + maxRadius * Math.cos(rad);
        const y = cy + maxRadius * Math.sin(rad);
        return (
          <line key={index} x1={cx} y1={cy} x2={x} y2={y} stroke="#fdba74" strokeWidth={1} opacity={0.6} />
        );
      })}
    </g>
  );
};

const CustomTick = ({ payload, x, y, textAnchor, stroke, radius }: any) => {
  const dataItem = RADAR_DATA.find(item => item.subject === payload.value);
  return (
    <g className="recharts-layer recharts-polar-angle-axis-tick">
      <text radius={radius} stroke={stroke} x={x} y={y} className="recharts-text recharts-polar-angle-axis-tick-value" textAnchor={textAnchor}>
        <tspan x={x} dy="-0.2em" fill="#4b5563" fontSize="14" fontWeight="bold">{payload.value}</tspan>
        <tspan x={x} dy="1.4em" fill="#f97316" fontSize="14" fontWeight="bold">{dataItem?.grade}</tspan>
      </text>
    </g>
  );
};

const useVerticalDragToScroll = () => {
  const ref = useRef<any>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    isDragging.current = true;
    startY.current = e.pageY - ref.current.offsetTop;
    scrollTop.current = ref.current.scrollTop;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const y = e.pageY - ref.current.offsetTop;
    const walk = (y - startY.current) * 1.5;
    ref.current.scrollTop = scrollTop.current - walk;
  };

  return { ref, onMouseDown: handleMouseDown, onMouseLeave: handleMouseLeave, onMouseUp: handleMouseUp, onMouseMove: handleMouseMove };
};

const AwardCard = ({ ach }: { ach: any }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className={`relative w-full [perspective:1000px] ${ach.acquired ? 'cursor-pointer group' : ''}`}
      onClick={() => ach.acquired && setFlipped(!flipped)}
    >
      <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* Front */}
        <div 
          className={`relative [backface-visibility:hidden] rounded-[32px] p-5 sm:p-6 flex flex-col items-center justify-center text-center border-2 transition-all duration-300 ${
            ach.acquired 
              ? 'bg-white border-slate-100 shadow-lg group-hover:-translate-y-1 group-hover:shadow-xl' 
              : 'bg-slate-50 border-transparent opacity-50 grayscale'
          }`}
        >
          <div className={`w-16 h-16 sm:w-20 sm:h-20 ${ach.iconBg} rounded-full flex items-center justify-center mb-4 shadow-inner relative`}>
            {ach.acquired && <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />}
            <ach.IconComponent size={32} className={`${ach.iconColor} drop-shadow-sm relative z-10`} />
          </div>
          <h3 className="font-black text-slate-800 text-sm sm:text-base mb-1.5">{ach.name}</h3>
          <p className="text-xs text-slate-500 leading-snug line-clamp-2 font-medium">{ach.intro}</p>
        </div>

        {/* Back */}
        <div 
          className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[32px] p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-lg ${ach.iconBg}`}
        >
          <div className={`w-12 h-12 bg-white/50 rounded-full flex items-center justify-center mb-3 shadow-inner`}>
            <CalendarIcon size={24} className={ach.iconColor} />
          </div>
          <h3 className={`font-black ${ach.iconColor} text-sm sm:text-base mb-2`}>获得日期</h3>
          <p className={`text-xs sm:text-sm font-bold ${ach.iconColor} opacity-80`}>2025年03月15日</p>
        </div>

      </div>
    </div>
  );
};

export default function App() {
  // --- 状态管理 ---
  const [currentView, setCurrentView] = useState('home');
  const [majorIdx, setMajorIdx] = useState(0); 
  const [subIdx, setSubIdx] = useState(0);     
  const [diamonds, setDiamonds] = useState(500); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showModuleReward, setShowModuleReward] = useState<number | null>(null); 
  const [showGrandReward, setShowGrandReward] = useState(false);
  const [showParentGate, setShowParentGate] = useState(false);
  const [gateMath, setGateMath] = useState({ q: '', a: 0 });
  const [gateInput, setGateInput] = useState(''); 
  const [learningTitle, setLearningTitle] = useState('');

  const verticalDragProps = useVerticalDragToScroll();
  const calendarDragProps = useVerticalDragToScroll();

  const mapScrollRef = useRef<number>(0);
  const mainRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);

  // --- 全局点击音效 ---
  useEffect(() => {
    const playPop = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {
        // Ignore audio context errors
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('[class*="cursor-pointer"]')) {
        playPop();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mainRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - mainRef.current.offsetLeft;
    scrollLeft.current = mainRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !mainRef.current) return;
    e.preventDefault();
    const x = e.pageX - mainRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    mainRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => {
    if (currentView === 'home' && mainRef.current) {
      mainRef.current.scrollLeft = mapScrollRef.current;
    }
  }, [currentView]);

  // 统一变量：判断选中的是否是今天
  const isToday = useMemo(() => {
    return selectedDate.toDateString() === new Date().toDateString();
  }, [selectedDate]);

  // --- 逻辑处理 ---
  const startLearning = (title: string) => {
    setLearningTitle(title);
    setCurrentView('learning');
  };

  const finishSubTask = () => {
    setDiamonds(prev => prev + 10);
    setSubIdx(prev => prev + 1);
    setCurrentView('home');
    
    // Toast 提示
    const toast = document.getElementById('toast');
    if (toast) {
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0) scale(1)';
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
          toast.style.transform = 'translate(-50%, 0) scale(0.5)';
        }, 500);
      }, 2000);
    }
  };

  const handleOpenReward = (mIdx: number) => {
    setShowModuleReward(mIdx);
    
    // 播放胜利庆祝音效
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        
        const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'triangle') => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = type;
          osc.frequency.setValueAtTime(freq, startTime);
          
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(startTime);
          osc.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        // C Major Arpeggio: C4, E4, G4, C5
        playNote(261.63, now, 0.4);       // C4
        playNote(329.63, now + 0.1, 0.4); // E4
        playNote(392.00, now + 0.2, 0.4); // G4
        playNote(523.25, now + 0.3, 0.8, 'sine'); // C5
        
        // Add harmony on the last note
        playNote(329.63, now + 0.3, 0.8, 'sine'); // E4
        playNote(392.00, now + 0.3, 0.8, 'sine'); // G4
      }
    } catch (e) {
      // Ignore audio context errors
    }

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      zIndex: 1000,
      colors: ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899']
    });
  };

  const handleRewardConfirm = () => {
    const isLastMajor = majorIdx === TASK_DATA.length - 1;
    setDiamonds(prev => prev + 50);
    setShowModuleReward(null);
    if (isLastMajor) {
      setShowGrandReward(true);
      
      // 播放更盛大的胜利庆祝音效
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          
          const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'triangle') => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
          };

          const now = ctx.currentTime;
          // Fanfare: C4, F4, C4, F4, A4, C5
          playNote(261.63, now, 0.2);       // C4
          playNote(349.23, now + 0.2, 0.2); // F4
          playNote(261.63, now + 0.4, 0.2); // C4
          playNote(349.23, now + 0.6, 0.2); // F4
          playNote(440.00, now + 0.8, 0.2); // A4
          playNote(523.25, now + 1.0, 1.5, 'sine'); // C5
          
          // Harmony
          playNote(349.23, now + 1.0, 1.5, 'sine'); // F4
          playNote(440.00, now + 1.0, 1.5, 'sine'); // A4
        }
      } catch (e) {
        // Ignore audio context errors
      }

      // 盛大纸屑
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'],
          zIndex: 1000
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'],
          zIndex: 1000
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

    } else {
      const nextIdx = majorIdx + 1;
      setMajorIdx(nextIdx);
      setSubIdx(0);
      
      // Auto-scroll to the next module after a short delay to allow rendering
      setTimeout(() => {
        const nextModule = document.getElementById(`major-module-${nextIdx}`);
        if (nextModule && mainRef.current) {
          // Calculate the center position
          const container = mainRef.current;
          const scrollLeft = nextModule.offsetLeft - (container.clientWidth / 2) + (nextModule.clientWidth / 2);
          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleConfirmDate = () => {
    const day = selectedDate.getDate();
    const status = MOCK_HISTORY_STATUS[day] ?? 0;
    if (isToday) {
      setMajorIdx(0);
      setSubIdx(0);
    } else {
      if (status === 2) { setMajorIdx(TASK_DATA.length); setSubIdx(0); }
      else if (status === 1) { setMajorIdx(1); setSubIdx(1); }
      else { setMajorIdx(0); setSubIdx(0); }
    }
    setShowCalendar(false);
  };

  const openParentGate = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setGateMath({ q: `${n1} + ${n2} = ?`, a: n1 + n2 });
    setGateInput('');
    setShowParentGate(true);
  };

  const handleParentGateSubmit = () => {
    if (parseInt(gateInput) === gateMath.a) {
      setShowParentGate(false);
      setCurrentView('parent');
    } else {
      setGateInput('');
    }
  };

  const changeDay = (delta: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedDate(newDate);
  };

  // --- 扁平化路径渲染：彻底修复 "Objects are not valid as a React child" 报错 ---
  const renderMapPath = () => {
    const pathNodes: React.ReactNode[] = [];
    TASK_DATA.forEach((major, mIdx) => {
      const isMajorDone = mIdx < majorIdx;
      const isMajorCurrent = mIdx === majorIdx;
      const isMajorFuture = mIdx > majorIdx;

      // Define background styles based on state
      let bgClass = '';
      let borderClass = '';
      
      if (isMajorDone) {
        // Finished: Soft theme color, solid but calm
        if (mIdx === 0) { bgClass = 'bg-[#d5ecfe]'; borderClass = 'border-blue-200'; }
        else if (mIdx === 1) { bgClass = 'bg-green-100/80'; borderClass = 'border-green-300/50'; }
        else if (mIdx === 2) { bgClass = 'bg-amber-100/80'; borderClass = 'border-amber-300/50'; }
        else if (mIdx === 3) { bgClass = 'bg-purple-100/80'; borderClass = 'border-purple-300/50'; }
      } else if (isMajorCurrent) {
        // Current: Bright, glowing, active
        if (mIdx === 0) { bgClass = 'bg-blue-50/90 shadow-[0_0_30px_rgba(59,130,246,0.3)]'; borderClass = 'border-blue-500'; }
        else if (mIdx === 1) { bgClass = 'bg-green-50/90 shadow-[0_0_30px_rgba(34,197,94,0.3)]'; borderClass = 'border-green-500'; }
        else if (mIdx === 2) { bgClass = 'bg-amber-50/90 shadow-[0_0_30px_rgba(245,158,11,0.3)]'; borderClass = 'border-amber-500'; }
        else if (mIdx === 3) { bgClass = 'bg-purple-50/90 shadow-[0_0_30px_rgba(168,85,247,0.3)]'; borderClass = 'border-purple-500'; }
      } else {
        // Unfinished: Muted, glassmorphism, gray
        bgClass = 'bg-white/20 grayscale opacity-60';
        borderClass = 'border-white/30';
      }

      const stageContent: React.ReactNode[] = [];

      // 1. 大站
      stageContent.push(
        <div key={`major-${mIdx}`} className="flex flex-col items-center relative group">
          {isMajorCurrent && <div className="absolute -inset-4 bg-white/40 rounded-full blur-xl animate-pulse z-0" />}
          <div 
            className={`w-24 h-24 rounded-[40%] flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 relative z-10
              ${isMajorDone ? 'bg-slate-300 opacity-90' : isMajorCurrent ? 'bg-white text-blue-500 scale-110 shadow-blue-500/50' : 'bg-white/80 opacity-60 grayscale hover:grayscale-0 hover:scale-105'}
            `}
            style={{ 
              backgroundColor: isMajorDone ? '#cbd5e1' : isMajorCurrent ? 'white' : major.color,
              boxShadow: isMajorCurrent ? `0 10px 25px -5px ${major.color}80, inset 0 -4px 0 0 rgba(0,0,0,0.1)` : 'inset 0 -4px 0 0 rgba(0,0,0,0.1)'
            }}
          >
            {isMajorDone ? <Check size={48} color="white" /> : <span className="text-4xl drop-shadow-md">{major.icon}</span>}
          </div>
          <div className="mt-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-white/50">
            <span className="font-black text-[12px] text-slate-700 tracking-wider">{major.name}</span>
          </div>
        </div>
      );

      // 2. 子点
      major.subs.forEach((sub, sIdx) => {
        const isSubDone = isMajorDone || (isMajorCurrent && sIdx < subIdx);
        const isSubActive = isMajorCurrent && sIdx === subIdx;
        
        stageContent.push(
          <div key={`line-sub-${mIdx}-${sIdx}`} className="w-10 h-2.5 bg-white/30 mx-1 rounded-full overflow-hidden shadow-inner relative">
            <div className="absolute inset-0 bg-white/20" />
            <div 
              className={`h-full transition-all duration-700 ease-out rounded-full relative ${isSubDone ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-transparent'}`} 
              style={{ width: isSubDone ? '100%' : '0%' }} 
            />
          </div>
        );

        stageContent.push(
          <div 
            key={`dot-sub-${mIdx}-${sIdx}`}
            onClick={() => isSubActive && startLearning(`${major.name} · ${sub}`)}
            className={`w-14 h-14 rounded-full border-4 border-white shadow-md flex items-center justify-center relative transition-all duration-300
              ${isSubDone ? 'bg-slate-400' : isSubActive ? 'bg-white cursor-pointer animate-bounce scale-110 shadow-yellow-400/50' : 'bg-white/60 opacity-60'}
            `}
            style={{ 
              borderColor: isSubActive ? '#fbbf24' : 'white',
              backgroundColor: isSubDone ? '#94a3b8' : 'white',
              boxShadow: isSubActive ? '0 10px 15px -3px rgba(251, 191, 36, 0.5), inset 0 -3px 0 0 rgba(0,0,0,0.1)' : 'inset 0 -3px 0 0 rgba(0,0,0,0.1)'
            }}
          >
            {isSubActive && (
              <div className="absolute -top-10 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-xl text-[10px] font-black shadow-lg whitespace-nowrap z-50 border border-yellow-300">
                {sub}<div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45 border-b border-r border-yellow-300" />
              </div>
            )}
            {isSubDone ? <Check size={20} color="white" /> : isSubActive ? <Play size={20} className="fill-amber-500 text-amber-500 drop-shadow-sm" /> : <div className="w-3 h-3 rounded-full" style={{ backgroundColor: major.color }} />}
          </div>
        );
      });

      // 3. 宝箱
      stageContent.push(
        <div key={`line-chest-${mIdx}`} className="w-10 h-2.5 bg-white/30 mx-1 rounded-full overflow-hidden shadow-inner relative">
          <div className="absolute inset-0 bg-white/20" />
          <div className={`h-full transition-all duration-700 ease-out rounded-full ${isMajorDone ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-transparent'}`} style={{ width: isMajorDone ? '100%' : '0%' }} />
        </div>
      );

      stageContent.push(
        <div 
          key={`chest-${mIdx}`}
          onClick={() => isMajorCurrent && subIdx === major.subs.length && handleOpenReward(mIdx)}
          className={`w-16 h-16 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 relative
            ${isMajorDone ? 'bg-slate-400' : (isMajorCurrent && subIdx === major.subs.length) ? 'bg-gradient-to-br from-yellow-300 to-orange-500 cursor-pointer scale-110 shadow-orange-500/50' : 'bg-slate-200 opacity-40'}
          `}
          style={{
            boxShadow: (isMajorCurrent && subIdx === major.subs.length) ? '0 10px 25px -5px rgba(249, 115, 22, 0.6), inset 0 -4px 0 0 rgba(0,0,0,0.1)' : 'inset 0 -4px 0 0 rgba(0,0,0,0.1)'
          }}
        >
          {isMajorDone ? <Check size={32} color="white" className="drop-shadow-md" /> : <span className={`text-3xl drop-shadow-sm ${(isMajorCurrent && subIdx === major.subs.length) ? 'animate-breathe-scale inline-block' : ''}`}>🎁</span>}
        </div>
      );

      // Push the grouped stage block
      pathNodes.push(
        <React.Fragment key={`stage-frag-${mIdx}`}>
          <div id={`major-module-${mIdx}`} className={`relative flex items-center h-[258px] px-6 py-8 mx-2 rounded-[40px] border-2 backdrop-blur-sm transition-all duration-700 overflow-hidden ${bgClass} ${borderClass}`}>
            
            {/* Animated Background for Current Module */}
            {isMajorCurrent && (
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className={`absolute -top-10 -left-10 w-64 h-64 rounded-full opacity-20 animate-drift-1 ${mIdx === 0 ? 'bg-blue-300' : mIdx === 1 ? 'bg-green-300' : mIdx === 2 ? 'bg-amber-300' : 'bg-purple-300'}`}></div>
                <div className={`absolute -bottom-10 -right-10 w-72 h-72 rounded-full opacity-20 animate-drift-2 ${mIdx === 0 ? 'bg-blue-200' : mIdx === 1 ? 'bg-green-200' : mIdx === 2 ? 'bg-amber-200' : 'bg-purple-200'}`}></div>
              </div>
            )}

            {/* Stage Label Watermark */}
            <div className="absolute top-3 left-0 w-full text-center font-black text-[15px] tracking-widest uppercase opacity-40 z-10" style={{ color: isMajorFuture ? '#94a3b8' : major.color }}>
              STAGE {mIdx + 1} · {major.id}
            </div>
            
            {/* Nodes */}
            <div className="flex items-center relative z-10 mt-4">
              {stageContent}
            </div>
          </div>

          {/* 4. 大关连接 */}
          {mIdx < TASK_DATA.length - 1 && (
            <div key={`major-conn-${mIdx}`} className="w-16 h-3 bg-white/30 rounded-full mx-1 shadow-inner overflow-hidden relative shrink-0">
              <div className="absolute inset-0 bg-white/20" />
              <div className={`h-full transition-all duration-1000 ${mIdx < majorIdx ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-transparent'}`} style={{ width: mIdx < majorIdx ? '100%' : '0%' }} />
            </div>
          )}
        </React.Fragment>
      );
    });
    return pathNodes;
  };

  return (
    <div className="bg-slate-900 w-full h-screen flex items-center justify-center overflow-hidden font-sans select-none text-slate-800">
      {/* 全屏舞台容器 */}
      <div id="app-stage" className="relative bg-[#E0F2FE] overflow-hidden w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 via-cyan-100 to-green-100 z-0">
          {/* Decorative floating elements */}
          <div className="absolute top-10 left-[10%] w-48 h-16 bg-white/40 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-[15%] w-64 h-20 bg-white/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-[20%] w-80 h-24 bg-white/50 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* 首页 */}
        {currentView === 'home' && (
          <div className="relative h-full w-full flex flex-col z-10 animate-in fade-in duration-500">
            <header className="h-[15%] px-[4%] flex justify-between items-center relative z-20">
              <div onClick={() => setCurrentView('profile')} className="flex items-center space-x-4 cursor-pointer group">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform shadow-md"></div>
                  <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-lg border-2 border-white overflow-hidden relative z-10 group-hover:scale-105 transition-transform">
                    <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Qian" alt="avatar" className="bg-blue-50 w-full h-full object-cover" />
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md border border-white/50 group-hover:bg-white transition-colors">
                  <span className={`font-black text-sm tracking-wide ${isToday ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' : 'text-green-600'}`}>
                    L1 · {isToday ? '今日探险' : `复习(${selectedDate.getDate()}日)`}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-5">
                <div onClick={() => setCurrentView('shop')} className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md flex items-center space-x-2.5 cursor-pointer hover:bg-white hover:scale-105 transition-all border border-white/50">
                  <Gem size={22} className="text-blue-500 drop-shadow-sm" />
                  <span className="font-black text-slate-700 text-lg tracking-wider">{diamonds}</span>
                </div>
                <button onClick={openParentGate} className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-blue-600 hover:rotate-90 transition-all border border-white/50">
                  <Settings size={26} />
                </button>
              </div>
            </header>
            <main 
              ref={mainRef}
              onScroll={(e) => { mapScrollRef.current = e.currentTarget.scrollLeft; }}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar px-[8%] flex items-center relative z-10 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center min-w-max h-full py-4">{renderMapPath()}</div>
            </main>
            <footer className="h-[22%] flex items-center justify-center pb-6 relative z-20 space-x-6">
              {/* Main Pill */}
              <div className="bg-white px-8 py-4 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center space-x-8 border border-slate-100 relative overflow-hidden">
                
                {/* Study Time */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Study Time</p>
                    <p className="text-xl font-black text-slate-800">12 MIN</p>
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-slate-200" />

                {/* Daily Goal */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Daily Goal</p>
                    <p className="text-xl font-black text-slate-800">STAGE {Math.min(majorIdx + 1, TASK_DATA.length)}/{TASK_DATA.length}</p>
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-slate-200" />

                {/* Adventure Progress */}
                <div className="flex flex-col justify-center w-56">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Adventure Progress</p>
                    <p className="text-[12px] font-black text-orange-500">{Math.round((majorIdx / TASK_DATA.length) * 100)}%</p>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${(majorIdx / TASK_DATA.length) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Pill (Buttons) */}
              <div className="bg-white p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center space-x-3 border border-slate-100">
                <button onClick={() => setShowCalendar(true)} className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center text-white transition-all shadow-[0_4px_0_#7e22ce] active:shadow-none active:translate-y-1">
                  <CalendarIcon size={24} />
                </button>
                <button onClick={() => setCurrentView('awards')} className="w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center text-white transition-all shadow-[0_4px_0_#0369a1] active:shadow-none active:translate-y-1">
                  <Award size={24} />
                </button>
              </div>
            </footer>
          </div>
        )}

        {/* 学习详情页：纯白背景 & 修复按钮高度 */}
        {currentView === 'learning' && (
          <div className="relative h-full w-full bg-white z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800">
            <header className="h-[12%] px-[4%] flex items-center justify-between bg-slate-50 border-b border-slate-100 shadow-sm">
              <button onClick={() => setCurrentView('home')} className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-300 transition-colors"><X size={32} /></button>
              <h2 className="font-black tracking-widest text-xl uppercase text-slate-600">{learningTitle}</h2><div className="w-14" />
            </header>
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10"><div className="w-full h-full max-w-4xl aspect-video bg-slate-100 rounded-[40px] border-4 border-slate-200 shadow-xl flex items-center justify-center relative overflow-hidden"><Play size={80} className="text-slate-300 opacity-50" /><div className="absolute bottom-6 left-6 right-6 h-3 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-1/3" /></div></div></div>
            <div className="h-[16%] flex items-center justify-center px-10 pb-4"><button onClick={finishSubTask} className="bg-blue-600 text-white px-14 py-4 rounded-2xl font-black text-2xl shadow-lg active:scale-95">学完了！领取奖励</button></div>
          </div>
        )}

        {/* 各二级视图 (纯白背景) */}
        {['parent', 'awards', 'shop', 'profile'].includes(currentView) && (
          <div className="relative h-full w-full bg-white z-50 flex flex-col animate-in slide-in-from-left duration-300">
            <header className="h-[12%] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100">
              <button onClick={() => setCurrentView('home')} className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 active:scale-90 transition-transform"><ChevronLeft size={32} /></button>
              <h2 className="font-black text-slate-800 text-2xl tracking-widest">{currentView === 'parent' ? '家长中心' : currentView === 'awards' ? '我的勋章' : currentView === 'shop' ? '魔法商城' : '学员档案'}</h2><div className="w-14" />
            </header>
            <main {...verticalDragProps} className="flex-1 p-[4%] overflow-y-auto no-scrollbar text-slate-800 cursor-grab active:cursor-grabbing">
               {currentView === 'awards' ? (
                 <div className="max-w-5xl mx-auto">
                   <div className="flex items-center space-x-4 mb-8">
                     <Trophy size={40} className="text-amber-500" />
                     <div>
                       <h1 className="text-2xl font-black text-slate-800">荣誉勋章墙</h1>
                       <p className="text-slate-500 font-bold text-sm opacity-60">已解锁 {ACHIEVEMENTS_LIST.filter(a => a.acquired).length} / {ACHIEVEMENTS_LIST.length}</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-10">
                     {ACHIEVEMENTS_LIST.map(ach => (
                       <AwardCard key={ach.id} ach={ach} />
                     ))}
                   </div>
                 </div>
               ) : currentView === 'parent' ? (
                 <div className="max-w-4xl mx-auto space-y-6 py-4"><div className="flex items-center space-x-3 mb-4"><ShieldCheck className="text-blue-500" size={32} /><h1 className="text-2xl font-black">管理面板</h1></div><div className="grid grid-cols-2 gap-6"><div className="bg-slate-50 p-6 rounded-[30px] border border-slate-100 text-center py-10 opacity-60"><p className="font-black uppercase">管理功能开发中...</p></div></div></div>
               ) : currentView === 'profile' ? (
                 <div className="max-w-5xl mx-auto h-full flex flex-col pb-4">
                   {/* Top Profile Banner */}
                   <div className="flex items-center mb-6 w-full">
                     <div className="relative mr-8">
                       <div className="absolute inset-0 bg-yellow-400 rounded-[32px] -rotate-6 scale-105 shadow-md"></div>
                       <div className="w-24 h-24 bg-white rounded-[32px] p-1.5 shadow-xl border-4 border-white overflow-hidden relative z-10">
                         <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Qian" alt="avatar" className="w-full h-full object-cover bg-blue-50" />
                       </div>
                       <div className="absolute -top-2 -right-4 text-3xl animate-bounce z-20">✨</div>
                       <div className="absolute -bottom-2 -left-4 text-3xl animate-pulse z-20">🌟</div>
                     </div>
                     <div className="flex flex-col items-start">
                       <h1 className="text-3xl font-black text-slate-800 tracking-wide mb-2">糯米团子</h1>
                       <div className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-black text-xs shadow-sm border border-blue-200">
                         小小探险家
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
                     {/* Left: Skill Cards */}
                     <div className="grid grid-cols-2 gap-3">
                       {[
                         { id: 'listen', name: '听', level: 1, progress: 20, color: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', icon: '🎧' },
                         { id: 'speak', name: '说', level: 12, progress: 80, color: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600', icon: '🎙️' },
                         { id: 'read', name: '读', level: 1, progress: 30, color: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600', icon: '📖' },
                         { id: 'write', name: '写', level: 1, progress: 40, color: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', icon: '✍️' },
                       ].map(item => (
                         <div key={item.id} className={`${item.light} rounded-[24px] p-4 flex flex-col relative overflow-hidden transition-transform hover:scale-105 cursor-pointer border-2 border-white shadow-sm`}>
                           <div className="flex justify-between items-start mb-2">
                             <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm`}>
                               {item.icon}
                             </div>
                             <div className={`font-black ${item.text} text-sm bg-white/60 px-2 py-0.5 rounded-lg`}>Lv.{item.level}</div>
                           </div>
                           <h3 className={`font-black ${item.text} text-lg mb-2`}>{item.name}力</h3>
                           <div className="h-3 bg-white/60 rounded-full overflow-hidden p-0.5 mt-auto">
                             <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                           </div>
                         </div>
                       ))}
                     </div>

                     {/* Right: Radar Chart */}
                     <div className="bg-slate-50 rounded-[32px] p-4 flex flex-col items-center justify-center border-4 border-slate-100 relative shadow-sm min-h-0">
                       <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-xl shadow-sm font-black text-slate-700 flex items-center space-x-2 z-10 text-sm">
                         <Target className="text-red-500" size={16} />
                         <span>我的超能力雷达</span>
                       </div>
                       <div className="w-full h-full min-h-[150px] mt-6">
                         <ResponsiveContainer width="100%" height="100%">
                           <RadarChart cx="50%" cy="50%" outerRadius="65%" data={RADAR_DATA}>
                             <PolarGrid content={<CustomPolarGrid />} />
                             <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
                             <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                             <Radar 
                               name="能力" 
                               dataKey="A" 
                               stroke="#f97316" 
                               strokeWidth={3} 
                               fill="#fb923c" 
                               fillOpacity={0.8} 
                               isAnimationActive={true}
                               animationBegin={0}
                               animationDuration={1500}
                               animationEasing="ease-out"
                               dot={{ r: 4, fill: '#fff', stroke: '#f97316', strokeWidth: 2 }}
                               activeDot={{ r: 6, fill: '#fff', stroke: '#f97316', strokeWidth: 2 }}
                             />
                           </RadarChart>
                         </ResponsiveContainer>
                       </div>
                     </div>
                   </div>

                   {/* Bottom: Overall Progress */}
                   <div className="mt-4 bg-white border-4 border-slate-100 rounded-[24px] p-4 relative overflow-hidden shadow-sm shrink-0">
                     <div className="flex justify-between items-end mb-2 relative z-10">
                       <div>
                         <p className="text-slate-400 font-bold text-xs mb-1">当前进度</p>
                         <h3 className="font-black text-xl text-slate-800 flex items-center space-x-2">
                           <Crown className="text-yellow-500" size={20} />
                           <span>Lv.2 入门</span>
                         </h3>
                       </div>
                       <div className="text-right">
                         <p className="text-slate-400 font-bold text-xs mb-1">下一级</p>
                         <h3 className="font-black text-lg text-slate-400">Lv.3 学徒</h3>
                       </div>
                     </div>
                     <div className="h-6 bg-slate-100 rounded-full relative overflow-hidden p-1 z-10">
                       <div className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-[30%] shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-full"></div>
                       </div>
                     </div>
                     <Rocket className="absolute -right-2 -bottom-2 text-slate-50 opacity-50" size={80} />
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 opacity-30"><div className="text-6xl mb-4">{currentView === 'shop' ? '🎁' : '👤'}</div><p className="font-black text-xs uppercase">界面设计中...</p></div>
               )}
            </main>
          </div>
        )}

        {/* --- 弹窗逻辑 --- */}

        {showCalendar && (
          <div className="absolute inset-0 z-[700] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-[4%]">
            <div className="bg-white w-full max-w-4xl h-[90%] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300 text-slate-800">
              <header className="bg-blue-600 p-6 text-white flex justify-between items-center"><button onClick={() => setShowCalendar(false)} className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><X size={24}/></button><div className="flex items-center bg-white/10 rounded-2xl p-2 px-4 space-x-6"><button onClick={() => changeDay(-1)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><ArrowLeft size={24}/></button><div className="text-center min-w-[120px]"><p className="text-xs font-bold opacity-70 uppercase tracking-widest">March 2024</p><p className="text-2xl font-black">{selectedDate.getDate()}日</p></div><button onClick={() => changeDay(1)} disabled={new Date(new Date(selectedDate).setDate(selectedDate.getDate()+1)) > new Date()} className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30"><ArrowRight size={24}/></button></div><button onClick={() => setSelectedDate(new Date())} className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black text-sm active:scale-95">今天</button></header>
              <div className="flex-1 p-8 flex flex-col overflow-hidden"><div className="grid grid-cols-7 gap-3 text-center mb-3">{['S','M','T','W','T','F','S'].map((d, i) => <div key={`cal-h-${i}`} className="font-black text-xs text-slate-300 uppercase">{d}</div>)}</div><div {...calendarDragProps} className="grid grid-cols-7 gap-3 flex-1 overflow-y-auto no-scrollbar cursor-grab active:cursor-grabbing">{[...Array(31)].map((_, i) => { const d = i + 1; const isFuture = d > new Date().getDate(); const isPicked = d === selectedDate.getDate(); const status = MOCK_HISTORY_STATUS[d] ?? -1; let statusColor = "bg-slate-50 text-slate-600"; if (!isFuture) { if (status === 2) statusColor = "bg-green-50 text-green-600"; else if (status === 1) statusColor = "bg-yellow-50 text-yellow-600"; else if (status === 0) statusColor = "bg-red-50 text-red-400"; } return (<div key={`day-c-${i}`} onClick={() => !isFuture && setSelectedDate(new Date(2024, 2, d))} className={`aspect-square relative flex flex-col items-center justify-center rounded-2xl font-black text-lg transition-all cursor-pointer ${isFuture ? 'text-slate-200 cursor-not-allowed bg-slate-50/30' : isPicked ? 'ring-4 ring-blue-500/30 scale-105 z-10' : ''} ${!isPicked ? statusColor : 'bg-blue-600 text-white shadow-lg'}`}><span>{d}</span>{!isFuture && !isPicked && status !== -1 && (<div className={`w-2 h-2 rounded-full absolute bottom-2 ${status === 2 ? 'bg-green-400' : status === 1 ? 'bg-yellow-400' : 'bg-red-300'}`} />)}</div>); })}</div><div className="mt-6 flex justify-center space-x-6 text-xs font-bold text-slate-400 border-t border-slate-50 pt-4"><div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-green-400" /><span>已完成</span></div><div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-yellow-400" /><span>未完成</span></div><div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-red-400" /><span>未学习</span></div></div></div>
              <div className="p-6 bg-slate-50 border-t flex justify-center"><button onClick={handleConfirmDate} className={`w-full py-4 rounded-2xl font-black text-xl shadow-lg active:scale-95 ${isToday ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>{isToday ? "开始今日学习探险" : "开启该日复习模式"}</button></div>
            </div>
          </div>
        )}

        {showModuleReward !== null && TASK_DATA[showModuleReward] && (
          <div className="absolute inset-0 z-[800] bg-transparent flex items-center justify-center text-slate-800">
            <div className="bg-white rounded-[40px] p-12 text-center shadow-2xl animate-in zoom-in duration-500 max-w-sm">
              <div className="text-8xl mb-6">🎁</div>
              <h2 className="text-3xl font-black text-orange-500 mb-2">{TASK_DATA[showModuleReward].name}</h2>
              <p className="text-slate-500 mb-8 font-bold text-sm">获得专属奖励能量包</p>
              <div className="text-5xl font-black text-blue-600 mb-10 flex items-center justify-center space-x-3"><span>+50</span> <Gem size={32} className="text-blue-400" /></div>
              <button onClick={handleRewardConfirm} className="w-full bg-blue-500 text-white text-2xl font-black py-5 rounded-3xl shadow-xl active:scale-95 transition-transform">收下奖励</button>
            </div>
          </div>
        )}

        {showGrandReward && (
          <div className="absolute inset-0 z-[900] bg-gradient-to-b from-blue-900/90 to-purple-900/90 backdrop-blur-xl flex items-center justify-center text-slate-800">
            <div className="bg-white rounded-[50px] p-10 max-w-lg w-full text-center shadow-[0_0_100px_rgba(255,183,3,0.5)] animate-in zoom-in"><div className="w-20 h-20 bg-yellow-400 rounded-full border-4 border-white shadow-2xl flex items-center justify-center mx-auto mb-6 animate-bounce"><Award size={40} color="white" /></div><h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">今日探险圆满达成！</h2><div className="grid grid-cols-3 gap-3 mb-10 text-center"><div className="bg-blue-50 p-4 rounded-2xl"><p className="text-xl font-black text-blue-600">30M</p><p className="text-[8px] font-bold opacity-40">时长</p></div><div className="bg-green-50 p-4 rounded-2xl"><p className="text-xl font-black text-green-600">45W</p><p className="text-[8px] font-bold opacity-40">单词</p></div><div className="bg-purple-50 p-4 rounded-2xl"><p className="text-xl font-black text-purple-600">+200</p><p className="text-[8px] font-bold opacity-40">奖励</p></div></div><button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg font-black py-5 rounded-3xl shadow-xl flex items-center justify-center space-x-2 mb-3"><Camera size={20} /> <span>领取勋章并分享</span></button><button onClick={() => setShowGrandReward(false)} className="w-full py-1.5 text-slate-400 font-black text-xs uppercase tracking-widest">回到地图</button></div>
          </div>
        )}

        {showParentGate && (
          <div className="absolute inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center text-slate-800">
            <div className="bg-white rounded-[40px] p-12 max-w-md w-full text-center shadow-2xl animate-in zoom-in"><h3 className="text-2xl font-black text-slate-800 mb-8">家长验证</h3><div className="text-5xl font-black text-blue-600 mb-10 tracking-widest">{gateMath.q}</div><input type="number" placeholder="?" autoFocus value={gateInput} onChange={(e) => setGateInput(e.target.value)} className="w-full text-center text-4xl p-5 bg-slate-50 rounded-2xl mb-8 outline-none border-4 border-transparent focus:border-blue-100 transition-all" onKeyDown={(e) => { if (e.key === 'Enter') handleParentGateSubmit(); }} /><div className="flex space-x-4"><button onClick={() => setShowParentGate(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-slate-500 text-lg">取消</button><button onClick={handleParentGateSubmit} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl text-lg">确认</button></div></div>
          </div>
        )}

        <div id="toast" className="absolute top-[10vw] left-1/2 bg-white px-10 py-5 rounded-full shadow-2xl border-4 border-yellow-400 opacity-0 transition-all duration-500 z-[1100] flex items-center space-x-4 pointer-events-none text-slate-700" style={{ transform: 'translate(-50%, 0) scale(0.5)' }}>
          <Gem className="text-blue-400" size={36} /><span className="text-3xl font-black text-blue-600">+10 钻石！</span>
        </div>
      </div>

      <div className="fixed inset-0 z-[9999] bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center landscape:hidden">
        <div className="text-6xl animate-bounce mb-6">🔄</div><h2 className="text-2xl font-black mb-2">请旋转您的设备</h2><p className="opacity-60 text-sm">横屏体验能够开启完整学习探险哦！</p>
      </div>
    </div>
  );
}

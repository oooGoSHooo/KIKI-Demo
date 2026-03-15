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
  ShieldCheck, BarChart3, Bell, Sliders, User
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

  const mapScrollRef = useRef<number>(0);
  const mainRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);
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
        if (mIdx === 0) { bgClass = 'bg-[#d5ecfe]'; borderClass = 'border-blue-400/60'; }
        else if (mIdx === 1) { bgClass = 'bg-green-100/80'; borderClass = 'border-green-300/50'; }
        else if (mIdx === 2) { bgClass = 'bg-amber-100/80'; borderClass = 'border-amber-300/50'; }
        else if (mIdx === 3) { bgClass = 'bg-purple-100/80'; borderClass = 'border-purple-300/50'; }
      } else if (isMajorCurrent) {
        // Current: Bright, glowing, active
        if (mIdx === 0) { bgClass = 'bg-blue-50/90 shadow-[0_0_30px_rgba(59,130,246,0.3)]'; borderClass = 'border-blue-400'; }
        else if (mIdx === 1) { bgClass = 'bg-green-50/90 shadow-[0_0_30px_rgba(34,197,94,0.3)]'; borderClass = 'border-green-400'; }
        else if (mIdx === 2) { bgClass = 'bg-amber-50/90 shadow-[0_0_30px_rgba(245,158,11,0.3)]'; borderClass = 'border-amber-400'; }
        else if (mIdx === 3) { bgClass = 'bg-purple-50/90 shadow-[0_0_30px_rgba(168,85,247,0.3)]'; borderClass = 'border-purple-400'; }
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
                <div className={`absolute -top-10 -left-10 w-64 h-64 rounded-full filter blur-3xl opacity-40 animate-drift-1 ${mIdx === 0 ? 'bg-blue-300' : mIdx === 1 ? 'bg-green-300' : mIdx === 2 ? 'bg-amber-300' : 'bg-purple-300'}`}></div>
                <div className={`absolute -bottom-10 -right-10 w-72 h-72 rounded-full filter blur-3xl opacity-40 animate-drift-2 ${mIdx === 0 ? 'bg-blue-200' : mIdx === 1 ? 'bg-green-200' : mIdx === 2 ? 'bg-amber-200' : 'bg-purple-200'}`}></div>
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
            <footer className="h-[22%] flex items-center justify-center pb-6 relative z-20">
              <div className="bg-white/90 backdrop-blur-xl px-14 py-6 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center space-x-14 border-2 border-white relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                
                <div className="text-center relative z-10">
                  <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-1">学习时长</p>
                  <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">12 <span className="text-sm font-bold">MIN</span></p>
                </div>
                
                <div className="h-14 w-1 bg-slate-100 rounded-full relative z-10" />
                
                <div className="flex flex-col items-center relative z-10">
                  <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-3">探险进度</p>
                  <div className="flex space-x-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    {TASK_DATA.map((_, i) => 
                      <div key={`dot-${i}`} className={`w-3.5 h-3.5 rounded-full transition-all duration-500 shadow-inner ${i < majorIdx ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-8' : i === majorIdx ? 'bg-gradient-to-r from-blue-400 to-cyan-500 animate-pulse shadow-blue-400/50' : 'bg-slate-200'}`} />
                    )}
                  </div>
                </div>
                
                <div className="h-14 w-1 bg-slate-100 rounded-full relative z-10" />
                
                <div className="flex space-x-5 relative z-10">
                  <button onClick={() => setShowCalendar(true)} className="w-16 h-16 bg-gradient-to-b from-white to-rose-50 rounded-2xl shadow-md flex items-center justify-center text-rose-500 border-b-4 border-rose-200 hover:translate-y-1 hover:border-b-0 transition-all">
                    <CalendarIcon size={30} className="drop-shadow-sm" />
                  </button>
                  <button onClick={() => setCurrentView('awards')} className="w-16 h-16 bg-gradient-to-b from-white to-amber-50 rounded-2xl shadow-md flex items-center justify-center text-amber-500 border-b-4 border-amber-200 hover:translate-y-1 hover:border-b-0 transition-all">
                    <Trophy size={30} className="drop-shadow-sm" />
                  </button>
                </div>
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
            <main className="flex-1 p-[4%] overflow-y-auto no-scrollbar text-slate-800">
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
                       <div 
                         key={ach.id} 
                         className={`rounded-[32px] p-5 sm:p-6 flex flex-col items-center justify-center text-center border-2 transition-all duration-300 ${
                           ach.acquired 
                             ? 'bg-white border-slate-100 shadow-lg hover:-translate-y-1 hover:shadow-xl' 
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
                     ))}
                   </div>
                 </div>
               ) : currentView === 'parent' ? (
                 <div className="max-w-4xl mx-auto space-y-6 py-4"><div className="flex items-center space-x-3 mb-4"><ShieldCheck className="text-blue-500" size={32} /><h1 className="text-2xl font-black">管理面板</h1></div><div className="grid grid-cols-2 gap-6"><div className="bg-slate-50 p-6 rounded-[30px] border border-slate-100 text-center py-10 opacity-60"><p className="font-black uppercase">管理功能开发中...</p></div></div></div>
               ) : currentView === 'profile' ? (
                 <div className="max-w-5xl mx-auto h-full flex flex-col pb-10">
                   {/* Top Profile Banner */}
                   <div className="flex items-center mb-10 w-full">
                     <div className="relative mr-8">
                       <div className="absolute inset-0 bg-yellow-400 rounded-[32px] -rotate-6 scale-105 shadow-md"></div>
                       <div className="w-28 h-28 bg-white rounded-[32px] p-1.5 shadow-xl border-4 border-white overflow-hidden relative z-10">
                         <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Qian" alt="avatar" className="w-full h-full object-cover bg-blue-50" />
                       </div>
                       <div className="absolute -top-2 -right-4 text-3xl animate-bounce z-20">✨</div>
                       <div className="absolute -bottom-2 -left-4 text-3xl animate-pulse z-20">🌟</div>
                     </div>
                     <div className="flex flex-col items-start">
                       <h1 className="text-4xl font-black text-slate-800 tracking-wide mb-3">王大王大王</h1>
                       <div className="bg-blue-100 text-blue-600 px-5 py-1.5 rounded-full font-black text-sm shadow-sm border border-blue-200">
                         小小探险家
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                     {/* Left: Skill Cards */}
                     <div className="grid grid-cols-2 gap-4">
                       {[
                         { id: 'listen', name: '听', level: 1, progress: 20, color: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', icon: '🎧' },
                         { id: 'speak', name: '说', level: 12, progress: 80, color: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600', icon: '🎙️' },
                         { id: 'read', name: '读', level: 1, progress: 30, color: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600', icon: '📖' },
                         { id: 'write', name: '写', level: 1, progress: 40, color: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', icon: '✍️' },
                       ].map(item => (
                         <div key={item.id} className={`${item.light} rounded-[32px] p-5 flex flex-col relative overflow-hidden transition-transform hover:scale-105 cursor-pointer border-2 border-white shadow-sm`}>
                           <div className="flex justify-between items-start mb-4">
                             <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                               {item.icon}
                             </div>
                             <div className={`font-black ${item.text} text-lg bg-white/60 px-2 py-1 rounded-xl`}>Lv.{item.level}</div>
                           </div>
                           <h3 className={`font-black ${item.text} text-xl mb-3`}>{item.name}力</h3>
                           <div className="h-4 bg-white/60 rounded-full overflow-hidden p-0.5">
                             <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                           </div>
                         </div>
                       ))}
                     </div>

                     {/* Right: Radar Chart */}
                     <div className="bg-slate-50 rounded-[40px] p-6 flex flex-col items-center justify-center border-4 border-slate-100 relative shadow-sm">
                       <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-2xl shadow-sm font-black text-slate-700 flex items-center space-x-2 z-10">
                         <Target className="text-red-500" size={20} />
                         <span>我的超能力雷达</span>
                       </div>
                       <div className="w-full h-64 mt-8">
                         <ResponsiveContainer width="100%" height="100%">
                           <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                             { subject: '说', A: 80, fullMark: 100 },
                             { subject: '写', A: 40, fullMark: 100 },
                             { subject: '读', A: 30, fullMark: 100 },
                             { subject: '听', A: 20, fullMark: 100 },
                           ]}>
                             <PolarGrid gridType="polygon" stroke="#cbd5e1" strokeDasharray="3 3" />
                             <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 16, fontWeight: 900 }} />
                             <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                             <Radar name="能力" dataKey="A" stroke="#3b82f6" strokeWidth={4} fill="#60a5fa" fillOpacity={0.5} />
                           </RadarChart>
                         </ResponsiveContainer>
                       </div>
                     </div>
                   </div>

                   {/* Bottom: Overall Progress */}
                   <div className="mt-8 bg-white border-4 border-slate-100 rounded-[32px] p-6 relative overflow-hidden shadow-sm">
                     <div className="flex justify-between items-end mb-4 relative z-10">
                       <div>
                         <p className="text-slate-400 font-bold text-sm mb-1">当前进度</p>
                         <h3 className="font-black text-2xl text-slate-800 flex items-center space-x-2">
                           <Crown className="text-yellow-500" size={24} />
                           <span>Lv.2 入门</span>
                         </h3>
                       </div>
                       <div className="text-right">
                         <p className="text-slate-400 font-bold text-sm mb-1">下一级</p>
                         <h3 className="font-black text-xl text-slate-400">Lv.3 学徒</h3>
                       </div>
                     </div>
                     <div className="h-8 bg-slate-100 rounded-full relative overflow-hidden p-1 z-10">
                       <div className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-[30%] shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-full"></div>
                       </div>
                     </div>
                     <Rocket className="absolute -right-4 -bottom-4 text-slate-50 opacity-50" size={120} />
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
            <div className="bg-white w-full max-w-2xl h-[90%] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300 text-slate-800">
              <header className="bg-blue-600 p-6 text-white flex justify-between items-center"><button onClick={() => setShowCalendar(false)} className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><X size={24}/></button><div className="flex items-center bg-white/10 rounded-2xl p-2 px-4 space-x-6"><button onClick={() => changeDay(-1)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><ArrowLeft size={24}/></button><div className="text-center min-w-[120px]"><p className="text-xs font-bold opacity-70 uppercase tracking-widest">March 2024</p><p className="text-2xl font-black">{selectedDate.getDate()}日</p></div><button onClick={() => changeDay(1)} disabled={new Date(new Date(selectedDate).setDate(selectedDate.getDate()+1)) > new Date()} className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30"><ArrowRight size={24}/></button></div><button onClick={() => setSelectedDate(new Date())} className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black text-sm active:scale-95">今天</button></header>
              <div className="flex-1 p-8 flex flex-col overflow-hidden"><div className="grid grid-cols-7 gap-3 text-center mb-3">{['S','M','T','W','T','F','S'].map((d, i) => <div key={`cal-h-${i}`} className="font-black text-xs text-slate-300 uppercase">{d}</div>)}</div><div className="grid grid-cols-7 gap-3 flex-1 overflow-y-auto no-scrollbar">{[...Array(31)].map((_, i) => { const d = i + 1; const isFuture = d > new Date().getDate(); const isPicked = d === selectedDate.getDate(); const status = MOCK_HISTORY_STATUS[d] ?? -1; let statusColor = "bg-slate-50 text-slate-600"; if (!isFuture) { if (status === 2) statusColor = "bg-green-50 text-green-600"; else if (status === 1) statusColor = "bg-yellow-50 text-yellow-600"; else if (status === 0) statusColor = "bg-red-50 text-red-400"; } return (<div key={`day-c-${i}`} onClick={() => !isFuture && setSelectedDate(new Date(2024, 2, d))} className={`aspect-square relative flex flex-col items-center justify-center rounded-2xl font-black text-lg transition-all cursor-pointer ${isFuture ? 'text-slate-200 cursor-not-allowed bg-slate-50/30' : isPicked ? 'ring-4 ring-blue-500/30 scale-105 z-10' : ''} ${!isPicked ? statusColor : 'bg-blue-600 text-white shadow-lg'}`}><span>{d}</span>{!isFuture && !isPicked && status !== -1 && (<div className={`w-2 h-2 rounded-full absolute bottom-2 ${status === 2 ? 'bg-green-400' : status === 1 ? 'bg-yellow-400' : 'bg-red-300'}`} />)}</div>); })}</div><div className="mt-6 flex justify-center space-x-6 text-xs font-bold text-slate-400 border-t border-slate-50 pt-4"><div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-green-400" /><span>已完成</span></div><div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-yellow-400" /><span>未完成</span></div><div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-red-400" /><span>未学习</span></div></div></div>
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

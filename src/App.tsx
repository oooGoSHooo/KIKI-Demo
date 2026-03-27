import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { EbookReader } from './components/EbookReader';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, X, Gem, Settings, Trophy, 
  Calendar as CalendarIcon, Award, Play, 
  ArrowLeft, ArrowRight, Check, Lock, Camera,
  Footprints, Sunrise, Gift, Ear, Mic, BookOpen, 
  Repeat, CalendarCheck, ShoppingBag, Palette, 
  Zap, Star, Medal, Crown, Target, Rocket,
  ShieldCheck, BarChart3, Bell, Sliders, User,
  Clock, Map, ChevronRight, LogOut, FileText, Headphones, Sparkles, Loader2,
  Store, PackageX, Hourglass, FlaskConical, Shield, Clover, Ghost, History, Flame
} from 'lucide-react';

/**
 * 核心任务配置数据
 */
const TASK_DATA = [
  { id: 'listen', name: '听 (LISTEN)', color: '#3b82f6', icon: '🎧', subs: ['视频', '单词卡', '电子书', '听音', '互动'], rewardName: '听力能量包' },
  { id: 'speak', name: '说 (SPEAK)', color: '#22c55e', icon: '🎙️', subs: ['跟读', 'AI评测'], rewardName: '口语奖励箱' },
  { id: 'read', name: '读 (READ)', color: '#f59e0b', icon: '📖', subs: ['认读', '拼读'], rewardName: '阅读宝藏库' },
  { id: 'write', name: '写 (WRITE)', color: '#a855f7', icon: '✍️', subs: ['排序', '拼写'], rewardName: '书写大师杯' }
];

/**
 * 勋章成就数据 (包含12个预设解锁)
 */
const SUBSCRIPTIONS_LIST = [
  { id: 1, name: '千千妈妈启蒙认知方法课', desc: '家长课', status: 'active', expireDate: '2026年12月31日', image: '/icons/1.png' },
  { id: 2, name: '科普英文阅读课', desc: 'Little Kids', status: 'active', expireDate: '2026年12月31日', image: '/icons/2.png' },
  { id: 3, name: '红火箭分级阅读 黄盒', desc: '5-7级', status: 'active', expireDate: '2026年12月31日', image: '/icons/3.png' },
  { id: 4, name: '红火箭分级阅读 蓝盒', desc: '1-4级', status: 'expired', expireDate: '已过期', image: '/icons/4.png' },
  { id: 5, name: '红火箭分级阅读', desc: '全套', status: 'unpurchased', expireDate: '未购买', image: '/icons/5.png' },
  { id: 6, name: '兰登精品阅读课', desc: 'Step into Reading', status: 'unpurchased', expireDate: '未购买', image: '/icons/6.png' },
  { id: 7, name: '标准美式发音课+音标课', desc: '千千妈妈', status: 'unpurchased', expireDate: '未购买', image: '/icons/7.png' },
  { id: 8, name: '千千妈妈自然拼读课', desc: '核心课程', status: 'unpurchased', expireDate: '未购买', image: '/icons/8.png' },
  { id: 9, name: '千千妈妈桥梁书俱乐部', desc: '进阶阅读', status: 'unpurchased', expireDate: '未购买', image: '/icons/9.png' },
  { id: 10, name: '苏斯博士绘本小课堂', desc: 'Dr. Seuss', status: 'unpurchased', expireDate: '未购买', image: '/icons/10.png' },
  { id: 11, name: '听力口语陪跑营 1阶段', desc: '基础启蒙', status: 'unpurchased', expireDate: '未购买', image: '/icons/11.png' },
  { id: 12, name: '听力口语陪跑营 2阶段', desc: '进阶提升', status: 'unpurchased', expireDate: '未购买', image: '/icons/12.png' },
  { id: 13, name: '听力口语陪跑营 3阶段', desc: '流利表达', status: 'unpurchased', expireDate: '未购买', image: '/icons/13.png' },
  { id: 14, name: '听力口语陪跑营 4阶段', desc: 'Whiz Kids News', status: 'unpurchased', expireDate: '未购买', image: '/icons/14.png' },
  { id: 15, name: 'Mia唱童谣', desc: '千千妈妈', status: 'unpurchased', expireDate: '未购买', image: '/icons/15.png' },
  { id: 16, name: '章节书俱乐部', desc: '千千妈妈', status: 'unpurchased', expireDate: '未购买', image: '/icons/16.png' },
  { id: 17, name: 'Awesome Leveled Readers', desc: '字母课', status: 'unpurchased', expireDate: '未购买', image: '/icons/17.png' },
  { id: 18, name: '字母启蒙精品课', desc: 'Awesome Alphabet', status: 'unpurchased', expireDate: '未购买', image: '/icons/18.png' },
  { id: 19, name: '高频词课', desc: 'Awesome Sight Words', status: 'unpurchased', expireDate: '未购买', image: '/icons/19.png' },
  { id: 20, name: '剑桥英语精品课 KET-PET', desc: 'A2+', status: 'unpurchased', expireDate: '未购买', image: '/icons/20.png' },
  { id: 21, name: '剑桥英语精品课 PET-FCE', desc: 'B1+', status: 'unpurchased', expireDate: '未购买', image: '/icons/21.png' },
  { id: 22, name: '剑桥英语精品课 KET', desc: 'A1-A2', status: 'unpurchased', expireDate: '未购买', image: '/icons/22.png' },
  { id: 23, name: '卓越KPF考冲班 FCE', desc: '考前冲刺', status: 'unpurchased', expireDate: '未购买', image: '/icons/23.png' },
  { id: 24, name: '卓越KPF考冲班 KET', desc: '考前冲刺', status: 'unpurchased', expireDate: '未购买', image: '/icons/24.png' },
  { id: 25, name: '卓越KPF考冲班 PET', desc: '考前冲刺', status: 'unpurchased', expireDate: '未购买', image: '/icons/25.png' },
];

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

const AwardCard: React.FC<{ ach: any }> = ({ ach }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className={`relative w-full h-full [perspective:1000px] ${ach.acquired ? 'cursor-pointer group' : ''}`}
      onClick={() => ach.acquired && setFlipped(!flipped)}
    >
      <div className={`w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''} ${ach.acquired ? 'group-hover:-translate-y-1' : ''}`}>
        
        {/* Front */}
        <div 
          className={`relative h-full [backface-visibility:hidden] rounded-[32px] p-[clamp(14px,3.5vw,20px)] sm:p-[clamp(16px,4vw,24px)] flex flex-col items-center justify-start text-center border-2 transition-all duration-300 ${
            ach.acquired 
              ? 'bg-white border-slate-100 shadow-lg group-hover:shadow-xl' 
              : 'bg-slate-50 border-transparent opacity-50 grayscale'
          }`}
        >
          <div className={`w-[clamp(48px,14vw,64px)] h-[clamp(48px,14vw,64px)] sm:w-[clamp(56px,16vw,80px)] sm:h-[clamp(56px,16vw,80px)] shrink-0 ${ach.iconBg} rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] shadow-inner relative`}>
            {ach.acquired && <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />}
            <ach.IconComponent size={32} className={`${ach.iconColor} drop-shadow-sm relative z-10`} />
          </div>
          <h3 className="font-black text-slate-800 text-[clamp(14px,3.5vw,16px)] sm:text-[clamp(14px,3.5vw,16px)] mb-1.5">{ach.name}</h3>
          <p className="text-[clamp(14px,3.5vw,16px)] text-slate-500 leading-snug line-clamp-2 font-medium h-9 flex items-center justify-center">{ach.intro}</p>
        </div>

        {/* Back */}
        <div 
          className={`absolute inset-0 h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[32px] p-[clamp(14px,3.5vw,20px)] sm:p-[clamp(16px,4vw,24px)] flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 group-hover:shadow-xl ${ach.iconBg}`}
        >
          <div className={`w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-white/50 rounded-full flex items-center justify-center mb-[clamp(8px,2.5vw,12px)] shadow-inner`}>
            <CalendarIcon size={24} className={ach.iconColor} />
          </div>
          <h3 className={`font-black ${ach.iconColor} text-[clamp(14px,3.5vw,16px)] sm:text-[clamp(14px,3.5vw,16px)] mb-[clamp(6px,2vw,8px)]`}>获得日期</h3>
          <p className={`text-[clamp(14px,3.5vw,16px)] sm:text-[clamp(14px,3.5vw,16px)] font-bold ${ach.iconColor} opacity-80`}>2025年03月15日</p>
        </div>

      </div>
    </div>
  );
};

const publicAssetUrl = (path: string) => {
  const base = (import.meta as any).env?.BASE_URL ?? '/';
  const normalizedBase = typeof base === 'string' && base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return encodeURI(`${normalizedBase}${normalizedPath}`);
};

const FLASHCARDS_DATA = [
  { word: 'calculator', pos: 'n.', pron: '/ˈkæl.kjə.leɪ.tər/', meaning: '计算器', example: 'I need a calculator for my math homework.', image: '/cards/calculator.png' },
  { word: 'gel', pos: 'n.', pron: '/dʒel/', meaning: '凝胶', example: 'He uses hair gel every morning.', image: '/cards/gel.png' },
  { word: 'hate', pos: 'v.', pron: '/heɪt/', meaning: '讨厌，憎恨', example: 'I hate waking up early on weekends.', image: '/cards/hate.png' },
  { word: 'invention', pos: 'n.', pron: '/ɪnˈven.ʃən/', meaning: '发明；发明物', example: 'The telephone is a great invention.', image: '/cards/invention.png' },
  { word: 'remote control', pos: 'n.', pron: '/rɪˌmoʊt kənˈtroʊl/', meaning: '遥控器', example: 'Where is the TV remote control?', image: '/cards/remote control.png' },
];

const FlashcardLearning = ({ onFinish, onBack }: { onFinish: () => void, onBack: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    if (currentIndex < FLASHCARDS_DATA.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30, delay: 0.08 },
        opacity: { duration: 0.2, delay: 0.08 }
      }
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }
      };
    }
  };

  return (
    <div className="relative h-full w-full bg-slate-50 z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800 overflow-hidden">
      <header className="h-[10%] min-h-[60px] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100 shrink-0 z-10">
        <button onClick={onBack} className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"><X size={28} /></button>
        <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] uppercase text-slate-600">单词卡 ({currentIndex + 1}/{FLASHCARDS_DATA.length})</h2>
        <div className="w-[clamp(36px,10vw,48px)]" />
      </header>
      
      <div className="flex-1 flex items-center justify-center p-[clamp(12px,3vw,16px)] sm:p-[clamp(20px,5vw,32px)] relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden absolute"
          >
            {/* Image Section */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-100 relative">
              <img src={publicAssetUrl(FLASHCARDS_DATA[currentIndex].image)} alt={FLASHCARDS_DATA[currentIndex].word} className="w-full h-full object-cover" />
            </div>
            
            {/* Content Section */}
            <div className="w-full md:w-1/2 p-[clamp(20px,5vw,32px)] sm:p-[clamp(32px,8vw,48px)] flex flex-col justify-center relative bg-white">
              <div className="space-y-[clamp(16px,4vw,24px)]">
                <div>
                  <h1 className="text-[clamp(32px,8vw,48px)] sm:text-6xl font-black text-slate-800 mb-[clamp(6px,2vw,8px)]">{FLASHCARDS_DATA[currentIndex].word}</h1>
                  <div className="flex items-center space-x-[clamp(8px,2.5vw,12px)] text-[clamp(18px,4.5vw,20px)] sm:text-[clamp(20px,5vw,24px)] font-bold text-slate-500">
                    <span className="bg-blue-100 text-blue-600 px-[clamp(8px,2.5vw,12px)] py-1 rounded-[clamp(6px,1.5vw,8px)]">{FLASHCARDS_DATA[currentIndex].pos}</span>
                    <span>{FLASHCARDS_DATA[currentIndex].pron}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-[clamp(14px,3.5vw,16px)] font-black text-slate-400 uppercase tracking-widest mb-1">中文意思</h3>
                  <p className="text-[clamp(22px,5.5vw,28px)] font-bold text-slate-700">{FLASHCARDS_DATA[currentIndex].meaning}</p>
                </div>
                
                <div>
                  <h3 className="text-[clamp(14px,3.5vw,16px)] font-black text-slate-400 uppercase tracking-widest mb-1">例句</h3>
                  <p className="text-[clamp(18px,4.5vw,20px)] font-medium text-slate-600 italic leading-relaxed">"{FLASHCARDS_DATA[currentIndex].example}"</p>
                </div>
              </div>
              
              {/* Next Button */}
              <div className="mt-12 flex justify-end">
                {currentIndex < FLASHCARDS_DATA.length - 1 ? (
                  <button 
                    onClick={handleNext}
                    className="w-[clamp(48px,14vw,64px)] h-[clamp(48px,14vw,64px)] bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 active:scale-90 transition-all"
                  >
                    <ArrowRight size={32} />
                  </button>
                ) : (
                  <button 
                    onClick={onFinish}
                    className="px-[clamp(20px,5vw,32px)] py-[clamp(12px,3vw,16px)] bg-green-500 text-white rounded-full font-black text-[clamp(20px,5vw,24px)] shadow-lg hover:bg-green-600 active:scale-95 transition-all flex items-center space-x-[clamp(6px,2vw,8px)]"
                  >
                    <Check size={28} strokeWidth={3} />
                    <span>完成学习</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const ReportGenerator = ({ onBack }: { onBack: () => void }) => {
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('generating');
  const [progress, setProgress] = useState(0);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    if (status === 'generating') {
      setProgress(0);
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setStatus('success');
          setReportUrl('https://cyberai.dev.xrunda.com/creator-review/cw_1769655106291_39479145/page_1769655912709_ebd8bc1a?version=2016709183749292033');
        }
        setProgress(currentProgress);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="max-w-4xl mx-auto py-[clamp(16px,4vw,24px)]">
      {status === 'generating' && (
        <div className="bg-white rounded-[32px] p-[clamp(32px,8vw,48px)] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative w-[clamp(96px,30vw,128px)] h-[clamp(96px,30vw,128px)] flex items-center justify-center">
            <svg className="animate-spin w-full h-full text-blue-100" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75 text-blue-500" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[clamp(22px,5.5vw,28px)] font-black text-blue-500">{progress}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-[clamp(22px,5.5vw,28px)] font-black text-slate-800 mb-[clamp(6px,2vw,8px)]">AIGC 报告生成中...</h3>
            <p className="text-slate-500 font-bold">
              {progress < 20 ? '正在创建课件...' : 
               progress < 40 ? '获取模板信息...' : 
               progress < 80 ? '调用 AI 生成内容...' : 
               '保存结果中...'}
            </p>
          </div>
          <div className="w-full max-w-md bg-slate-100 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="bg-white rounded-[32px] p-[clamp(32px,8vw,48px)] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-[clamp(16px,4vw,24px)]">
          <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)]">
            <Check size={48} strokeWidth={3} />
          </div>
          <h3 className="text-[clamp(24px,6vw,32px)] font-black text-slate-800">报告生成成功！</h3>
          <p className="text-slate-500 font-bold text-[clamp(18px,4.5vw,20px)] max-w-xl">
            学习报告已成功生成，您可以点击下方按钮预览报告。
          </p>
          <div className="pt-6 w-full max-w-sm space-y-[clamp(12px,3vw,16px)]">
            <button 
              onClick={() => setShowPreview(true)}
              className="w-full py-[clamp(12px,3vw,16px)] bg-green-500 text-white rounded-[clamp(12px,3vw,16px)] font-black text-[clamp(20px,5vw,24px)] shadow-lg hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center space-x-[clamp(6px,2vw,8px)]"
            >
              <FileText size={24} />
              <span>预览报告</span>
            </button>
          </div>
        </div>
      )}

      {showPreview && reportUrl && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <header className="h-[10%] min-h-[60px] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100 shrink-0">
            <button onClick={() => setShowPreview(false)} className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform">
              <ChevronLeft size={28} />
            </button>
            <h2 className="font-black text-slate-800 text-[clamp(20px,5vw,24px)] tracking-widest">学习报告预览</h2>
            <div className="w-[clamp(36px,10vw,48px)]" />
          </header>
          <div className="flex-1 w-full h-full bg-slate-50">
            <iframe 
              src={reportUrl} 
              className="w-full h-full border-none"
              title="学习报告预览"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}
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
  const [gateError, setGateError] = useState(false);
  const [learningTitle, setLearningTitle] = useState('');
  const [studyTime, setStudyTime] = useState(0);

  const verticalDragProps = useVerticalDragToScroll();
  const calendarDragProps = useVerticalDragToScroll();

  useEffect(() => {
    if (showCalendar) {
      const el = document.getElementById(`cal-day-${selectedDate.getDate()}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedDate, showCalendar]);

  const mapScrollRef = useRef<number>(0);
  const mainRef = useRef<HTMLElement>(null);
  const gateInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentView === 'learning') {
      interval = setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
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
        }, 250);
      }, 1000);
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
    setGateError(false);
    setShowParentGate(true);
  };

  const handleParentGateSubmit = () => {
    if (parseInt(gateInput) === gateMath.a) {
      setShowParentGate(false);
      setCurrentView('parent');
    } else {
      setGateError(true);
      setGateInput('');

      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'square';
          const now = ctx.currentTime;
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.linearRampToValueAtTime(260, now + 0.18);

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
        }
      } catch {
        // ignore audio errors
      }

      setTimeout(() => setGateError(false), 220);
    }
  };

  const handleParentGateCancel = () => {
    setShowParentGate(false);
    setCurrentView('home');
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
            className={`w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] rounded-[40%] flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 relative z-10
              ${isMajorDone ? 'bg-slate-300 opacity-90' : isMajorCurrent ? 'bg-white text-blue-500 scale-110 shadow-blue-500/50' : 'bg-white/80 opacity-60 grayscale hover:grayscale-0 hover:scale-105'}
            `}
            style={{ 
              backgroundColor: isMajorDone ? '#cbd5e1' : isMajorCurrent ? 'white' : major.color,
              boxShadow: isMajorCurrent ? `0 10px 25px -5px ${major.color}80, inset 0 -4px 0 0 rgba(0,0,0,0.1)` : 'inset 0 -4px 0 0 rgba(0,0,0,0.1)'
            }}
          >
            {isMajorDone ? <Check size={48} color="white" /> : <span className="text-[clamp(28px,7vw,40px)] drop-shadow-md">{major.icon}</span>}
          </div>
          <div className="mt-[clamp(12px,3vw,16px)] bg-white/90 backdrop-blur-sm px-[clamp(12px,3vw,16px)] py-1.5 rounded-full shadow-sm border border-white/50">
            <span className="font-black text-[12px] text-slate-700 tracking-wider">{major.name}</span>
          </div>
        </div>
      );

      // 2. 子点
      major.subs.forEach((sub, sIdx) => {
        const isSubDone = isMajorDone || (isMajorCurrent && sIdx < subIdx);
        const isSubActive = isMajorCurrent && sIdx === subIdx;
        
        stageContent.push(
          <div key={`line-sub-${mIdx}-${sIdx}`} className="w-[clamp(32px,8vw,40px)] h-2.5 bg-white/30 mx-1 rounded-full overflow-hidden shadow-inner relative">
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
            className={`flex flex-col items-center relative`}
          >
            {isSubActive && (
              <div className="absolute -top-10 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-[clamp(8px,2.5vw,12px)] py-1 rounded-[clamp(8px,2vw,12px)] text-[10px] font-black shadow-lg whitespace-nowrap z-50 border border-yellow-300">
                {sub}<div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45 border-b border-r border-yellow-300" />
              </div>
            )}
            <div
              className={`w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all duration-300
                ${isSubDone ? 'bg-slate-400' : isSubActive ? 'bg-white cursor-pointer animate-breathe-scale scale-110 shadow-yellow-400/50' : 'bg-white/60 opacity-60'}
              `}
              style={{ 
                borderColor: isSubActive ? '#fbbf24' : 'white',
                backgroundColor: isSubDone ? '#94a3b8' : 'white',
                boxShadow: isSubActive ? '0 10px 15px -3px rgba(251, 191, 36, 0.5), inset 0 -3px 0 0 rgba(0,0,0,0.1)' : 'inset 0 -3px 0 0 rgba(0,0,0,0.1)'
              }}
            >
              {isSubDone ? <Check size={20} color="white" /> : isSubActive ? <Play size={20} className="fill-amber-500 text-amber-500 drop-shadow-sm" /> : <div className="w-3 h-3 rounded-full" style={{ backgroundColor: major.color }} />}
            </div>
          </div>
        );
      });

      // 3. 宝箱
      stageContent.push(
        <div key={`line-chest-${mIdx}`} className="w-[clamp(32px,8vw,40px)] h-2.5 bg-white/30 mx-1 rounded-full overflow-hidden shadow-inner relative">
          <div className={`h-full transition-all duration-700 ease-out rounded-full ${isMajorDone ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-transparent'}`} style={{ width: isMajorDone ? '100%' : '0%' }} />
        </div>
      );

      stageContent.push(
        <div 
          key={`chest-${mIdx}`}
          onClick={() => isMajorCurrent && subIdx === major.subs.length && handleOpenReward(mIdx)}
          className={`w-[clamp(48px,14vw,64px)] h-[clamp(48px,14vw,64px)] rounded-[clamp(12px,3vw,16px)] border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 relative
            ${isMajorDone ? 'bg-slate-400' : (isMajorCurrent && subIdx === major.subs.length) ? 'bg-gradient-to-br from-yellow-300 to-orange-500 cursor-pointer scale-110 shadow-orange-500/50' : 'bg-slate-200 opacity-40'}
          `}
          style={{
            boxShadow: (isMajorCurrent && subIdx === major.subs.length) ? '0 10px 25px -5px rgba(249, 115, 22, 0.6), inset 0 -4px 0 0 rgba(0,0,0,0.1)' : 'inset 0 -4px 0 0 rgba(0,0,0,0.1)'
          }}
        >
          {isMajorDone ? <Check size={32} color="white" className="drop-shadow-md" /> : <span className={`text-[clamp(24px,6vw,32px)] drop-shadow-sm ${(isMajorCurrent && subIdx === major.subs.length) ? 'animate-breathe-scale inline-block' : ''}`}>🎁</span>}
        </div>
      );

      // Push the grouped stage block
      pathNodes.push(
        <React.Fragment key={`stage-frag-${mIdx}`}>
          <div id={`major-module-${mIdx}`} className={`relative flex items-center h-[258px] px-[clamp(16px,4vw,24px)] py-[clamp(20px,5vw,32px)] mx-2 rounded-[40px] border-2 backdrop-blur-sm transition-all duration-700 overflow-hidden ${bgClass} ${borderClass}`}>
            
            {/* Animated Background for Current Module */}
            {isMajorCurrent && (
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className={`absolute -top-10 -left-10 w-[clamp(160px,50vw,256px)] h-[clamp(160px,50vw,256px)] rounded-full opacity-20 animate-drift-1 ${mIdx === 0 ? 'bg-blue-300' : mIdx === 1 ? 'bg-green-300' : mIdx === 2 ? 'bg-amber-300' : 'bg-purple-300'}`}></div>
                <div className={`absolute -bottom-10 -right-10 w-[clamp(200px,60vw,288px)] h-[clamp(200px,60vw,288px)] rounded-full opacity-20 animate-drift-2 ${mIdx === 0 ? 'bg-blue-200' : mIdx === 1 ? 'bg-green-200' : mIdx === 2 ? 'bg-amber-200' : 'bg-purple-200'}`}></div>
              </div>
            )}

            {/* Stage Label Watermark */}
            <div className="absolute top-3 left-0 w-full text-center font-black text-[15px] tracking-widest uppercase opacity-40 z-10" style={{ color: isMajorFuture ? '#94a3b8' : major.color }}>
              STAGE {mIdx + 1} · {major.id}
            </div>
            
            {/* Nodes */}
            <div className="flex items-center relative z-10 mt-[clamp(12px,3vw,16px)]">
              {stageContent}
            </div>
          </div>

          {/* 4. 大关连接 */}
          {mIdx < TASK_DATA.length - 1 && (
            <div key={`major-conn-${mIdx}`} className="w-[clamp(48px,14vw,64px)] h-3 bg-white/30 rounded-full mx-1 shadow-inner overflow-hidden relative shrink-0">
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
          <div className="absolute top-10 left-[10%] w-[clamp(128px,40vw,192px)] h-[clamp(48px,14vw,64px)] bg-white/40 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-[15%] w-[clamp(160px,50vw,256px)] h-[clamp(56px,16vw,80px)] bg-white/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-[20%] w-[clamp(240px,70vw,320px)] h-[clamp(64px,20vw,96px)] bg-white/50 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/2 w-[clamp(280px,80vw,384px)] h-[clamp(280px,80vw,384px)] bg-yellow-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* 首页 */}
        {currentView === 'home' && (
          <div className="relative h-full w-full flex flex-col z-10 animate-in fade-in duration-500">
            <header className="h-[15%] px-[4%] flex justify-between items-center relative z-20">
              <div onClick={() => setCurrentView('profile')} className="flex items-center space-x-[clamp(12px,3vw,16px)] cursor-pointer group">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-[clamp(12px,3vw,16px)] rotate-3 group-hover:rotate-6 transition-transform shadow-md"></div>
                  <div className="w-[clamp(48px,14vw,64px)] h-[clamp(48px,14vw,64px)] bg-white rounded-[clamp(12px,3vw,16px)] p-1 shadow-lg border-2 border-white overflow-hidden relative z-10 group-hover:scale-105 transition-transform">
                    <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Qian" alt="avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-[clamp(14px,3.5vw,20px)] py-[clamp(8px,2.5vw,10px)] rounded-full shadow-md border border-white/50 group-hover:bg-white transition-colors">
                  <span className={`font-black text-[clamp(14px,3.5vw,16px)] tracking-wide ${isToday ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' : 'text-green-600'}`}>
                    L1 · {isToday ? '今日探险' : `复习(${selectedDate.getDate()}日)`}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-[clamp(14px,3.5vw,20px)]">
                <div onClick={() => setCurrentView('shop')} className="bg-white/90 backdrop-blur-sm px-[clamp(14px,3.5vw,20px)] py-[clamp(8px,2.5vw,10px)] rounded-full shadow-md flex items-center cursor-pointer hover:bg-white hover:scale-105 transition-all border border-white/50">
                  <Gem size={22} className="text-blue-500 drop-shadow-sm mr-2" />
                  <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)] tracking-wider">{diamonds}</span>
                </div>
                <button onClick={openParentGate} className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-slate-500 active:text-blue-600 active:rotate-90 transition-all border border-white/50">
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
              <div className="flex items-center min-w-max h-full py-[clamp(12px,3vw,16px)]">{renderMapPath()}</div>
            </main>
            <footer className="h-[22%] flex items-center justify-center pb-6 relative z-20 space-x-[clamp(16px,4vw,24px)]">
              {/* Main Pill */}
              <div className="bg-white px-[clamp(20px,5vw,32px)] py-[clamp(12px,3vw,16px)] rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center space-x-8 border border-slate-100 relative overflow-hidden">
                
                {/* Study Time */}
                <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                  <div className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Study Time</p>
                    <p className="text-[clamp(20px,5vw,24px)] font-black text-slate-800">
                      {Math.floor(studyTime / 60)} <span className="text-[clamp(12px,3vw,14px)]">MIN</span>
                    </p>
                  </div>
                </div>

                <div className="h-[clamp(32px,8vw,40px)] w-[1px] bg-slate-200" />

                {/* Daily Goal */}
                <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                  <div className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Daily Goal</p>
                    <p className="text-[clamp(20px,5vw,24px)] font-black text-slate-800">STAGE {Math.min(majorIdx + 1, TASK_DATA.length)}/{TASK_DATA.length}</p>
                  </div>
                </div>

                <div className="h-[clamp(32px,8vw,40px)] w-[1px] bg-slate-200" />

                {/* Adventure Progress */}
                <div className="flex flex-col justify-center w-[clamp(240px,70vw,320px)] relative pr-3">
                  <div className="flex justify-between items-end mb-[clamp(8px,2.5vw,12px)]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Adventure Progress</p>
                    <p className="text-[12px] font-black text-orange-500">{Math.round((TASK_DATA.slice(0, majorIdx).reduce((acc, task) => acc + task.subs.length, 0) + subIdx) / TASK_DATA.reduce((acc, task) => acc + task.subs.length, 0) * 100)}%</p>
                  </div>
                  <div className="relative h-3 w-full bg-slate-100 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${(TASK_DATA.slice(0, majorIdx).reduce((acc, task) => acc + task.subs.length, 0) + subIdx) / TASK_DATA.reduce((acc, task) => acc + task.subs.length, 0) * 100}%` }} 
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse rounded-full" />
                    </div>
                    {TASK_DATA.map((task, idx) => {
                      const totalSubs = TASK_DATA.reduce((acc, t) => acc + t.subs.length, 0);
                      const currentTotalSubsDone = TASK_DATA.slice(0, majorIdx).reduce((acc, t) => acc + t.subs.length, 0) + subIdx;
                      const taskEndSubs = TASK_DATA.slice(0, idx + 1).reduce((acc, t) => acc + t.subs.length, 0);
                      const nodePercent = (taskEndSubs / totalSubs) * 100;
                      const isReached = currentTotalSubsDone >= taskEndSubs;
                      const isCurrent = majorIdx === idx;
                      return (
                        <div 
                          key={task.id}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                          style={{ left: `${nodePercent}%` }}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all duration-500 z-10 ${isReached ? 'bg-green-500 border-2 border-white shadow-[0_2px_8px_rgba(34,197,94,0.5)] scale-110' : isCurrent ? 'bg-orange-100 border-2 border-orange-400 shadow-sm scale-125' : 'bg-slate-200 border-2 border-white shadow-sm grayscale opacity-60'}`}>
                            {isReached ? <Check size={14} color="white" strokeWidth={3} /> : task.icon}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Secondary Pill (Buttons) */}
              <div className="bg-white p-[clamp(6px,2vw,8px)] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center space-x-[clamp(8px,2.5vw,12px)] border border-slate-100">
                <button onClick={() => setShowCalendar(true)} className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-purple-500 rounded-full flex items-center justify-center text-white transition-all shadow-[0_4px_0_#7e22ce] active:shadow-none active:translate-y-1">
                  <CalendarIcon size={24} />
                </button>
                <button onClick={() => setCurrentView('awards')} className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-sky-500 rounded-full flex items-center justify-center text-white transition-all shadow-[0_4px_0_#0369a1] active:shadow-none active:translate-y-1">
                  <Award size={24} />
                </button>
              </div>
            </footer>
          </div>
        )}

        {/* 学习详情页：纯白背景 & 修复按钮高度 */}
        {currentView === 'learning' && (
          learningTitle.includes('单词卡') ? (
            <FlashcardLearning onFinish={finishSubTask} onBack={() => setCurrentView('home')} />
          ) : learningTitle.includes('电子书') ? (
            <EbookReader onFinish={finishSubTask} onBack={() => setCurrentView('home')} />
          ) : (
            <div className="relative h-full w-full bg-white z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800">
              <header className="h-[12%] px-[4%] flex items-center justify-between bg-slate-50 border-b border-slate-100 shadow-sm">
                <button onClick={() => setCurrentView('home')} className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-200 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 hover:bg-slate-300 transition-colors"><X size={32} /></button>
                <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] uppercase text-slate-600">{learningTitle}</h2><div className="w-[clamp(40px,12vw,56px)]" />
              </header>
              <div className="flex-1 flex items-center justify-center p-[clamp(16px,4vw,24px)] sm:p-[clamp(24px,6vw,40px)]"><div className="w-full h-full max-w-4xl aspect-video bg-slate-100 rounded-[40px] border-4 border-slate-200 shadow-xl flex items-center justify-center relative overflow-hidden"><Play size={80} className="text-slate-300 opacity-50" /><div className="absolute bottom-6 left-6 right-6 h-3 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-1/3" /></div></div></div>
              <div className="h-[16%] flex items-center justify-center px-[clamp(24px,6vw,40px)] pb-4"><button onClick={finishSubTask} className="bg-blue-600 text-white px-[clamp(32px,8vw,56px)] py-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)] font-black text-[clamp(22px,5.5vw,28px)] shadow-lg active:scale-95">学完了！领取奖励</button></div>
            </div>
          )
        )}

        {/* 各二级视图 (纯白背景) */}
        {['parent', 'awards', 'shop', 'profile', 'settings', 'subscriptions', 'reports', 'report-generator'].includes(currentView) && (
          <div className="relative h-full w-full bg-white z-50 flex flex-col animate-in slide-in-from-left duration-300">
            <header className="h-[12%] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100">
              <button onClick={() => currentView === 'report-generator' ? setCurrentView('reports') : ['settings', 'subscriptions', 'reports'].includes(currentView) ? setCurrentView('parent') : setCurrentView('home')} className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform"><ChevronLeft size={32} /></button>
              <h2 className="font-black text-slate-800 text-[clamp(22px,5.5vw,28px)] tracking-widest">{currentView === 'parent' ? '家长中心' : currentView === 'awards' ? '我的勋章' : currentView === 'shop' ? '魔法商城' : currentView === 'settings' ? 'App 设置' : currentView === 'subscriptions' ? '管理订阅' : currentView === 'reports' ? '接收学习报告' : currentView === 'report-generator' ? '生成学习报告' : '学员档案'}</h2>
              {currentView === 'parent' ? (
                <button onClick={() => setCurrentView('settings')} className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform">
                  <Settings size={28} />
                </button>
              ) : (
                <div className="w-[clamp(40px,12vw,56px)]" />
              )}
            </header>
            <main {...verticalDragProps} className="flex-1 p-[4%] overflow-y-auto no-scrollbar text-slate-800 cursor-grab active:cursor-grabbing">
               {currentView === 'awards' ? (
                 <div className="max-w-5xl mx-auto">
                   <div className="flex items-center space-x-[clamp(12px,3vw,16px)] mb-[clamp(20px,5vw,32px)]">
                     <Trophy size={40} className="text-amber-500" />
                     <div>
                       <h1 className="text-[clamp(22px,5.5vw,28px)] font-black text-slate-800">荣誉勋章墙</h1>
                       <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)] opacity-60">已解锁 {ACHIEVEMENTS_LIST.filter(a => a.acquired).length} / {ACHIEVEMENTS_LIST.length}</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[clamp(12px,3vw,16px)] sm:gap-[clamp(16px,4vw,24px)] pb-10 auto-rows-fr">
                     {ACHIEVEMENTS_LIST.map(ach => (
                       <AwardCard key={ach.id} ach={ach} />
                     ))}
                   </div>
                 </div>
               ) : currentView === 'parent' ? (
                 <div className="max-w-4xl mx-auto space-y-8 py-[clamp(12px,3vw,16px)]">
                   {/* 今日学习成就 */}
                   <section>
                     <div className="flex items-center space-x-[clamp(8px,2.5vw,12px)] mb-[clamp(16px,4vw,24px)]">
                       <BarChart3 className="text-blue-500" size={28} />
                       <h3 className="text-[clamp(20px,5vw,24px)] font-black text-slate-800">今日学习成就</h3>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-[clamp(12px,3vw,16px)]">
                       <div className="bg-blue-50 rounded-[24px] p-[clamp(14px,3.5vw,20px)] flex flex-col items-center justify-center text-center border-2 border-blue-100">
                         <BookOpen className="text-blue-500 mb-[clamp(6px,2vw,8px)]" size={24} />
                         <span className="text-[clamp(22px,5.5vw,28px)] font-black text-blue-600 mb-1">1,250</span>
                         <span className="text-[clamp(14px,3.5vw,16px)] font-bold text-blue-400">总阅读量(字)</span>
                       </div>
                       <div className="bg-green-50 rounded-[24px] p-[clamp(14px,3.5vw,20px)] flex flex-col items-center justify-center text-center border-2 border-green-100">
                         <Sparkles className="text-green-500 mb-[clamp(6px,2vw,8px)]" size={24} />
                         <span className="text-[clamp(22px,5.5vw,28px)] font-black text-green-600 mb-1">24</span>
                         <span className="text-[clamp(14px,3.5vw,16px)] font-bold text-green-400">新增词汇量(个)</span>
                       </div>
                       <div className="bg-amber-50 rounded-[24px] p-[clamp(14px,3.5vw,20px)] flex flex-col items-center justify-center text-center border-2 border-amber-100">
                         <Clock className="text-amber-500 mb-[clamp(6px,2vw,8px)]" size={24} />
                         <span className="text-[clamp(22px,5.5vw,28px)] font-black text-amber-600 mb-1">45</span>
                         <span className="text-[clamp(14px,3.5vw,16px)] font-bold text-amber-400">学习时长(分)</span>
                       </div>
                       <div className="bg-purple-50 rounded-[24px] p-[clamp(14px,3.5vw,20px)] flex flex-col items-center justify-center text-center border-2 border-purple-100">
                         <BookOpen className="text-purple-500 mb-[clamp(6px,2vw,8px)]" size={24} />
                         <span className="text-[clamp(22px,5.5vw,28px)] font-black text-purple-600 mb-1">3</span>
                         <span className="text-[clamp(14px,3.5vw,16px)] font-bold text-purple-400">读书总量(本)</span>
                       </div>
                     </div>
                   </section>

                   {/* 功能入口 */}
                   <section className="flex flex-col space-y-[clamp(12px,3vw,16px)]">
                     <button onClick={() => setCurrentView('subscriptions')} className="bg-amber-50 hover:bg-amber-100 transition-colors rounded-[24px] p-[clamp(16px,4vw,24px)] flex items-center justify-between border-2 border-amber-100 group w-full">
                       <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                         <div className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Crown className="text-amber-500" size={28} />
                         </div>
                         <div className="text-left">
                           <h3 className="font-black text-slate-800 text-[clamp(20px,5vw,24px)]">管理订阅</h3>
                           <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)]">查看千千妈妈课程订阅状态</p>
                         </div>
                       </div>
                       <ChevronRight className="text-amber-400 group-hover:text-amber-600 transition-colors" size={32} />
                     </button>
                     <button onClick={() => setCurrentView('reports')} className="bg-blue-50 hover:bg-blue-100 transition-colors rounded-[24px] p-[clamp(16px,4vw,24px)] flex items-center justify-between border-2 border-blue-100 group w-full">
                       <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                         <div className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                           <FileText className="text-blue-500" size={28} />
                         </div>
                         <div className="text-left">
                           <h3 className="font-black text-slate-800 text-[clamp(20px,5vw,24px)]">接收学习报告</h3>
                           <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)]">绑定微信，获取每周学习反馈</p>
                         </div>
                       </div>
                       <ChevronRight className="text-blue-400 group-hover:text-blue-600 transition-colors" size={32} />
                     </button>
                   </section>
                 </div>
               ) : currentView === 'subscriptions' ? (
                 <div className="max-w-3xl mx-auto space-y-[clamp(12px,3vw,16px)] py-[clamp(12px,3vw,16px)]">
                   {SUBSCRIPTIONS_LIST.map((sub) => (
                     <div key={sub.id} className={`bg-slate-50 rounded-[24px] p-[clamp(16px,4vw,24px)] border border-slate-100 flex items-center justify-between ${sub.status === 'expired' ? 'opacity-60 grayscale' : ''}`}>
                       <div className="flex items-center space-x-[clamp(12px,3vw,16px)] sm:space-x-[clamp(14px,3.5vw,20px)]">
                         <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] sm:w-[clamp(80px,25vw,112px)] sm:h-[clamp(80px,25vw,112px)] flex-shrink-0 relative flex items-center justify-center">
                           <div className="absolute inset-0 bg-[#CCCCCC] rounded-[clamp(12px,3vw,16px)] animate-pulse" />
                           <img src={sub.image} alt={sub.name} className={`w-full h-full object-contain drop-shadow-sm relative z-10 opacity-0 transition-opacity duration-300 ${sub.status === 'unpurchased' ? 'brightness-75 saturate-50' : ''}`} referrerPolicy="no-referrer" onLoad={(e) => { e.currentTarget.classList.remove('opacity-0'); e.currentTarget.classList.add('opacity-100'); const prev = e.currentTarget.previousElementSibling as HTMLElement; if (prev) prev.style.display = 'none'; }} onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${sub.id}/200/200`; }} />
                           {sub.status === 'unpurchased' && (
                             <div className="absolute inset-0 flex items-center justify-center rounded-[clamp(12px,3vw,16px)] z-20">
                               <div className="bg-black/50 rounded-full p-[clamp(8px,2vw,12px)] flex items-center justify-center"><Lock className="text-white drop-shadow-md" size={28} /></div>
                             </div>
                           )}
                         </div>
                         <div>
                           <h3 className="font-black text-slate-800 text-[clamp(18px,4.5vw,20px)]">{sub.name}</h3>
                           <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)]">{sub.desc}</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="text-[clamp(14px,3.5vw,16px)] font-bold text-slate-400 uppercase tracking-wider mb-1">
                           {sub.status === 'unpurchased' ? '状态' : sub.status === 'expired' ? '状态' : '到期时间'}
                         </p>
                         <p className={`font-black ${sub.status === 'unpurchased' ? 'text-slate-400' : sub.status === 'expired' ? 'text-slate-500' : 'text-slate-700'}`}>
                           {sub.expireDate}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : currentView === 'reports' ? (
                 <div className="h-full w-full flex items-center justify-center">
                   <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between px-[clamp(20px,5vw,32px)] gap-[clamp(32px,8vw,48px)]">
                     {/* Left Side: Icon, Title, Subtitle */}
                     <div className="flex-1 flex flex-col items-start text-left">
                       <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] bg-green-100 rounded-[32px] flex items-center justify-center text-green-500 mb-[clamp(20px,5vw,32px)] shadow-inner">
                         <FileText size={48} />
                       </div>
                       <h2 className="text-[clamp(28px,7vw,40px)] sm:text-[clamp(32px,8vw,48px)] font-black text-slate-800 mb-[clamp(16px,4vw,24px)] leading-tight">绑定微信<br/>接收学习报告</h2>
                       <p className="text-slate-500 font-bold text-[clamp(18px,4.5vw,20px)] max-w-md leading-relaxed mb-[clamp(20px,5vw,32px)]">
                         使用微信扫描右侧二维码，关注“千千妈妈”官方公众号，即可每周自动接收孩子的详细学习进度与报告。
                       </p>
                       <div className="flex items-center space-x-[clamp(6px,2vw,8px)] text-slate-400 font-bold text-[clamp(14px,3.5vw,16px)] bg-slate-50 px-[clamp(14px,3.5vw,20px)] py-[clamp(8px,2.5vw,12px)] rounded-full border border-slate-100">
                         <ShieldCheck size={20} className="text-green-500" />
                         <span>安全绑定，随时可取消</span>
                       </div>
                     </div>
                     
                     {/* Right Side: QR Code and Prompt */}
                     <div className="flex flex-col items-center justify-center">
                       <div className="bg-white p-[clamp(16px,4vw,24px)] rounded-[40px] shadow-2xl border border-slate-100 mb-[clamp(16px,4vw,24px)] relative group transform -translate-y-4">
                         <div className="absolute -top-4 -right-4 bg-green-500 text-white text-[clamp(14px,3.5vw,16px)] font-black px-[clamp(12px,3vw,16px)] py-[clamp(6px,2vw,8px)] rounded-full shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform z-10">
                           扫一扫
                         </div>
                         <div className="w-[clamp(160px,50vw,224px)] h-[clamp(160px,50vw,224px)] sm:w-[clamp(160px,50vw,256px)] sm:h-[clamp(160px,50vw,256px)] bg-slate-50 rounded-[clamp(12px,3vw,16px)] overflow-hidden relative">
                           {/* 占位二维码，如果用户上传了图片，请将 src 替换为本地路径，例如 "./qrcode.jpg" */}
                           <img 
                             src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QianQianMaMa" 
                             alt="千千妈妈公众号二维码" 
                             className="w-full h-full object-cover"
                             referrerPolicy="no-referrer"
                           />
                         </div>
                       </div>
                       <p className="text-slate-400 font-black tracking-widest uppercase text-[clamp(14px,3.5vw,16px)] mb-[clamp(16px,4vw,24px)]">
                         Scan to Subscribe
                       </p>
                       <button 
                         onClick={() => setCurrentView('report-generator')}
                         className="px-[clamp(20px,5vw,32px)] py-[clamp(12px,3vw,16px)] bg-blue-500 text-white rounded-full font-black text-[clamp(18px,4.5vw,20px)] shadow-lg hover:bg-blue-600 active:scale-95 transition-all flex items-center space-x-[clamp(6px,2vw,8px)]"
                       >
                         <FileText size={24} />
                         <span>预览学习报告</span>
                       </button>
                     </div>
                   </div>
                 </div>
               ) : currentView === 'report-generator' ? (
                 <ReportGenerator onBack={() => setCurrentView('reports')} />
               ) : currentView === 'settings' ? (
                 <div className="max-w-3xl mx-auto space-y-[clamp(16px,4vw,24px)] py-[clamp(12px,3vw,16px)]">
                   <div className="bg-slate-50 rounded-[32px] p-[clamp(16px,4vw,24px)] sm:p-[clamp(20px,5vw,32px)] border border-slate-100 space-y-[clamp(16px,4vw,24px)]">
                     {/* 个性化推荐 */}
                     <div className="flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60">
                       <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                         <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center"><Sparkles className="text-purple-500" size={20} /></div>
                         <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)]">个性化推荐</span>
                       </div>
                       <div className="w-[clamp(40px,12vw,56px)] h-[clamp(24px,6vw,32px)] bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                         <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                       </div>
                     </div>
                     {/* 语音测试难度 */}
                     <div className="flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60">
                       <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                         <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center"><Mic className="text-blue-500" size={20} /></div>
                         <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)]">语音测试难度</span>
                       </div>
                       <div className="flex items-center space-x-[clamp(6px,2vw,8px)] bg-white rounded-[clamp(8px,2vw,12px)] p-1 shadow-sm border border-slate-100">
                         <button className="px-[clamp(12px,3vw,16px)] py-1.5 rounded-[clamp(6px,1.5vw,8px)] font-bold text-[clamp(14px,3.5vw,16px)] text-slate-500 hover:bg-slate-50">简单</button>
                         <button className="px-[clamp(12px,3vw,16px)] py-1.5 rounded-[clamp(6px,1.5vw,8px)] font-bold text-[clamp(14px,3.5vw,16px)] bg-blue-50 text-blue-600 shadow-sm">适中</button>
                         <button className="px-[clamp(12px,3vw,16px)] py-1.5 rounded-[clamp(6px,1.5vw,8px)] font-bold text-[clamp(14px,3.5vw,16px)] text-slate-500 hover:bg-slate-50">挑战</button>
                       </div>
                     </div>
                     {/* 用户协议 */}
                     <button className="w-full flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60 group">
                       <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                         <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center"><FileText className="text-slate-500" size={20} /></div>
                         <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)] group-hover:text-blue-600 transition-colors">用户协议</span>
                       </div>
                       <ChevronRight className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
                     </button>
                     {/* 联系客服 */}
                     <button className="w-full flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60 group">
                       <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                         <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center"><Headphones className="text-slate-500" size={20} /></div>
                         <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)] group-hover:text-blue-600 transition-colors">联系客服</span>
                       </div>
                       <ChevronRight className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
                     </button>
                     {/* 退出登录 */}
                     <button className="w-full flex items-center justify-between py-[clamp(6px,2vw,8px)] group mt-[clamp(12px,3vw,16px)]">
                       <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                         <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-red-50 rounded-full flex items-center justify-center"><LogOut className="text-red-500" size={20} /></div>
                         <span className="font-black text-red-500 text-[clamp(18px,4.5vw,20px)]">退出登录</span>
                       </div>
                     </button>
                   </div>
                   <div className="text-center text-slate-400 font-bold text-[clamp(14px,3.5vw,16px)]">
                     当前版本 v1.0.0
                   </div>
                 </div>
               ) : currentView === 'profile' ? (
                 <div className="max-w-5xl mx-auto h-full flex flex-col pb-4">
                   {/* Top Profile Banner */}
                   <div className="flex items-center mb-[clamp(16px,4vw,24px)] w-full">
                     <div className="relative mr-8">
                       <div className="absolute inset-0 bg-yellow-400 rounded-[32px] -rotate-6 scale-105 shadow-md"></div>
                       <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] bg-white rounded-[32px] p-1.5 shadow-xl border-4 border-white overflow-hidden relative z-10">
                         <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Qian" alt="avatar" className="w-full h-full object-cover bg-blue-50" />
                       </div>
                       <div className="absolute -top-2 -right-4 text-[clamp(24px,6vw,32px)] animate-bounce z-20">✨</div>
                       <div className="absolute -bottom-2 -left-4 text-[clamp(24px,6vw,32px)] animate-pulse z-20">🌟</div>
                     </div>
                     <div className="flex flex-col items-start">
                       <h1 className="text-[clamp(24px,6vw,32px)] font-black text-slate-800 tracking-wide mb-[clamp(6px,2vw,8px)]">糯米团子</h1>
                       <div className="bg-blue-100 text-blue-600 px-[clamp(12px,3vw,16px)] py-1 rounded-full font-black text-[clamp(14px,3.5vw,16px)] shadow-sm border border-blue-200">
                         小小探险家
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(12px,3vw,16px)] flex-1 min-h-0">
                     {/* Left: Skill Cards */}
                     <div className="grid grid-cols-2 gap-[clamp(8px,2.5vw,12px)]">
                       {[
                         { id: 'listen', name: '听', level: 1, progress: 20, color: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', icon: '🎧' },
                         { id: 'speak', name: '说', level: 12, progress: 80, color: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600', icon: '🎙️' },
                         { id: 'read', name: '读', level: 1, progress: 30, color: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600', icon: '📖' },
                         { id: 'write', name: '写', level: 1, progress: 40, color: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', icon: '✍️' },
                       ].map(item => (
                         <div key={item.id} className={`${item.light} rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col relative overflow-hidden transition-transform hover:scale-105 cursor-pointer border-2 border-white shadow-sm`}>
                           <div className="flex justify-between items-start mb-[clamp(6px,2vw,8px)]">
                             <div className={`w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-[clamp(8px,2vw,12px)] flex items-center justify-center text-[clamp(20px,5vw,24px)] shadow-sm`}>
                               {item.icon}
                             </div>
                             <div className={`font-black ${item.text} text-[clamp(14px,3.5vw,16px)] bg-white/60 px-[clamp(6px,2vw,8px)] py-0.5 rounded-[clamp(6px,1.5vw,8px)]`}>Lv.{item.level}</div>
                           </div>
                           <h3 className={`font-black ${item.text} text-[clamp(18px,4.5vw,20px)] mb-[clamp(6px,2vw,8px)]`}>{item.name}力</h3>
                           <div className="h-3 bg-white/60 rounded-full overflow-hidden p-0.5 mt-auto">
                             <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                           </div>
                         </div>
                       ))}
                     </div>

                     {/* Right: Radar Chart */}
                     <div className="bg-slate-50 rounded-[32px] p-[clamp(12px,3vw,16px)] flex flex-col items-center justify-center border-4 border-slate-100 relative shadow-sm min-h-0">
                       <div className="absolute top-4 left-4 bg-white px-[clamp(8px,2.5vw,12px)] py-1.5 rounded-[clamp(8px,2vw,12px)] shadow-sm font-black text-slate-700 flex items-center space-x-[clamp(6px,2vw,8px)] z-10 text-[clamp(14px,3.5vw,16px)]">
                         <Target className="text-red-500" size={16} />
                         <span>我的超能力雷达</span>
                       </div>
                       <div className="w-full h-full min-h-[150px] mt-[clamp(16px,4vw,24px)]">
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
                   <div className="mt-[clamp(12px,3vw,16px)] bg-white border-4 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] relative overflow-hidden shadow-sm shrink-0">
                     <div className="flex justify-between items-end mb-[clamp(6px,2vw,8px)] relative z-10">
                       <div>
                         <p className="text-slate-400 font-bold text-[clamp(14px,3.5vw,16px)] mb-1">当前进度</p>
                         <h3 className="font-black text-[clamp(20px,5vw,24px)] text-slate-800 flex items-center space-x-[clamp(6px,2vw,8px)]">
                           <Crown className="text-yellow-500" size={20} />
                           <span>Lv.2 入门</span>
                         </h3>
                       </div>
                       <div className="text-right">
                         <p className="text-slate-400 font-bold text-[clamp(14px,3.5vw,16px)] mb-1">下一级</p>
                         <h3 className="font-black text-[clamp(18px,4.5vw,20px)] text-slate-400">Lv.3 学徒</h3>
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
               ) : currentView === 'shop' ? (
                 <div className="max-w-5xl mx-auto pb-[clamp(24px,6vw,40px)]">
                   <h2 className="text-[clamp(18px,4.5vw,20px)] font-black text-slate-700 mb-[clamp(12px,3vw,16px)] flex items-center"><Sparkles className="text-amber-500 mr-2" size={24} /> 售卖中</h2>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[clamp(12px,3vw,16px)] mb-[clamp(24px,6vw,40px)]">
                     {/* Item 1 */}
                     <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                       <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-blue-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group-hover:scale-110 transition-transform">
                         <Hourglass className="text-blue-500" size={32} />
                       </div>
                       <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">魔法沙漏</h3>
                       <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">增加15分钟学习时间</p>
                       <button className="w-full mt-auto bg-blue-100 hover:bg-blue-200 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                         <Gem size={16} />
                         <span>50</span>
                       </button>
                     </div>

                     {/* Item 2 */}
                     <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                       <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-purple-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group-hover:scale-110 transition-transform">
                         <FlaskConical className="text-purple-500" size={32} />
                       </div>
                       <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">智慧药水</h3>
                       <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">经验值双倍卡(1小时)</p>
                       <button className="w-full mt-auto bg-blue-100 hover:bg-blue-200 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                         <Gem size={16} />
                         <span>100</span>
                       </button>
                     </div>

                     {/* Item 3 */}
                     <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                       <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-amber-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group-hover:scale-110 transition-transform">
                         <Shield className="text-amber-500" size={32} />
                       </div>
                       <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">守护神盾</h3>
                       <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">抵消一次未完成惩罚</p>
                       <button className="w-full mt-auto bg-blue-100 hover:bg-blue-200 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                         <Gem size={16} />
                         <span>150</span>
                       </button>
                     </div>

                     {/* Item 4 */}
                     <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                       <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-green-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group-hover:scale-110 transition-transform">
                         <Clover className="text-green-500" size={32} />
                       </div>
                       <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">幸运四叶草</h3>
                       <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">抽奖概率提升20%</p>
                       <button className="w-full mt-auto bg-blue-100 hover:bg-blue-200 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                         <Gem size={16} />
                         <span>80</span>
                       </button>
                     </div>

                     {/* Item 5 */}
                     <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                       <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-rose-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group-hover:scale-110 transition-transform">
                         <Map className="text-rose-500" size={32} />
                       </div>
                       <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">探险指南</h3>
                       <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">解锁一个隐藏关卡</p>
                       <button className="w-full mt-auto bg-blue-100 hover:bg-blue-200 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                         <Gem size={16} />
                         <span>200</span>
                       </button>
                     </div>
                   </div>

                   <h2 className="text-[clamp(18px,4.5vw,20px)] font-black text-slate-400 mb-[clamp(12px,3vw,16px)] flex items-center"><PackageX className="text-slate-400 mr-2" size={24} /> 已售罄</h2>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[clamp(12px,3vw,16px)] opacity-60 grayscale">
                     {/* Sold Out 1 */}
                     <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center relative overflow-hidden">
                       <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-slate-200 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)]">
                         <Ghost className="text-slate-500" size={32} />
                       </div>
                       <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">隐身斗篷</h3>
                       <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">休息日免打卡</p>
                       <button disabled className="w-full mt-auto bg-slate-200 text-slate-500 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1">
                         <span>已售罄</span>
                       </button>
                     </div>

                     {/* Sold Out 2 */}
                     <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center relative overflow-hidden">
                       <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-slate-200 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)]">
                         <History className="text-slate-500" size={32} />
                       </div>
                       <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">时光倒流怀表</h3>
                       <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">补签一次</p>
                       <button disabled className="w-full mt-auto bg-slate-200 text-slate-500 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1">
                         <span>已售罄</span>
                       </button>
                     </div>

                     {/* Sold Out 3 */}
                     <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center relative overflow-hidden">
                       <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-slate-200 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)]">
                         <Flame className="text-slate-500" size={32} />
                       </div>
                       <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">龙之力量</h3>
                       <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">自动完成所有任务</p>
                       <button disabled className="w-full mt-auto bg-slate-200 text-slate-500 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1">
                         <span>已售罄</span>
                       </button>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 opacity-30"><div className="text-6xl mb-[clamp(12px,3vw,16px)]">👤</div><p className="font-black text-[clamp(14px,3.5vw,16px)] uppercase">界面设计中...</p></div>
               )}
            </main>
          </div>
        )}

        {/* --- 弹窗逻辑 --- */}

        {showCalendar && (
          <div className="absolute inset-0 z-[700] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-[4%]" onClick={() => setShowCalendar(false)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-4xl h-[90%] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-90 fade-in duration-300 ease-out text-slate-800">
              <header className="bg-blue-600 p-[clamp(16px,4vw,24px)] text-white flex justify-between items-center">
                <button onClick={() => setShowCalendar(false)} className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-white/20 rounded-[clamp(8px,2vw,12px)] flex items-center justify-center"><X size={24}/></button>
                <div className="flex items-center bg-white/10 rounded-[clamp(12px,3vw,16px)] p-[clamp(6px,2vw,8px)] px-[clamp(12px,3vw,16px)] space-x-[clamp(16px,4vw,24px)]">
                  <button onClick={() => changeDay(-1)} className="p-[clamp(6px,2vw,8px)] hover:bg-white/20 rounded-full transition-colors"><ArrowLeft size={24}/></button>
                  <div className="text-center min-w-[120px]">
                    <p className="text-[clamp(14px,3.5vw,16px)] font-bold opacity-70 uppercase tracking-widest">March 2024</p>
                    <p className="text-[clamp(22px,5.5vw,28px)] font-black">{selectedDate.getDate()}日</p>
                  </div>
                  <button onClick={() => changeDay(1)} disabled={new Date(new Date(selectedDate).setDate(selectedDate.getDate()+1)) > new Date()} className="p-[clamp(6px,2vw,8px)] hover:bg-white/20 rounded-full transition-colors disabled:opacity-30"><ArrowRight size={24}/></button>
                </div>
                <button onClick={() => setSelectedDate(new Date())} className="bg-white text-blue-600 px-[clamp(16px,4vw,24px)] py-[clamp(8px,2.5vw,10px)] rounded-[clamp(8px,2vw,12px)] font-black text-[clamp(14px,3.5vw,16px)] active:scale-95">回到今天</button>
              </header>
              <div className="flex-1 p-[clamp(20px,5vw,32px)] flex flex-col overflow-hidden">
                <div className="grid grid-cols-7 gap-[clamp(8px,2.5vw,12px)] text-center mb-[clamp(8px,2.5vw,12px)]">
                  {['S','M','T','W','T','F','S'].map((d, i) => <div key={`cal-h-${i}`} className="font-black text-[clamp(14px,3.5vw,16px)] text-slate-300 uppercase">{d}</div>)}
                </div>
                <div {...calendarDragProps} className="grid grid-cols-7 gap-[clamp(8px,2.5vw,12px)] flex-1 overflow-y-auto no-scrollbar cursor-grab active:cursor-grabbing pb-12">
                  {[...Array(31)].map((_, i) => { 
                    const d = i + 1; 
                    const isFuture = d > new Date().getDate(); 
                    const isPicked = d === selectedDate.getDate(); 
                    const status = MOCK_HISTORY_STATUS[d] ?? -1; 
                    let statusColor = "bg-slate-50 text-slate-600"; 
                    if (!isFuture) { 
                      if (status === 2) statusColor = "bg-green-50 text-green-600"; 
                      else if (status === 1) statusColor = "bg-yellow-50 text-yellow-600"; 
                      else if (status === 0) statusColor = "bg-red-50 text-red-400"; 
                    } 
                    return (
                      <div 
                        key={`day-c-${i}`} 
                        id={`cal-day-${d}`}
                        onClick={() => !isFuture && setSelectedDate(new Date(2024, 2, d))} 
                        className={`h-[clamp(48px,14vw,64px)] relative flex flex-col items-center justify-center rounded-[clamp(12px,3vw,16px)] font-black text-[clamp(18px,4.5vw,20px)] transition-all cursor-pointer ${isFuture ? 'text-slate-200 cursor-not-allowed bg-slate-50/30' : isPicked ? 'ring-4 ring-blue-500/30 scale-105 z-10' : ''} ${!isPicked ? statusColor : 'bg-blue-600 text-white shadow-lg'}`}
                      >
                        <span>{d}</span>
                        {!isFuture && !isPicked && status !== -1 && (
                          <div className={`w-2 h-2 rounded-full absolute bottom-2 ${status === 2 ? 'bg-green-400' : status === 1 ? 'bg-yellow-400' : 'bg-red-300'}`} />
                        )}
                      </div>
                    ); 
                  })}
                </div>
                <div className="mt-[clamp(16px,4vw,24px)] flex justify-center space-x-[clamp(16px,4vw,24px)] text-[clamp(14px,3.5vw,16px)] font-bold text-slate-400 border-t border-slate-50 pt-4">
                  <div className="flex items-center space-x-[clamp(6px,2vw,8px)]"><div className="w-3 h-3 rounded-full bg-green-400" /><span>已完成</span></div>
                  <div className="flex items-center space-x-[clamp(6px,2vw,8px)]"><div className="w-3 h-3 rounded-full bg-yellow-400" /><span>未完成</span></div>
                  <div className="flex items-center space-x-[clamp(6px,2vw,8px)]"><div className="w-3 h-3 rounded-full bg-red-400" /><span>未学习</span></div>
                </div>
              </div>
              <div className="p-[clamp(16px,4vw,24px)] bg-slate-50 border-t flex justify-center">
                {(() => {
                  const d = selectedDate.getDate();
                  const status = MOCK_HISTORY_STATUS[d] ?? -1;
                  let btnColor = "bg-blue-600 text-white";
                  if (!isToday) {
                    if (status === 2) btnColor = "bg-green-500 text-white";
                    else if (status === 1) btnColor = "bg-yellow-500 text-white";
                    else if (status === 0) btnColor = "bg-red-500 text-white";
                    else btnColor = "bg-slate-400 text-white";
                  }
                  return (
                    <button onClick={handleConfirmDate} className={`w-full py-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)] font-black text-[clamp(20px,5vw,24px)] shadow-lg active:scale-95 transition-colors ${btnColor}`}>
                      {isToday ? "开始今日学习探险" : "开启该日复习模式"}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {showModuleReward !== null && TASK_DATA[showModuleReward] && (
          <div className="absolute inset-0 z-[800] bg-transparent flex items-center justify-center text-slate-800">
            <div className="bg-white rounded-[40px] p-[clamp(32px,8vw,48px)] text-center shadow-2xl animate-in zoom-in duration-500 max-w-sm">
              <div className="text-8xl mb-[clamp(16px,4vw,24px)]">🎁</div>
              <h2 className="text-[clamp(24px,6vw,32px)] font-black text-orange-500 mb-[clamp(6px,2vw,8px)]">{TASK_DATA[showModuleReward].name}</h2>
              <p className="text-slate-500 mb-[clamp(20px,5vw,32px)] font-bold text-[clamp(14px,3.5vw,16px)]">获得专属奖励能量包</p>
              <div className="text-[clamp(32px,8vw,48px)] font-black text-blue-600 mb-10 flex items-center justify-center space-x-[clamp(8px,2.5vw,12px)]"><span>+50</span> <Gem size={32} className="text-blue-400" /></div>
              <button onClick={handleRewardConfirm} className="w-full bg-blue-500 text-white text-[clamp(22px,5.5vw,28px)] font-black py-[clamp(14px,3.5vw,20px)] rounded-[clamp(16px,4vw,24px)] shadow-xl active:scale-95 transition-transform">收下奖励</button>
            </div>
          </div>
        )}

        {showGrandReward && (
          <div className="absolute inset-0 z-[900] bg-gradient-to-b from-blue-900/90 to-purple-900/90 backdrop-blur-xl flex items-center justify-center text-slate-800">
            <div className="bg-white rounded-[50px] p-[clamp(24px,6vw,40px)] max-w-lg w-full text-center shadow-[0_0_100px_rgba(255,183,3,0.5)] animate-in zoom-in"><div className="w-[clamp(56px,16vw,80px)] h-[clamp(56px,16vw,80px)] bg-yellow-400 rounded-full border-4 border-white shadow-2xl flex items-center justify-center mx-auto mb-[clamp(16px,4vw,24px)] animate-bounce"><Award size={40} color="white" /></div><h2 className="text-[clamp(24px,6vw,32px)] font-black text-slate-800 mb-[clamp(20px,5vw,32px)] tracking-tight">今日探险圆满达成！</h2><div className="grid grid-cols-3 gap-[clamp(8px,2.5vw,12px)] mb-10 text-center"><div className="bg-blue-50 p-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)]"><p className="text-[clamp(20px,5vw,24px)] font-black text-blue-600">30M</p><p className="text-[8px] font-bold opacity-40">时长</p></div><div className="bg-green-50 p-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)]"><p className="text-[clamp(20px,5vw,24px)] font-black text-green-600">45W</p><p className="text-[8px] font-bold opacity-40">单词</p></div><div className="bg-purple-50 p-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)]"><p className="text-[clamp(20px,5vw,24px)] font-black text-purple-600">+200</p><p className="text-[8px] font-bold opacity-40">奖励</p></div></div><button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[clamp(18px,4.5vw,20px)] font-black py-[clamp(14px,3.5vw,20px)] rounded-[clamp(16px,4vw,24px)] shadow-xl flex items-center justify-center space-x-[clamp(6px,2vw,8px)] mb-[clamp(8px,2.5vw,12px)]"><Camera size={20} /> <span>领取勋章并分享</span></button><button onClick={() => setShowGrandReward(false)} className="w-full py-1.5 text-slate-400 font-black text-[clamp(14px,3.5vw,16px)] uppercase tracking-widest">回到地图</button></div>
          </div>
        )}

        {showParentGate && (
          <div
            className="absolute inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center text-slate-800"
            onClick={handleParentGateCancel}
          >
            <div
              className="bg-white rounded-[40px] p-[clamp(20px,5vw,32px)] sm:p-[clamp(28px,7vw,44px)] max-w-2xl w-[min(92vw,900px)] shadow-2xl animate-in zoom-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row gap-[clamp(16px,4vw,24px)] md:items-stretch">
                {/* Left: question + input */}
                <div className="flex-1 text-center flex flex-col h-full">
                  <h3 className="text-[clamp(22px,5.5vw,28px)] font-black text-slate-800 mb-[clamp(12px,3vw,18px)]">家长验证</h3>
                  <div className="text-[clamp(32px,8vw,48px)] font-black text-blue-600 mb-[clamp(14px,3.5vw,20px)] tracking-widest">
                    {gateMath.q}
                  </div>

                  <input
                    ref={gateInputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="?"
                    autoFocus
                    value={gateInput}
                    onChange={(e) => setGateInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className={`w-full text-center text-[clamp(28px,7vw,40px)] p-[clamp(10px,2.8vw,14px)] bg-slate-50 rounded-[clamp(12px,3vw,16px)] mb-[clamp(12px,3vw,16px)] outline-none border-4 transition-all ${
                      gateError ? 'border-red-400 animate-[pulse_0.2s_ease-in-out_2]' : 'border-transparent focus:border-blue-100'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleParentGateSubmit();
                    }}
                  />

                  <div className="flex space-x-[clamp(12px,3vw,16px)] mt-auto">
                    <button
                      onClick={handleParentGateCancel}
                      className="flex-1 py-[clamp(12px,3vw,16px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] font-black text-slate-500 text-[clamp(18px,4.5vw,20px)] active:scale-95 transition-transform"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleParentGateSubmit}
                      className="flex-1 py-[clamp(12px,3vw,16px)] bg-blue-600 text-white rounded-[clamp(12px,3vw,16px)] font-black shadow-xl text-[clamp(18px,4.5vw,20px)] active:scale-95 transition-transform"
                    >
                      确认
                    </button>
                  </div>
                </div>

                {/* Right: cute touch keypad */}
                <div className="md:w-[320px] w-full shrink-0">
                  <div className="bg-gradient-to-b from-blue-50 to-indigo-50 border border-blue-100 rounded-[28px] p-[clamp(14px,3.5vw,18px)] shadow-inner">
                    <div className="grid grid-cols-3 gap-[clamp(10px,2.5vw,12px)] select-none">
                      {['1','2','3','4','5','6','7','8','9'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onPointerDown={(e) => {
                            e.preventDefault();
                            setGateInput((prev) => (prev + d).replace(/\D/g, '').slice(0, 4));
                            gateInputRef.current?.focus();
                          }}
                          className="h-[clamp(52px,12vw,64px)] rounded-[20px] bg-white border border-blue-100 shadow-lg font-black text-[clamp(20px,5vw,24px)] text-slate-800 active:scale-95 transition-transform"
                        >
                          {d}
                        </button>
                      ))}

                      <div className="h-[clamp(52px,12vw,64px)]" />

                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          setGateInput((prev) => (prev + '0').replace(/\D/g, '').slice(0, 4));
                          gateInputRef.current?.focus();
                        }}
                        className="h-[clamp(52px,12vw,64px)] rounded-[20px] bg-white border border-blue-100 shadow-lg font-black text-[clamp(20px,5vw,24px)] text-slate-800 active:scale-95 transition-transform"
                      >
                        0
                      </button>

                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          setGateInput((prev) => prev.slice(0, -1));
                          gateInputRef.current?.focus();
                        }}
                        className="h-[clamp(52px,12vw,64px)] rounded-[20px] bg-gradient-to-b from-rose-400 to-pink-500 text-white shadow-lg font-semibold text-[clamp(22px,5vw,28px)] active:scale-95 transition-transform flex items-center justify-center"
                        aria-label="删除"
                      >
                        <span className="text-[clamp(24px,6vw,32px)] leading-none">⌫</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div id="toast" className="absolute top-[10vw] left-1/2 bg-white px-[clamp(24px,6vw,40px)] py-[clamp(14px,3.5vw,20px)] rounded-full shadow-2xl border-4 border-yellow-400 opacity-0 transition-all duration-500 z-[1100] flex items-center space-x-[clamp(12px,3vw,16px)] pointer-events-none text-slate-700" style={{ transform: 'translate(-50%, 0) scale(0.5)' }}>
          <Gem className="text-blue-400" size={36} /><span className="text-[clamp(24px,6vw,32px)] font-black text-blue-600">+10 钻石！</span>
        </div>
      </div>

      <div className="fixed inset-0 z-[9999] bg-slate-950 text-white flex flex-col items-center justify-center p-[clamp(16px,4vw,24px)] text-center landscape:hidden">
        <div className="text-6xl animate-bounce mb-[clamp(16px,4vw,24px)]">🔄</div><h2 className="text-[clamp(22px,5.5vw,28px)] font-black mb-[clamp(6px,2vw,8px)]">请旋转您的设备</h2><p className="opacity-60 text-[clamp(14px,3.5vw,16px)]">横屏体验能够开启完整学习探险哦！</p>
      </div>
    </div>
  );
}

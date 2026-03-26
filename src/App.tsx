import React, { useState, useEffect, useMemo, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft,
  X,
  Gem,
  Settings,
  Trophy,
  Calendar as CalendarIcon,
  Award,
  Play,
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Camera,
  Footprints,
  Sunrise,
  Gift,
  Ear,
  Mic,
  BookOpen,
  Repeat,
  CalendarCheck,
  ShoppingBag,
  Palette,
  Zap,
  Star,
  Medal,
  Crown,
  Target,
  Rocket,
  ShieldCheck,
  BarChart3,
  Bell,
  Sliders,
  User,
  Clock,
  Map,
  ChevronRight,
  LogOut,
  FileText,
  Headphones,
  Sparkles,
  Loader2,
  Store,
  PackageX,
  Hourglass,
  FlaskConical,
  Shield,
  Clover,
  Ghost,
  History,
  Flame,
  Edit2,
  TrendingUp,
  Shirt,
  Dices,
} from "lucide-react";

import {
  AVATAR_SEEDS,
  NAME_ADJS,
  NAME_NOUNS,
  TASK_DATA,
  SUBSCRIPTIONS_LIST,
  ACHIEVEMENTS_LIST,
  MOCK_HISTORY_STATUS,
} from "./constants";
import { UserProfile, ViewType, Achievement, Subscription } from "./types";
import { useVerticalDragToScroll } from "./hooks/useVerticalDragToScroll";
import { AchievementCard } from "./components/profile/AchievementCard";
import { ReportGenerator, FlashcardLearning } from "./components/learning/LearningComponents";
import { EbookReader } from "./components/EbookReader";
import { ReadAloud } from "./components/ReadAloud";
import { ExerciseModule } from "./components/ExerciseModule";
import { HomeView } from "./components/views/HomeView";
import { LearningView } from "./components/views/LearningView";
import { SecondaryView } from "./components/views/SecondaryView";
import { MapPath } from "./components/map/MapPath";
import { MainLayout } from "./components/layout/MainLayout";
import {
  RADAR_DATA,
  CustomPolarGrid,
  CustomTick,
} from "./components/reports/RadarChartComponents";

import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // --- 状态管理 ---
  const [userProfile, setUserProfile] = useState({
    name: "糯米团子",
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mimi",
  });
  const [tempProfile, setTempProfile] = useState({
    name: "糯米团子",
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mimi",
  });
  const [currentView, setCurrentView] = useState("home");
  const [majorIdx, setMajorIdx] = useState(1);
  const [subIdx, setSubIdx] = useState(0);
  const [diamonds, setDiamonds] = useState(500);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showModuleReward, setShowModuleReward] = useState<number | null>(null);
  const [showGrandReward, setShowGrandReward] = useState(false);
  const [showParentGate, setShowParentGate] = useState(false);
  const [gateMath, setGateMath] = useState({ q: "", a: 0 });
  const [gateInput, setGateInput] = useState("");
  const [learningTitle, setLearningTitle] = useState("");
  const [studyTime, setStudyTime] = useState(0);

  const verticalDragProps = useVerticalDragToScroll();
  const calendarDragProps = useVerticalDragToScroll();

  useEffect(() => {
    if (showCalendar) {
      const el = document.getElementById(`cal-day-${selectedDate.getDate()}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedDate, showCalendar]);

  const mapScrollRef = useRef<number>(0);
  const mainRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);

  // --- 全局点击音效 ---
  useEffect(() => {
    const playPop = () => {
      try {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
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
      if (
        target.closest("button") ||
        target.closest('[class*="cursor-pointer"]')
      ) {
        playPop();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startDraggingX = (pageX: number) => {
    if (!mainRef.current) return;
    isDragging.current = true;
    startX.current = pageX - mainRef.current.offsetLeft;
    scrollLeft.current = mainRef.current.scrollLeft;
  };

  const stopDraggingX = () => {
    isDragging.current = false;
  };

  const moveDraggingX = (pageX: number, e: any) => {
    if (!isDragging.current || !mainRef.current) return;
    if (e.cancelable) e.preventDefault();
    const x = pageX - mainRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    mainRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseDown = (e: React.MouseEvent) => startDraggingX(e.pageX);
  const handleMouseLeave = () => stopDraggingX();
  const handleMouseUp = () => stopDraggingX();
  const handleMouseMove = (e: React.MouseEvent) => moveDraggingX(e.pageX, e);

  const handleTouchStart = (e: React.TouchEvent) => startDraggingX(e.touches[0].pageX);
  const handleTouchEnd = () => stopDraggingX();
  const handleTouchMove = (e: React.TouchEvent) => moveDraggingX(e.touches[0].pageX, e);

  useEffect(() => {
    if (currentView === "home" && mainRef.current) {
      mainRef.current.scrollLeft = mapScrollRef.current;
    }
  }, [currentView]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentView === "learning") {
      interval = setInterval(() => {
        setStudyTime((prev) => prev + 1);
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
    setCurrentView("learning");
  };

  const finishSubTask = () => {
    setDiamonds((prev) => prev + 10);
    setSubIdx((prev) => prev + 1);
    setCurrentView("home");

    // Toast 提示
    const toast = document.getElementById("toast");
    if (toast) {
      toast.style.opacity = "1";
      toast.style.transform = "translate(-50%, 0) scale(1)";
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
          toast.style.transform = "translate(-50%, 0) scale(0.5)";
        }, 500);
      }, 2000);
    }
  };

  const handleRandomName = () => {
    const adj = NAME_ADJS[Math.floor(Math.random() * NAME_ADJS.length)];
    const noun = NAME_NOUNS[Math.floor(Math.random() * NAME_NOUNS.length)];
    setTempProfile((prev) => ({ ...prev, name: `${adj}${noun}` }));
  };

  const handleSaveProfile = () => {
    setUserProfile(tempProfile);
    setCurrentView("profile");
  };

  const handleOpenEditProfile = () => {
    setTempProfile(userProfile);
    setCurrentView("edit-profile");
  };

  const handleOpenReward = (mIdx: number) => {
    setShowModuleReward(mIdx);

    // 播放胜利庆祝音效
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();

        const playNote = (
          freq: number,
          startTime: number,
          duration: number,
          type: OscillatorType = "triangle",
        ) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc.type = type;
          osc.frequency.setValueAtTime(freq, startTime);

          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            startTime + duration,
          );

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        // C Major Arpeggio: C4, E4, G4, C5
        playNote(261.63, now, 0.4); // C4
        playNote(329.63, now + 0.1, 0.4); // E4
        playNote(392.0, now + 0.2, 0.4); // G4
        playNote(523.25, now + 0.3, 0.8, "sine"); // C5

        // Add harmony on the last note
        playNote(329.63, now + 0.3, 0.8, "sine"); // E4
        playNote(392.0, now + 0.3, 0.8, "sine"); // G4
      }
    } catch (e) {
      // Ignore audio context errors
    }

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      zIndex: 1000,
      colors: ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"],
    });
  };

  const handleRewardConfirm = () => {
    const isLastMajor = majorIdx === TASK_DATA.length - 1;
    setDiamonds((prev) => prev + 50);
    setShowModuleReward(null);
    if (isLastMajor) {
      setShowGrandReward(true);

      // 播放更盛大的胜利庆祝音效
      try {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();

          const playNote = (
            freq: number,
            startTime: number,
            duration: number,
            type: OscillatorType = "triangle",
          ) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              startTime + duration,
            );

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          };

          const now = ctx.currentTime;
          // Fanfare: C4, F4, C4, F4, A4, C5
          playNote(261.63, now, 0.2); // C4
          playNote(349.23, now + 0.2, 0.2); // F4
          playNote(261.63, now + 0.4, 0.2); // C4
          playNote(349.23, now + 0.6, 0.2); // F4
          playNote(440.0, now + 0.8, 0.2); // A4
          playNote(523.25, now + 1.0, 1.5, "sine"); // C5

          // Harmony
          playNote(349.23, now + 1.0, 1.5, "sine"); // F4
          playNote(440.0, now + 1.0, 1.5, "sine"); // A4
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
          colors: ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"],
          zIndex: 1000,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"],
          zIndex: 1000,
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
          const scrollLeft =
            nextModule.offsetLeft -
            container.clientWidth / 2 +
            nextModule.clientWidth / 2;
          container.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
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
      if (status === 2) {
        setMajorIdx(TASK_DATA.length);
        setSubIdx(0);
      } else if (status === 1) {
        setMajorIdx(1);
        setSubIdx(1);
      } else {
        setMajorIdx(0);
        setSubIdx(0);
      }
    }
    setShowCalendar(false);
  };

  const openParentGate = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setGateMath({ q: `${n1} + ${n2} = ?`, a: n1 + n2 });
    setGateInput("");
    setShowParentGate(true);
  };

  const handleParentGateSubmit = () => {
    if (parseInt(gateInput) === gateMath.a) {
      setShowParentGate(false);
      setCurrentView("parent");
    } else {
      setGateInput("");
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
      let bgClass = "";
      let borderClass = "";

      if (isMajorDone) {
        // Finished: Soft theme color, solid but calm
        if (mIdx === 0) {
          bgClass = "bg-[#d5ecfe]";
          borderClass = "border-blue-200";
        } else if (mIdx === 1) {
          bgClass = "bg-green-100/80";
          borderClass = "border-green-300/50";
        } else if (mIdx === 2) {
          bgClass = "bg-amber-100/80";
          borderClass = "border-amber-300/50";
        } else if (mIdx === 3) {
          bgClass = "bg-purple-100/80";
          borderClass = "border-purple-300/50";
        }
      } else if (isMajorCurrent) {
        // Current: Bright, glowing, active
        if (mIdx === 0) {
          bgClass = "bg-blue-50/90 shadow-[0_0_30px_rgba(59,130,246,0.3)]";
          borderClass = "border-blue-500";
        } else if (mIdx === 1) {
          bgClass = "bg-green-50/90 shadow-[0_0_30px_rgba(34,197,94,0.3)]";
          borderClass = "border-green-500";
        } else if (mIdx === 2) {
          bgClass = "bg-amber-50/90 shadow-[0_0_30px_rgba(245,158,11,0.3)]";
          borderClass = "border-amber-500";
        } else if (mIdx === 3) {
          bgClass = "bg-purple-50/90 shadow-[0_0_30px_rgba(168,85,247,0.3)]";
          borderClass = "border-purple-500";
        }
      } else {
        // Unfinished: Muted, glassmorphism, gray
        bgClass = "bg-white/20 grayscale opacity-60";
        borderClass = "border-white/30";
      }

      const stageContent: React.ReactNode[] = [];

      // 1. 大站
      stageContent.push(
        <div
          key={`major-${mIdx}`}
          className="flex flex-col items-center relative group"
        >
          {isMajorCurrent && (
            <div className="absolute -inset-4 bg-white/40 rounded-full blur-xl animate-pulse z-0" />
          )}
          <div
            className={`w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] rounded-[40%] flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 relative z-10
 ${isMajorDone ? "bg-slate-300 opacity-90" : isMajorCurrent ? "bg-white text-blue-500 scale-110 shadow-blue-500/50" : "bg-white/80 opacity-60 grayscale "}
 `}
            style={{
              backgroundColor: isMajorDone
                ? "#cbd5e1"
                : isMajorCurrent
                  ? "white"
                  : major.color,
              boxShadow: isMajorCurrent
                ? `0 10px 25px -5px ${major.color}80, inset 0 -4px 0 0 rgba(0,0,0,0.1)`
                : "inset 0 -4px 0 0 rgba(0,0,0,0.1)",
            }}
          >
            {isMajorDone ? (
              <Check size={48} color="white" />
            ) : (
              <span className="text-[clamp(28px,7vw,40px)] drop-shadow-md">
                {major.icon}
              </span>
            )}
          </div>
          <div className="mt-[clamp(12px,3vw,16px)] bg-white/90 backdrop-blur-sm px-[clamp(12px,3vw,16px)] py-1.5 rounded-full shadow-sm border border-white/50">
            <span className="font-black text-[12px] text-slate-700 tracking-wider">
              {major.name}
            </span>
          </div>
        </div>,
      );

      // 2. 子点
      major.subs.forEach((sub, sIdx) => {
        const isSubDone = isMajorDone || (isMajorCurrent && sIdx < subIdx);
        const isSubActive = isMajorCurrent && sIdx === subIdx;

        stageContent.push(
          <div
            key={`line-sub-${mIdx}-${sIdx}`}
            className="w-[clamp(32px,8vw,40px)] h-2.5 bg-white/30 mx-1 rounded-full overflow-hidden shadow-inner relative"
          >
            <div
              className={`h-full transition-all duration-700 ease-out rounded-full relative ${isSubDone ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-transparent"}`}
              style={{ width: isSubDone ? "100%" : "0%" }}
            />
          </div>,
        );

        stageContent.push(
          <div
            key={`dot-sub-${mIdx}-${sIdx}`}
            onClick={() =>
              isSubActive && startLearning(`${major.name} · ${sub}`)
            }
            className={`w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] rounded-full border-4 border-white shadow-md flex items-center justify-center relative transition-all duration-300
 ${isSubDone ? "bg-slate-400" : isSubActive ? "bg-white cursor-pointer animate-bounce scale-110 shadow-yellow-400/50" : "bg-white/60 opacity-60"}
 `}
            style={{
              borderColor: isSubActive ? "#fbbf24" : "white",
              backgroundColor: isSubDone ? "#94a3b8" : "white",
              boxShadow: isSubActive
                ? "0 10px 15px -3px rgba(251, 191, 36, 0.5), inset 0 -3px 0 0 rgba(0,0,0,0.1)"
                : "inset 0 -3px 0 0 rgba(0,0,0,0.1)",
            }}
          >
            {isSubActive && (
              <div className="absolute -top-10 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-[clamp(8px,2.5vw,12px)] py-1 rounded-[clamp(8px,2vw,12px)] text-[10px] font-black shadow-lg whitespace-nowrap z-50 border border-yellow-300">
                {sub}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45 border-b border-r border-yellow-300" />
              </div>
            )}
            {isSubDone ? (
              <Check size={20} color="white" />
            ) : isSubActive ? (
              <Play
                size={20}
                className="fill-amber-500 text-amber-500 drop-shadow-sm"
              />
            ) : (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: major.color }}
              />
            )}
          </div>,
        );
      });

      // 3. 宝箱
      stageContent.push(
        <div
          key={`line-chest-${mIdx}`}
          className="w-[clamp(32px,8vw,40px)] h-2.5 bg-white/30 mx-1 rounded-full overflow-hidden shadow-inner relative"
        >
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${isMajorDone ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-transparent"}`}
            style={{ width: isMajorDone ? "100%" : "0%" }}
          />
        </div>,
      );

      stageContent.push(
        <div
          key={`chest-${mIdx}`}
          onClick={() =>
            isMajorCurrent &&
            subIdx === major.subs.length &&
            handleOpenReward(mIdx)
          }
          className={`w-[clamp(48px,14vw,64px)] h-[clamp(48px,14vw,64px)] rounded-[clamp(12px,3vw,16px)] border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 relative
 ${isMajorDone ? "bg-slate-400" : isMajorCurrent && subIdx === major.subs.length ? "bg-gradient-to-br from-yellow-300 to-orange-500 cursor-pointer scale-110 shadow-orange-500/50" : "bg-slate-200 opacity-40"}
 `}
          style={{
            boxShadow:
              isMajorCurrent && subIdx === major.subs.length
                ? "0 10px 25px -5px rgba(249, 115, 22, 0.6), inset 0 -4px 0 0 rgba(0,0,0,0.1)"
                : "inset 0 -4px 0 0 rgba(0,0,0,0.1)",
          }}
        >
          {isMajorDone ? (
            <Check size={32} color="white" className="drop-shadow-md" />
          ) : (
            <span
              className={`text-[clamp(24px,6vw,32px)] drop-shadow-sm ${isMajorCurrent && subIdx === major.subs.length ? "animate-breathe-scale inline-block" : ""}`}
            >
              🎁
            </span>
          )}
        </div>,
      );

      // Push the grouped stage block
      pathNodes.push(
        <React.Fragment key={`stage-frag-${mIdx}`}>
          <div
            id={`major-module-${mIdx}`}
            className={`relative flex items-center h-[258px] px-[clamp(16px,4vw,24px)] py-[clamp(20px,5vw,32px)] mx-2 rounded-[40px] border-2 backdrop-blur-sm transition-all duration-700 overflow-hidden ${bgClass} ${borderClass}`}
          >
            {/* Animated Background for Current Module */}
            {isMajorCurrent && (
              <div className="absolute inset-0 pointer-events-none z-0">
                <div
                  className={`absolute -top-10 -left-10 w-[clamp(160px,50vw,256px)] h-[clamp(160px,50vw,256px)] rounded-full opacity-20 animate-drift-1 ${mIdx === 0 ? "bg-blue-300" : mIdx === 1 ? "bg-green-300" : mIdx === 2 ? "bg-amber-300" : "bg-purple-300"}`}
                ></div>
                <div
                  className={`absolute -bottom-10 -right-10 w-[clamp(200px,60vw,288px)] h-[clamp(200px,60vw,288px)] rounded-full opacity-20 animate-drift-2 ${mIdx === 0 ? "bg-blue-200" : mIdx === 1 ? "bg-green-200" : mIdx === 2 ? "bg-amber-200" : "bg-purple-200"}`}
                ></div>
              </div>
            )}

            {/* Stage Label Watermark */}
            <div
              className="absolute top-3 left-0 w-full text-center font-black text-[15px] tracking-widest uppercase opacity-40 z-10"
              style={{ color: isMajorFuture ? "#94a3b8" : major.color }}
            >
              STAGE {mIdx + 1} · {major.id}
            </div>

            {/* Nodes */}
            <div className="flex items-center relative z-10 mt-[clamp(12px,3vw,16px)]">
              {stageContent}
            </div>
          </div>

          {/* 4. 大关连接 */}
          {mIdx < TASK_DATA.length - 1 && (
            <div
              key={`major-conn-${mIdx}`}
              className="w-[clamp(48px,14vw,64px)] h-3 bg-white/30 rounded-full mx-1 shadow-inner overflow-hidden relative shrink-0"
            >
              <div
                className={`h-full transition-all duration-1000 ${mIdx < majorIdx ? "bg-gradient-to-r from-blue-400 to-cyan-400" : "bg-transparent"}`}
                style={{ width: mIdx < majorIdx ? "100%" : "0%" }}
              />
            </div>
          )}
        </React.Fragment>,
      );
    });
    return pathNodes;
  };

  return (
    <>
      <MainLayout>
        <AnimatePresence mode="wait">
        {currentView === "home" && (
          <HomeView
            key="home"
            userProfile={userProfile}
            diamonds={diamonds}
            selectedDate={selectedDate}
            isToday={isToday}
            studyTime={studyTime}
            majorIdx={majorIdx}
            subIdx={subIdx}
            onProfileClick={() => setCurrentView("profile")}
            onShopClick={() => setCurrentView("shop")}
            onSettingsClick={openParentGate}
            onCalendarClick={() => setShowCalendar(true)}
            onAwardsClick={() => setCurrentView("awards")}
            startLearning={startLearning}
            handleOpenReward={handleOpenReward}
            mainRef={mainRef}
            handleMouseDown={handleMouseDown}
            handleMouseLeave={handleMouseLeave}
            handleMouseUp={handleMouseUp}
            handleMouseMove={handleMouseMove}
            handleTouchStart={handleTouchStart}
            handleTouchEnd={handleTouchEnd}
            handleTouchMove={handleTouchMove}
            onScroll={(e) => {
              mapScrollRef.current = e.currentTarget.scrollLeft;
            }}
          />
        )}

        {currentView === "learning" && (
          <LearningView
            key="learning"
            learningTitle={learningTitle}
            finishSubTask={finishSubTask}
            onBack={() => setCurrentView("home")}
          />
        )}

        {[
          "parent",
          "awards",
          "shop",
          "profile",
          "settings",
          "subscriptions",
          "reports",
          "report-generator",
        ].includes(currentView) && (
          <SecondaryView
            key="secondary"
            currentView={currentView as ViewType}
            onBack={() => {
              if (currentView === "report-generator") setCurrentView("reports");
              else if (
                ["settings", "subscriptions", "reports"].includes(currentView)
              )
                setCurrentView("parent");
              else setCurrentView("home");
            }}
            onSettingsClick={() => setCurrentView("settings")}
            dragProps={verticalDragProps}
          >
            {currentView === "awards" ? (
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center space-x-[clamp(12px,3vw,16px)] mb-[clamp(20px,5vw,32px)]">
                  <Trophy size={40} className="text-amber-500" />
                  <div>
                    <h1 className="text-[clamp(22px,5.5vw,28px)] font-black text-slate-800">
                      荣誉勋章墙
                    </h1>
                    <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)] opacity-60">
                      已解锁{" "}
                      {ACHIEVEMENTS_LIST.filter((a) => a.acquired).length} /{" "}
                      {ACHIEVEMENTS_LIST.length}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[clamp(12px,3vw,16px)] sm:gap-[clamp(16px,4vw,24px)] pb-0 auto-rows-fr">
                  {ACHIEVEMENTS_LIST.map((ach) => (
                    <AchievementCard key={ach.id} ach={ach} />
                  ))}
                </div>
              </div>
            ) : currentView === "parent" ? (
                <div className="max-w-4xl mx-auto space-y-8 pt-0 pb-12">
                  {/* 今日学习成就 */}
                  <section>
                    <div className="flex items-center space-x-[clamp(8px,2.5vw,12px)] mb-[clamp(16px,4vw,24px)]">
                      <BarChart3 className="text-blue-500" size={28} />
                      <h3 className="text-[clamp(20px,5vw,24px)] font-black text-slate-800">
                        今日学习成就
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-[clamp(12px,3vw,16px)]">
                      <div className="bg-blue-50 rounded-[24px] p-[clamp(14px,3.5vw,20px)] flex flex-col items-center justify-center text-center border-2 border-blue-100">
                        <BookOpen
                          className="text-blue-500 mb-[clamp(6px,2vw,8px)]"
                          size={24}
                        />
                        <span className="text-[clamp(22px,5.5vw,28px)] font-black text-blue-600 mb-1">
                          1,250
                        </span>
                        <span className="text-[clamp(14px,3.5vw,16px)] font-bold text-blue-400">
                          总阅读量(字)
                        </span>
                      </div>
                      <div className="bg-green-50 rounded-[24px] p-[clamp(14px,3.5vw,20px)] flex flex-col items-center justify-center text-center border-2 border-green-100">
                        <Sparkles
                          className="text-green-500 mb-[clamp(6px,2vw,8px)]"
                          size={24}
                        />
                        <span className="text-[clamp(22px,5.5vw,28px)] font-black text-green-600 mb-1">
                          24
                        </span>
                        <span className="text-[clamp(14px,3.5vw,16px)] font-bold text-green-400">
                          新增词汇量(个)
                        </span>
                      </div>
                      <div className="bg-amber-50 rounded-[24px] p-[clamp(14px,3.5vw,20px)] flex flex-col items-center justify-center text-center border-2 border-amber-100">
                        <Clock
                          className="text-amber-500 mb-[clamp(6px,2vw,8px)]"
                          size={24}
                        />
                        <span className="text-[clamp(22px,5.5vw,28px)] font-black text-amber-600 mb-1">
                          45
                        </span>
                        <span className="text-[clamp(14px,3.5vw,16px)] font-bold text-amber-400">
                          学习时长(分)
                        </span>
                      </div>
                      <div className="bg-purple-50 rounded-[24px] p-[clamp(14px,3.5vw,20px)] flex flex-col items-center justify-center text-center border-2 border-purple-100">
                        <BookOpen
                          className="text-purple-500 mb-[clamp(6px,2vw,8px)]"
                          size={24}
                        />
                        <span className="text-[clamp(22px,5.5vw,28px)] font-black text-purple-600 mb-1">
                          3
                        </span>
                        <span className="text-[clamp(14px,3.5vw,16px)] font-bold text-purple-400">
                          读书总量(本)
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* 功能入口 */}
                  <section className="flex flex-col space-y-[clamp(12px,3vw,16px)]">
                    <button
                      onClick={() => setCurrentView("subscriptions")}
                      className="bg-amber-50 transition-colors rounded-[24px] p-[clamp(16px,4vw,24px)] flex items-center justify-between border-2 border-amber-100 group w-full"
                    >
                      <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                        <div className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-white rounded-full shadow-sm flex items-center justify-center group- transition-transform">
                          <Crown className="text-amber-500" size={28} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-black text-slate-800 text-[clamp(20px,5vw,24px)]">
                            管理订阅
                          </h3>
                          <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)]">
                            查看千千妈妈课程订阅状态
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className="text-amber-400 group- transition-colors"
                        size={32}
                      />
                    </button>
                    <button
                      onClick={() => setCurrentView("reports")}
                      className="bg-blue-50 transition-colors rounded-[24px] p-[clamp(16px,4vw,24px)] flex items-center justify-between border-2 border-blue-100 group w-full"
                    >
                      <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                        <div className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-white rounded-full shadow-sm flex items-center justify-center group- transition-transform">
                          <FileText className="text-blue-500" size={28} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-black text-slate-800 text-[clamp(20px,5vw,24px)]">
                            接收学习报告
                          </h3>
                          <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)]">
                            绑定微信，获取每周学习反馈
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className="text-blue-400 group- transition-colors"
                        size={32}
                      />
                    </button>
                  </section>
                </div>
              ) : currentView === "subscriptions" ? (
                <div className="max-w-3xl mx-auto space-y-[clamp(12px,3vw,16px)] py-[clamp(12px,3vw,16px)]">
                  {SUBSCRIPTIONS_LIST.map((sub) => (
                    <div
                      key={sub.id}
                      className={`bg-slate-50 rounded-[24px] p-[clamp(16px,4vw,24px)] border border-slate-100 flex items-center justify-between ${sub.status === "expired" ? "opacity-60 grayscale" : ""}`}
                    >
                      <div className="flex items-center space-x-[clamp(12px,3vw,16px)] sm:space-x-[clamp(14px,3.5vw,20px)]">
                        <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] sm:w-[clamp(80px,25vw,112px)] sm:h-[clamp(80px,25vw,112px)] flex-shrink-0 relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-[#CCCCCC] rounded-[clamp(12px,3vw,16px)] animate-pulse" />
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className={`w-full h-full object-contain drop-shadow-sm relative z-10 opacity-0 transition-opacity duration-300 ${sub.status === "unpurchased" ? "brightness-75 saturate-50" : ""}`}
                            referrerPolicy="no-referrer"
                            onLoad={(e) => {
                              e.currentTarget.classList.remove("opacity-0");
                              e.currentTarget.classList.add("opacity-100");
                              const prev = e.currentTarget
                                .previousElementSibling as HTMLElement;
                              if (prev) prev.style.display = "none";
                            }}
                            onError={(e) => {
                              e.currentTarget.src = `https://picsum.photos/seed/${sub.id}/200/200`;
                            }}
                          />
                          {sub.status === "unpurchased" && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-[clamp(12px,3vw,16px)] z-20">
                              <div className="bg-black/50 rounded-full p-[clamp(8px,2vw,12px)] flex items-center justify-center">
                                <Lock
                                  className="text-white drop-shadow-md"
                                  size={28}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-[clamp(18px,4.5vw,20px)]">
                            {sub.name}
                          </h3>
                          <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)]">
                            {sub.desc}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[clamp(14px,3.5vw,16px)] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {sub.status === "unpurchased"
                            ? "状态"
                            : sub.status === "expired"
                              ? "状态"
                              : "到期时间"}
                        </p>
                        <p
                          className={`font-black ${sub.status === "unpurchased" ? "text-slate-400" : sub.status === "expired" ? "text-slate-500" : "text-slate-700"}`}
                        >
                          {sub.expireDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentView === "reports" ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between px-[clamp(20px,5vw,32px)] gap-[clamp(32px,8vw,48px)]">
                    {/* Left Side: Icon, Title, Subtitle */}
                    <div className="flex-1 flex flex-col items-start text-left">
                      <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] bg-green-100 rounded-[32px] flex items-center justify-center text-green-500 mb-[clamp(20px,5vw,32px)] shadow-inner">
                        <FileText size={48} />
                      </div>
                      <h2 className="text-[clamp(28px,7vw,40px)] sm:text-[clamp(32px,8vw,48px)] font-black text-slate-800 mb-[clamp(16px,4vw,24px)] leading-tight">
                        绑定微信
                        <br />
                        接收学习报告
                      </h2>
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
                        <div className="absolute -top-4 -right-4 bg-green-500 text-white text-[clamp(14px,3.5vw,16px)] font-black px-[clamp(12px,3vw,16px)] py-[clamp(6px,2vw,8px)] rounded-full shadow-lg transform rotate-12 group- transition-transform z-10">
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
                        onClick={() => setCurrentView("report-generator")}
                        className="px-[clamp(20px,5vw,32px)] py-[clamp(12px,3vw,16px)] bg-blue-500 text-white rounded-full font-black text-[clamp(18px,4.5vw,20px)] shadow-lg active:scale-95 transition-all flex items-center space-x-[clamp(6px,2vw,8px)]"
                      >
                        <FileText size={24} />
                        <span>预览学习报告</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : currentView === "report-generator" ? (
                <ReportGenerator onBack={() => setCurrentView("reports")} />
              ) : currentView === "settings" ? (
                <div className="max-w-3xl mx-auto space-y-[clamp(16px,4vw,24px)] pt-0 pb-12">
                  <div className="bg-slate-50 rounded-[32px] p-[clamp(16px,4vw,24px)] sm:p-[clamp(20px,5vw,32px)] border border-slate-100 space-y-[clamp(16px,4vw,24px)]">
                    {/* 个性化推荐 */}
                    <div className="flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60">
                      <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                        <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center">
                          <Sparkles className="text-purple-500" size={20} />
                        </div>
                        <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)]">
                          个性化推荐
                        </span>
                      </div>
                      <div className="w-[clamp(40px,12vw,56px)] h-[clamp(24px,6vw,32px)] bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                        <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                    {/* 语音测试难度 */}
                    <div className="flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60">
                      <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                        <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center">
                          <Mic className="text-blue-500" size={20} />
                        </div>
                        <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)]">
                          语音测试难度
                        </span>
                      </div>
                      <div className="flex items-center space-x-[clamp(6px,2vw,8px)] bg-white rounded-[clamp(8px,2vw,12px)] p-1 shadow-sm border border-slate-100">
                        <button className="px-[clamp(12px,3vw,16px)] py-1.5 rounded-[clamp(6px,1.5vw,8px)] font-bold text-[clamp(14px,3.5vw,16px)] text-slate-500 ">
                          简单
                        </button>
                        <button className="px-[clamp(12px,3vw,16px)] py-1.5 rounded-[clamp(6px,1.5vw,8px)] font-bold text-[clamp(14px,3.5vw,16px)] bg-blue-50 text-blue-600 shadow-sm">
                          适中
                        </button>
                        <button className="px-[clamp(12px,3vw,16px)] py-1.5 rounded-[clamp(6px,1.5vw,8px)] font-bold text-[clamp(14px,3.5vw,16px)] text-slate-500 ">
                          挑战
                        </button>
                      </div>
                    </div>
                    {/* 用户协议 */}
                    <button className="w-full flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60 group">
                      <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                        <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center">
                          <FileText className="text-slate-500" size={20} />
                        </div>
                        <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)] group- transition-colors">
                          用户协议
                        </span>
                      </div>
                      <ChevronRight
                        className="text-slate-400 group- transition-colors"
                        size={24}
                      />
                    </button>
                    {/* 联系客服 */}
                    <button className="w-full flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60 group">
                      <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                        <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center">
                          <Headphones className="text-slate-500" size={20} />
                        </div>
                        <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)] group- transition-colors">
                          联系客服
                        </span>
                      </div>
                      <ChevronRight
                        className="text-slate-400 group- transition-colors"
                        size={24}
                      />
                    </button>
                    {/* 退出登录 */}
                    <button className="w-full flex items-center justify-between py-[clamp(6px,2vw,8px)] group mt-[clamp(12px,3vw,16px)]">
                      <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
                        <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-red-50 rounded-full flex items-center justify-center">
                          <LogOut className="text-red-500" size={20} />
                        </div>
                        <span className="font-black text-red-500 text-[clamp(18px,4.5vw,20px)]">
                          退出登录
                        </span>
                      </div>
                    </button>
                  </div>
                  <div className="text-center text-slate-400 font-bold text-[clamp(14px,3.5vw,16px)]">
                    当前版本 v1.0.0
                  </div>
                </div>
              ) : currentView === "profile" ? (
                <div className="max-w-5xl mx-auto h-full flex flex-col pb-0 overflow-y-auto no-scrollbar space-y-[clamp(12px,3vw,16px)]">
                  {/* 1. 上方身份区 */}
                  <div className="bg-white rounded-[32px] p-[clamp(16px,4vw,24px)] shadow-sm border-2 border-slate-100 flex items-center justify-between relative overflow-hidden shrink-0">
                    <div className="flex items-center">
                      <div className="relative mr-[clamp(16px,4vw,24px)]">
                        <div className="absolute inset-0 bg-yellow-400 rounded-full -rotate-6 scale-105 shadow-md"></div>
                        <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] bg-white rounded-full p-1.5 shadow-xl border-4 border-white overflow-hidden relative z-10">
                          <img
                            src={userProfile.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover bg-blue-50 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="flex items-center space-x-2 mb-[clamp(4px,1vw,8px)]">
                          <h1 className="text-[clamp(20px,5vw,28px)] font-black text-slate-800 tracking-wide">
                            {userProfile.name}
                          </h1>
                          <button
                            onClick={handleOpenEditProfile}
                            className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 active:scale-90 transition-transform"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-100 text-blue-600 px-[clamp(10px,2.5vw,14px)] py-1 rounded-full font-black text-[clamp(12px,3vw,14px)] shadow-sm border border-blue-200 flex items-center space-x-1">
                            <Crown size={14} />
                            <span>小小探险家</span>
                          </div>
                          <div className="bg-purple-100 text-purple-600 px-[clamp(10px,2.5vw,14px)] py-1 rounded-full font-black text-[clamp(12px,3vw,14px)] shadow-sm border border-purple-200 flex items-center space-x-1">
                            <Star size={14} />
                            <span>Lv.2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-orange-50 rounded-[24px] px-[clamp(16px,4vw,24px)] py-[clamp(12px,3vw,16px)] border-2 border-orange-100">
                      <div className="flex items-center space-x-2 mb-1">
                        <Flame className="text-orange-500" size={24} />
                        <span className="text-[clamp(24px,6vw,32px)] font-black text-orange-600">
                          12
                        </span>
                      </div>
                      <span className="text-[clamp(12px,3vw,14px)] font-bold text-orange-400">
                        连续学习(天)
                      </span>
                    </div>
                  </div>

                  {/* 2. 今日任务完成度 */}
                  <div className="shrink-0">
                    <div className="flex justify-between items-center mb-[clamp(16px,4vw,24px)]">
                      <h2 className="text-[clamp(20px,5vw,24px)] font-black text-slate-800 flex items-center space-x-2">
                        <Target className="text-green-500" size={28} />
                        <span>今日任务</span>
                      </h2>
                      <span className="text-green-500 font-black text-[clamp(14px,3.5vw,16px)] bg-green-50 px-3 py-1 rounded-full">
                        已完成 2/3
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[clamp(12px,3vw,16px)]">
                      {/* Task 1 */}
                      <div className="flex items-center justify-between bg-slate-50 p-[clamp(12px,3vw,16px)] rounded-[20px] border border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center shrink-0">
                            <Check size={20} strokeWidth={3} />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-700 text-[clamp(14px,3.5vw,16px)] line-clamp-1">
                              完成1个绘本跟读
                            </h3>
                            <p className="text-slate-400 font-bold text-[clamp(12px,3vw,14px)]">
                              +10 经验值
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Task 2 */}
                      <div className="flex items-center justify-between bg-slate-50 p-[clamp(12px,3vw,16px)] rounded-[20px] border border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center shrink-0">
                            <Check size={20} strokeWidth={3} />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-700 text-[clamp(14px,3.5vw,16px)] line-clamp-1">
                              完成1个单词卡学习
                            </h3>
                            <p className="text-slate-400 font-bold text-[clamp(12px,3vw,14px)]">
                              +10 经验值
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Task 3 */}
                      <div className="flex items-center justify-between bg-blue-50 p-[clamp(12px,3vw,16px)] rounded-[20px] border border-blue-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                            <BookOpen size={20} strokeWidth={3} />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-700 text-[clamp(14px,3.5vw,16px)] line-clamp-1">
                              学习时长达到 20 分钟
                            </h3>
                            <p className="text-blue-400 font-bold text-[clamp(12px,3vw,14px)]">
                              进度: 15/20 分钟
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. 能力成长区 */}
                  <div className="flex flex-col space-y-[clamp(16px,4vw,24px)]">
                    <div className="flex justify-between items-center shrink-0">
                      <h2 className="text-[clamp(20px,5vw,24px)] font-black text-slate-800 flex items-center space-x-2">
                        <TrendingUp className="text-purple-500" size={28} />
                        <span>能力成长</span>
                      </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-[clamp(16px,4vw,24px)] min-h-0">
                      {/* Radar Chart */}
                      <div className="flex-1 bg-slate-50 rounded-[24px] p-[clamp(12px,3vw,16px)] flex items-center justify-center border-2 border-slate-100 relative min-h-[250px]">
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                          className="outline-none focus:outline-none"
                          tabIndex={-1}
                          style={{ outline: "none" }}
                        >
                          <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="65%"
                            data={RADAR_DATA}
                            className="outline-none focus:outline-none"
                            tabIndex={-1}
                            style={{ outline: "none" }}
                          >
                            <PolarGrid content={<CustomPolarGrid />} />
                            <PolarAngleAxis
                              dataKey="subject"
                              tick={<CustomTick />}
                            />
                            <PolarRadiusAxis
                              angle={90}
                              domain={[0, 100]}
                              tick={false}
                              axisLine={false}
                            />
                            <Radar
                              name="能力"
                              dataKey="A"
                              stroke="#8b5cf6"
                              strokeWidth={3}
                              fill="#a78bfa"
                              fillOpacity={0.6}
                              isAnimationActive={true}
                              animationBegin={0}
                              animationDuration={1500}
                              animationEasing="ease-out"
                              dot={{
                                r: 4,
                                fill: "#fff",
                                stroke: "#8b5cf6",
                                strokeWidth: 2,
                              }}
                              activeDot={{
                                r: 6,
                                fill: "#fff",
                                stroke: "#8b5cf6",
                                strokeWidth: 2,
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* 13 Levels Progress */}
                      <div className="flex-1 flex flex-col justify-center bg-slate-50 rounded-[24px] p-[clamp(16px,4vw,24px)] border-2 border-slate-100">
                        <div className="mb-[clamp(24px,6vw,32px)] text-center">
                          <h3 className="font-black text-[clamp(20px,5vw,24px)] text-slate-700 mb-2">
                            当前级别:{" "}
                            <span className="text-purple-600">Lv.2 启蒙期</span>
                          </h3>
                          <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)]">
                            再获得 150 经验值即可升级到 Lv.3！
                          </p>
                        </div>

                        <div className="relative py-12 px-4 w-full max-w-md mx-auto">
                          {/* Progress Line */}
                          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-4 bg-slate-200 rounded-full overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full w-[15%]"></div>
                          </div>

                          {/* 13 Level Nodes */}
                          <div className="relative flex justify-between items-center z-10">
                            {Array.from({ length: 13 }).map((_, i) => {
                              const level = i + 1;
                              const isCurrent = level === 2;
                              const isPassed = level < 2;
                              // Only show nodes for 1, 4, 7, 10, 13 to avoid crowding, but keep the current one
                              const showNode =
                                level === 1 ||
                                level === 13 ||
                                level % 3 === 1 ||
                                isCurrent;

                              if (!showNode)
                                return <div key={level} className="w-0 h-0" />;

                              return (
                                <div
                                  key={level}
                                  className="relative flex flex-col items-center"
                                >
                                  {isCurrent && (
                                    <div className="absolute -top-14 w-12 h-12 bg-white rounded-full p-1 shadow-lg border-2 border-purple-500 z-20 animate-bounce">
                                      <img
                                        src={userProfile.avatar}
                                        alt="avatar"
                                        className="w-full h-full object-cover bg-blue-50 rounded-full"
                                      />
                                    </div>
                                  )}
                                  <div
                                    className={`w-5 h-5 rounded-full border-4 ${isPassed ? "bg-purple-500 border-purple-500" : isCurrent ? "bg-white border-purple-500 scale-125 shadow-md" : "bg-slate-200 border-slate-300"} transition-all`}
                                  ></div>
                                  <span
                                    className={`absolute top-8 text-[12px] font-black ${isPassed || isCurrent ? "text-purple-600" : "text-slate-400"}`}
                                  >
                                    Lv.{level}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentView === "shop" ? (
                <div className="max-w-5xl mx-auto pb-0">
                  <h2 className="text-[clamp(18px,4.5vw,20px)] font-black text-slate-700 mb-[clamp(12px,3vw,16px)] flex items-center">
                    <Sparkles className="text-amber-500 mr-2" size={24} />{" "}
                    售卖中
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[clamp(12px,3vw,16px)] mb-0">
                    {/* Item 1 */}
                    <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm transition-shadow relative overflow-hidden group">
                      <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-blue-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group- transition-transform">
                        <Hourglass className="text-blue-500" size={32} />
                      </div>
                      <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">
                        魔法沙漏
                      </h3>
                      <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">
                        增加15分钟学习时间
                      </p>
                      <button className="w-full mt-auto bg-blue-100 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                        <Gem size={16} />
                        <span>50</span>
                      </button>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm transition-shadow relative overflow-hidden group">
                      <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-purple-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group- transition-transform">
                        <FlaskConical className="text-purple-500" size={32} />
                      </div>
                      <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">
                        智慧药水
                      </h3>
                      <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">
                        经验值双倍卡(1小时)
                      </p>
                      <button className="w-full mt-auto bg-blue-100 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                        <Gem size={16} />
                        <span>100</span>
                      </button>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm transition-shadow relative overflow-hidden group">
                      <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-amber-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group- transition-transform">
                        <Shield className="text-amber-500" size={32} />
                      </div>
                      <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">
                        守护神盾
                      </h3>
                      <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">
                        抵消一次未完成惩罚
                      </p>
                      <button className="w-full mt-auto bg-blue-100 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                        <Gem size={16} />
                        <span>150</span>
                      </button>
                    </div>

                    {/* Item 4 */}
                    <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm transition-shadow relative overflow-hidden group">
                      <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-green-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group- transition-transform">
                        <Clover className="text-green-500" size={32} />
                      </div>
                      <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">
                        幸运四叶草
                      </h3>
                      <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">
                        抽奖概率提升20%
                      </p>
                      <button className="w-full mt-auto bg-blue-100 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                        <Gem size={16} />
                        <span>80</span>
                      </button>
                    </div>

                    {/* Item 5 */}
                    <div className="bg-white border-2 border-slate-100 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center shadow-sm transition-shadow relative overflow-hidden group">
                      <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-rose-50 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] group- transition-transform">
                        <Map className="text-rose-500" size={32} />
                      </div>
                      <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">
                        探险指南
                      </h3>
                      <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">
                        解锁一个隐藏关卡
                      </p>
                      <button className="w-full mt-auto bg-blue-100 text-blue-600 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1 transition-colors">
                        <Gem size={16} />
                        <span>200</span>
                      </button>
                    </div>
                  </div>

                  <h2 className="text-[clamp(18px,4.5vw,20px)] font-black text-slate-400 mb-[clamp(12px,3vw,16px)] flex items-center">
                    <PackageX className="text-slate-400 mr-2" size={24} />{" "}
                    已售罄
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[clamp(12px,3vw,16px)] opacity-60 grayscale">
                    {/* Sold Out 1 */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center relative overflow-hidden">
                      <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-slate-200 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)]">
                        <Ghost className="text-slate-500" size={32} />
                      </div>
                      <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">
                        隐身斗篷
                      </h3>
                      <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">
                        休息日免打卡
                      </p>
                      <button
                        disabled
                        className="w-full mt-auto bg-slate-200 text-slate-500 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1"
                      >
                        <span>已售罄</span>
                      </button>
                    </div>

                    {/* Sold Out 2 */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center relative overflow-hidden">
                      <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-slate-200 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)]">
                        <History className="text-slate-500" size={32} />
                      </div>
                      <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">
                        时光倒流怀表
                      </h3>
                      <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">
                        补签一次
                      </p>
                      <button
                        disabled
                        className="w-full mt-auto bg-slate-200 text-slate-500 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1"
                      >
                        <span>已售罄</span>
                      </button>
                    </div>

                    {/* Sold Out 3 */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-[clamp(12px,3vw,16px)] flex flex-col items-center text-center relative overflow-hidden">
                      <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-slate-200 rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)]">
                        <Flame className="text-slate-500" size={32} />
                      </div>
                      <h3 className="font-black text-slate-800 text-[clamp(16px,4vw,18px)] mb-1">
                        龙之力量
                      </h3>
                      <p className="text-slate-500 text-[clamp(12px,3vw,14px)] font-bold mb-[clamp(12px,3vw,16px)] line-clamp-2">
                        自动完成所有任务
                      </p>
                      <button
                        disabled
                        className="w-full mt-auto bg-slate-200 text-slate-500 font-black py-[clamp(8px,2.5vw,10px)] rounded-[clamp(12px,3vw,16px)] flex items-center justify-center space-x-1"
                      >
                        <span>已售罄</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <div className="text-6xl mb-[clamp(12px,3vw,16px)]">👤</div>
                  <p className="font-black text-[clamp(14px,3.5vw,16px)] uppercase">
                    界面设计中...
                  </p>
                </div>
              )}
            </SecondaryView>
          )}

        {/* --- 弹窗逻辑 --- */}

        {showCalendar && (
          <div
            className="absolute inset-0 z-[700] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-[4%]"
            onClick={() => setShowCalendar(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl h-[90%] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-90 fade-in duration-300 ease-out text-slate-800"
            >
              <header className="bg-blue-600 p-[clamp(16px,4vw,24px)] text-white flex justify-between items-center">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-white/20 rounded-[clamp(8px,2vw,12px)] flex items-center justify-center"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center bg-white/10 rounded-[clamp(12px,3vw,16px)] p-[clamp(6px,2vw,8px)] px-[clamp(12px,3vw,16px)] space-x-[clamp(16px,4vw,24px)]">
                  <button
                    onClick={() => changeDay(-1)}
                    className="p-[clamp(6px,2vw,8px)] rounded-full transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div className="text-center min-w-[120px]">
                    <p className="text-[clamp(14px,3.5vw,16px)] font-bold opacity-70 uppercase tracking-widest">
                      March 2024
                    </p>
                    <p className="text-[clamp(22px,5.5vw,28px)] font-black">
                      {selectedDate.getDate()}日
                    </p>
                  </div>
                  <button
                    onClick={() => changeDay(1)}
                    disabled={
                      new Date(
                        new Date(selectedDate).setDate(
                          selectedDate.getDate() + 1,
                        ),
                      ) > new Date()
                    }
                    className="p-[clamp(6px,2vw,8px)] rounded-full transition-colors disabled:opacity-30"
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="bg-white text-blue-600 px-[clamp(16px,4vw,24px)] py-[clamp(8px,2.5vw,10px)] rounded-[clamp(8px,2vw,12px)] font-black text-[clamp(14px,3.5vw,16px)] active:scale-95"
                >
                  回到今天
                </button>
              </header>
              <div className="flex-1 p-[clamp(20px,5vw,32px)] flex flex-col overflow-hidden">
                <div className="grid grid-cols-7 gap-[clamp(8px,2.5vw,12px)] text-center mb-[clamp(8px,2.5vw,12px)]">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div
                      key={`cal-h-${i}`}
                      className="font-black text-[clamp(14px,3.5vw,16px)] text-slate-300 uppercase"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div
                  {...calendarDragProps}
                  className="grid grid-cols-7 gap-[clamp(8px,2.5vw,12px)] flex-1 overflow-y-auto no-scrollbar cursor-grab active:cursor-grabbing pb-12"
                >
                  {[...Array(31)].map((_, i) => {
                    const d = i + 1;
                    const isFuture = d > new Date().getDate();
                    const isPicked = d === selectedDate.getDate();
                    const status = MOCK_HISTORY_STATUS[d] ?? -1;
                    let statusColor = "bg-slate-50 text-slate-600";
                    if (!isFuture) {
                      if (status === 2)
                        statusColor = "bg-green-50 text-green-600";
                      else if (status === 1)
                        statusColor = "bg-yellow-50 text-yellow-600";
                      else if (status === 0)
                        statusColor = "bg-red-50 text-red-400";
                    }
                    return (
                      <div
                        key={`day-c-${i}`}
                        id={`cal-day-${d}`}
                        onClick={() =>
                          !isFuture && setSelectedDate(new Date(2024, 2, d))
                        }
                        className={`h-[clamp(48px,14vw,64px)] relative flex flex-col items-center justify-center rounded-[clamp(12px,3vw,16px)] font-black text-[clamp(18px,4.5vw,20px)] transition-all cursor-pointer ${isFuture ? "text-slate-200 cursor-not-allowed bg-slate-50/30" : isPicked ? "ring-4 ring-blue-500/30 scale-105 z-10" : ""} ${!isPicked ? statusColor : "bg-blue-600 text-white shadow-lg"}`}
                      >
                        <span>{d}</span>
                        {!isFuture && !isPicked && status !== -1 && (
                          <div
                            className={`w-2 h-2 rounded-full absolute bottom-2 ${status === 2 ? "bg-green-400" : status === 1 ? "bg-yellow-400" : "bg-red-300"}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-[clamp(16px,4vw,24px)] flex justify-center space-x-[clamp(16px,4vw,24px)] text-[clamp(14px,3.5vw,16px)] font-bold text-slate-400 border-t border-slate-50 pt-4">
                  <div className="flex items-center space-x-[clamp(6px,2vw,8px)]">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span>已完成</span>
                  </div>
                  <div className="flex items-center space-x-[clamp(6px,2vw,8px)]">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span>未完成</span>
                  </div>
                  <div className="flex items-center space-x-[clamp(6px,2vw,8px)]">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <span>未学习</span>
                  </div>
                </div>
              </div>
              <div className="p-[clamp(16px,4vw,24px)] bg-slate-50 border-t flex justify-center">
                {(() => {
                  const d = selectedDate.getDate();
                  const status = MOCK_HISTORY_STATUS[d] ?? -1;
                  let btnColor = "bg-blue-600 text-white";
                  if (!isToday) {
                    if (status === 2) btnColor = "bg-green-500 text-white";
                    else if (status === 1)
                      btnColor = "bg-yellow-500 text-white";
                    else if (status === 0) btnColor = "bg-red-500 text-white";
                    else btnColor = "bg-slate-400 text-white";
                  }
                  return (
                    <button
                      onClick={handleConfirmDate}
                      className={`w-full py-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)] font-black text-[clamp(20px,5vw,24px)] shadow-lg active:scale-95 transition-colors ${btnColor}`}
                    >
                      {isToday ? "开始今日学习探险" : "开启该日复习模式"}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {currentView === "edit-profile" && (
          <div className="absolute inset-0 z-[100] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
            <header className="h-[12%] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100 shrink-0">
              <button
                onClick={() => setCurrentView("profile")}
                className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
              >
                <ChevronLeft size={32} />
              </button>
              <h2 className="font-black text-slate-800 text-[clamp(22px,5.5vw,28px)] tracking-widest">
                编辑资料
              </h2>
              <button
                onClick={handleSaveProfile}
                className="px-[clamp(16px,4vw,24px)] h-[clamp(40px,12vw,56px)] bg-blue-500 text-white font-black rounded-[clamp(12px,3vw,16px)] active:scale-90 transition-transform shadow-sm text-[clamp(16px,4vw,18px)]"
              >
                保存
              </button>
            </header>
            <main
              {...verticalDragProps}
              className="flex-1 px-[4%] pb-0 pt-0 overflow-y-auto no-scrollbar flex flex-col items-center"
            >
              {/* Avatar Preview */}
              <div className="w-[clamp(100px,25vw,140px)] h-[clamp(100px,25vw,140px)] bg-white rounded-full p-2 shadow-xl border-4 border-slate-100 overflow-hidden relative mb-[clamp(16px,4vw,24px)] shrink-0">
                <img
                  src={tempProfile.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover bg-blue-50 rounded-full"
                />
              </div>

              {/* Nickname Input */}
              <div className="w-full max-w-md mb-[clamp(24px,6vw,32px)]">
                <label className="block text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)] mb-2">
                  学员昵称
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, name: e.target.value })
                    }
                    className="flex-1 bg-white border-2 border-slate-200 rounded-[16px] px-4 py-3 font-black text-slate-800 text-[clamp(16px,4vw,18px)] focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                    maxLength={10}
                  />
                  <button
                    onClick={handleRandomName}
                    className="bg-purple-100 text-purple-600 px-4 rounded-[16px] font-black flex items-center justify-center active:scale-95 transition-transform border-2 border-purple-200 whitespace-nowrap"
                  >
                    <Dices size={20} className="mr-1" />
                    随机
                  </button>
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="w-full max-w-md flex-1 flex flex-col min-h-0">
                <label className="block text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)] mb-3 shrink-0">
                  选择头像
                </label>
                <div className="bg-white rounded-[24px] p-[clamp(16px,4vw,24px)] shadow-sm border-2 border-slate-100 flex-1 overflow-y-auto no-scrollbar">
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-[clamp(12px,3vw,16px)]">
                    {AVATAR_SEEDS.map((seed) => {
                      const avatarUrl = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
                      const isSelected = tempProfile.avatar === avatarUrl;
                      return (
                        <button
                          key={seed}
                          onClick={() =>
                            setTempProfile({
                              ...tempProfile,
                              avatar: avatarUrl,
                            })
                          }
                          className={`aspect-square rounded-full p-1 transition-all ${isSelected ? "border-4 border-blue-500 scale-110 shadow-md" : "border-2 border-transparent hover:scale-105"}`}
                        >
                          <img
                            src={avatarUrl}
                            alt={seed}
                            className="w-full h-full object-cover bg-slate-50 rounded-full"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}

        {showModuleReward !== null && TASK_DATA[showModuleReward] && (
          <div className="absolute inset-0 z-[800] bg-transparent flex items-center justify-center text-slate-800">
            <div className="bg-white rounded-[40px] p-[clamp(32px,8vw,48px)] text-center shadow-2xl animate-in zoom-in duration-500 max-w-sm">
              <div className="text-8xl mb-[clamp(16px,4vw,24px)]">🎁</div>
              <h2 className="text-[clamp(24px,6vw,32px)] font-black text-orange-500 mb-[clamp(6px,2vw,8px)]">
                {TASK_DATA[showModuleReward].name}
              </h2>
              <p className="text-slate-500 mb-[clamp(20px,5vw,32px)] font-bold text-[clamp(14px,3.5vw,16px)]">
                获得专属奖励能量包
              </p>
              <div className="text-[clamp(32px,8vw,48px)] font-black text-blue-600 mb-10 flex items-center justify-center space-x-[clamp(8px,2.5vw,12px)]">
                <span>+50</span> <Gem size={32} className="text-blue-400" />
              </div>
              <button
                onClick={handleRewardConfirm}
                className="w-full bg-blue-500 text-white text-[clamp(22px,5.5vw,28px)] font-black py-[clamp(14px,3.5vw,20px)] rounded-[clamp(16px,4vw,24px)] shadow-xl active:scale-95 transition-transform"
              >
                收下奖励
              </button>
            </div>
          </div>
        )}

        {showGrandReward && (
          <div className="absolute inset-0 z-[900] bg-gradient-to-b from-blue-900/90 to-purple-900/90 backdrop-blur-xl flex items-center justify-center text-slate-800">
            <div className="bg-white rounded-[50px] p-[clamp(24px,6vw,40px)] max-w-lg w-full text-center shadow-[0_0_100px_rgba(255,183,3,0.5)] animate-in zoom-in">
              <div className="w-[clamp(56px,16vw,80px)] h-[clamp(56px,16vw,80px)] bg-yellow-400 rounded-full border-4 border-white shadow-2xl flex items-center justify-center mx-auto mb-[clamp(16px,4vw,24px)] animate-bounce">
                <Award size={40} color="white" />
              </div>
              <h2 className="text-[clamp(24px,6vw,32px)] font-black text-slate-800 mb-[clamp(20px,5vw,32px)] tracking-tight">
                今日探险圆满达成！
              </h2>
              <div className="grid grid-cols-3 gap-[clamp(8px,2.5vw,12px)] mb-10 text-center">
                <div className="bg-blue-50 p-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)]">
                  <p className="text-[clamp(20px,5vw,24px)] font-black text-blue-600">
                    30M
                  </p>
                  <p className="text-[8px] font-bold opacity-40">时长</p>
                </div>
                <div className="bg-green-50 p-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)]">
                  <p className="text-[clamp(20px,5vw,24px)] font-black text-green-600">
                    45W
                  </p>
                  <p className="text-[8px] font-bold opacity-40">单词</p>
                </div>
                <div className="bg-purple-50 p-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)]">
                  <p className="text-[clamp(20px,5vw,24px)] font-black text-purple-600">
                    +200
                  </p>
                  <p className="text-[8px] font-bold opacity-40">奖励</p>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[clamp(18px,4.5vw,20px)] font-black py-[clamp(14px,3.5vw,20px)] rounded-[clamp(16px,4vw,24px)] shadow-xl flex items-center justify-center space-x-[clamp(6px,2vw,8px)] mb-[clamp(8px,2.5vw,12px)]">
                <Camera size={20} /> <span>领取勋章并分享</span>
              </button>
              <button
                onClick={() => setShowGrandReward(false)}
                className="w-full py-1.5 text-slate-400 font-black text-[clamp(14px,3.5vw,16px)] uppercase tracking-widest"
              >
                回到地图
              </button>
            </div>
          </div>
        )}

        {showParentGate && (
          <div className="absolute inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center text-slate-800">
            <div className="bg-white rounded-[40px] p-[clamp(32px,8vw,48px)] max-w-md w-full text-center shadow-2xl animate-in zoom-in">
              <h3 className="text-[clamp(22px,5.5vw,28px)] font-black text-slate-800 mb-[clamp(20px,5vw,32px)]">
                家长验证
              </h3>
              <div className="text-[clamp(32px,8vw,48px)] font-black text-blue-600 mb-10 tracking-widest">
                {gateMath.q}
              </div>
              <input
                type="number"
                placeholder="?"
                autoFocus
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value)}
                className="w-full text-center text-[clamp(28px,7vw,40px)] p-[clamp(14px,3.5vw,20px)] bg-slate-50 rounded-[clamp(12px,3vw,16px)] mb-[clamp(20px,5vw,32px)] outline-none border-4 border-transparent focus:border-blue-100 transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleParentGateSubmit();
                }}
              />
              <div className="flex space-x-[clamp(12px,3vw,16px)]">
                <button
                  onClick={() => setShowParentGate(false)}
                  className="flex-1 py-[clamp(12px,3vw,16px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] font-black text-slate-500 text-[clamp(18px,4.5vw,20px)]"
                >
                  取消
                </button>
                <button
                  onClick={handleParentGateSubmit}
                  className="flex-1 py-[clamp(12px,3vw,16px)] bg-blue-600 text-white rounded-[clamp(12px,3vw,16px)] font-black shadow-xl text-[clamp(18px,4.5vw,20px)]"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          id="toast"
          className="absolute top-[10vw] left-1/2 bg-white px-[clamp(24px,6vw,40px)] py-[clamp(14px,3.5vw,20px)] rounded-full shadow-2xl border-4 border-yellow-400 opacity-0 transition-all duration-500 z-[1100] flex items-center space-x-[clamp(12px,3vw,16px)] pointer-events-none text-slate-700"
          style={{ transform: "translate(-50%, 0) scale(0.5)" }}
        >
          <Gem className="text-blue-400" size={36} />
          <span className="text-[clamp(24px,6vw,32px)] font-black text-blue-600">
            +10 钻石！
          </span>
        </div>
        </AnimatePresence>
      </MainLayout>

      <div className="fixed inset-0 z-[9999] bg-slate-950 text-white flex flex-col items-center justify-center p-[clamp(16px,4vw,24px)] text-center landscape:hidden">
        <div className="text-6xl animate-bounce mb-[clamp(16px,4vw,24px)]">
          🔄
        </div>
        <h2 className="text-[clamp(22px,5.5vw,28px)] font-black mb-[clamp(6px,2vw,8px)]">
          请旋转您的设备
        </h2>
        <p className="opacity-60 text-[clamp(14px,3.5vw,16px)]">
          横屏体验能够开启完整学习探险哦！
        </p>
      </div>
    </>
  );
}

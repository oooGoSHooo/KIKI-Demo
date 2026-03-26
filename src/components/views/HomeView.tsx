import React from "react";
import { Gem, Settings, Clock, Trophy, Calendar as CalendarIcon, Award, Check } from "lucide-react";
import { UserProfile } from "../../types";
import { TASK_DATA } from "../../constants";
import { MapPath } from "../map/MapPath";

interface HomeViewProps {
  userProfile: UserProfile;
  diamonds: number;
  selectedDate: Date;
  isToday: boolean;
  studyTime: number;
  majorIdx: number;
  subIdx: number;
  onProfileClick: () => void;
  onShopClick: () => void;
  onSettingsClick: () => void;
  onCalendarClick: () => void;
  onAwardsClick: () => void;
  startLearning: (title: string) => void;
  handleOpenReward: (mIdx: number) => void;
  mainRef: React.RefObject<HTMLElement>;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handleMouseUp: () => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userProfile,
  diamonds,
  selectedDate,
  isToday,
  studyTime,
  majorIdx,
  subIdx,
  onProfileClick,
  onShopClick,
  onSettingsClick,
  onCalendarClick,
  onAwardsClick,
  startLearning,
  handleOpenReward,
  mainRef,
  handleMouseDown,
  handleMouseLeave,
  handleMouseUp,
  handleMouseMove,
  handleTouchStart,
  handleTouchEnd,
  handleTouchMove,
  onScroll,
}) => {
  return (
    <div className="relative h-full w-full flex flex-col z-10 animate-in fade-in duration-500">
      <header className="h-[15%] px-[4%] flex justify-between items-center relative z-20">
        <div
          onClick={onProfileClick}
          className="flex items-center space-x-[clamp(12px,3vw,16px)] cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full rotate-3 group- transition-transform shadow-md"></div>
            <div className="w-[clamp(48px,14vw,64px)] h-[clamp(48px,14vw,64px)] bg-white rounded-full p-1 shadow-lg border-2 border-white overflow-hidden relative z-10 group- transition-transform">
              <img
                src={userProfile.avatar}
                alt="avatar"
                className="bg-blue-50 w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-[clamp(14px,3.5vw,20px)] py-[clamp(8px,2.5vw,10px)] rounded-full shadow-md border border-white/50 group- transition-colors">
            <span
              className={`font-black text-[clamp(14px,3.5vw,16px)] tracking-wide ${isToday ? "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" : "text-green-600"}`}
            >
              L1 · {isToday ? "今日探险" : `复习(${selectedDate.getDate()}日)`}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-[clamp(14px,3.5vw,20px)]">
          <div
            onClick={onShopClick}
            className="bg-white/90 backdrop-blur-sm px-[clamp(14px,3.5vw,20px)] py-[clamp(8px,2.5vw,10px)] rounded-full shadow-md flex items-center cursor-pointer transition-all border border-white/50"
          >
            <Gem size={22} className="text-blue-500 drop-shadow-sm mr-2" />
            <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)] tracking-wider">
              {diamonds}
            </span>
          </div>
          <button
            onClick={onSettingsClick}
            className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-slate-500 active:text-blue-600 active:rotate-90 transition-all border border-white/50"
          >
            <Settings size={26} />
          </button>
        </div>
      </header>
      <main
        ref={mainRef}
        onScroll={onScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar px-[8%] flex items-center relative z-10 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center min-w-max h-full py-[clamp(12px,3vw,16px)]">
          <MapPath
            majorIdx={majorIdx}
            subIdx={subIdx}
            startLearning={startLearning}
            handleOpenReward={handleOpenReward}
          />
        </div>
      </main>
      <footer className="h-[22%] flex items-center justify-center pb-6 relative z-20 space-x-[clamp(16px,4vw,24px)]">
        <div className="bg-white px-[clamp(20px,5vw,32px)] py-[clamp(12px,3vw,16px)] rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center space-x-8 border border-slate-100 relative overflow-hidden">
          <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
            <div className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                Study Time
              </p>
              <p className="text-[clamp(20px,5vw,24px)] font-black text-slate-800">
                {Math.floor(studyTime / 60)}{" "}
                <span className="text-[clamp(12px,3vw,14px)]">MIN</span>
              </p>
            </div>
          </div>

          <div className="h-[clamp(32px,8vw,40px)] w-[1px] bg-slate-200" />

          <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
            <div className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                Daily Goal
              </p>
              <p className="text-[clamp(20px,5vw,24px)] font-black text-slate-800">
                STAGE {Math.min(majorIdx + 1, TASK_DATA.length)}/
                {TASK_DATA.length}
              </p>
            </div>
          </div>

          <div className="h-[clamp(32px,8vw,40px)] w-[1px] bg-slate-200" />

          <div className="flex flex-col justify-center w-[clamp(240px,70vw,320px)] relative pr-3">
            <div className="flex justify-between items-end mb-[clamp(8px,2.5vw,12px)]">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Adventure Progress
              </p>
              <p className="text-[12px] font-black text-orange-500">
                {Math.round(
                  ((TASK_DATA.slice(0, majorIdx).reduce(
                    (acc, task) => acc + task.subs.length,
                    0,
                  ) +
                    subIdx) /
                    TASK_DATA.reduce(
                      (acc, task) => acc + task.subs.length,
                      0,
                    )) *
                    100,
                )}
                %
              </p>
            </div>
            <div className="relative h-3 w-full bg-slate-100 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${((TASK_DATA.slice(0, majorIdx).reduce((acc, task) => acc + task.subs.length, 0) + subIdx) / TASK_DATA.reduce((acc, task) => acc + task.subs.length, 0)) * 100}%`,
                }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse rounded-full" />
              </div>
              {TASK_DATA.map((task, idx) => {
                const totalSubs = TASK_DATA.reduce(
                  (acc, t) => acc + t.subs.length,
                  0,
                );
                const currentTotalSubsDone =
                  TASK_DATA.slice(0, majorIdx).reduce(
                    (acc, t) => acc + t.subs.length,
                    0,
                  ) + subIdx;
                const taskEndSubs = TASK_DATA.slice(0, idx + 1).reduce(
                  (acc, t) => acc + t.subs.length,
                  0,
                );
                const nodePercent = (taskEndSubs / totalSubs) * 100;
                const isReached = currentTotalSubsDone >= taskEndSubs;
                const isCurrent = majorIdx === idx;
                return (
                  <div
                    key={task.id}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${nodePercent}%` }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all duration-500 z-10 ${isReached ? "bg-green-500 border-2 border-white shadow-[0_2px_8px_rgba(34,197,94,0.5)] scale-110" : isCurrent ? "bg-orange-100 border-2 border-orange-400 shadow-sm scale-125" : "bg-slate-200 border-2 border-white shadow-sm grayscale opacity-60"}`}
                    >
                      {isReached ? (
                        <Check size={14} color="white" strokeWidth={3} />
                      ) : (
                        task.icon
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white p-[clamp(6px,2vw,8px)] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center space-x-[clamp(8px,2.5vw,12px)] border border-slate-100">
          <button
            onClick={onCalendarClick}
            className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-purple-500 rounded-full flex items-center justify-center text-white transition-all shadow-[0_4px_0_#7e22ce] active:shadow-none active:translate-y-1"
          >
            <CalendarIcon size={24} />
          </button>
          <button
            onClick={onAwardsClick}
            className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-sky-500 rounded-full flex items-center justify-center text-white transition-all shadow-[0_4px_0_#0369a1] active:shadow-none active:translate-y-1"
          >
            <Award size={24} />
          </button>
        </div>
      </footer>
    </div>
  );
};

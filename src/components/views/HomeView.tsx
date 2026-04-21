import React from "react";
import {
  Gem,
  Settings,
  Clock,
  Trophy,
  Calendar as CalendarIcon,
  Award,
  Check,
  Flame,
  ChevronRight,
  Sparkles,
} from "lucide-react";
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
  const totalSubs = TASK_DATA.reduce((acc, t) => acc + t.subs.length, 0);
  const doneSubs =
    TASK_DATA.slice(0, majorIdx).reduce((acc, t) => acc + t.subs.length, 0) +
    subIdx;
  const overallPercent = totalSubs === 0 ? 0 : (doneSubs / totalSubs) * 100;

  return (
    <div className="relative h-full w-full flex flex-col z-10 animate-in fade-in duration-500 overflow-hidden">
      {/* 奶油米色背景 —— 覆盖 MainLayout 的蓝色渐变，仅作用于首页 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#FAF4E4]">
        <div className="absolute -top-24 -left-16 w-[clamp(240px,55vw,420px)] h-[clamp(240px,55vw,420px)] rounded-full bg-[#FDE5BF]/55 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-[clamp(260px,60vw,480px)] h-[clamp(260px,60vw,480px)] rounded-full bg-[#FCE2CF]/50 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-[clamp(280px,65vw,520px)] h-[clamp(280px,65vw,520px)] rounded-full bg-[#F4E4C1]/45 blur-3xl" />
        {/* 装饰圆点 */}
        <div className="absolute top-[18%] left-[8%] w-2 h-2 rounded-full bg-[#F5A442]/40" />
        <div className="absolute top-[24%] right-[12%] w-3 h-3 rounded-full bg-[#7BB573]/30" />
        <div className="absolute bottom-[28%] left-[14%] w-2.5 h-2.5 rounded-full bg-[#8B73C4]/30" />
        <div className="absolute bottom-[34%] right-[8%] w-2 h-2 rounded-full bg-[#E5A43C]/40" />
      </div>

      {/* ───────── HEADER ───────── */}
      <header className="h-[18%] px-[clamp(16px,4vw,32px)] flex justify-between items-center relative z-20">
        <div
          onClick={onProfileClick}
          className="flex items-center gap-[clamp(14px,3.5vw,18px)] cursor-pointer group"
        >
          {/* 头像 —— 橙色光晕，像参考稿的主角 */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-[#F5A442]/25 rounded-full blur-xl scale-125" />
            <div className="absolute -inset-1.5 bg-[#FFE2B8] rounded-full" />
            <div className="relative z-10 w-[clamp(56px,15vw,72px)] h-[clamp(56px,15vw,72px)] bg-white rounded-full p-1 shadow-[0_8px_20px_rgba(245,164,66,0.3)] border-[3px] border-white overflow-hidden transition-transform group-hover:scale-105 group-active:scale-95">
              <img
                src={userProfile.avatar}
                alt="avatar"
                className="bg-[#FFF6E3] w-full h-full object-cover rounded-full"
              />
            </div>
            {/* 在线小圆点 */}
            <div className="absolute bottom-0.5 right-0.5 z-20 w-[clamp(14px,3.5vw,18px)] h-[clamp(14px,3.5vw,18px)] rounded-full bg-[#7BB573] border-[3px] border-white shadow-sm" />
          </div>

          {/* 问候 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[clamp(11px,2.5vw,13px)] font-bold tracking-wider uppercase text-[#B8A88A] mb-0.5">
              <Sparkles
                size={12}
                className="fill-[#F5A442] text-[#F5A442]"
              />
              {isToday ? "Hi There" : `回顾 · ${selectedDate.getMonth() + 1}/${selectedDate.getDate()}`}
            </div>
            <div className="font-bold text-[clamp(18px,4.5vw,22px)] text-[#3D372B] leading-tight">
              {userProfile.name}!
            </div>
            <div className="mt-1 inline-flex w-fit items-center gap-1.5 bg-white px-[clamp(10px,2.5vw,12px)] py-[clamp(3px,1vw,4px)] rounded-full shadow-[0_4px_12px_rgba(196,154,84,0.12)] border border-[#F1E6CA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A442]" />
              <span
                className={`font-bold text-[clamp(11px,2.5vw,12px)] tracking-wide ${isToday ? "text-[#F5A442]" : "text-[#7BB573]"}`}
              >
                L1 · {isToday ? "今日探险" : `复习(${selectedDate.getDate()}日)`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[clamp(10px,2.5vw,14px)]">
          {/* 连续打卡徽章 */}
          <div className="hidden sm:flex bg-white px-[clamp(12px,3vw,16px)] py-[clamp(8px,2vw,10px)] rounded-2xl shadow-[0_6px_16px_rgba(196,154,84,0.12)] border border-[#F1E6CA] items-center gap-2">
            <div className="w-[clamp(28px,7vw,32px)] h-[clamp(28px,7vw,32px)] rounded-xl bg-[#FFE5D0] flex items-center justify-center">
              <Flame
                size={18}
                className="fill-[#F5A442] text-[#F5A442]"
                strokeWidth={2.2}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-[clamp(14px,3.5vw,16px)] text-[#3D372B]">
                7
              </span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#B8A88A]">
                DAYS
              </span>
            </div>
          </div>

          {/* 钻石 —— 奶油胶囊 */}
          <div
            onClick={onShopClick}
            className="bg-white px-[clamp(14px,3.5vw,18px)] py-[clamp(8px,2vw,10px)] rounded-2xl shadow-[0_6px_16px_rgba(196,154,84,0.12)] flex items-center gap-2 cursor-pointer transition-all hover:scale-105 hover:shadow-[0_10px_20px_rgba(245,164,66,0.25)] active:scale-95 border border-[#F1E6CA]"
          >
            <div className="w-[clamp(28px,7vw,32px)] h-[clamp(28px,7vw,32px)] rounded-xl bg-[#FFF0D5] flex items-center justify-center">
              <Gem size={18} className="text-[#F5A442]" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-[clamp(14px,3.5vw,16px)] text-[#3D372B] tracking-wide">
                {diamonds}
              </span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#B8A88A]">
                GEMS
              </span>
            </div>
          </div>

          {/* 设置 */}
          <button
            onClick={onSettingsClick}
            aria-label="设置"
            className="w-[clamp(44px,12vw,52px)] h-[clamp(44px,12vw,52px)] bg-white rounded-2xl shadow-[0_6px_16px_rgba(196,154,84,0.12)] flex items-center justify-center text-[#8C7F68] hover:text-[#F5A442] hover:rotate-45 active:scale-90 transition-all duration-300 border border-[#F1E6CA]"
          >
            <Settings size={22} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* ───────── MAIN ───────── */}
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
        className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar px-[clamp(16px,4vw,40px)] flex items-center relative z-10 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center min-w-max h-full py-[clamp(12px,3vw,20px)] gap-2">
          <MapPath
            majorIdx={majorIdx}
            subIdx={subIdx}
            startLearning={startLearning}
            handleOpenReward={handleOpenReward}
          />
        </div>
      </main>

      {/* 滑动提示 */}
      <div className="absolute bottom-[24%] right-[clamp(20px,5vw,40px)] z-20 flex items-center gap-1.5 text-[10px] font-bold tracking-[2px] uppercase text-[#B8A88A] animate-pulse pointer-events-none">
        Swipe
        <ChevronRight size={14} strokeWidth={3} />
      </div>

      {/* ───────── FOOTER ───────── */}
      <footer className="h-[22%] px-[clamp(16px,4vw,32px)] pb-[clamp(12px,3vw,20px)] flex items-center justify-center relative z-20 gap-[clamp(12px,3vw,20px)]">
        {/* 左：统计数据 tile 组 —— 参考稿的"Numbers/Reading"大色块 */}
        <div className="flex items-center gap-[clamp(10px,2.5vw,14px)] shrink-0">
          {/* 学习时长 tile */}
          <div className="bg-[#E8F3DF] border-2 border-[#CFE4C0] rounded-[clamp(20px,5vw,28px)] p-[clamp(12px,3vw,16px)] shadow-[0_10px_24px_-8px_rgba(111,174,102,0.3)] flex flex-col items-center justify-center w-[clamp(96px,24vw,120px)] h-[clamp(88px,22vw,110px)] relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_14px_28px_-8px_rgba(111,174,102,0.4)] cursor-default">
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-[#D7EBC8] opacity-60" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-[clamp(36px,9vw,42px)] h-[clamp(36px,9vw,42px)] rounded-2xl bg-white flex items-center justify-center shadow-sm border border-[#D7EBC8]">
                <Clock
                  size={22}
                  className="text-[#6FAE66]"
                  strokeWidth={2.4}
                />
              </div>
              <div className="font-bold text-[clamp(18px,4.5vw,22px)] text-[#4F8D49] leading-none mt-1">
                {Math.floor(studyTime / 60)}
                <span className="text-[11px] ml-0.5">m</span>
              </div>
              <div className="text-[9px] font-bold tracking-[2px] uppercase text-[#4F8D49]/70">
                Study
              </div>
            </div>
          </div>

          {/* 每日目标 tile */}
          <div className="bg-[#FBF1D4] border-2 border-[#F3E2A6] rounded-[clamp(20px,5vw,28px)] p-[clamp(12px,3vw,16px)] shadow-[0_10px_24px_-8px_rgba(229,164,60,0.3)] flex flex-col items-center justify-center w-[clamp(96px,24vw,120px)] h-[clamp(88px,22vw,110px)] relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_14px_28px_-8px_rgba(229,164,60,0.4)] cursor-default">
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-[#F8E8B8] opacity-60" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-[clamp(36px,9vw,42px)] h-[clamp(36px,9vw,42px)] rounded-2xl bg-white flex items-center justify-center shadow-sm border border-[#F8E8B8]">
                <Trophy
                  size={22}
                  className="text-[#E5A43C]"
                  strokeWidth={2.4}
                />
              </div>
              <div className="font-bold text-[clamp(18px,4.5vw,22px)] text-[#B37C1E] leading-none mt-1">
                {Math.min(majorIdx + 1, TASK_DATA.length)}
                <span className="text-[11px] text-[#B37C1E]/60">
                  /{TASK_DATA.length}
                </span>
              </div>
              <div className="text-[9px] font-bold tracking-[2px] uppercase text-[#B37C1E]/70">
                Stage
              </div>
            </div>
          </div>
        </div>

        {/* 中：冒险进度卡 */}
        <div className="flex-1 max-w-[clamp(280px,50vw,520px)] bg-white border-2 border-[#F1E6CA] rounded-[clamp(20px,5vw,28px)] p-[clamp(12px,3vw,18px)] shadow-[0_10px_24px_-8px_rgba(196,154,84,0.2)] relative overflow-hidden">
          {/* 装饰气泡 */}
          <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-[#FFEFD5]/60" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-[clamp(8px,2vw,12px)]">
              <div className="flex items-center gap-2">
                <div className="w-[clamp(28px,7vw,32px)] h-[clamp(28px,7vw,32px)] rounded-xl bg-[#FFEFD5] flex items-center justify-center">
                  <Sparkles
                    size={15}
                    className="fill-[#F5A442] text-[#F5A442]"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[9px] font-bold tracking-[2px] uppercase text-[#B8A88A]">
                    Adventure
                  </span>
                  <span className="text-[13px] font-bold text-[#3D372B]">
                    冒险进度
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[clamp(22px,5.5vw,28px)] font-bold text-[#F5A442] leading-none">
                  {Math.round(overallPercent)}
                </span>
                <span className="text-[12px] font-bold text-[#F5A442]/70">
                  %
                </span>
              </div>
            </div>

            {/* 进度条 + 里程碑 */}
            <div className="relative h-3 w-full bg-[#F6ECD4] rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F9B969] to-[#F5A442] rounded-full transition-all duration-1000 ease-out overflow-hidden"
                style={{ width: `${overallPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
              </div>
              {TASK_DATA.map((task, idx) => {
                const taskEndSubs = TASK_DATA.slice(0, idx + 1).reduce(
                  (acc, t) => acc + t.subs.length,
                  0,
                );
                const nodePercent = (taskEndSubs / totalSubs) * 100;
                const isReached = doneSubs >= taskEndSubs;
                const isCurrent = majorIdx === idx;
                return (
                  <div
                    key={task.id}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${nodePercent}%` }}
                  >
                    <div
                      className={`w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] rounded-full flex items-center justify-center text-[10px] transition-all duration-500 z-10
                        ${
                          isReached
                            ? "bg-[#7BB573] border-2 border-white shadow-[0_2px_8px_rgba(123,181,115,0.5)] scale-110"
                            : isCurrent
                              ? "bg-white border-2 border-[#F5A442] shadow-[0_2px_8px_rgba(245,164,66,0.4)] scale-125"
                              : "bg-[#F1E6CA] border-2 border-white shadow-sm opacity-60"
                        }
                      `}
                    >
                      {isReached ? (
                        <Check size={12} color="white" strokeWidth={3} />
                      ) : isCurrent ? (
                        <span className="text-[10px]">{task.icon}</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 px-0.5">
              {TASK_DATA.map((task, idx) => {
                const isReached = idx < majorIdx;
                const isCurrent = majorIdx === idx;
                return (
                  <span
                    key={`label-${task.id}`}
                    className={`text-[9px] font-bold tracking-wider uppercase ${
                      isReached
                        ? "text-[#7BB573]"
                        : isCurrent
                          ? "text-[#F5A442]"
                          : "text-[#C9BFA3]"
                    }`}
                  >
                    {task.id}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右：动作按钮 */}
        <div className="flex flex-col gap-[clamp(8px,2vw,10px)] shrink-0">
          <button
            onClick={onCalendarClick}
            aria-label="日历"
            className="w-[clamp(44px,11vw,52px)] h-[clamp(44px,11vw,52px)] bg-[#B79CE8] rounded-2xl flex items-center justify-center text-white transition-all shadow-[0_5px_0_#8B73C4,0_10px_20px_-6px_rgba(139,115,196,0.5)] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#8B73C4,0_14px_22px_-6px_rgba(139,115,196,0.55)] active:shadow-[0_0_0_#8B73C4,0_4px_10px_-4px_rgba(139,115,196,0.4)] active:translate-y-1.5"
          >
            <CalendarIcon size={22} strokeWidth={2.4} />
          </button>
          <button
            onClick={onAwardsClick}
            aria-label="奖励"
            className="w-[clamp(44px,11vw,52px)] h-[clamp(44px,11vw,52px)] bg-[#F5A442] rounded-2xl flex items-center justify-center text-white transition-all shadow-[0_5px_0_#C4823A,0_10px_20px_-6px_rgba(245,164,66,0.5)] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#C4823A,0_14px_22px_-6px_rgba(245,164,66,0.55)] active:shadow-[0_0_0_#C4823A,0_4px_10px_-4px_rgba(245,164,66,0.4)] active:translate-y-1.5"
          >
            <Award size={22} strokeWidth={2.4} />
          </button>
        </div>
      </footer>
    </div>
  );
};

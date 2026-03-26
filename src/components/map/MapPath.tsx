import React from "react";
import { Check, Play } from "lucide-react";
import { TASK_DATA } from "../../constants";

interface MapPathProps {
  majorIdx: number;
  subIdx: number;
  startLearning: (title: string) => void;
  handleOpenReward: (mIdx: number) => void;
}

export const MapPath: React.FC<MapPathProps> = ({
  majorIdx,
  subIdx,
  startLearning,
  handleOpenReward,
}) => {
  const pathNodes: React.ReactNode[] = [];

  TASK_DATA.forEach((major, mIdx) => {
    const isMajorDone = mIdx < majorIdx;
    const isMajorCurrent = mIdx === majorIdx;
    const isMajorFuture = mIdx > majorIdx;

    const bgClass = isMajorDone
      ? "bg-slate-100/40"
      : isMajorCurrent
        ? "bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        : "bg-slate-200/20";
    const borderClass = isMajorDone
      ? "border-slate-200"
      : isMajorCurrent
        ? "border-white"
        : "border-slate-300/30";

    const stageContent: React.ReactNode[] = [];

    // 1. 大关图标
    stageContent.push(
      <div
        key={`major-icon-${mIdx}`}
        className="flex flex-col items-center justify-center mr-[clamp(16px,4vw,24px)]"
      >
        <div
          className={`w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] rounded-[clamp(20px,5vw,28px)] flex items-center justify-center text-[clamp(28px,7vw,36px)] shadow-lg transition-all duration-500 relative
 ${isMajorDone ? "bg-slate-400 grayscale" : isMajorCurrent ? "bg-white scale-110 rotate-3" : "bg-slate-200 opacity-40"}
 `}
          style={{
            backgroundColor: isMajorCurrent ? "white" : isMajorDone ? "#94a3b8" : "#e2e8f0",
            boxShadow: isMajorCurrent
              ? `0 15px 30px -5px ${major.color}44, inset 0 -4px 0 0 rgba(0,0,0,0.1)`
              : "inset 0 -4px 0 0 rgba(0,0,0,0.1)",
          }}
        >
          {isMajorDone ? (
            <Check size={40} color="white" className="drop-shadow-md" />
          ) : (
            <span
              className={`${isMajorCurrent ? "animate-bounce-slow" : ""}`}
            >
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

  return <>{pathNodes}</>;
};

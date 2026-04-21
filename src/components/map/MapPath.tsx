import React from "react";
import { Check, Play } from "lucide-react";
import { TASK_DATA } from "../../constants";

// 每个大关卡对应的奶油系柔和配色 —— 对齐参考稿的薄荷/奶油黄/橙/紫
const STAGE_PALETTE = [
  {
    // Listen
    cardBg: "bg-[#DDF0D5]",
    cardBorder: "border-[#C8E6BD]",
    blob: "bg-[#BEDDB0]",
    accent: "#7BB573",
    chipText: "text-[#5B9355]",
    iconRing: "shadow-[0_15px_30px_-5px_rgba(123,181,115,0.35)]",
  },
  {
    // Speak
    cardBg: "bg-[#FBEFC7]",
    cardBorder: "border-[#F6E3A3]",
    blob: "bg-[#F3D97C]",
    accent: "#E5A43C",
    chipText: "text-[#B37C1E]",
    iconRing: "shadow-[0_15px_30px_-5px_rgba(245,164,66,0.35)]",
  },
  {
    // Read
    cardBg: "bg-[#FCE2CF]",
    cardBorder: "border-[#F6C9A8]",
    blob: "bg-[#F4B587]",
    accent: "#F5A442",
    chipText: "text-[#C4823A]",
    iconRing: "shadow-[0_15px_30px_-5px_rgba(245,164,66,0.35)]",
  },
  {
    // Write
    cardBg: "bg-[#E5DFF9]",
    cardBorder: "border-[#CFC5F0]",
    blob: "bg-[#B8A8E8]",
    accent: "#8B73C4",
    chipText: "text-[#6B57A6]",
    iconRing: "shadow-[0_15px_30px_-5px_rgba(139,115,196,0.35)]",
  },
];

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
    const palette = STAGE_PALETTE[mIdx] ?? STAGE_PALETTE[0];

    // 卡片底色 —— 当前关卡用对应奶油色，已完成柔化、未解锁灰白
    const bgClass = isMajorCurrent
      ? `${palette.cardBg}`
      : isMajorDone
        ? "bg-white/70"
        : "bg-[#F5EDD8]/60";
    const borderClass = isMajorCurrent
      ? palette.cardBorder
      : isMajorDone
        ? "border-[#E9DEC2]"
        : "border-[#EFE6CF]";

    const stageContent: React.ReactNode[] = [];

    // 1. 大关图标 —— 白色圆角方块，带奶油内阴影
    stageContent.push(
      <div
        key={`major-icon-${mIdx}`}
        className="flex flex-col items-center justify-center mr-[clamp(16px,4vw,24px)]"
      >
        <div
          className={`w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] rounded-[clamp(20px,5vw,28px)] flex items-center justify-center text-[clamp(28px,7vw,36px)] transition-all duration-500 relative
 ${isMajorDone ? "bg-white grayscale opacity-70" : isMajorCurrent ? `bg-white scale-110 rotate-3 ${palette.iconRing}` : "bg-white/70 opacity-50"}
 `}
          style={{
            boxShadow: isMajorCurrent
              ? undefined
              : "inset 0 -4px 0 0 rgba(196,154,84,0.08)",
          }}
        >
          {isMajorDone ? (
            <Check size={40} className="drop-shadow-md" style={{ color: palette.accent }} />
          ) : (
            <span className={`${isMajorCurrent ? "animate-bounce-slow" : ""}`}>
              {major.icon}
            </span>
          )}
        </div>
        <div
          className="mt-[clamp(12px,3vw,16px)] bg-white px-[clamp(12px,3vw,16px)] py-1.5 rounded-full shadow-[0_4px_12px_rgba(196,154,84,0.12)] border border-[#F1E6CA]"
        >
          <span
            className={`font-bold text-[12px] tracking-wider ${isMajorFuture ? "text-slate-400" : palette.chipText}`}
          >
            {major.name}
          </span>
        </div>
      </div>,
    );

    // 2. 子点
    major.subs.forEach((sub, sIdx) => {
      const isSubDone = isMajorDone || (isMajorCurrent && sIdx < subIdx);
      const isSubActive = isMajorCurrent && sIdx === subIdx;

      // 连接条 —— 奶油底，完成用对应关卡主色
      stageContent.push(
        <div
          key={`line-sub-${mIdx}-${sIdx}`}
          className="w-[clamp(32px,8vw,40px)] h-2.5 bg-white/70 mx-1 rounded-full overflow-hidden shadow-inner relative"
        >
          <div
            className="h-full transition-all duration-700 ease-out rounded-full relative"
            style={{
              width: isSubDone ? "100%" : "0%",
              background: isSubDone
                ? `linear-gradient(90deg, ${palette.accent}, ${palette.accent})`
                : "transparent",
            }}
          />
        </div>,
      );

      // 子节点圆点 —— 柔和白色，当前节点用橙色强调
      stageContent.push(
        <div
          key={`dot-sub-${mIdx}-${sIdx}`}
          onClick={() =>
            isSubActive && startLearning(`${major.name} · ${sub}`)
          }
          className={`w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] rounded-full border-4 flex items-center justify-center relative transition-all duration-300
 ${isSubDone ? "opacity-90" : isSubActive ? "cursor-pointer animate-bounce scale-110" : "opacity-60"}
 `}
          style={{
            borderColor: isSubActive ? "#F5A442" : "white",
            backgroundColor: isSubDone ? palette.accent : "white",
            boxShadow: isSubActive
              ? "0 10px 15px -3px rgba(245, 164, 66, 0.45), inset 0 -3px 0 0 rgba(0,0,0,0.08)"
              : "0 4px 10px rgba(196,154,84,0.12), inset 0 -3px 0 0 rgba(0,0,0,0.06)",
          }}
        >
          {isSubActive && (
            <div className="absolute -top-10 bg-[#F5A442] text-white px-[clamp(8px,2.5vw,12px)] py-1 rounded-[clamp(8px,2vw,12px)] text-[10px] font-bold shadow-lg whitespace-nowrap z-50 border border-[#E59236]">
              {sub}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F5A442] rotate-45 border-b border-r border-[#E59236]" />
            </div>
          )}
          {isSubDone ? (
            <Check size={20} color="white" strokeWidth={3} />
          ) : isSubActive ? (
            <Play
              size={20}
              className="fill-[#F5A442] text-[#F5A442] drop-shadow-sm"
            />
          ) : (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: palette.accent }}
            />
          )}
        </div>,
      );
    });

    // 3. 宝箱前的连接
    stageContent.push(
      <div
        key={`line-chest-${mIdx}`}
        className="w-[clamp(32px,8vw,40px)] h-2.5 bg-white/70 mx-1 rounded-full overflow-hidden shadow-inner relative"
      >
        <div
          className="h-full transition-all duration-700 ease-out rounded-full"
          style={{
            width: isMajorDone ? "100%" : "0%",
            background: isMajorDone
              ? `linear-gradient(90deg, ${palette.accent}, ${palette.accent})`
              : "transparent",
          }}
        />
      </div>,
    );

    // 宝箱 —— 橙色发光态
    stageContent.push(
      <div
        key={`chest-${mIdx}`}
        onClick={() =>
          isMajorCurrent &&
          subIdx === major.subs.length &&
          handleOpenReward(mIdx)
        }
        className={`w-[clamp(48px,14vw,64px)] h-[clamp(48px,14vw,64px)] rounded-[clamp(12px,3vw,16px)] border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 relative
 ${isMajorDone ? "bg-white" : isMajorCurrent && subIdx === major.subs.length ? "bg-gradient-to-br from-[#FBC268] to-[#F5A442] cursor-pointer scale-110" : "bg-white/70 opacity-50"}
 `}
        style={{
          boxShadow:
            isMajorCurrent && subIdx === major.subs.length
              ? "0 10px 25px -5px rgba(245, 164, 66, 0.55), inset 0 -4px 0 0 rgba(0,0,0,0.1)"
              : "inset 0 -4px 0 0 rgba(196,154,84,0.08)",
        }}
      >
        {isMajorDone ? (
          <Check size={32} className="drop-shadow-md" style={{ color: palette.accent }} strokeWidth={3} />
        ) : (
          <span
            className={`text-[clamp(24px,6vw,32px)] drop-shadow-sm ${isMajorCurrent && subIdx === major.subs.length ? "animate-breathe-scale inline-block" : ""}`}
          >
            🎁
          </span>
        )}
      </div>,
    );

    // 推入整个关卡块
    pathNodes.push(
      <React.Fragment key={`stage-frag-${mIdx}`}>
        <div
          id={`major-module-${mIdx}`}
          className={`relative flex items-center h-[258px] px-[clamp(16px,4vw,24px)] py-[clamp(20px,5vw,32px)] mx-2 rounded-[36px] border-2 backdrop-blur-sm transition-all duration-700 overflow-hidden ${bgClass} ${borderClass}`}
        >
          {/* 当前关卡的柔和色块装饰 */}
          {isMajorCurrent && (
            <div className="absolute inset-0 pointer-events-none z-0">
              <div
                className={`absolute -top-10 -left-10 w-[clamp(160px,50vw,256px)] h-[clamp(160px,50vw,256px)] rounded-full opacity-40 animate-drift-1 ${palette.blob}`}
              />
              <div
                className={`absolute -bottom-10 -right-10 w-[clamp(200px,60vw,288px)] h-[clamp(200px,60vw,288px)] rounded-full opacity-30 animate-drift-2 ${palette.blob}`}
              />
            </div>
          )}

          {/* 关卡水印标签 */}
          <div
            className="absolute top-3 left-0 w-full text-center font-bold text-[15px] tracking-widest uppercase opacity-50 z-10"
            style={{ color: isMajorFuture ? "#B8A88A" : palette.accent }}
          >
            STAGE {mIdx + 1} · {major.id}
          </div>

          {/* 节点 */}
          <div className="flex items-center relative z-10 mt-[clamp(12px,3vw,16px)]">
            {stageContent}
          </div>
        </div>

        {/* 4. 大关之间的连接 */}
        {mIdx < TASK_DATA.length - 1 && (
          <div
            key={`major-conn-${mIdx}`}
            className="w-[clamp(48px,14vw,64px)] h-3 bg-white/70 rounded-full mx-1 shadow-inner overflow-hidden relative shrink-0"
          >
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: mIdx < majorIdx ? "100%" : "0%",
                background:
                  mIdx < majorIdx
                    ? "linear-gradient(90deg, #F9B969, #F5A442)"
                    : "transparent",
              }}
            />
          </div>
        )}
      </React.Fragment>,
    );
  });

  return <>{pathNodes}</>;
};

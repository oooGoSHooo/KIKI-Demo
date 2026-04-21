import React from "react";
import {
  Check,
  Play,
  Lock,
  Headphones,
  Mic,
  BookOpen,
  PenLine,
  Gift,
  Sparkles,
} from "lucide-react";
import { TASK_DATA } from "../../constants";

// 每个大关卡对应的奶油系柔和配色 —— 对齐参考稿的薄荷/奶油黄/橙/紫
const STAGE_PALETTE = [
  {
    // Listen
    cardBg: "bg-[#E8F3DF]",
    cardBorder: "border-[#CFE4C0]",
    tileBg: "bg-[#D7EBC8]",
    tileActiveBg: "bg-white",
    blob: "bg-[#BEDDB0]",
    accent: "#6FAE66",
    accentDark: "#4F8D49",
    chipBg: "bg-[#6FAE66]",
    chipText: "text-[#4F8D49]",
    numberText: "text-[#6FAE66]/15",
    iconRing: "shadow-[0_18px_36px_-8px_rgba(111,174,102,0.45)]",
    SubIcon: Headphones,
  },
  {
    // Speak
    cardBg: "bg-[#FBF1D4]",
    cardBorder: "border-[#F3E2A6]",
    tileBg: "bg-[#F8E8B8]",
    tileActiveBg: "bg-white",
    blob: "bg-[#F3D97C]",
    accent: "#E5A43C",
    accentDark: "#B37C1E",
    chipBg: "bg-[#E5A43C]",
    chipText: "text-[#B37C1E]",
    numberText: "text-[#E5A43C]/15",
    iconRing: "shadow-[0_18px_36px_-8px_rgba(229,164,60,0.45)]",
    SubIcon: Mic,
  },
  {
    // Read
    cardBg: "bg-[#FCE2CF]",
    cardBorder: "border-[#F6C9A8]",
    tileBg: "bg-[#FAD3B6]",
    tileActiveBg: "bg-white",
    blob: "bg-[#F4B587]",
    accent: "#F5A442",
    accentDark: "#C4823A",
    chipBg: "bg-[#F5A442]",
    chipText: "text-[#C4823A]",
    numberText: "text-[#F5A442]/15",
    iconRing: "shadow-[0_18px_36px_-8px_rgba(245,164,66,0.45)]",
    SubIcon: BookOpen,
  },
  {
    // Write
    cardBg: "bg-[#ECE5FB]",
    cardBorder: "border-[#D6C9F3]",
    tileBg: "bg-[#DECEF7]",
    tileActiveBg: "bg-white",
    blob: "bg-[#B8A8E8]",
    accent: "#8B73C4",
    accentDark: "#6B57A6",
    chipBg: "bg-[#8B73C4]",
    chipText: "text-[#6B57A6]",
    numberText: "text-[#8B73C4]/15",
    iconRing: "shadow-[0_18px_36px_-8px_rgba(139,115,196,0.45)]",
    SubIcon: PenLine,
  },
];

interface MapPathProps {
  majorIdx: number;
  subIdx: number;
  startLearning: (title: string) => void;
  handleOpenReward: (mIdx: number) => void;
}

interface SubTileProps {
  sub: string;
  sIdx: number;
  mIdx: number;
  majorName: string;
  state: "done" | "active" | "locked";
  palette: (typeof STAGE_PALETTE)[number];
  startLearning: (title: string) => void;
}

const SubTile: React.FC<SubTileProps> = ({
  sub,
  sIdx,
  mIdx,
  majorName,
  state,
  palette,
  startLearning,
}) => {
  const { SubIcon } = palette;
  const clickable = state === "active";
  return (
    <div className="relative flex flex-col items-center group">
      {/* 活动提示气泡 */}
      {state === "active" && (
        <div className="absolute -top-[58px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-bounce-slow pointer-events-none">
          <div
            className="px-3 py-1.5 rounded-2xl text-white text-[11px] font-bold shadow-lg whitespace-nowrap flex items-center gap-1"
            style={{ background: palette.accent }}
          >
            <Sparkles size={12} className="fill-white" />
            {sub}
          </div>
          <div
            className="w-3 h-3 rotate-45 -mt-1.5"
            style={{ background: palette.accent }}
          />
        </div>
      )}

      <button
        onClick={() =>
          clickable && startLearning(`${majorName} · ${sub}`)
        }
        disabled={!clickable}
        className={`
          relative w-[clamp(64px,16vw,84px)] h-[clamp(64px,16vw,84px)]
          rounded-[clamp(18px,4.5vw,24px)] flex items-center justify-center
          transition-all duration-300 overflow-hidden border-[3px]
          ${state === "done" ? "border-white" : ""}
          ${state === "active" ? "border-white scale-105 cursor-pointer hover:scale-110 active:scale-100" : ""}
          ${state === "locked" ? "border-white/60 cursor-not-allowed" : ""}
        `}
        style={{
          background:
            state === "active"
              ? "#FFFFFF"
              : state === "done"
                ? palette.accent
                : "rgba(255,255,255,0.5)",
          boxShadow:
            state === "active"
              ? `0 10px 24px -6px ${palette.accent}66, inset 0 -4px 0 0 rgba(0,0,0,0.05)`
              : state === "done"
                ? `0 6px 14px -4px ${palette.accent}55, inset 0 -4px 0 0 rgba(0,0,0,0.1)`
                : "inset 0 -4px 0 0 rgba(196,154,84,0.08)",
        }}
        aria-label={`${majorName} ${sub}`}
      >
        {/* 内部图标 */}
        {state === "done" && (
          <Check size={30} strokeWidth={3} color="white" />
        )}
        {state === "active" && (
          <div className="relative flex flex-col items-center justify-center">
            <SubIcon
              size={30}
              strokeWidth={2.2}
              style={{ color: palette.accent }}
            />
            {/* 活动 Play 浮动按钮 */}
            <div
              className="absolute -bottom-2 -right-3 w-6 h-6 rounded-full bg-[#F5A442] flex items-center justify-center shadow-md border-2 border-white"
              style={{ boxShadow: "0 4px 10px rgba(245,164,66,0.5)" }}
            >
              <Play size={10} className="fill-white text-white ml-0.5" />
            </div>
          </div>
        )}
        {state === "locked" && (
          <Lock size={22} strokeWidth={2.4} className="text-[#B8A88A]" />
        )}

        {/* 已完成角标 */}
        {state === "done" && (
          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            <Check size={10} strokeWidth={4} style={{ color: palette.accent }} />
          </div>
        )}
      </button>

      {/* 子任务标签 */}
      <div
        className={`mt-[clamp(8px,2vw,10px)] text-[11px] font-bold tracking-wide max-w-[clamp(64px,16vw,84px)] text-center leading-tight ${
          state === "locked"
            ? "text-[#B8A88A]"
            : state === "active"
              ? palette.chipText
              : "text-[#8C7F68]"
        }`}
      >
        {sub}
      </div>

      {/* 节点序号 */}
      <div
        className={`mt-1 text-[9px] font-bold tracking-[2px] ${
          state === "locked" ? "text-[#C9BFA3]" : palette.chipText + " opacity-70"
        }`}
      >
        {String(sIdx + 1).padStart(2, "0")}
      </div>
    </div>
  );
};

export const MapPath: React.FC<MapPathProps> = ({
  majorIdx,
  subIdx,
  startLearning,
  handleOpenReward,
}) => {
  return (
    <>
      {TASK_DATA.map((major, mIdx) => {
        const isMajorDone = mIdx < majorIdx;
        const isMajorCurrent = mIdx === majorIdx;
        const isMajorFuture = mIdx > majorIdx;
        const palette = STAGE_PALETTE[mIdx] ?? STAGE_PALETTE[0];

        const stageSubsTotal = major.subs.length;
        const stageSubsDone = isMajorDone
          ? stageSubsTotal
          : isMajorCurrent
            ? subIdx
            : 0;
        const stageProgress =
          stageSubsTotal === 0 ? 0 : stageSubsDone / stageSubsTotal;
        const chestReady = isMajorCurrent && subIdx === major.subs.length;

        const cardBg = isMajorCurrent
          ? palette.cardBg
          : isMajorDone
            ? "bg-white/75"
            : "bg-[#F5EDD8]/55";
        const cardBorder = isMajorCurrent
          ? palette.cardBorder
          : isMajorDone
            ? "border-[#E9DEC2]"
            : "border-[#EFE6CF]";

        return (
          <React.Fragment key={`stage-${mIdx}`}>
            <div
              id={`major-module-${mIdx}`}
              className={`relative flex flex-col shrink-0 h-[clamp(320px,60vh,400px)] w-[clamp(480px,82vw,620px)] px-[clamp(20px,4.5vw,28px)] py-[clamp(20px,4.5vw,26px)] mx-2 rounded-[clamp(28px,6vw,40px)] border-2 backdrop-blur-sm transition-all duration-700 overflow-hidden ${cardBg} ${cardBorder}`}
              style={{
                boxShadow: isMajorCurrent
                  ? "0 24px 48px -20px rgba(196,154,84,0.35), 0 4px 12px -4px rgba(196,154,84,0.15)"
                  : "0 10px 28px -14px rgba(196,154,84,0.2)",
              }}
            >
              {/* 当前关卡的柔和色块装饰 */}
              {isMajorCurrent && (
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[inherit]">
                  <div
                    className={`absolute -top-16 -left-16 w-[clamp(180px,55vw,280px)] h-[clamp(180px,55vw,280px)] rounded-full opacity-40 animate-drift-1 ${palette.blob}`}
                  />
                  <div
                    className={`absolute -bottom-20 -right-16 w-[clamp(200px,60vw,320px)] h-[clamp(200px,60vw,320px)] rounded-full opacity-30 animate-drift-2 ${palette.blob}`}
                  />
                </div>
              )}

              {/* 巨大水印数字 */}
              <div
                className={`absolute top-[clamp(8px,2vw,16px)] right-[clamp(16px,4vw,28px)] font-black leading-none tracking-tighter select-none pointer-events-none ${palette.numberText}`}
                style={{ fontSize: "clamp(84px,18vw,140px)" }}
              >
                {String(mIdx + 1).padStart(2, "0")}
              </div>

              {/* 顶部：阶段标签 + 进度 */}
              <div className="relative z-10 flex items-start justify-between mb-[clamp(12px,3vw,18px)]">
                <div className="flex items-center gap-[clamp(12px,3vw,16px)]">
                  {/* 阶段图标 */}
                  <div
                    className={`w-[clamp(56px,14vw,72px)] h-[clamp(56px,14vw,72px)] rounded-[clamp(16px,4vw,22px)] flex items-center justify-center text-[clamp(28px,7vw,36px)] transition-all duration-500 bg-white
                      ${isMajorDone ? "grayscale opacity-75" : ""}
                      ${isMajorCurrent ? palette.iconRing : "shadow-[0_6px_16px_rgba(196,154,84,0.15)]"}
                      ${isMajorFuture ? "opacity-60" : ""}
                    `}
                    style={{
                      border: `3px solid ${isMajorCurrent ? palette.accent : "rgba(255,255,255,0.9)"}`,
                    }}
                  >
                    <span
                      className={`${isMajorCurrent ? "animate-bounce-slow" : ""} drop-shadow-sm`}
                    >
                      {major.icon}
                    </span>
                  </div>

                  {/* 阶段名称 & 小标签 */}
                  <div className="flex flex-col justify-center">
                    <div
                      className={`text-[10px] font-bold tracking-[3px] uppercase mb-1 ${isMajorFuture ? "text-[#C9BFA3]" : palette.chipText + " opacity-80"}`}
                    >
                      STAGE {mIdx + 1}
                    </div>
                    <div
                      className={`font-bold text-[clamp(18px,4.5vw,22px)] tracking-wide leading-tight ${isMajorFuture ? "text-[#B8A88A]" : "text-[#3D372B]"}`}
                    >
                      {major.name}
                    </div>
                    <div
                      className={`text-[11px] font-semibold mt-0.5 ${isMajorFuture ? "text-[#C9BFA3]" : palette.chipText}`}
                    >
                      {stageSubsDone}/{stageSubsTotal} · 已完成
                    </div>
                  </div>
                </div>

                {/* 右上状态徽章 */}
                <div
                  className={`
                    px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shrink-0
                    ${
                      isMajorDone
                        ? "bg-white text-[#7BB573] border border-[#D7EBC8]"
                        : isMajorCurrent
                          ? palette.chipBg + " text-white shadow-md"
                          : "bg-white/60 text-[#B8A88A] border border-[#EFE6CF]"
                    }
                  `}
                >
                  {isMajorDone && (
                    <>
                      <Check size={12} strokeWidth={3.5} /> 已通关
                    </>
                  )}
                  {isMajorCurrent && (
                    <>
                      <Sparkles size={12} className="fill-white" /> 探险中
                    </>
                  )}
                  {isMajorFuture && (
                    <>
                      <Lock size={11} strokeWidth={2.5} /> 未解锁
                    </>
                  )}
                </div>
              </div>

              {/* 中段：进度条 */}
              <div className="relative z-10 mb-[clamp(14px,3.5vw,18px)]">
                <div className="h-2 w-full rounded-full bg-white/60 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{
                      width: `${stageProgress * 100}%`,
                      background: `linear-gradient(90deg, ${palette.accent}BB, ${palette.accent})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
                  </div>
                </div>
              </div>

              {/* 底部：子任务方块路径 + 宝箱 */}
              <div className="relative z-10 flex-1 flex items-center">
                <div className="flex items-start w-full gap-[clamp(6px,1.5vw,10px)]">
                  {major.subs.map((sub, sIdx) => {
                    const subState: "done" | "active" | "locked" = isMajorDone
                      ? "done"
                      : isMajorCurrent && sIdx < subIdx
                        ? "done"
                        : isMajorCurrent && sIdx === subIdx
                          ? "active"
                          : "locked";

                    return (
                      <React.Fragment key={`sub-frag-${mIdx}-${sIdx}`}>
                        <SubTile
                          sub={sub}
                          sIdx={sIdx}
                          mIdx={mIdx}
                          majorName={major.name}
                          state={subState}
                          palette={palette}
                          startLearning={startLearning}
                        />
                        {/* 虚线连接 —— 不在最后一个子节点 */}
                        <div className="flex-1 flex items-center justify-center pt-[clamp(24px,6vw,30px)] min-w-[clamp(8px,2vw,16px)]">
                          <div className="flex items-center gap-1">
                            {[0, 1, 2].map((d) => (
                              <div
                                key={d}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                                  (isMajorDone ||
                                    (isMajorCurrent && sIdx < subIdx)) &&
                                  "scale-110"
                                }`}
                                style={{
                                  background:
                                    isMajorDone ||
                                    (isMajorCurrent && sIdx < subIdx)
                                      ? palette.accent
                                      : "rgba(196,154,84,0.25)",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* 宝箱 tile */}
                  <div className="relative flex flex-col items-center">
                    <button
                      onClick={() => chestReady && handleOpenReward(mIdx)}
                      disabled={!chestReady && !isMajorDone}
                      className={`relative w-[clamp(64px,16vw,84px)] h-[clamp(64px,16vw,84px)] rounded-[clamp(18px,4.5vw,24px)] flex items-center justify-center transition-all duration-500 overflow-hidden border-[3px] border-white
                        ${chestReady ? "cursor-pointer scale-110 hover:scale-[1.18] animate-breathe-scale" : "cursor-default"}
                        ${isMajorFuture ? "opacity-55" : ""}
                      `}
                      style={{
                        background: chestReady
                          ? `linear-gradient(135deg, #FCC97D 0%, ${palette.accent} 100%)`
                          : isMajorDone
                            ? "#FFFFFF"
                            : "rgba(255,255,255,0.5)",
                        boxShadow: chestReady
                          ? `0 14px 32px -6px ${palette.accent}88, inset 0 -4px 0 0 rgba(0,0,0,0.1)`
                          : isMajorDone
                            ? `0 8px 18px -6px ${palette.accent}55, inset 0 -4px 0 0 rgba(0,0,0,0.06)`
                            : "inset 0 -4px 0 0 rgba(196,154,84,0.08)",
                      }}
                      aria-label={`${major.rewardName} 宝箱`}
                    >
                      {isMajorDone ? (
                        <Gift
                          size={30}
                          strokeWidth={2.2}
                          style={{ color: palette.accent }}
                        />
                      ) : (
                        <Gift
                          size={30}
                          strokeWidth={2.2}
                          color={chestReady ? "white" : "#B8A88A"}
                        />
                      )}
                      {chestReady && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                          <Sparkles
                            size={14}
                            className="fill-[#F5A442] text-[#F5A442]"
                          />
                        </div>
                      )}
                      {isMajorDone && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                          <Check
                            size={10}
                            strokeWidth={4}
                            style={{ color: palette.accent }}
                          />
                        </div>
                      )}
                    </button>
                    <div
                      className={`mt-[clamp(8px,2vw,10px)] text-[11px] font-bold tracking-wide max-w-[clamp(64px,16vw,84px)] text-center leading-tight ${
                        chestReady
                          ? "text-[#F5A442]"
                          : isMajorDone
                            ? palette.chipText
                            : "text-[#B8A88A]"
                      }`}
                    >
                      {major.rewardName}
                    </div>
                    <div
                      className={`mt-1 text-[9px] font-bold tracking-[2px] ${
                        isMajorFuture
                          ? "text-[#C9BFA3]"
                          : "text-[#F5A442] opacity-70"
                      }`}
                    >
                      BONUS
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 大关之间的弧形虚线连接 */}
            {mIdx < TASK_DATA.length - 1 && (
              <div className="flex items-center justify-center shrink-0 mx-2 h-full relative">
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full transition-all duration-700"
                      style={{
                        background:
                          mIdx < majorIdx
                            ? "#F5A442"
                            : "rgba(196,154,84,0.3)",
                        transform: `translateY(${Math.sin(i * 0.8) * 12}px)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

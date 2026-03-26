import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Achievement } from "../../types";

export const AchievementCard: React.FC<{ ach: Achievement }> = ({ ach }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group [perspective:1000px] h-[clamp(180px,45vw,220px)] sm:h-[clamp(200px,50vw,240px)] w-full cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 h-full [backface-visibility:hidden] rounded-[32px] p-[clamp(14px,3.5vw,20px)] sm:p-[clamp(16px,4vw,24px)] flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 group-hover:shadow-xl border-2 ${ach.acquired ? "bg-white border-slate-100" : "bg-slate-50 border-slate-200 grayscale opacity-60"}`}
        >
          <div
            className={`w-[clamp(56px,15vw,72px)] h-[clamp(56px,15vw,72px)] sm:w-[clamp(64px,18vw,80px)] sm:h-[clamp(64px,18vw,80px)] rounded-full flex items-center justify-center mb-[clamp(12px,3vw,16px)] shadow-inner relative ${ach.iconBg}`}
          >
            {ach.acquired && (
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            )}
            <ach.IconComponent
              size={32}
              className={`${ach.iconColor} drop-shadow-sm relative z-10`}
            />
          </div>
          <h3 className="font-black text-slate-800 text-[clamp(14px,3.5vw,16px)] sm:text-[clamp(14px,3.5vw,16px)] mb-1.5">
            {ach.name}
          </h3>
          <p className="text-[clamp(14px,3.5vw,16px)] text-slate-500 leading-snug line-clamp-2 font-medium h-9 flex items-center justify-center">
            {ach.intro}
          </p>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[32px] p-[clamp(14px,3.5vw,20px)] sm:p-[clamp(16px,4vw,24px)] flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 group- ${ach.iconBg}`}
        >
          <div
            className={`w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-white/50 rounded-full flex items-center justify-center mb-[clamp(8px,2.5vw,12px)] shadow-inner`}
          >
            <CalendarIcon size={24} className={ach.iconColor} />
          </div>
          <h3
            className={`font-black ${ach.iconColor} text-[clamp(14px,3.5vw,16px)] sm:text-[clamp(14px,3.5vw,16px)] mb-[clamp(6px,2vw,8px)]`}
          >
            获得日期
          </h3>
          <p
            className={`text-[clamp(14px,3.5vw,16px)] sm:text-[clamp(14px,3.5vw,16px)] font-bold ${ach.iconColor} opacity-80`}
          >
            2025年03月15日
          </p>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Trophy } from "lucide-react";
import { ACHIEVEMENTS_LIST } from "../../constants";
import { AchievementCard } from "../profile/AchievementCard";

export const AwardsView: React.FC = () => {
  return (
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
  );
};

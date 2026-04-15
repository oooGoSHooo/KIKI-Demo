import React from "react";
import { Edit2, Star, Zap, Calendar } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { UserProfile } from "../../types";
import { RADAR_DATA, CustomPolarGrid, CustomTick } from "../reports/RadarChartComponents";

interface ProfileViewProps {
  userProfile: UserProfile;
  onEditClick: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, onEditClick }) => {
  return (
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
                onClick={onEditClick}
                className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 active:scale-90 transition-transform"
              >
                <Edit2 size={16} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-wider">
                Lv.2 启蒙期
              </div>
              <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-wider">
                学习第 15 天
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 数据统计区 */}
      <div className="grid grid-cols-3 gap-[clamp(12px,3vw,16px)] shrink-0">
        <div className="bg-white rounded-[24px] p-[clamp(12px,3vw,16px)] shadow-sm border-2 border-slate-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-2">
            <Star size={20} fill="currentColor" />
          </div>
          <span className="text-[clamp(18px,4.5vw,22px)] font-black text-slate-800">
            128
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total Stars
          </span>
        </div>
        <div className="bg-white rounded-[24px] p-[clamp(12px,3vw,16px)] shadow-sm border-2 border-slate-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-2">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="text-[clamp(18px,4.5vw,22px)] font-black text-slate-800">
            15
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Day Streak
          </span>
        </div>
        <div className="bg-white rounded-[24px] p-[clamp(12px,3vw,16px)] shadow-sm border-2 border-slate-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
            <Calendar size={20} />
          </div>
          <span className="text-[clamp(18px,4.5vw,22px)] font-black text-slate-800">
            450
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Study Mins
          </span>
        </div>
      </div>

      {/* 3. 下方图表区 */}
      <div className="flex-1 flex flex-col md:flex-row gap-[clamp(12px,3vw,16px)] shrink-0 min-h-[350px]">
        {/* 雷达图 */}
        <div className="flex-1 bg-white rounded-[32px] p-[clamp(16px,4vw,24px)] shadow-sm border-2 border-slate-100 flex flex-col">
          <h3 className="font-black text-slate-800 text-[clamp(18px,4.5vw,20px)] mb-[clamp(12px,3vw,16px)]">
            能力雷达图
          </h3>
          <div className="flex-1 relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                <PolarGrid content={<CustomPolarGrid />} />
                <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
                <Radar
                  name="能力值"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 13 Levels Progress */}
        <div className="flex-1 bg-white rounded-[32px] p-[clamp(16px,4vw,24px)] shadow-sm border-2 border-slate-100 flex flex-col justify-center">
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
                const showNode =
                  level === 1 ||
                  level === 13 ||
                  level % 3 === 1 ||
                  isCurrent;

                if (!showNode)
                  return <div key={`progress-node-empty-${level}`} className="w-0 h-0" />;

                return (
                  <div
                    key={`progress-node-${level}`}
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
  );
};

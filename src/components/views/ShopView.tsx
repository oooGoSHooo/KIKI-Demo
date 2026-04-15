import React from "react";
import { Sparkles, Hourglass, Gem, FlaskConical, Shield, Clover, Map, PackageX, Ghost, History, Flame } from "lucide-react";

export const ShopView: React.FC = () => {
  return (
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

      <h2 className="text-[clamp(18px,4.5vw,20px)] font-black text-slate-400 mb-[clamp(12px,3vw,16px)] flex items-center mt-8">
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
  );
};

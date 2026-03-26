import React from "react";
import { BarChart3, BookOpen, Sparkles, Clock, Crown, FileText, ChevronRight } from "lucide-react";

interface ParentCenterViewProps {
  onSubscriptionsClick: () => void;
  onReportsClick: () => void;
}

export const ParentCenterView: React.FC<ParentCenterViewProps> = ({
  onSubscriptionsClick,
  onReportsClick,
}) => {
  return (
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
          onClick={onSubscriptionsClick}
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
          onClick={onReportsClick}
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
  );
};

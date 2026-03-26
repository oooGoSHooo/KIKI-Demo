import React from "react";
import { Sparkles, Mic, FileText, ChevronRight, Headphones, LogOut } from "lucide-react";

export const SettingsView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-[clamp(16px,4vw,24px)] pt-0 pb-12">
      <div className="bg-slate-50 rounded-[32px] p-[clamp(16px,4vw,24px)] sm:p-[clamp(20px,5vw,32px)] border border-slate-100 space-y-[clamp(16px,4vw,24px)]">
        {/* 个性化推荐 */}
        <div className="flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60">
          <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
            <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center">
              <Sparkles className="text-purple-500" size={20} />
            </div>
            <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)]">
              个性化推荐
            </span>
          </div>
          <div className="w-[clamp(40px,12vw,56px)] h-[clamp(24px,6vw,32px)] bg-green-500 rounded-full relative cursor-pointer shadow-inner">
            <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
        {/* 语音测试难度 */}
        <div className="flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60">
          <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
            <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center">
              <Mic className="text-blue-500" size={20} />
            </div>
            <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)]">
              语音测试难度
            </span>
          </div>
          <div className="flex items-center space-x-[clamp(6px,2vw,8px)] bg-white rounded-[clamp(8px,2vw,12px)] p-1 shadow-sm border border-slate-100">
            <button className="px-[clamp(12px,3vw,16px)] py-1.5 rounded-[clamp(6px,1.5vw,8px)] font-bold text-[clamp(14px,3.5vw,16px)] text-slate-500 ">
              简单
            </button>
            <button className="px-[clamp(12px,3vw,16px)] py-1.5 rounded-[clamp(6px,1.5vw,8px)] font-bold text-[clamp(14px,3.5vw,16px)] bg-blue-50 text-blue-600 shadow-sm">
              适中
            </button>
            <button className="px-[clamp(12px,3vw,16px)] py-1.5 rounded-[clamp(6px,1.5vw,8px)] font-bold text-[clamp(14px,3.5vw,16px)] text-slate-500 ">
              挑战
            </button>
          </div>
        </div>
        {/* 用户协议 */}
        <button className="w-full flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60 group">
          <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
            <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center">
              <FileText className="text-slate-500" size={20} />
            </div>
            <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)] group- transition-colors">
              用户协议
            </span>
          </div>
          <ChevronRight
            className="text-slate-400 group- transition-colors"
            size={24}
          />
        </button>
        {/* 联系客服 */}
        <button className="w-full flex items-center justify-between py-[clamp(6px,2vw,8px)] border-b border-slate-200/60 group">
          <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
            <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-white rounded-full shadow-sm flex items-center justify-center">
              <Headphones className="text-slate-500" size={20} />
            </div>
            <span className="font-black text-slate-700 text-[clamp(18px,4.5vw,20px)] group- transition-colors">
              联系客服
            </span>
          </div>
          <ChevronRight
            className="text-slate-400 group- transition-colors"
            size={24}
          />
        </button>
        {/* 退出登录 */}
        <button className="w-full flex items-center justify-between py-[clamp(6px,2vw,8px)] group mt-[clamp(12px,3vw,16px)]">
          <div className="flex items-center space-x-[clamp(12px,3vw,16px)]">
            <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] bg-red-50 rounded-full flex items-center justify-center">
              <LogOut className="text-red-500" size={20} />
            </div>
            <span className="font-black text-red-500 text-[clamp(18px,4.5vw,20px)]">
              退出登录
            </span>
          </div>
        </button>
      </div>
      <div className="text-center text-slate-400 font-bold text-[clamp(14px,3.5vw,16px)]">
        当前版本 v1.0.0
      </div>
    </div>
  );
};

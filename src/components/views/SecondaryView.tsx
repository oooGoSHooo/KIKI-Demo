import React from "react";
import { ChevronLeft, Settings } from "lucide-react";
import { ViewType } from "../../types";

interface SecondaryViewProps {
  currentView: ViewType;
  onBack: () => void;
  onSettingsClick?: () => void;
  children: React.ReactNode;
  dragProps?: any;
}

export const SecondaryView: React.FC<SecondaryViewProps> = ({
  currentView,
  onBack,
  onSettingsClick,
  children,
  dragProps,
}) => {
  const getTitle = () => {
    switch (currentView) {
      case "parent":
        return "家长中心";
      case "awards":
        return "我的勋章";
      case "shop":
        return "魔法商城";
      case "settings":
        return "App 设置";
      case "subscriptions":
        return "管理订阅";
      case "reports":
        return "接收学习报告";
      case "report-generator":
        return "生成学习报告";
      case "profile":
        return "学员档案";
      default:
        return "";
    }
  };

  return (
    <div className="relative h-full w-full bg-white z-50 flex flex-col animate-in slide-in-from-left duration-300">
      <header className="h-[12%] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100">
        <button
          onClick={onBack}
          className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
        >
          <ChevronLeft size={32} />
        </button>
        <h2 className="font-black text-slate-800 text-[clamp(22px,5.5vw,28px)] tracking-widest">
          {getTitle()}
        </h2>
        {currentView === "parent" ? (
          <button
            onClick={onSettingsClick}
            className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
          >
            <Settings size={28} />
          </button>
        ) : (
          <div className="w-[clamp(40px,12vw,56px)]" />
        )}
      </header>
      <main
        {...dragProps}
        className="flex-1 px-[4%] pb-0 pt-0 overflow-y-auto no-scrollbar text-slate-800 cursor-grab active:cursor-grabbing"
      >
        {children}
      </main>
    </div>
  );
};

import React from "react";
import { X, Play } from "lucide-react";
import { FlashcardLearning } from "../learning/LearningComponents";
import { EbookReader } from "../EbookReader";
import { ReadAloud } from "../ReadAloud";
import { ExerciseModule } from "../ExerciseModule";

interface LearningViewProps {
  learningTitle: string;
  finishSubTask: () => void;
  onBack: () => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  learningTitle,
  finishSubTask,
  onBack,
}) => {
  if (learningTitle.includes("单词卡")) {
    return <FlashcardLearning onFinish={finishSubTask} onBack={onBack} />;
  }

  if (learningTitle.includes("电子书")) {
    return <EbookReader onFinish={finishSubTask} onBack={onBack} />;
  }

  if (learningTitle.includes("绘本跟读")) {
    return <ReadAloud onFinish={finishSubTask} onBack={onBack} />;
  }

  if (learningTitle.includes("练习-")) {
    return (
      <ExerciseModule
        type={learningTitle.split(" · ")[1] || learningTitle}
        onFinish={finishSubTask}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="relative h-full w-full bg-white z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800">
      <header className="h-[12%] px-[4%] flex items-center justify-between bg-slate-50 border-b border-slate-100 shadow-sm z-10 relative">
        <button
          onClick={onBack}
          className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-200 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 transition-colors"
        >
          <X size={32} />
        </button>
        <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] uppercase text-slate-600">
          {learningTitle}
        </h2>
        <div className="w-[clamp(40px,12vw,56px)]" />
      </header>
      <div className="flex-1 flex items-center justify-center p-[clamp(16px,4vw,24px)] sm:p-[clamp(24px,6vw,40px)]">
        <div className="w-full h-full max-w-4xl aspect-video bg-slate-100 rounded-[40px] border-4 border-slate-200 shadow-xl flex items-center justify-center relative overflow-hidden">
          <Play size={80} className="text-slate-300 opacity-50" />
          <div className="absolute bottom-6 left-6 right-6 h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-1/3" />
          </div>
        </div>
      </div>
      <div className="h-[16%] flex items-center justify-center px-[clamp(24px,6vw,40px)] pb-0">
        <button
          onClick={finishSubTask}
          className="bg-blue-600 text-white px-[clamp(32px,8vw,56px)] py-[clamp(12px,3vw,16px)] rounded-[clamp(12px,3vw,16px)] font-black text-[clamp(22px,5.5vw,28px)] shadow-lg active:scale-95"
        >
          学完了！领取奖励
        </button>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1.5 bg-blue-500 transition-all duration-500 z-50 rounded-r-full"
        style={{ width: "33%" }}
      />
    </div>
  );
};

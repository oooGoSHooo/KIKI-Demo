import React from "react";
import { ShieldCheck, FileText } from "lucide-react";

interface ReportsViewProps {
  onPreviewClick: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onPreviewClick }) => {
  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col items-center justify-center py-[clamp(20px,5vw,32px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(24px,6vw,40px)] items-center w-full">
        {/* Left Side: Info */}
        <div className="flex flex-col items-start text-left space-y-[clamp(16px,4vw,24px)]">
          <div className="w-[clamp(64px,18vw,80px)] h-[clamp(64px,18vw,80px)] bg-blue-100 rounded-[clamp(20px,5vw,28px)] flex items-center justify-center text-blue-600 mb-[clamp(8px,2vw,12px)]">
            <FileText size={40} />
          </div>
          <h1 className="text-[clamp(28px,7vw,36px)] font-black text-slate-800 leading-tight">
            绑定微信 <br />
            <span className="text-blue-600">接收学习报告</span>
          </h1>
          <p className="text-slate-500 font-bold text-[clamp(16px,4vw,18px)] max-w-md leading-relaxed">
            每周一上午 10:00，我们将为您推送孩子上周的学习进度、词汇掌握情况及专业建议。
          </p>
          <div className="flex items-center space-x-[clamp(6px,2vw,8px)] text-slate-400 font-bold text-[clamp(14px,3.5vw,16px)] bg-slate-50 px-[clamp(14px,3.5vw,20px)] py-[clamp(8px,2.5vw,12px)] rounded-full border border-slate-100">
            <ShieldCheck size={20} className="text-green-500" />
            <span>安全绑定，随时可取消</span>
          </div>
        </div>

        {/* Right Side: QR Code and Prompt */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-[clamp(16px,4vw,24px)] rounded-[40px] shadow-2xl border border-slate-100 mb-[clamp(16px,4vw,24px)] relative group transform -translate-y-4">
            <div className="absolute -top-4 -right-4 bg-green-500 text-white text-[clamp(14px,3.5vw,16px)] font-black px-[clamp(12px,3vw,16px)] py-[clamp(6px,2vw,8px)] rounded-full shadow-lg transform rotate-12 group- transition-transform z-10">
              扫一扫
            </div>
            <div className="w-[clamp(160px,50vw,224px)] h-[clamp(160px,50vw,224px)] sm:w-[clamp(160px,50vw,256px)] sm:h-[clamp(160px,50vw,256px)] bg-slate-50 rounded-[clamp(12px,3vw,16px)] overflow-hidden relative">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QianQianMaMa"
                alt="千千妈妈公众号二维码"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <p className="text-slate-400 font-black tracking-widest uppercase text-[clamp(14px,3.5vw,16px)] mb-[clamp(16px,4vw,24px)]">
            Scan to Subscribe
          </p>
          <button
            onClick={onPreviewClick}
            className="px-[clamp(20px,5vw,32px)] py-[clamp(12px,3vw,16px)] bg-blue-500 text-white rounded-full font-black text-[clamp(18px,4.5vw,20px)] shadow-lg active:scale-95 transition-all flex items-center space-x-[clamp(6px,2vw,8px)]"
          >
            <FileText size={24} />
            <span>预览学习报告</span>
          </button>
        </div>
      </div>
    </div>
  );
};

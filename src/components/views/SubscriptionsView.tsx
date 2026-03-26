import React from "react";
import { SUBSCRIPTIONS_LIST } from "../../constants";

export const SubscriptionsView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-[clamp(12px,3vw,16px)] py-[clamp(12px,3vw,16px)]">
      {SUBSCRIPTIONS_LIST.map((sub) => (
        <div
          key={sub.id}
          className={`bg-slate-50 rounded-[24px] p-[clamp(16px,4vw,24px)] border border-slate-100 flex items-center justify-between ${sub.status === "expired" ? "opacity-60 grayscale" : ""}`}
        >
          <div className="flex items-center space-x-[clamp(12px,3vw,16px)] sm:space-x-[clamp(14px,3.5vw,20px)]">
            <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] sm:w-[clamp(80px,25vw,112px)] sm:h-[clamp(80px,25vw,112px)] flex-shrink-0 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#CCCCCC] rounded-[clamp(12px,3vw,16px)] animate-pulse" />
              <img
                src={sub.image}
                alt={sub.name}
                className={`w-full h-full object-contain drop-shadow-sm relative z-10 opacity-0 transition-opacity duration-300 ${sub.status === "unpurchased" ? "brightness-75 saturate-50" : ""}`}
                referrerPolicy="no-referrer"
                onLoad={(e) => {
                  e.currentTarget.classList.remove("opacity-0");
                  e.currentTarget.classList.add("opacity-100");
                }}
              />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-[clamp(18px,4.5vw,20px)] mb-1">
                {sub.name}
              </h3>
              <p className="text-slate-500 font-bold text-[clamp(12px,3vw,14px)]">
                {sub.status === "active"
                  ? `有效期至: ${sub.expireDate}`
                  : sub.status === "expired"
                    ? "已于 " + sub.expireDate + " 到期"
                    : "尚未订阅"}
              </p>
            </div>
          </div>
          <button
            className={`px-[clamp(16px,4vw,24px)] py-[clamp(8px,2.5vw,10px)] rounded-full font-black text-[clamp(14px,3.5vw,16px)] transition-all ${sub.status === "active" ? "bg-green-100 text-green-600" : sub.status === "expired" ? "bg-slate-200 text-slate-500" : "bg-blue-600 text-white shadow-[0_4px_0_#2563eb] active:shadow-none active:translate-y-1"}`}
          >
            {sub.status === "active"
              ? "已开通"
              : sub.status === "expired"
                ? "续费"
                : "立即订阅"}
          </button>
        </div>
      ))}
    </div>
  );
};

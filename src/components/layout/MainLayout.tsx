import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-slate-900 w-full h-screen flex items-center justify-center overflow-hidden font-sans select-none text-slate-800">
      <div
        id="app-stage"
        className="relative bg-[#E0F2FE] overflow-hidden w-full h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 via-cyan-100 to-green-100 z-0">
          <div className="absolute top-10 left-[10%] w-[clamp(128px,40vw,192px)] h-[clamp(48px,14vw,64px)] bg-white/40 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute top-40 right-[15%] w-[clamp(160px,50vw,256px)] h-[clamp(56px,16vw,80px)] bg-white/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute bottom-32 left-[20%] w-[clamp(240px,70vw,320px)] h-[clamp(64px,20vw,96px)] bg-white/50 rounded-full blur-3xl"></div>
          <div
            className="absolute top-1/3 left-1/2 w-[clamp(280px,80vw,384px)] h-[clamp(280px,80vw,384px)] bg-yellow-200/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        {children}
      </div>
    </div>
  );
};

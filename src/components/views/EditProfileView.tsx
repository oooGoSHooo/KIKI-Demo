import React from "react";
import { ChevronLeft, Dices } from "lucide-react";
import { UserProfile } from "../../types";
import { AVATAR_SEEDS, NAME_ADJS, NAME_NOUNS } from "../../constants";

interface EditProfileViewProps {
  tempProfile: UserProfile;
  setTempProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onBack: () => void;
  onSave: () => void;
  verticalDragProps: any;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  tempProfile,
  setTempProfile,
  onBack,
  onSave,
  verticalDragProps,
}) => {
  const handleRandomName = () => {
    const adj = NAME_ADJS[Math.floor(Math.random() * NAME_ADJS.length)];
    const noun = NAME_NOUNS[Math.floor(Math.random() * NAME_NOUNS.length)];
    setTempProfile((prev) => ({ ...prev, name: `${adj}${noun}` }));
  };

  return (
    <div className="absolute inset-0 z-[100] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
      <header className="h-[12%] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100 shrink-0">
        <button
          onClick={onBack}
          className="w-[clamp(40px,12vw,56px)] h-[clamp(40px,12vw,56px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
        >
          <ChevronLeft size={32} />
        </button>
        <h2 className="font-black text-slate-800 text-[clamp(22px,5.5vw,28px)] tracking-widest">
          编辑资料
        </h2>
        <button
          onClick={onSave}
          className="px-[clamp(16px,4vw,24px)] h-[clamp(40px,12vw,56px)] bg-blue-500 text-white font-black rounded-[clamp(12px,3vw,16px)] active:scale-90 transition-transform shadow-sm text-[clamp(16px,4vw,18px)]"
        >
          保存
        </button>
      </header>
      <main
        {...verticalDragProps}
        className="flex-1 px-[4%] pb-0 pt-0 overflow-y-auto no-scrollbar flex flex-col items-center"
      >
        {/* Avatar Preview */}
        <div className="w-[clamp(100px,25vw,140px)] h-[clamp(100px,25vw,140px)] bg-white rounded-full p-2 shadow-xl border-4 border-slate-100 overflow-hidden relative mb-[clamp(16px,4vw,24px)] shrink-0">
          <img
            src={tempProfile.avatar}
            alt="avatar"
            className="w-full h-full object-cover bg-blue-50 rounded-full"
          />
        </div>

        {/* Nickname Input */}
        <div className="w-full max-w-md mb-[clamp(24px,6vw,32px)]">
          <label className="block text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)] mb-2">
            学员昵称
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={tempProfile.name}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, name: e.target.value })
              }
              className="flex-1 bg-white border-2 border-slate-200 rounded-[16px] px-4 py-3 font-black text-slate-800 text-[clamp(16px,4vw,18px)] focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
              maxLength={10}
            />
            <button
              onClick={handleRandomName}
              className="bg-purple-100 text-purple-600 px-4 rounded-[16px] font-black flex items-center justify-center active:scale-95 transition-transform border-2 border-purple-200 whitespace-nowrap"
            >
              <Dices size={20} className="mr-1" />
              随机
            </button>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="w-full max-w-md flex-1 flex flex-col min-h-0">
          <label className="block text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)] mb-3 shrink-0">
            选择头像
          </label>
          <div className="bg-white rounded-[24px] p-[clamp(16px,4vw,24px)] shadow-sm border-2 border-slate-100 flex-1 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-[clamp(12px,3vw,16px)]">
              {AVATAR_SEEDS.map((seed) => {
                const avatarUrl = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
                const isSelected = tempProfile.avatar === avatarUrl;
                return (
                  <button
                    key={seed}
                    onClick={() =>
                      setTempProfile({
                        ...tempProfile,
                        avatar: avatarUrl,
                      })
                    }
                    className={`aspect-square rounded-full p-1 transition-all ${isSelected ? "border-4 border-blue-500 scale-110 shadow-md" : "border-2 border-transparent hover:scale-105"}`}
                  >
                    <img
                      src={avatarUrl}
                      alt={seed}
                      className="w-full h-full object-cover bg-slate-50 rounded-full"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

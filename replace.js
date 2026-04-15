const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = `) : currentView === 'profile' ? (`;
const endStr = `) : currentView === 'edit-profile' ? (`;

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.substring(0, startIndex) + `) : currentView === 'profile' ? (
          <div className="max-w-5xl mx-auto h-full flex flex-col pb-4 overflow-y-auto no-scrollbar space-y-[clamp(12px,3vw,16px)]">
            {/* 1. 上方身份区 */}
            <div className="bg-white rounded-[32px] p-[clamp(16px,4vw,24px)] shadow-sm border-2 border-slate-100 flex items-center justify-between relative overflow-hidden shrink-0">
              <div className="flex items-center">
                <div className="relative mr-[clamp(16px,4vw,24px)]">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full -rotate-6 scale-105 shadow-md"></div>
                  <div className="w-[clamp(64px,20vw,96px)] h-[clamp(64px,20vw,96px)] bg-white rounded-full p-1.5 shadow-xl border-4 border-white overflow-hidden relative z-10">
                    <img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Qian" alt="avatar" className="w-full h-full object-cover bg-blue-50 rounded-full" />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center space-x-2 mb-[clamp(4px,1vw,8px)]">
                    <h1 className="text-[clamp(20px,5vw,28px)] font-black text-slate-800 tracking-wide">糯米团子</h1>
                    <button onClick={() => setCurrentView('edit-profile')} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 active:scale-90 transition-transform">
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 text-blue-600 px-[clamp(10px,2.5vw,14px)] py-1 rounded-full font-black text-[clamp(12px,3vw,14px)] shadow-sm border border-blue-200 flex items-center space-x-1">
                      <Crown size={14} />
                      <span>小小探险家</span>
                    </div>
                    <div className="bg-purple-100 text-purple-600 px-[clamp(10px,2.5vw,14px)] py-1 rounded-full font-black text-[clamp(12px,3vw,14px)] shadow-sm border border-purple-200 flex items-center space-x-1">
                      <Star size={14} />
                      <span>Lv.2</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-orange-50 rounded-[24px] px-[clamp(16px,4vw,24px)] py-[clamp(12px,3vw,16px)] border-2 border-orange-100">
                <div className="flex items-center space-x-2 mb-1">
                  <Flame className="text-orange-500" size={24} />
                  <span className="text-[clamp(24px,6vw,32px)] font-black text-orange-600">12</span>
                </div>
                <span className="text-[clamp(12px,3vw,14px)] font-bold text-orange-400">连续学习(天)</span>
              </div>
            </div>

            {/* 2. 今日任务完成度 */}
            <div className="bg-white rounded-[32px] p-[clamp(16px,4vw,24px)] shadow-sm border-2 border-slate-100 shrink-0">
              <div className="flex justify-between items-center mb-[clamp(12px,3vw,16px)]">
                <h2 className="text-[clamp(18px,4.5vw,20px)] font-black text-slate-800 flex items-center space-x-2">
                  <Target className="text-green-500" size={24} />
                  <span>今日任务</span>
                </h2>
                <span className="text-green-500 font-black text-[clamp(14px,3.5vw,16px)] bg-green-50 px-3 py-1 rounded-full">已完成 2/3</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[clamp(8px,2vw,12px)]">
                {/* Task 1 */}
                <div className="flex items-center justify-between bg-slate-50 p-[clamp(12px,3vw,16px)] rounded-[20px] border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center shrink-0">
                      <Check size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-700 text-[clamp(14px,3.5vw,16px)] line-clamp-1">完成1个绘本跟读</h3>
                      <p className="text-slate-400 font-bold text-[clamp(12px,3vw,14px)]">+10 经验值</p>
                    </div>
                  </div>
                </div>
                {/* Task 2 */}
                <div className="flex items-center justify-between bg-slate-50 p-[clamp(12px,3vw,16px)] rounded-[20px] border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center shrink-0">
                      <Check size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-700 text-[clamp(14px,3.5vw,16px)] line-clamp-1">完成1个单词卡学习</h3>
                      <p className="text-slate-400 font-bold text-[clamp(12px,3vw,14px)]">+10 经验值</p>
                    </div>
                  </div>
                </div>
                {/* Task 3 */}
                <div className="flex items-center justify-between bg-blue-50 p-[clamp(12px,3vw,16px)] rounded-[20px] border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <BookOpen size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-700 text-[clamp(14px,3.5vw,16px)] line-clamp-1">学习时长达到 20 分钟</h3>
                      <p className="text-blue-400 font-bold text-[clamp(12px,3vw,14px)]">进度: 15/20 分钟</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 能力成长区 */}
            <div className="bg-white rounded-[32px] p-[clamp(16px,4vw,24px)] shadow-sm border-2 border-slate-100 flex-1 flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-[clamp(16px,4vw,24px)] shrink-0">
                <h2 className="text-[clamp(18px,4.5vw,20px)] font-black text-slate-800 flex items-center space-x-2">
                  <TrendingUp className="text-purple-500" size={24} />
                  <span>能力成长</span>
                </h2>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-[clamp(16px,4vw,24px)] flex-1 min-h-0">
                {/* Radar Chart */}
                <div className="flex-1 bg-slate-50 rounded-[24px] p-[clamp(12px,3vw,16px)] flex items-center justify-center border-2 border-slate-100 relative min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={RADAR_DATA}>
                      <PolarGrid content={<CustomPolarGrid />} />
                      <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar 
                        name="能力" 
                        dataKey="A" 
                        stroke="#8b5cf6" 
                        strokeWidth={3} 
                        fill="#a78bfa" 
                        fillOpacity={0.6} 
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={1500}
                        animationEasing="ease-out"
                        dot={{ r: 4, fill: '#fff', stroke: '#8b5cf6', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#fff', stroke: '#8b5cf6', strokeWidth: 2 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* 13 Levels Progress */}
                <div className="flex-1 flex flex-col justify-center bg-slate-50 rounded-[24px] p-[clamp(16px,4vw,24px)] border-2 border-slate-100">
                  <div className="mb-[clamp(24px,6vw,32px)] text-center">
                    <h3 className="font-black text-[clamp(20px,5vw,24px)] text-slate-700 mb-2">当前级别: <span className="text-purple-600">Lv.2 启蒙期</span></h3>
                    <p className="text-slate-500 font-bold text-[clamp(14px,3.5vw,16px)]">再获得 150 经验值即可升级到 Lv.3！</p>
                  </div>
                  
                  <div className="relative pt-12 pb-8 px-4 w-full max-w-md mx-auto">
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
                        // Only show nodes for 1, 4, 7, 10, 13 to avoid crowding, but keep the current one
                        const showNode = level === 1 || level === 13 || level % 3 === 1 || isCurrent;
                        
                        if (!showNode) return <div key={level} className="w-0 h-0" />;

                        return (
                          <div key={level} className="relative flex flex-col items-center">
                            {isCurrent && (
                              <div className="absolute -top-14 w-12 h-12 bg-white rounded-full p-1 shadow-lg border-2 border-purple-500 z-20 animate-bounce">
                                <img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Qian" alt="avatar" className="w-full h-full object-cover bg-blue-50 rounded-full" />
                              </div>
                            )}
                            <div className={\`w-5 h-5 rounded-full border-4 \${isPassed ? 'bg-purple-500 border-purple-500' : isCurrent ? 'bg-white border-purple-500 scale-125 shadow-md' : 'bg-slate-200 border-slate-300'} transition-all\`}></div>
                            <span className={\`absolute top-8 text-[12px] font-black \${isPassed || isCurrent ? 'text-purple-600' : 'text-slate-400'}\`}>
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
          </div>
        ` + content.substring(endIndex);
  fs.writeFileSync('src/App.tsx', newContent);
  console.log('Successfully replaced content');
} else {
  console.log('Could not find start or end string');
}

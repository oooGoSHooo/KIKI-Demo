import React from 'react';
import { Gem, Lock } from 'lucide-react';

type Item = {
  id: string;
  title: string;
  price: number;
  image?: string;
  desc?: string;
  soldOut?: boolean;
};

const SHOP_ITEMS: Item[] = [
  { id: 'i1', title: '魔法放大镜', price: 120, image: '/cards/calculator.png', desc: '放大生词，轻松记忆' },
  { id: 'i2', title: '语音点读器', price: 200, image: '/cards/remote control.png', desc: '智能点读，跟读纠音' },
  { id: 'i3', title: '彩色贴纸包', price: 60, image: '/cards/gel.png', desc: '完成任务可贴卡奖励' },
  { id: 'i4', title: '成长日历', price: 80, image: '/cards/invention.png', desc: '记录每一天的小进步' },
  { id: 'i5', title: '神奇画笔', price: 150, image: '/cards/hate.png', desc: '绘本涂色与创作工具' },

  // Sold out
  { id: 's1', title: '限量贴纸-独角兽', price: 0, image: '/cards/remote control.png', desc: '已售罄', soldOut: true },
  { id: 's2', title: 'VIP 头像框', price: 0, image: '/cards/calculator.png', desc: '已售罄', soldOut: true },
  { id: 's3', title: '限量电子书', price: 0, image: '/cards/invention.png', desc: '已售罄', soldOut: true },
];

const Shop: React.FC<{ onBack?: () => void }> = () => {
  const selling = SHOP_ITEMS.filter(i => !i.soldOut).slice(0, 5);
  const sold = SHOP_ITEMS.filter(i => i.soldOut).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-6">
        <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center space-x-3"><Gem className="text-blue-500" /> <span>售卖中</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selling.map(item => (
            <div key={item.id} className="relative bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col">
              <div className="w-full h-40 bg-slate-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
              </div>
              <h4 className="font-black text-slate-800 text-lg mb-1">{item.title}</h4>
              <p className="text-slate-500 text-sm mb-3 flex-1">{item.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gem className="text-blue-400" />
                  <span className="font-black text-blue-600">{item.price}</span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">购买</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center space-x-3"><Lock className="text-slate-400" /> <span>已售罄</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sold.map(item => (
            <div key={item.id} className="relative bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col opacity-60">
              <div className="w-full h-36 bg-slate-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
              </div>
              <h4 className="font-black text-slate-800 text-lg mb-1">{item.title}</h4>
              <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
              <div className="flex items-center justify-between">
                <div className="text-slate-400 font-bold">已售罄</div>
                <button disabled className="bg-slate-300 text-white px-4 py-2 rounded-lg font-bold cursor-not-allowed">售罄</button>
              </div>
              <div className="absolute inset-0 bg-white/40 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Shop;

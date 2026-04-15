import React from "react";
import {
  Footprints,
  Gift,
  Mic,
  Sunrise,
  Gem,
  Ear,
  BookOpen,
  Repeat,
  CalendarCheck,
  ShoppingBag,
  Palette,
  Calendar as CalendarIcon,
  Zap,
  Star,
  Medal,
  Crown,
  Target,
  Rocket,
  ShieldCheck,
} from "lucide-react";

export const AVATAR_SEEDS = [
  "Mimi", "Coco", "Lola", "Felix", "Bella", "Lucy", "Max", "Charlie", "Daisy", "Buddy",
  "Rocky", "Luna", "Milo", "Chloe", "Toby", "Bailey", "Rosie", "Bear", "Sophie", "Buster",
  "Zoe", "Duke", "Stella", "Jack", "Penny", "Oliver", "Ruby", "Leo", "Mia", "Zeus",
];

export const NAME_ADJS = [
  "快乐的", "聪明的", "勇敢的", "可爱的", "神奇的", "闪亮的", "调皮的", "乖巧的", "活泼的", "酷酷的",
];

export const NAME_NOUNS = [
  "小猫", "小狗", "兔子", "狮子", "老虎", "熊猫", "考拉", "海豚", "企鹅", "恐龙",
];

export const TASK_DATA = [
  {
    id: "listen",
    name: "听 (LISTEN)",
    color: "#3b82f6",
    icon: "🎧",
    subs: ["视频", "单词卡", "电子书", "绘本跟读"],
    rewardName: "听力能量包",
  },
  {
    id: "speak",
    name: "说 (SPEAK)",
    color: "#22c55e",
    icon: "🎙️",
    subs: ["练习-单选", "练习-多选", "练习-判断", "练习-排序"],
    rewardName: "口语奖励箱",
  },
  {
    id: "read",
    name: "读 (READ)",
    color: "#f59e0b",
    icon: "📖",
    subs: ["认读", "拼读"],
    rewardName: "阅读宝藏库",
  },
  {
    id: "write",
    name: "写 (WRITE)",
    color: "#a855f7",
    icon: "✍️",
    subs: ["排序", "拼写"],
    rewardName: "书写大师杯",
  },
];

export const SUBSCRIPTIONS_LIST = [
  { id: 1, name: "千千妈妈启蒙认知方法课", desc: "家长课", status: "active", expireDate: "2026年12月31日", image: "/icons/1.png" },
  { id: 2, name: "科普英文阅读课", desc: "Little Kids", status: "active", expireDate: "2026年12月31日", image: "/icons/2.png" },
  { id: 3, name: "红火箭分级阅读 黄盒", desc: "5-7级", status: "active", expireDate: "2026年12月31日", image: "/icons/3.png" },
  { id: 4, name: "红火箭分级阅读 蓝盒", desc: "1-4级", status: "expired", expireDate: "已过期", image: "/icons/4.png" },
  { id: 5, name: "红火箭分级阅读", desc: "全套", status: "unpurchased", expireDate: "未购买", image: "/icons/5.png" },
  { id: 6, name: "兰登精品阅读课", desc: "Step into Reading", status: "unpurchased", expireDate: "未购买", image: "/icons/6.png" },
  { id: 7, name: "标准美式发音课+音标课", desc: "千千妈妈", status: "unpurchased", expireDate: "未购买", image: "/icons/7.png" },
  { id: 8, name: "千千妈妈自然拼读课", desc: "核心课程", status: "unpurchased", expireDate: "未购买", image: "/icons/8.png" },
  { id: 9, name: "千千妈妈桥梁书俱乐部", desc: "进阶阅读", status: "unpurchased", expireDate: "未购买", image: "/icons/9.png" },
  { id: 10, name: "苏斯博士绘本小课堂", desc: "Dr. Seuss", status: "unpurchased", expireDate: "未购买", image: "/icons/10.png" },
  { id: 11, name: "听力口语陪跑营 1阶段", desc: "基础启蒙", status: "unpurchased", expireDate: "未购买", image: "/icons/11.png" },
  { id: 12, name: "听力口语陪跑营 2阶段", desc: "进阶提升", status: "unpurchased", expireDate: "未购买", image: "/icons/12.png" },
  { id: 13, name: "听力口语陪跑营 3阶段", desc: "流利表达", status: "unpurchased", expireDate: "未购买", image: "/icons/13.png" },
  { id: 14, name: "听力口语陪跑营 4阶段", desc: "Whiz Kids News", status: "unpurchased", expireDate: "未购买", image: "/icons/14.png" },
  { id: 15, name: "Mia唱童谣", desc: "千千妈妈", status: "unpurchased", expireDate: "未购买", image: "/icons/15.png" },
  { id: 16, name: "章节书俱乐部", desc: "千千妈妈", status: "unpurchased", expireDate: "未购买", image: "/icons/16.png" },
  { id: 17, name: "Awesome Leveled Readers", desc: "字母课", status: "unpurchased", expireDate: "未购买", image: "/icons/17.png" },
  { id: 18, name: "字母启蒙精品课", desc: "Awesome Alphabet", status: "unpurchased", expireDate: "未购买", image: "/icons/18.png" },
  { id: 19, name: "高频词课", desc: "Awesome Sight Words", status: "unpurchased", expireDate: "未购买", image: "/icons/19.png" },
  { id: 20, name: "剑桥英语精品课 KET-PET", desc: "A2+", status: "unpurchased", expireDate: "未购买", image: "/icons/20.png" },
  { id: 21, name: "剑桥英语精品课 PET-FCE", desc: "B1+", status: "unpurchased", expireDate: "未购买", image: "/icons/21.png" },
  { id: 22, name: "剑桥英语精品课 KET", desc: "A1-A2", status: "unpurchased", expireDate: "未购买", image: "/icons/22.png" },
  { id: 23, name: "卓越KPF考冲班 FCE", desc: "考前冲刺", status: "unpurchased", expireDate: "未购买", image: "/icons/23.png" },
  { id: 24, name: "卓越KPF考冲班 KET", desc: "考前冲刺", status: "unpurchased", expireDate: "未购买", image: "/icons/24.png" },
  { id: 25, name: "卓越KPF考冲班 PET", desc: "考前冲刺", status: "unpurchased", expireDate: "未购买", image: "/icons/25.png" },
];

export const ACHIEVEMENTS_LIST = [
  { id: "a1", name: "第一步", intro: "开启奇妙探险的第一步！", iconBg: "bg-blue-100", iconColor: "text-blue-500", IconComponent: Footprints, acquired: true },
  { id: "a2", name: "宝箱开启者", intro: "这里面藏着魔法！", iconBg: "bg-amber-100", iconColor: "text-amber-500", IconComponent: Gift, acquired: true },
  { id: "a3", name: "开口第一声", intro: "勇敢地说出来吧。", iconBg: "bg-green-100", iconColor: "text-green-500", IconComponent: Mic, acquired: true },
  { id: "a4", name: "三日晨光", intro: "连续三天保持探险状态。", iconBg: "bg-orange-100", iconColor: "text-orange-500", IconComponent: Sunrise, acquired: true },
  { id: "a5", name: "第一桶金", intro: "赚到了第一份学费(500钻)。", iconBg: "bg-yellow-100", iconColor: "text-yellow-600", IconComponent: Gem, acquired: true },
  { id: "a6", name: "小耳朵L1", intro: "我在认真听哦！(10个任务)", iconBg: "bg-indigo-100", iconColor: "text-indigo-500", IconComponent: Ear, acquired: true },
  { id: "a7", name: "读书笔记", intro: "绘本里有大世界。(5个任务)", iconBg: "bg-teal-100", iconColor: "text-teal-500", IconComponent: BookOpen, acquired: true },
  { id: "a8", name: "复读机", intro: "听一遍，再说一遍。(重试3次)", iconBg: "bg-purple-100", iconColor: "text-purple-500", IconComponent: Repeat, acquired: true },
  { id: "a9", name: "补救专家", intro: "哪怕迟到，也要赶到。", iconBg: "bg-rose-100", iconColor: "text-rose-500", IconComponent: CalendarCheck, acquired: true },
  { id: "a10", name: "疯狂购物", intro: "我要把商场搬回家。", iconBg: "bg-pink-100", iconColor: "text-pink-500", IconComponent: ShoppingBag, acquired: true },
  { id: "a11", name: "字母小画家", intro: "认识了26个好朋友。", iconBg: "bg-cyan-100", iconColor: "text-cyan-500", IconComponent: Palette, acquired: true },
  { id: "a12", name: "七日之约", intro: "第一个完整的一周。", iconBg: "bg-lime-100", iconColor: "text-lime-600", IconComponent: CalendarIcon, acquired: true },
  { id: "b1", name: "习惯的魔力", intro: "21天，你变强了！", iconBg: "bg-red-200", iconColor: "text-red-600", IconComponent: Zap, acquired: false },
  { id: "b2", name: "金牌小声优", intro: "你的声音真好听(10次优)。", iconBg: "bg-fuchsia-200", iconColor: "text-fuchsia-600", IconComponent: Star, acquired: false },
  { id: "b3", name: "学霸之星", intro: "连续30天不间断学习。", iconBg: "bg-yellow-200", iconColor: "text-yellow-600", IconComponent: Medal, acquired: false },
  { id: "b4", name: "全能王", intro: "听、说、读、写全部精通。", iconBg: "bg-indigo-200", iconColor: "text-indigo-600", IconComponent: Crown, acquired: false },
  { id: "b5", name: "精准打击", intro: "练习正确率达到100%。", iconBg: "bg-emerald-200", iconColor: "text-emerald-600", IconComponent: Target, acquired: false },
  { id: "b6", name: "光速少年", intro: "在最短时间内完成任务。", iconBg: "bg-blue-200", iconColor: "text-blue-600", IconComponent: Rocket, acquired: false },
  { id: "b7", name: "知识守护者", intro: "累计复习次数达到100次。", iconBg: "bg-slate-200", iconColor: "text-slate-600", IconComponent: ShieldCheck, acquired: false },
];

export const MOCK_HISTORY_STATUS: Record<number, number> = {
  1: 2,
  2: 2,
  3: 1,
  4: 0,
  5: 2,
  6: 2,
  7: 2,
  8: 1,
  9: 0,
  10: 2,
  11: 2,
  12: 2,
  13: 1,
};

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  Volume2,
  Mic,
  BookOpen,
  CheckCircle2,
  Star,
  Trophy,
  ArrowRight,
  RefreshCw,
  User,
  GraduationCap,
  Target,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

import {
  AgeGroup,
  ExpLevel,
  TestState,
  calculateFinalLevel,
  LEVEL_MAP,
  AbilityTestResult,
} from "./types";

// --- Mock Data (kept from the provided test project) ---
const LISTENING_QUESTIONS = [
  { id: 1, audio: "Apple", options: ["🍎", "🍌", "🍇"], correct: 0 },
  {
    id: 2,
    audio: "The cat is on the mat",
    options: ["🐱🛋️", "🐱📦", "🐱🌳"],
    correct: 0,
  },
  { id: 3, audio: "Where is the library?", options: ["📚", "🍔", "⚽"], correct: 0 },
  {
    id: 4,
    audio: "I like swimming in summer",
    options: ["🏊‍♂️☀️", "⛷️❄️", "🍂🍁"],
    correct: 0,
  },
  {
    id: 5,
    audio: "The weather forecast says it will rain",
    options: ["☀️", "🌧️", "☁️"],
    correct: 1,
  },
];

const VOCAB_QUESTIONS: Record<
  "A" | "B" | "C",
  Array<{ word: string; options: string[]; correct: number }>
> = {
  A: [
    { word: "Dog", options: ["🐕", "🐈", "🐘"], correct: 0 },
    { word: "Blue", options: ["🔴", "🔵", "🟡"], correct: 1 },
    { word: "Three", options: ["1", "2", "3"], correct: 2 },
    { word: "Happy", options: ["😊", "😢", "😡"], correct: 0 },
  ],
  B: [
    { word: "Elephant", options: ["🐘", "🦒", "🦓"], correct: 0 },
    { word: "Mountain", options: ["🌊", "⛰️", "🔥"], correct: 1 },
    { word: "Scientist", options: ["👨‍🔬", "👨‍🍳", "👨‍🎨"], correct: 0 },
    { word: "Library", options: ["🏥", "🏫", "📚"], correct: 2 },
  ],
  C: [
    { word: "Environment", options: ["🌍", "🏢", "🚗"], correct: 0 },
    { word: "Architecture", options: ["🏛️", "🎨", "🎵"], correct: 0 },
    { word: "Philosophy", options: ["🤔", "🏃", "🍽️"], correct: 0 },
    { word: "Sustainability", options: ["♻️", "💰", "⚔️"], correct: 0 },
  ],
};

const READING_QUESTIONS = [
  {
    text: "The sun is very hot. It gives us light and warmth. Plants need the sun to grow.",
    question: "What does the sun give us?",
    options: ["Rain and snow", "Light and warmth", "Food and water"],
    correct: 1,
  },
];

const ORAL_QUESTIONS = [
  { text: "Hello, how are you?", translation: "你好，你好吗？" },
  { text: "I like eating red apples.", translation: "我喜欢吃红苹果。" },
  { text: "The weather is very nice today.", translation: "今天天气很好。" },
  { text: "Can you help me find my cat?", translation: "你能帮我找我的猫吗？" },
];

const GRAMMAR_QUESTIONS = [
  { sentence: "She ___ to school every day.", options: ["go", "goes", "going"], correct: 1 },
  { sentence: "They ___ playing football now.", options: ["is", "am", "are"], correct: 2 },
];

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
    <motion.div
      className="h-full bg-emerald-500"
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ duration: 0.5 }}
    />
  </div>
);

const Card = ({ children, onClick, active, className = "" }: any) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
      active
        ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100"
        : "border-gray-100 bg-white"
    } ${className}`}
  >
    {children}
  </motion.div>
);

export type EnglishProficiencyTestProps = {
  onComplete: (result: AbilityTestResult) => void;
  onBack?: () => void;
};

const EMPTY_TEST_STATE: TestState = {
  ageGroup: null,
  expLevel: null,
  goal: null,
  listeningScore: 0,
  oralScore: null,
  vocabScore: 0,
  readingScore: null,
  grammarScore: null,
  oralTriggered: false,
  readingTriggered: false,
  grammarTriggered: false,
  vocabStartRange: "A",
};

export function EnglishProficiencyTest({ onComplete, onBack }: EnglishProficiencyTestProps) {
  const [step, setStep] = useState<"welcome" | "questionnaire" | "listening" | "oral" | "vocab" | "reading" | "grammar" | "result">(
    "welcome",
  );
  const [testState, setTestState] = useState<TestState>(EMPTY_TEST_STATE);

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [tempScore, setTempScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const lastCompleteRef = useRef(false);

  useEffect(() => {
    const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getOverallProgress = () => {
    const progressMap: Record<string, number> = {
      welcome: 0,
      questionnaire: 10,
      listening: 25,
      oral: 40,
      vocab: 60,
      reading: 80,
      grammar: 95,
      result: 100,
    };
    return progressMap[step] || 0;
  };

  const resetAll = () => {
    lastCompleteRef.current = false;
    setStep("welcome");
    setTestState(EMPTY_TEST_STATE);
    setCurrentQuestionIdx(0);
    setTempScore(0);
    setIsRecording(false);
  };

  // --- Handlers ---
  const startTest = () => setStep("questionnaire");

  const handleQuestionnaireSubmit = () => {
    setStep("listening");
    setCurrentQuestionIdx(0);
    setTempScore(0);
  };

  const handleListeningAnswer = (isCorrect: boolean) => {
    const newScore = isCorrect ? tempScore + 1 : tempScore;
    if (currentQuestionIdx < LISTENING_QUESTIONS.length - 1) {
      setTempScore(newScore);
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      const finalListeningScore = newScore;
      const oralTrigger = finalListeningScore >= 2;
      let vocabRange: "A" | "B" | "C" = "A";
      if (finalListeningScore >= 4) vocabRange = "C";
      else if (finalListeningScore >= 2) vocabRange = "B";

      setTestState((prev) => ({
        ...prev,
        listeningScore: finalListeningScore,
        oralTriggered: oralTrigger,
        vocabStartRange: vocabRange,
      }));

      if (oralTrigger) {
        setStep("oral");
      } else {
        setStep("vocab");
      }
      setCurrentQuestionIdx(0);
      setTempScore(0);
    }
  };

  const handleOralComplete = () => {
    if (currentQuestionIdx < ORAL_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setTestState((prev) => ({ ...prev, oralScore: 0.85 }));
      setStep("vocab");
      setCurrentQuestionIdx(0);
      setTempScore(0);
    }
  };

  const handleVocabAnswer = (isCorrect: boolean) => {
    const questions = VOCAB_QUESTIONS[testState.vocabStartRange];
    const newScore = isCorrect ? tempScore + 1 : tempScore;

    if (currentQuestionIdx < questions.length - 1) {
      setTempScore(newScore);
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      const finalVocabScore = newScore / questions.length;
      const readingTrigger = finalVocabScore >= 0.5;

      setTestState((prev) => ({
        ...prev,
        vocabScore: finalVocabScore,
        readingTriggered: readingTrigger,
      }));

      if (readingTrigger) setStep("reading");
      else setStep("result");

      setCurrentQuestionIdx(0);
      setTempScore(0);
    }
  };

  const handleReadingAnswer = (isCorrect: boolean) => {
    const newScore = isCorrect ? tempScore + 1 : tempScore;
    if (currentQuestionIdx < READING_QUESTIONS.length - 1) {
      setTempScore(newScore);
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      const finalReadingScore = newScore / READING_QUESTIONS.length;
      const grammarTrigger = finalReadingScore >= 0.5;
      setTestState((prev) => ({
        ...prev,
        readingScore: finalReadingScore,
        grammarTriggered: grammarTrigger,
      }));

      if (grammarTrigger) setStep("grammar");
      else setStep("result");

      setCurrentQuestionIdx(0);
      setTempScore(0);
    }
  };

  const handleGrammarAnswer = (isCorrect: boolean) => {
    const newScore = isCorrect ? tempScore + 1 : tempScore;
    if (currentQuestionIdx < GRAMMAR_QUESTIONS.length - 1) {
      setTempScore(newScore);
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      const finalGrammarScore = newScore / GRAMMAR_QUESTIONS.length;
      setTestState((prev) => ({ ...prev, grammarScore: finalGrammarScore }));
      setStep("result");
      setCurrentQuestionIdx(0);
      setTempScore(0);
    }
  };

  useEffect(() => {
    if (step === "result") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#6ee7b7"],
      });
    }
  }, [step]);

  // --- Renderers ---
  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center h-full px-[6%] gap-4 md:gap-8 bg-gradient-to-br from-emerald-50 to-white overflow-y-auto py-4">
      <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center max-w-xl">
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-emerald-500 rounded-xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-6 shadow-xl shadow-emerald-100 mx-auto">
          <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
        </div>
        <p className="text-gray-500 text-sm sm:text-base md:text-xl leading-relaxed max-w-xs mx-auto mb-3 md:mb-6">
          开启宝贝的英语探索之旅，只需10分钟，精准定位学习起点。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs sm:text-sm md:text-base text-emerald-600 font-bold">
          <span className="flex items-center gap-1 md:gap-2">
            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> 自适应题库
          </span>
          <span className="flex items-center gap-1 md:gap-2">
            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> AI 口语评测
          </span>
        </div>
      </motion.div>

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-sm">
        <div className="space-y-3 md:space-y-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startTest}
            className="w-full py-3 sm:py-4 md:py-6 bg-emerald-500 text-white rounded-xl md:rounded-[2rem] font-black text-base sm:text-lg md:text-2xl shadow-2xl shadow-emerald-200 flex items-center justify-center gap-2 md:gap-4 transition-colors"
          >
            开始定级测试 <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
          </motion.button>
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <p className="text-center text-[8px] md:text-xs text-gray-400 uppercase tracking-[0.3em] font-bold">
              Professional Assessment System
            </p>
            <div className="h-0.5 w-12 md:w-20 bg-emerald-100 rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderQuestionnaire = () => (
    <div className="px-[4%] py-2 md:px-[8%] md:py-6 h-full flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-2 md:mb-6 shrink-0">
        <h2 className="text-lg md:text-3xl font-black flex items-center gap-2 md:gap-4 text-gray-900">
          <div className="w-7 h-7 md:w-10 md:h-10 bg-emerald-100 rounded-lg md:rounded-xl flex items-center justify-center">
            <User className="text-emerald-600 w-4 h-4 md:w-6 md:h-6" />
          </div>
          宝贝基本信息
        </h2>
        <div className="text-gray-400 font-bold tracking-widest text-[7px] md:text-xs uppercase">Step 01 / 05</div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 md:gap-12 min-h-0">
        <section className="flex flex-col min-h-0">
          <label className="block text-[9px] md:text-xs font-black text-gray-400 mb-2 md:mb-4 uppercase tracking-[0.2em] shrink-0">
            孩子年龄段
          </label>
          <div className="grid grid-cols-2 gap-2 md:gap-4 overflow-y-auto pr-1 custom-scrollbar">
            {[
              { label: "2-4岁", val: AgeGroup.Toddler },
              { label: "5-7岁", val: AgeGroup.Young },
              { label: "8-10岁", val: AgeGroup.Middle },
              { label: "11-12岁", val: AgeGroup.Older },
            ].map((item) => (
              <Card
                key={item.val}
                active={testState.ageGroup === item.val}
                onClick={() => setTestState((p) => ({ ...p, ageGroup: item.val }))}
                className="flex items-center justify-center text-xs md:text-xl font-black py-3 md:py-8"
              >
                {item.label}
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col min-h-0">
          <label className="block text-[9px] md:text-xs font-black text-gray-400 mb-2 md:mb-4 uppercase tracking-[0.2em] shrink-0">
            英语学习经历
          </label>
          <div className="space-y-2 md:space-y-3 overflow-y-auto pr-1 custom-scrollbar">
            {[
              { label: "完全零基础，从没学过", val: ExpLevel.Zero },
              { label: "在家听过一些英语歌/动画", val: ExpLevel.Exposure },
              { label: "幼儿园/早教有接触过英语", val: ExpLevel.Early },
              { label: "上过英语培训班或外教课", val: ExpLevel.Training },
              { label: "一直在系统学英语", val: ExpLevel.Systematic },
            ].map((item) => (
              <Card
                key={item.val}
                active={testState.expLevel === item.val}
                onClick={() => setTestState((p) => ({ ...p, expLevel: item.val }))}
                className="flex items-center justify-between py-2 px-3 md:py-4 md:px-6"
              >
                <span className="font-bold text-[10px] md:text-lg">{item.label}</span>
                {testState.expLevel === item.val && <CheckCircle2 className="text-emerald-500 w-3 h-3 md:w-6 md:h-6" />}
              </Card>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-3 md:mt-6 flex justify-end shrink-0">
        <motion.button
          disabled={!testState.ageGroup || testState.expLevel === null}
          onClick={handleQuestionnaireSubmit}
          className="px-6 py-2 md:px-16 md:py-4 bg-emerald-500 text-white rounded-lg md:rounded-2xl font-black text-xs md:text-xl shadow-xl disabled:opacity-30 disabled:shadow-none transition-all flex items-center gap-2 md:gap-4"
        >
          进入测试 <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
        </motion.button>
      </div>
    </div>
  );

  const renderListening = () => {
    const q = LISTENING_QUESTIONS[currentQuestionIdx];
    return (
      <div className="px-[4%] py-2 md:px-[8%] md:py-6 h-full flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-2 md:mb-6 shrink-0">
          <div className="flex items-center gap-2 md:gap-6">
            <span className="bg-emerald-100 text-emerald-600 px-2 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl font-black text-[10px] md:text-base flex items-center gap-1 md:gap-2">
              <Volume2 className="w-3 h-3 md:w-5 md:h-5" /> 听力筛选
            </span>
            <span className="text-gray-400 font-black text-[9px] md:text-lg tracking-widest uppercase">
              Q{currentQuestionIdx + 1} / {LISTENING_QUESTIONS.length}
            </span>
          </div>
          <div className="w-24 md:w-80">
            <ProgressBar current={currentQuestionIdx + 1} total={LISTENING_QUESTIONS.length} />
          </div>
        </div>

        <div className="flex-1 flex gap-4 md:gap-16 items-center min-h-0">
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-56 md:h-56 bg-emerald-500 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-xl md:shadow-2xl shadow-emerald-200 mb-2 md:mb-6"
            >
              <Volume2 className="w-10 h-10 md:w-28 md:h-28 text-white" />
            </motion.button>
            <p className="text-gray-400 font-black text-[8px] md:text-lg uppercase tracking-widest">点击播放音频</p>
          </div>

          <div className="flex-[1.5] grid grid-cols-3 gap-2 md:gap-6 overflow-y-auto pr-1 custom-scrollbar max-h-full py-2">
            {q.options.map((opt, idx) => (
              <Card
                key={idx}
                onClick={() => handleListeningAnswer(idx === q.correct)}
                className="aspect-square flex items-center justify-center text-2xl sm:text-3xl md:text-7xl"
              >
                {opt}
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderOral = () => {
    const q = ORAL_QUESTIONS[currentQuestionIdx];
    return (
      <div className="px-[4%] py-2 md:px-[8%] md:py-6 h-full flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-2 md:mb-6 shrink-0">
          <div className="flex items-center gap-2 md:gap-6">
            <span className="bg-emerald-100 text-emerald-600 px-2 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl font-black text-[10px] md:text-base flex items-center gap-1 md:gap-2">
              <Mic className="w-3 h-3 md:w-5 md:h-5" /> 口语跟读
            </span>
            <span className="text-gray-400 font-black text-[9px] md:text-lg tracking-widest uppercase">
              Q{currentQuestionIdx + 1} / {ORAL_QUESTIONS.length}
            </span>
          </div>
          <div className="w-24 md:w-80">
            <ProgressBar current={currentQuestionIdx + 1} total={ORAL_QUESTIONS.length} />
          </div>
        </div>

        <div className="flex-1 flex gap-6 md:gap-16 items-center min-h-0">
          <div className="flex-1 text-left">
            <h2 className="text-[10px] md:text-xl font-black text-gray-400 mb-1 md:mb-2 uppercase tracking-[0.2em]">
              Please repeat:
            </h2>
            <p className="text-xl sm:text-2xl md:text-5xl font-black text-emerald-600 leading-tight tracking-tight italic mb-2 md:mb-4">
              "{q.text}"
            </p>
            <p className="text-gray-400 text-[10px] md:text-lg font-bold">{q.translation}</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative mb-3 md:mb-8">
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2.2, opacity: 0.1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-emerald-400 rounded-full"
                  />
                )}
              </AnimatePresence>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => {
                  setIsRecording(false);
                  handleOralComplete();
                }}
                onTouchStart={() => setIsRecording(true)}
                onTouchEnd={() => {
                  setIsRecording(false);
                  handleOralComplete();
                }}
                className={`w-20 h-20 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-xl md:shadow-[0_15px_40px_rgba(0,0,0,0.1)] relative z-10 transition-all duration-300 ${
                  isRecording ? "bg-red-500 scale-110" : "bg-emerald-500"
                }`}
              >
                <Mic className="w-7 h-7 md:w-16 md:h-16 text-white" />
              </motion.button>
            </div>
            <p className="text-gray-500 font-black text-[10px] md:text-lg tracking-wide">长按按钮开始录音</p>
          </div>
        </div>
      </div>
    );
  };

  const renderVocab = () => {
    const questions = VOCAB_QUESTIONS[testState.vocabStartRange];
    const q = questions[currentQuestionIdx];
    return (
      <div className="px-[4%] py-2 md:px-[8%] md:py-6 h-full flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-2 md:mb-6 shrink-0">
          <div className="flex items-center gap-2 md:gap-6">
            <span className="bg-emerald-100 text-emerald-600 px-2 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl font-black text-[10px] md:text-base flex items-center gap-1 md:gap-2">
              <BookOpen className="w-3 h-3 md:w-5 md:h-5" /> 词汇自适应
            </span>
            <span className="text-gray-400 font-black text-[9px] md:text-lg tracking-widest uppercase">
              Q{currentQuestionIdx + 1} / {questions.length}
            </span>
          </div>
          <div className="w-24 md:w-80">
            <ProgressBar current={currentQuestionIdx + 1} total={questions.length} />
          </div>
        </div>

        <div className="flex-1 flex gap-4 md:gap-16 items-center min-h-0">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-emerald-50 w-full aspect-video rounded-xl md:rounded-[2.5rem] flex items-center justify-center mb-2 md:mb-4 border-2 md:border-4 border-emerald-100 shadow-inner">
              <h2 className="text-xl sm:text-3xl md:text-6xl font-black text-emerald-600 tracking-tighter">{q.word}</h2>
            </div>
            <p className="text-gray-400 font-black text-[8px] md:text-lg uppercase tracking-widest">这个单词是什么意思？</p>
          </div>

          <div className="flex-[1.5] grid grid-cols-2 gap-2 md:gap-6 overflow-y-auto pr-1 custom-scrollbar py-2">
            {q.options.map((opt, idx) => (
              <Card
                key={idx}
                onClick={() => handleVocabAnswer(idx === q.correct)}
                className="h-14 sm:h-16 md:h-32 flex items-center justify-center text-lg sm:text-xl md:text-5xl"
              >
                {opt}
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const finalLevel = calculateFinalLevel(testState);
    const levelLabel = LEVEL_MAP[`L${finalLevel}`];

    const handleComplete = () => {
      // 防止连点重复回调
      if (lastCompleteRef.current) return;
      lastCompleteRef.current = true;
      onComplete({ finalLevel, testState });
    };

    return (
      <div className="px-[4%] py-2 md:px-[8%] md:py-6 h-full flex gap-4 md:gap-10 items-center bg-gradient-to-br from-emerald-50 to-white overflow-y-auto custom-scrollbar max-w-7xl ml-0 mr-auto w-full">
        <div className="flex-1 text-center min-w-[180px]">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="relative inline-block mb-2 md:mb-6"
          >
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36 text-yellow-400 mx-auto drop-shadow-2xl" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 md:border-6 border-dashed border-yellow-200/50 rounded-full -m-1 md:-m-6"
            />
          </motion.div>
          <h2 className="text-lg sm:text-xl md:text-4xl font-black text-gray-900 mb-1 md:mb-2 tracking-tight">定级测试完成！</h2>
          <p className="text-gray-400 text-[10px] sm:text-xs md:text-lg font-bold">宝贝太棒了，为你点赞</p>
        </div>

        <div className="flex-[1.5] flex flex-col gap-2 md:gap-6 min-w-[240px]">
          <div className="bg-white rounded-xl md:rounded-[2.5rem] p-3 md:p-8 border-2 md:border-4 border-emerald-100 flex items-center justify-between shadow-xl md:shadow-2xl shadow-emerald-100/50">
            <div className="text-left">
              <p className="text-[7px] md:text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-1 md:mb-2">当前定级结果</p>
              <div className="flex items-baseline gap-1 md:gap-3">
                <h3 className="text-2xl sm:text-3xl md:text-6xl font-black text-gray-900 tracking-tighter">Level {finalLevel}</h3>
                <span className="text-[10px] sm:text-xs md:text-xl font-black text-emerald-600 opacity-60">{levelLabel}</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-24 md:h-24 bg-emerald-50 rounded-lg md:rounded-3xl flex items-center justify-center shadow-inner">
              <Star className="w-5 h-5 sm:w-7 sm:h-7 md:w-12 md:h-12 text-yellow-400 fill-yellow-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="bg-white p-2 md:p-4 rounded-lg md:rounded-2xl border-2 border-gray-50 flex flex-col gap-1 md:gap-2 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-[7px] md:text-sm font-black text-gray-400 uppercase tracking-widest">听力理解</span>
                <span className="text-emerald-600 font-black text-[10px] md:text-xl">{testState.listeningScore}/5</span>
              </div>
              <div className="h-1 md:h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(testState.listeningScore / 5) * 100}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
            <div className="bg-white p-2 md:p-4 rounded-lg md:rounded-2xl border-2 border-gray-50 flex flex-col gap-1 md:gap-2 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-[7px] md:text-sm font-black text-gray-400 uppercase tracking-widest">词汇储备</span>
                <span className="text-emerald-600 font-black text-[10px] md:text-xl">{Math.round(testState.vocabScore * 100)}%</span>
              </div>
              <div className="h-1 md:h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${testState.vocabScore * 100}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 md:gap-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              className="flex-1 py-2 md:py-5 bg-emerald-500 text-white rounded-lg md:rounded-2xl font-black text-xs md:text-xl shadow-xl md:shadow-2xl shadow-emerald-200 flex items-center justify-center gap-2 md:gap-4"
            >
              领取学习计划 <ArrowRight className="w-3 h-3 md:w-6 md:h-6" />
            </motion.button>
            <motion.button
              onClick={resetAll}
              className="px-3 py-2 md:px-8 md:py-5 bg-white text-emerald-500 border-2 md:border-4 border-emerald-100 rounded-lg md:rounded-2xl font-black transition-all"
            >
              <RefreshCw className="w-3 h-3 md:w-6 md:h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  const renderReading = () => {
    return (
      <div className="px-[4%] py-2 md:px-[8%] md:py-6 h-full flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-2 md:mb-6 shrink-0">
          <div className="flex items-center gap-2 md:gap-6">
            <span className="bg-emerald-100 text-emerald-600 px-2 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl font-black text-[10px] md:text-base flex items-center gap-1 md:gap-2">
              <BookOpen className="w-3 h-3 md:w-5 md:h-5" /> 阅读理解
            </span>
            <span className="text-gray-400 font-black text-[9px] md:text-lg tracking-widest uppercase">
              Q{currentQuestionIdx + 1} / {READING_QUESTIONS.length}
            </span>
          </div>
          <div className="w-24 md:w-80">
            <ProgressBar current={currentQuestionIdx + 1} total={READING_QUESTIONS.length} />
          </div>
        </div>

        <div className="flex-1 flex gap-4 md:gap-16 items-center min-h-0">
          <div className="flex-1 bg-emerald-50 p-3 md:p-8 rounded-xl md:rounded-[2.5rem] border-2 md:border-4 border-emerald-100 shadow-inner h-full flex flex-col justify-center overflow-y-auto custom-scrollbar">
            <p className="text-sm sm:text-base md:text-2xl font-bold text-gray-800 leading-relaxed italic mb-2 md:mb-6">
              "{READING_QUESTIONS[currentQuestionIdx].text}"
            </p>
            <div className="h-0.5 w-10 md:w-16 bg-emerald-200 rounded-full" />
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-0">
            <h3 className="text-xs sm:text-sm md:text-2xl font-black text-gray-900 mb-2 md:mb-6 leading-tight shrink-0">
              {READING_QUESTIONS[currentQuestionIdx].question}
            </h3>
            <div className="space-y-2 md:space-y-4 overflow-y-auto pr-1 custom-scrollbar py-2">
              {READING_QUESTIONS[currentQuestionIdx].options.map((opt, idx) => (
                <Card
                  key={idx}
                  onClick={() => handleReadingAnswer(idx === READING_QUESTIONS[currentQuestionIdx].correct)}
                  className="py-2 px-3 md:py-4 md:px-8 text-xs sm:text-sm md:text-xl font-bold"
                >
                  {opt}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGrammar = () => {
    return (
      <div className="px-[4%] py-2 md:px-[8%] md:py-6 h-full flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-2 md:mb-6 shrink-0">
          <div className="flex items-center gap-2 md:gap-6">
            <span className="bg-emerald-100 text-emerald-600 px-2 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl font-black text-[10px] md:text-base flex items-center gap-1 md:gap-2">
              <Target className="w-3 h-3 md:w-5 md:h-5" /> 语法筛选
            </span>
            <span className="text-gray-400 font-black text-[9px] md:text-lg tracking-widest uppercase">
              Q{currentQuestionIdx + 1} / {GRAMMAR_QUESTIONS.length}
            </span>
          </div>
          <div className="w-24 md:w-80">
            <ProgressBar current={currentQuestionIdx + 1} total={GRAMMAR_QUESTIONS.length} />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto custom-scrollbar px-2">
          <div className="bg-emerald-50 w-full max-w-3xl p-3 md:p-10 rounded-xl md:rounded-[2.5rem] border-2 md:border-4 border-emerald-100 mb-3 md:mb-8 text-center shrink-0">
            <h2 className="text-lg sm:text-xl md:text-4xl font-black text-emerald-600 tracking-tight leading-tight">
              {GRAMMAR_QUESTIONS[currentQuestionIdx].sentence.split("___").map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="inline-block w-6 md:w-24 h-0.5 bg-emerald-400 mx-1 md:mx-3 align-middle" />
                  )}
                </React.Fragment>
              ))}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 w-full max-w-3xl py-2">
            {GRAMMAR_QUESTIONS[currentQuestionIdx].options.map((opt, idx) => (
              <Card
                key={idx}
                onClick={() => handleGrammarAnswer(idx === GRAMMAR_QUESTIONS[currentQuestionIdx].correct)}
                className="py-2 md:py-6 text-xs sm:text-sm md:text-2xl font-black flex items-center justify-center"
              >
                {opt}
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-white font-sans antialiased overflow-hidden relative">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-[200] w-10 h-10 bg-white/90 rounded-full shadow-md border border-emerald-100 flex items-center justify-center text-emerald-600 active:scale-95"
          aria-label="Back"
        >
          <X size={20} />
        </button>
      )}

      {/* Orientation Lock Overlay */}
      <AnimatePresence>
        {isPortrait && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-emerald-500 flex flex-col items-center justify-center text-white p-12 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 90, 90, 0] }}
              transition={{ repeat: Infinity, duration: 2, times: [0, 0.4, 0.6, 1] }}
              className="mb-8"
            >
              <RefreshCw className="w-24 h-24" />
            </motion.div>
            <h2 className="text-4xl font-black mb-4">请旋转手机</h2>
            <p className="text-xl font-bold opacity-80">横屏体验更佳哦！</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="h-full w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {step === "welcome" && renderWelcome()}
            {step === "questionnaire" && renderQuestionnaire()}
            {step === "listening" && renderListening()}
            {step === "oral" && renderOral()}
            {step === "vocab" && renderVocab()}
            {step === "reading" && renderReading()}
            {step === "grammar" && renderGrammar()}
            {step === "result" && renderResult()}
          </motion.div>
        </AnimatePresence>

        {/* Overall Progress Bar */}
        {step !== "welcome" && step !== "result" && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 z-50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getOverallProgress()}%` }}
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        )}
      </main>
    </div>
  );
}


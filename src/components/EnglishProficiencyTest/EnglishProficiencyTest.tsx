import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { testModules } from './questions';
import { Button, playClickSound, playSuccessSound } from './Button';
import { AudioPlayer } from './AudioPlayer';
import { Clock, ArrowRight, Mic, CheckCircle2, FileText, X, ArrowLeft } from 'lucide-react';
import {
  AgeGroup,
  ExpLevel,
  TestState,
  AbilityTestResult,
} from './types';

export type EnglishProficiencyTestProps = {
  onComplete: (result: AbilityTestResult) => void;
  onBack?: () => void;
};

type Step = 'questionnaire' | 'transition' | 'test' | 'result';

function mapLevel13to7(level13: number): number {
  return Math.max(1, Math.min(7, Math.round((level13 - 1) / 12 * 6 + 1)));
}

function buildTestState(answers: boolean[]): TestState {
  const listeningAnswers = answers.slice(0, 5);
  const speakingAnswers = answers.slice(5, 8);
  const vocabAnswers = answers.slice(8, 16);
  const readingAnswers = answers.slice(16, 20);
  const grammarAnswers = answers.slice(20, 23);

  const listeningScore = listeningAnswers.filter(Boolean).length;
  const oralScore = speakingAnswers.length > 0
    ? speakingAnswers.filter(Boolean).length / speakingAnswers.length
    : 1.0;
  const vocabScore = vocabAnswers.length > 0
    ? vocabAnswers.filter(Boolean).length / vocabAnswers.length
    : 0;
  const readingScore = readingAnswers.length > 0
    ? readingAnswers.filter(Boolean).length / readingAnswers.length
    : null;
  const grammarScore = grammarAnswers.length > 0
    ? grammarAnswers.filter(Boolean).length / grammarAnswers.length
    : null;

  return {
    ageGroup: null as unknown as AgeGroup,
    expLevel: null as unknown as ExpLevel,
    goal: null,
    listeningScore,
    oralScore,
    vocabScore,
    readingScore,
    grammarScore,
    oralTriggered: speakingAnswers.length > 0,
    readingTriggered: readingAnswers.length > 0,
    grammarTriggered: grammarAnswers.length > 0,
    vocabStartRange: 'A',
  };
}

export function EnglishProficiencyTest({ onComplete, onBack }: EnglishProficiencyTestProps) {
  const [step, setStep] = useState<Step>('questionnaire');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [timeSpent, setTimeSpent] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [showPassage, setShowPassage] = useState(false);
  const resultRef = useRef<AbilityTestResult | null>(null);

  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    const lockOrientation = async () => {
      try {
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock('landscape');
        }
      } catch (e) {}
    };
    document.addEventListener('click', lockOrientation, { once: true });
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      document.removeEventListener('click', lockOrientation);
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'test' || step === 'transition') {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) { clearInterval(timer); setStep('result'); return 0; }
          return prev - 1;
        });
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      if (step === 'test' || step === 'transition') setShowExitModal(true);
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [step]);

  const handleNextQuestion = (isCorrect: boolean) => {
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    const currentModule = testModules[currentModuleIndex];
    if (currentQuestionIndex < currentModule.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentModuleIndex < testModules.length - 1) {
      const nextIdx = currentModuleIndex + 1;
      setCurrentModuleIndex(nextIdx);
      setCurrentQuestionIndex(0);
      setStep('transition');
      if (testModules[nextIdx].id === 'R-1') setShowPassage(true);
    } else {
      const correct = newAnswers.filter(Boolean).length;
      const total = newAnswers.length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      const level13 = Math.max(1, Math.min(13, Math.ceil((accuracy / 100) * 13)));
      resultRef.current = { finalLevel: mapLevel13to7(level13), testState: buildTestState(newAnswers) };
      setStep('result');
    }
  };

  const handleComplete = () => {
    if (resultRef.current) { onComplete(resultRef.current); return; }
    const correct = answers.filter(Boolean).length;
    const total = answers.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const level13 = Math.max(1, Math.min(13, Math.ceil((accuracy / 100) * 13)));
    onComplete({ finalLevel: mapLevel13to7(level13), testState: buildTestState(answers) });
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F7FFF7]">
      <AnimatePresence>
        {isPortrait && (
          <motion.div
            key="portrait-guard"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#ED7470] z-[200] flex flex-col items-center justify-center p-8 text-white text-center"
          >
            <motion.div animate={{ rotate: 90 }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="mb-8">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">请横屏使用</h2>
            <p className="text-xl opacity-90">为了获得最佳测试体验，请将手机横过来哦！</p>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 'questionnaire' && onBack && (
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow"
          aria-label="返回"
        >
          <ArrowLeft size={24} className="text-[#2F3640]" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {step === 'questionnaire' && <Questionnaire key="questionnaire" onStart={() => setStep('transition')} />}
        {step === 'transition' && (
          <TransitionScreen key={'transition-' + currentModuleIndex} moduleIndex={currentModuleIndex} onComplete={() => setStep('test')} />
        )}
        {step === 'test' && showPassage && (
          <PassageScreen key="passage" moduleIndex={currentModuleIndex} onNext={() => setShowPassage(false)} />
        )}
        {step === 'test' && !showPassage && (
          <TestScreen key={'test-' + currentModuleIndex + '-' + currentQuestionIndex} moduleIndex={currentModuleIndex} questionIndex={currentQuestionIndex} onNext={handleNextQuestion} />
        )}
        {step === 'result' && <ResultScreen key="result" answers={answers} timeSpent={timeSpent} onComplete={handleComplete} />}
      </AnimatePresence>

      {(step === 'test' || step === 'transition') && (
        <div className="fixed bottom-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-[#2F3640] font-bold z-50">
          <Clock size={20} className="text-[#ED7470]" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      )}

      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#2F3640]">确认退出？</h2>
            <p className="text-gray-600 mb-8">中断测试需要重新完成整个测试哦！</p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => { playClickSound(); setShowExitModal(false); }}>继续测试</Button>
              <Button variant="primary" className="flex-1" onClick={() => { playClickSound(); setShowExitModal(false); onBack?.(); }}>确认退出</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const Questionnaire: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [subStep, setSubStep] = useState<'cover' | 'age' | 'exp'>('cover');
  const [age, setAge] = useState('');
  const [exp, setExp] = useState('');
  const ages = ['3-5岁', '6-8岁', '9-11岁', '12岁以上'];
  const exps = ['零基础', '不到1年', '1-3年', '3-5年', '5年以上'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-[2rem] p-8 shadow-xl w-full min-h-[400px] flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {subStep === 'cover' && (
              <motion.div key="cover" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-32 h-32 bg-[#ED7470]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">👋</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-[#ED7470]">欢迎参加千千妈妈定级测试</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">为了给孩子匹配最合适的题目，<br />请先完成 2 道小调查哦！</p>
                <div className="flex justify-center gap-6 mb-8">
                  <div className="flex items-center gap-2 text-[#ED7470] font-bold"><CheckCircle2 size={20} /><span>自适应题库</span></div>
                  <div className="flex items-center gap-2 text-[#ED7470] font-bold"><CheckCircle2 size={20} /><span>AI 口语评测</span></div>
                </div>
              </motion.div>
            )}
            {subStep === 'age' && (
              <motion.div key="age" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-8 text-[#2F3640] text-center">1. 孩子的年龄段是？</h2>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {ages.map((a) => (
                    <Button key={a} variant={age === a ? 'secondary' : 'outline'} className="h-14 text-lg rounded-2xl" onClick={() => setAge(a)}>{a}</Button>
                  ))}
                </div>
              </motion.div>
            )}
            {subStep === 'exp' && (
              <motion.div key="exp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-8 text-[#2F3640] text-center">2. 英语学习经历？</h2>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {exps.map((e) => (
                    <Button key={e} variant={exp === e ? 'accent' : 'outline'} className="h-14 text-lg rounded-2xl" onClick={() => setExp(e)}>{e}</Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-6">
          {subStep === 'cover' && (
            <Button variant="primary" size="lg" className="w-64 mx-auto block text-xl rounded-full" onClick={() => { playClickSound(); setSubStep('age'); }}>开始填写问卷</Button>
          )}
          {subStep === 'age' && (
            <>
              <Button variant="primary" size="lg" className="w-64 mx-auto block text-xl rounded-full mb-6" disabled={!age} onClick={() => { playClickSound(); setSubStep('exp'); }}>下一题</Button>
              <div className="flex justify-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ED7470]"></div><div className="w-3 h-3 rounded-full bg-gray-200"></div></div>
            </>
          )}
          {subStep === 'exp' && (
            <>
              <Button variant="primary" size="lg" className="w-64 mx-auto block text-xl rounded-full mb-6" disabled={!exp} onClick={onStart}>完成，开始测试</Button>
              <div className="flex justify-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200"></div><div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div></div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TransitionScreen: React.FC<{ moduleIndex: number; onComplete: () => void }> = ({ moduleIndex, onComplete }) => {
  const module = testModules[moduleIndex];
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { setIsLoaded(true); playSuccessSound(); }, 2000);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-[#4ECDC4] text-white">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-center flex flex-col items-center w-full max-w-2xl">
        <h2 className="text-2xl font-medium mb-2 opacity-80">Module {moduleIndex + 1}</h2>
        <h1 className="text-5xl font-bold mb-24">{module.title}</h1>
        <p className={'text-xl font-medium mb-4 transition-all duration-500' + (!isLoaded ? ' animate-pulse' : '')}>
          {isLoaded ? '开始接受挑战吧～' : 'AI正在为您生成专属题库...'}
        </p>
        <div className="w-1/2 mb-12 relative">
          <div className="h-10 bg-[#8B4513] rounded-full p-1.5 shadow-inner border-4 border-[#D2691E]">
            <motion.div className="h-full bg-[#FFD700] rounded-full relative overflow-hidden bg-striped" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2, ease: 'easeIn' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Button variant="accent" size="lg" className="min-w-[200px] text-xl rounded-full disabled:!text-[#C56F33]" disabled={!isLoaded} onClick={onComplete}>
        {isLoaded ? '开始答题' : '加载中...'}
      </Button>
    </motion.div>
  );
};

const PassageScreen: React.FC<{ moduleIndex: number; onNext: () => void }> = ({ moduleIndex, onNext }) => {
  const passage = testModules[moduleIndex].questions[0].passage;
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
      <motion.div key="passage-screen-root" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="bg-white rounded-[3rem] p-10 shadow-xl w-full flex flex-col items-center">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center"><FileText size={32} className="text-[#4ECDC4]" /></div>
          <h1 className="text-3xl font-bold text-[#2F3640]">阅读文章</h1>
        </div>
        <div className="bg-gray-50 p-8 rounded-3xl mb-10 text-xl text-gray-700 leading-relaxed w-full border-2 border-dashed border-gray-200">{passage}</div>
        <Button variant="primary" size="lg" className="w-full max-w-xs text-xl h-16 rounded-full shadow-lg" onClick={() => { playClickSound(); onNext(); }}>下一步</Button>
      </motion.div>
    </div>
  );
};

const TestScreen: React.FC<{ moduleIndex: number; questionIndex: number; onNext: (isCorrect: boolean) => void }> = ({ moduleIndex, questionIndex, onNext }) => {
  const module = testModules[moduleIndex];
  const question = module.questions[questionIndex];
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showPassagePopup, setShowPassagePopup] = useState(false);

  useEffect(() => {
    setSelectedOptionId(null); setIsRecording(false); setHasRecorded(false); setShowPassagePopup(false);
  }, [questionIndex, moduleIndex]);

  const handleNext = () => {
    if (question.type === 'speaking') { onNext(true); return; }
    onNext(question.options?.find((o) => o.id === selectedOptionId)?.isCorrect || false);
  };

  const handleRecord = () => {
    playClickSound(); setIsRecording(true);
    setTimeout(() => { setIsRecording(false); setHasRecorded(true); playSuccessSound(); }, 3000);
  };

  return (
    <div className={'flex-1 flex flex-col p-6 pb-24 ' + (module.id === 'VA-1' ? 'max-w-6xl' : 'max-w-3xl') + ' mx-auto w-full relative'}>
      <motion.div key={moduleIndex + '-' + questionIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div className="font-bold text-[#4ECDC4] text-lg">{module.title}</div>
          <div className="font-bold text-gray-400">{questionIndex + 1} / {module.questions.length}</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {(question.type === 'listening' || question.type === 'vocabulary' || question.type === 'speaking') && question.audioText && (
            <div className={module.id === 'VA-1' ? 'mb-16' : 'mb-8'}>
              <AudioPlayer text={question.audioText} audio={question.audio} autoPlay={true} />
            </div>
          )}
          {question.text && <h2 className="text-3xl font-bold text-center mb-8 text-[#2F3640] leading-tight">{question.text}</h2>}
          {question.options && (
            <div className={'grid ' + (module.id === 'VA-1' ? 'gap-8' : 'gap-4') + ' w-full ' + (question.options[0].image ? (module.id === 'VA-1' ? 'grid-cols-4' : 'grid-cols-2') : 'grid-cols-1')}>
              {question.options.map((option) => (
                <button key={option.id} onClick={() => { playClickSound(); setSelectedOptionId(option.id); }}
                  className={'relative overflow-hidden rounded-3xl transition-all active:scale-95 ' + (selectedOptionId === option.id ? 'shadow-lg scale-[1.02] bg-[#ED7470]' : 'shadow-sm bg-white')}>
                  {option.image ? (
                    <div className={(module.id === 'VA-1' ? 'aspect-[400/512]' : 'aspect-[4/3]') + ' relative'}>
                      <img src={option.image} alt="Option" className="w-full h-full object-cover" referrerPolicy="no-referrer" draggable="false" />
                      <div className={'absolute inset-0 rounded-[1.4rem] pointer-events-none transition-all z-10 ' + (selectedOptionId === option.id ? 'ring-4 ring-inset ring-[#ED7470]' : 'ring-0')} />
                      {selectedOptionId === option.id && (
                        <div className="absolute inset-0 bg-[#ED7470]/20 flex items-center justify-center z-20">
                          <div className="bg-[#ED7470] text-white rounded-full p-2"><CheckCircle2 size={32} /></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={'p-6 text-xl font-semibold text-center transition-all ' + (selectedOptionId === option.id ? 'text-white' : 'text-[#2F3640]')}>{option.text}</div>
                  )}
                </button>
              ))}
            </div>
          )}
          {question.type === 'speaking' && (
            <div className="flex flex-col items-center gap-6 mt-8">
              <div className="relative">
                <AnimatePresence>
                  {isRecording && (
                    <>
                      <motion.div initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 2, ease: 'easeOut', repeatDelay: 0.5 }} className="absolute inset-0 rounded-full border-4 border-[#FF6B6B]/40 -z-10" />
                      <motion.div initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 2, ease: 'easeOut', delay: 0.5, repeatDelay: 0.5 }} className="absolute inset-0 rounded-full border-4 border-[#FF6B6B]/40 -z-10" />
                    </>
                  )}
                </AnimatePresence>
                <button onClick={handleRecord} disabled={isRecording}
                  className={'w-32 h-32 rounded-full flex items-center justify-center transition-all relative z-10 ' + (isRecording ? 'bg-[#ED7470] text-white scale-110 shadow-[0_0_30px_rgba(237,116,112,0.5)]' : hasRecorded ? 'bg-[#4ECDC4] text-white' : 'bg-white text-[#ED7470] shadow-lg active:scale-95')}>
                  <motion.div animate={isRecording ? { opacity: [1, 0.3, 1] } : { opacity: 1 }} transition={isRecording ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } : {}}>
                    {hasRecorded && !isRecording ? <CheckCircle2 size={48} /> : <Mic size={48} />}
                  </motion.div>
                </button>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-500">{isRecording ? '正在录音...' : hasRecorded ? '录音完成!' : '点击开始跟读'}</p>
                {hasRecorded && !isRecording && (
                  <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-gray-400 mt-1">再次点击按钮开始重新录音。</motion.p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
        <AnimatePresence>
          {question.passage && (
            <motion.div key="passage-btn" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <Button variant="secondary" size="icon" className="w-16 h-16 rounded-full shadow-xl" onClick={() => { playClickSound(); setShowPassagePopup(!showPassagePopup); }}>
                <FileText size={32} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <Button variant="primary" size="icon" className="w-16 h-16 rounded-full shadow-xl" disabled={!(selectedOptionId !== null || hasRecorded)} onClick={handleNext}>
          <ArrowRight size={32} />
        </Button>
      </div>

      <AnimatePresence>
        {showPassagePopup && <motion.div key="passage-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={() => setShowPassagePopup(false)} />}
        {showPassagePopup && (
          <motion.div key="passage-modal" initial={{ opacity: 0, y: 100, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.9 }} className="fixed inset-x-6 bottom-24 top-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-[2.5rem] shadow-2xl z-[101] p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center"><FileText size={20} className="text-[#4ECDC4]" /></div>
                <h3 className="text-2xl font-bold text-[#2F3640]">阅读原文</h3>
              </div>
              <button onClick={() => setShowPassagePopup(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2"><p className="text-xl text-gray-700 leading-relaxed">{question.passage}</p></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultScreen: React.FC<{ answers: boolean[]; timeSpent: number; onComplete: () => void }> = ({ answers, timeSpent, onComplete }) => {
  useEffect(() => {
    playSuccessSound();
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ED7470', '#4ECDC4', '#FFE66D'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ED7470', '#4ECDC4', '#FFE66D'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const correctCount = answers.filter(Boolean).length;
  const total = answers.length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const level = Math.max(1, Math.min(13, Math.ceil((accuracy / 100) * 13)));
  const m = Math.floor(timeSpent / 60);
  const s = timeSpent % 60;

  return (
    <motion.div key="result-screen-root" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FFE66D]">
      <div className="bg-white rounded-[3rem] p-8 shadow-2xl w-full max-w-md text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-[#CA5C55] mb-8">测试完成</h1>
          <div className="bg-[#FFF4C8] rounded-3xl p-6 mb-6 shadow-inner">
            <p className="text-gray-500 font-medium mb-1">你的英语等级是</p>
            <div className="text-6xl font-black text-[#4ECDC4] mb-2 font-sans tracking-tighter">Lv {level}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-2xl p-4"><p className="text-sm text-gray-500 mb-1">正确率</p><p className="text-2xl font-bold text-[#CA5C55]">{accuracy}%</p></div>
            <div className="bg-gray-50 rounded-2xl p-4"><p className="text-sm text-gray-500 mb-1">测试用时</p><p className="text-2xl font-bold text-[#2F3640]">{m}分{s}秒</p></div>
          </div>
          <Button variant="primary" size="lg" className="w-full text-xl h-16 rounded-full" onClick={onComplete}>完成</Button>
        </div>
      </div>
    </motion.div>
  );
};

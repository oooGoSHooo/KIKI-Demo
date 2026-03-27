import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { X, Check, AlertCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

type ExerciseQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: string[];
};

type ExerciseType = '练习-单选' | '练习-多选' | '练习-判断' | '练习-排序';

const EXERCISE_DATA: Record<ExerciseType, ExerciseQuestion[]> = {
  '练习-单选': [
    { id: 1, question: 'Which animal says "Meow"?', options: ['Cat', 'Dog', 'Cow', 'Sheep'], answer: ['Cat'] },
    { id: 2, question: 'What color is an apple?', options: ['Red', 'Blue', 'Black', 'Purple'], answer: ['Red'] },
    { id: 3, question: 'What is in the sky during the day?', options: ['Stars', 'Sun', 'Moon', 'Meteor'], answer: ['Sun'] },
    { id: 4, question: 'Which vehicle flies in the sky?', options: ['Car', 'Ship', 'Airplane', 'Bicycle'], answer: ['Airplane'] },
  ],
  '练习-多选': [
    { id: 1, question: 'Which of these are fruits?', options: ['Apple', 'Cabbage', 'Banana', 'Potato'], answer: ['Apple', 'Banana'] },
    { id: 2, question: 'Which animals live in water?', options: ['Fish', 'Bird', 'Crab', 'Tiger'], answer: ['Fish', 'Crab'] },
    { id: 3, question: 'Which of these are vehicles?', options: ['Bus', 'Apple', 'Train', 'Book'], answer: ['Bus', 'Train'] },
    { id: 4, question: 'Which colors are in a rainbow?', options: ['Red', 'Black', 'Green', 'Gray'], answer: ['Red', 'Green'] },
  ],
  '练习-判断': [
    { id: 1, question: 'The sun rises in the west.', options: ['True', 'False'], answer: ['False'] },
    { id: 2, question: 'There are four seasons in a year.', options: ['True', 'False'], answer: ['True'] },
    { id: 3, question: 'Ice is hot.', options: ['True', 'False'], answer: ['False'] },
    { id: 4, question: 'Birds can fly.', options: ['True', 'False'], answer: ['True'] },
  ],
  '练习-排序': [
    { id: 1, question: 'Order from smallest to largest:', options: ['3', '1', '4', '2'], answer: ['1', '2', '3', '4'] },
    { id: 2, question: 'Order by time of day:', options: ['Evening', 'Morning', 'Afternoon', 'Noon'], answer: ['Morning', 'Noon', 'Afternoon', 'Evening'] },
    { id: 3, question: 'Spell the word "CAT":', options: ['T', 'C', 'A'], answer: ['C', 'A', 'T'] },
    { id: 4, question: 'Order from largest to smallest:', options: ['Watermelon', 'Sesame', 'Apple', 'Grape'], answer: ['Watermelon', 'Apple', 'Grape', 'Sesame'] },
  ],
};

export const ExerciseModule = ({ type, onFinish, onBack }: { type: string; onFinish: () => void; onBack: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  const questions = EXERCISE_DATA[(type as ExerciseType)] || EXERCISE_DATA['练习-单选'];
  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (type === '练习-排序') {
      setOrderedItems([...currentQ.options]);
    } else {
      setSelectedAnswers([]);
    }
    setIsSubmitted(false);
    setFeedback('idle');
  }, [currentIndex, currentQ.options, type]);

  const handleSelect = (option: string) => {
    if (isSubmitted) return;

    if (type === '练习-单选' || type === '练习-判断') {
      setSelectedAnswers([option]);
      return;
    }

    if (type === '练习-多选') {
      setSelectedAnswers((prev) => (
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
      ));
    }
  };

  const playSound = (isCorrect: boolean) => {
    try {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      const context = new AudioContextCtor();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      if (isCorrect) {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, context.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.3);
      } else {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, context.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.2);
      }

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
    } catch {
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    let isCorrect = false;

    if (type === '练习-排序') {
      isCorrect = JSON.stringify(orderedItems) === JSON.stringify(currentQ.answer);
    } else {
      const sortedSelected = [...selectedAnswers].sort();
      const sortedAnswer = [...currentQ.answer].sort();
      isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedAnswer);
    }

    setIsSubmitted(true);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    playSound(isCorrect);

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b'],
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    onFinish();
  };

  const canSubmit = type === '练习-排序' ? true : selectedAnswers.length > 0;

  const typeMap: Record<string, string> = {
    '练习-单选': 'Single Choice',
    '练习-多选': 'Multiple Choice',
    '练习-判断': 'True / False',
    '练习-排序': 'Ordering',
  };

  const displayType = typeMap[type] || type;

  return (
    <div className="relative h-full w-full bg-slate-50 z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 text-slate-800 overflow-hidden">
      <header className="h-[10%] min-h-[60px] px-[4%] flex items-center justify-between bg-white shadow-sm border-b border-slate-100 shrink-0 z-10 relative">
        <button onClick={() => setShowExitConfirm(true)} className="w-[clamp(36px,10vw,48px)] h-[clamp(36px,10vw,48px)] bg-slate-100 rounded-[clamp(12px,3vw,16px)] flex items-center justify-center text-slate-600 active:scale-90 transition-transform">
          <X size={28} />
        </button>
        <h2 className="font-black tracking-widest text-[clamp(20px,5vw,24px)] uppercase text-slate-600">{displayType}</h2>
        <div className="w-[clamp(36px,10vw,48px)] flex items-center justify-center font-black text-slate-400">
          {currentIndex + 1}/{questions.length}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-[clamp(16px,4vw,24px)] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-full max-w-3xl bg-white rounded-[32px] shadow-xl border border-slate-100 p-[clamp(24px,6vw,40px)] flex flex-col items-center relative"
          >
            <h3 className="text-[clamp(24px,6vw,32px)] font-black text-slate-800 mb-[clamp(24px,6vw,40px)] text-center leading-snug">
              {currentQ.question}
            </h3>

            <div className="w-full flex flex-col items-center justify-center gap-[clamp(12px,3vw,16px)]">
              {type === '练习-排序' ? (
                <Reorder.Group axis="y" values={orderedItems} onReorder={setOrderedItems} className="w-full flex flex-col gap-[clamp(12px,3vw,16px)]">
                  {orderedItems.map((item) => {
                    const isCorrectPos = isSubmitted && currentQ.answer.indexOf(item) === orderedItems.indexOf(item);
                    const isWrongPos = isSubmitted && !isCorrectPos;

                    return (
                      <Reorder.Item
                        key={item}
                        value={item}
                        className={`w-full p-[clamp(16px,4vw,24px)] rounded-[20px] font-bold text-[clamp(18px,4.5vw,24px)] text-center cursor-grab active:cursor-grabbing select-none border-4 transition-colors relative overflow-hidden ${
                          isSubmitted
                            ? isCorrectPos
                              ? 'bg-green-100 border-green-500 text-green-700'
                              : 'bg-red-100 border-red-500 text-red-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                        dragListener={!isSubmitted}
                      >
                        {item}
                        {isSubmitted && isCorrectPos && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600">
                            <Check size={24} strokeWidth={3} />
                          </div>
                        )}
                        {isSubmitted && isWrongPos && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600">
                            <X size={24} strokeWidth={3} />
                          </div>
                        )}
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              ) : (
                <div className={`w-full grid gap-[clamp(12px,3vw,16px)] ${type === '练习-判断' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {currentQ.options.map((option) => {
                    const isSelected = selectedAnswers.includes(option);
                    const isCorrectAnswer = currentQ.answer.includes(option);

                    let btnClass = 'bg-slate-50 border-slate-200 text-slate-700';

                    if (isSelected && !isSubmitted) {
                      btnClass = 'bg-blue-100 border-blue-500 text-blue-700 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]';
                    } else if (isSubmitted) {
                      if (isCorrectAnswer) {
                        btnClass = 'bg-green-100 border-green-500 text-green-700 shadow-[0_0_0_4px_rgba(34,197,94,0.2)]';
                      } else if (isSelected) {
                        btnClass = 'bg-red-100 border-red-500 text-red-700';
                      } else {
                        btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                      }
                    }

                    return (
                      <motion.button
                        key={option}
                        whileTap={!isSubmitted ? { scale: 0.95 } : {}}
                        onClick={() => handleSelect(option)}
                        disabled={isSubmitted}
                        className={`relative w-full p-[clamp(16px,4vw,24px)] rounded-[20px] font-bold text-[clamp(18px,4.5vw,24px)] text-center border-4 transition-all duration-200 ${btnClass}`}
                      >
                        {option}
                        {isSubmitted && isCorrectAnswer && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 right-4 -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <Check size={20} strokeWidth={3} />
                          </motion.div>
                        )}
                        {isSubmitted && isSelected && !isCorrectAnswer && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 right-4 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
                            <X size={20} strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`mt-[clamp(24px,6vw,32px)] w-full p-[clamp(16px,4vw,24px)] rounded-[20px] flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {feedback === 'correct' ? <Check size={32} strokeWidth={3} /> : <X size={32} strokeWidth={3} />}
                    </div>
                    <div>
                      <h4 className="font-black text-[clamp(20px,5vw,24px)]">
                        {feedback === 'correct' ? 'Great job! Correct!' : 'Oops! Incorrect!'}
                      </h4>
                      {feedback === 'incorrect' && type !== '练习-排序' && (
                        <p className="font-bold mt-1 opacity-80">Correct Answer: {currentQ.answer.join(', ')}</p>
                      )}
                      {feedback === 'incorrect' && type === '练习-排序' && (
                        <p className="font-bold mt-1 opacity-80">Correct Order: {currentQ.answer.join(' ➔ ')}</p>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className={`w-14 h-14 rounded-full font-black text-white shadow-lg flex items-center justify-center shrink-0 ${
                      feedback === 'correct' ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'
                    }`}
                  >
                    <ArrowRight size={32} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSubmitted && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={canSubmit ? { scale: 0.95 } : {}}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`mt-[clamp(24px,6vw,32px)] px-[clamp(32px,8vw,48px)] py-[clamp(16px,4vw,20px)] rounded-full font-black text-[clamp(20px,5vw,24px)] shadow-lg transition-all duration-300 w-full sm:w-auto ${
                  canSubmit ? 'bg-blue-500 text-white shadow-blue-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 h-1.5 bg-blue-500 transition-all duration-500 z-50 rounded-r-full" style={{ width: `${(currentIndex / questions.length) * 100}%` }} />

      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] p-[clamp(24px,6vw,40px)] shadow-2xl relative z-10 w-full max-w-sm flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-[clamp(22px,5.5vw,28px)] font-black text-slate-800 mb-2">Exit Exercise?</h3>
              <p className="text-slate-500 font-bold mb-8">Your progress will be lost. Keep going!</p>
              <div className="w-full flex gap-4">
                <button onClick={onBack} className="flex-1 py-4 rounded-[16px] bg-slate-100 text-slate-600 font-black text-lg active:scale-95 transition-transform">
                  Exit
                </button>
                <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-4 rounded-[16px] bg-blue-500 text-white font-black text-lg shadow-lg shadow-blue-500/30 active:scale-95 transition-transform">
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
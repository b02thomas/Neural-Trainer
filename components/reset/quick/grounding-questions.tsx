'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  ClipboardList,
  HeartPulse,
  Target,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { GROUNDING_QUESTIONS, QuestionCategory, GroundingQuestion } from '@/types/reset';

interface GroundingQuestionsProps {
  onComplete: (answers: Record<string, string>) => void;
}

type AnswerType = 'yes' | 'no' | 'maybe' | 'skip';

const CATEGORY_CONFIG: Record<QuestionCategory, { icon: React.ElementType; color: string; bgColor: string }> = {
  awareness: { icon: Lightbulb, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  plan_check: { icon: ClipboardList, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  emotional: { icon: HeartPulse, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  perspective: { icon: Target, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
};

const ANSWER_STYLES: Record<AnswerType, { label: string; color: string; bg: string }> = {
  yes: { label: 'Yes', color: 'text-green-400', bg: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/30' },
  no: { label: 'No', color: 'text-red-400', bg: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30' },
  maybe: { label: 'Maybe', color: 'text-amber-400', bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30' },
  skip: { label: 'Skip', color: 'text-muted-foreground', bg: 'bg-white/5 hover:bg-white/10 border-white/10' },
};

// Select 5-6 questions from the pool for a varied experience
function selectQuestions(): GroundingQuestion[] {
  // Get one from each category, then add a couple more randomly
  const categories: QuestionCategory[] = ['awareness', 'plan_check', 'emotional', 'perspective'];
  const selected: GroundingQuestion[] = [];

  // One from each category
  categories.forEach((cat) => {
    const catQuestions = GROUNDING_QUESTIONS.filter((q) => q.category === cat);
    if (catQuestions.length > 0) {
      const idx = Math.floor(Math.random() * catQuestions.length);
      selected.push(catQuestions[idx]);
    }
  });

  // Add 1-2 more random questions not already selected
  const remaining = GROUNDING_QUESTIONS.filter((q) => !selected.find((s) => s.id === q.id));
  const additionalCount = Math.min(2, remaining.length);
  for (let i = 0; i < additionalCount; i++) {
    const idx = Math.floor(Math.random() * remaining.length);
    selected.push(remaining.splice(idx, 1)[0]);
  }

  return selected;
}

export function GroundingQuestions({ onComplete }: GroundingQuestionsProps) {
  const [questions] = useState(() => selectQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[currentIndex];
  const categoryConfig = CATEGORY_CONFIG[currentQuestion.category];
  const CategoryIcon = categoryConfig.icon;
  const progress = ((currentIndex + (answers[currentQuestion.id] ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (answer: AnswerType) => {
    if (isTransitioning) return;

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {questions.map((q, index) => {
          const config = CATEGORY_CONFIG[q.category];
          const isAnswered = !!answers[q.id];
          const isCurrent = index === currentIndex;

          return (
            <div
              key={q.id}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
                isAnswered
                  ? 'bg-green-500/20 border-2 border-green-500/50'
                  : isCurrent
                    ? `${config.bgColor} border-2 border-opacity-50`
                    : 'bg-white/5 border-2 border-white/10'
              )}
              style={isCurrent && !isAnswered ? { borderColor: 'currentColor' } : {}}
            >
              {isAnswered ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <span
                  className={cn(
                    'text-xs font-bold',
                    isCurrent ? config.color : 'text-muted-foreground'
                  )}
                >
                  {index + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Category badge */}
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6',
              categoryConfig.bgColor,
              categoryConfig.color
            )}
          >
            <CategoryIcon className="w-3 h-3" />
            {currentQuestion.category === 'plan_check' && 'Plan Check'}
            {currentQuestion.category === 'emotional' && 'Emotional Awareness'}
            {currentQuestion.category === 'awareness' && 'Self Awareness'}
            {currentQuestion.category === 'perspective' && 'Perspective'}
          </div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={cn(
              'inline-flex items-center justify-center w-20 h-20 rounded-full mb-6',
              categoryConfig.bgColor
            )}
          >
            <HelpCircle className={cn('w-10 h-10', categoryConfig.color)} />
          </motion.div>

          {/* Question */}
          <h2 className="text-xl font-medium mb-2 leading-relaxed">
            {currentQuestion.question}
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Be honest with yourself
          </p>

          {/* Answer buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['yes', 'no', 'maybe', 'skip'] as AnswerType[]).map((answer) => {
              const style = ANSWER_STYLES[answer];
              const isSelected = answers[currentQuestion.id] === answer;

              return (
                <Button
                  key={answer}
                  variant="outline"
                  onClick={() => handleAnswer(answer)}
                  disabled={isTransitioning}
                  className={cn(
                    'h-12 border transition-all duration-200',
                    style.bg,
                    isSelected && 'ring-2 ring-offset-2 ring-offset-background'
                  )}
                >
                  <span className={cn('font-medium', style.color)}>
                    {style.label}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isTransitioning}
              className="opacity-70 hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            {currentIndex === questions.length - 1 && answers[currentQuestion.id] && (
              <Button
                onClick={() => onComplete(answers)}
                className="glow-green"
              >
                Complete
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Reflection tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10"
      >
        <p className="text-sm text-muted-foreground text-center">
          <span className="text-foreground font-medium">Reflect:</span>{' '}
          {currentQuestion.category === 'plan_check' &&
            'Take a moment to review your trading plan before answering.'}
          {currentQuestion.category === 'emotional' &&
            'Check in with your body. Notice any tension or anxiety.'}
          {currentQuestion.category === 'awareness' &&
            'Be honest about your current state of mind.'}
          {currentQuestion.category === 'perspective' &&
            'Step back and see the bigger picture.'}
        </p>
      </motion.div>
    </div>
  );
}

// Compact version for quick access
export function GroundingQuestionsCompact({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions] = useState(() => selectQuestions().slice(0, 3));

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const currentQuestion = questions[currentIndex];
  const config = CATEGORY_CONFIG[currentQuestion.category];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
      <div className={cn('p-3 rounded-lg', config.bgColor)}>
        <Icon className={cn('w-6 h-6', config.color)} />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">{currentQuestion.question}</div>
        <div className="text-xs text-muted-foreground mt-1">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>
      <Button size="sm" onClick={handleNext}>
        {currentIndex === questions.length - 1 ? 'Done' : 'Next'}
      </Button>
    </div>
  );
}

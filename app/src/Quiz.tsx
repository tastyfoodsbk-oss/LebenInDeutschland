import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Question } from './types';

interface QuizProps {
  questions: Question[];
  onFinish: (answers: Record<number, number>) => void;
  onCancel: () => void;
}

export const ACTIVE_SESSION_KEY = 'lid_active_session';

export const Quiz: React.FC<QuizProps> = ({ questions, onFinish, onCancel }) => {
  // Restore position from localStorage on mount
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (saved) return JSON.parse(saved).currentIndex ?? 0;
    } catch {}
    return 0;
  });

  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (saved) return JSON.parse(saved).answers ?? {};
    } catch {}
    return {};
  });

  const [isAdvancing, setIsAdvancing] = useState(false);

  const question = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  // Persist current state on every change
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
        startId: questions[0]?.id,
        endId: questions[questions.length - 1]?.id,
        currentIndex,
        totalQuestions: questions.length,
        answers,
        savedAt: new Date().toISOString(),
      }));
    } catch {}
  }, [answers, currentIndex]);

  const handleSelectOption = (optionIndex: number) => {
    if (isAdvancing) return;

    const newAnswers = { ...answers, [question.id]: optionIndex };
    setAnswers(newAnswers);
    setIsAdvancing(true);

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
        onFinish(newAnswers);
      }
    }, 400);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      onFinish(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  // Keyboard shortcuts: 1–4 select options, Enter = next, Backspace = back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (question?.options[idx] !== undefined) handleSelectOption(idx);
      }
      if (e.key === 'Enter' && answers[question?.id] !== undefined) handleNext();
      if (e.key === 'Backspace' && currentIndex > 0) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, answers, currentIndex, isAdvancing]);

  // Reset isAdvancing when question changes
  useEffect(() => {
    setIsAdvancing(false);
  }, [currentIndex]);

  if (!question) return <div>Keine Fragen gefunden.</div>;

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="card">
      <div className="flex-between mb-4">
        <button className="btn-icon" onClick={onCancel} title="Abbrechen">
          <ArrowLeft size={24} />
        </button>
        <span style={{ fontWeight: 600 }}>
          Frage {currentIndex + 1} von {questions.length}
          {answeredCount > 0 && (
            <span style={{ fontWeight: 400, opacity: 0.55, marginLeft: '0.5rem', fontSize: '0.85rem' }}>
              · {answeredCount} beantwortet
            </span>
          )}
        </span>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="mb-8 mt-6">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
          {question.id}. {question.text}
        </h2>

        {/* Image Display */}
        {[21, 55, 70, 130, 181, 216, 235, 301, 308].includes(question.id) && (
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <img
              src={`/images/q${question.id}.png`}
              alt={`Bild für Frage ${question.id}`}
              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `<div style="padding: 1rem; background-color: var(--border-color); border-radius: 8px; font-size: 0.9rem;">[Bitte speichere das Bild als <b>q${question.id}.png</b> im Ordner <b>public/images/</b>]</div>`;
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {question.options.map((opt, idx) => {
            const isSelected = answers[question.id] === idx;
            return (
              <button
                key={idx}
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectOption(idx)}
              >
                <span style={{ opacity: 0.5, marginRight: '0.6rem', fontSize: '0.85rem' }}>
                  {idx + 1}
                </span>
                {opt || `Option ${idx + 1}`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-between mt-8">
        <button className="btn btn-outline" onClick={handlePrev} disabled={currentIndex === 0}>
          Zurück
        </button>
        <button className="btn" onClick={handleNext} disabled={answers[question.id] === undefined}>
          {currentIndex === questions.length - 1 ? (
            <>Abschließen <CheckCircle2 size={20} /></>
          ) : (
            <>Weiter <ArrowRight size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
};

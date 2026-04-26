import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Question } from './types';

interface QuizProps {
  questions: Question[];
  onFinish: (answers: Record<number, number>) => void;
  onCancel: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onFinish, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const question = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!question) return <div>Keine Fragen gefunden.</div>;

  return (
    <div className="card">
      <div className="flex-between mb-4">
        <button className="btn-icon" onClick={onCancel} title="Abbrechen">
          <ArrowLeft size={24} />
        </button>
        <span style={{ fontWeight: 600 }}>
          Frage {currentIndex + 1} von {questions.length}
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
                {opt || `Option ${idx + 1}`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-between mt-8">
        <button 
          className="btn btn-outline" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
        >
          Zurück
        </button>
        
        <button 
          className="btn" 
          onClick={handleNext}
          disabled={answers[question.id] === undefined}
        >
          {currentIndex === questions.length - 1 ? (
            <>
              Abschließen <CheckCircle2 size={20} />
            </>
          ) : (
            <>
              Weiter <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import type { Question } from './types';

interface ResultsProps {
  questions: Question[];
  answers: Record<number, number>;
  onHome: () => void;
  onRetry: () => void;
}

export const Results: React.FC<ResultsProps> = ({ questions, answers, onHome, onRetry }) => {
  // We assume the answer key is correct. Since we don't have the answer key, correctAnswer is 0 for all.
  // In a real scenario, this would use the real answer.
  const score = questions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);
  
  // Naturalization test requires 17 out of 33 correct (approx 51%)
  const passed = percentage >= 50;

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h2 style={{ fontSize: '2rem', color: passed ? 'var(--success)' : 'var(--error)' }}>
          {passed ? 'Bestanden!' : 'Nicht bestanden'}
        </h2>
        <div style={{ fontSize: '4rem', fontWeight: 800, margin: '1rem 0' }}>
          {score} <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/ {questions.length}</span>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>
          Hinweis: Aktuell ist der Lösungs-Schlüssel im PDF nicht markiert. Die App nimmt vorerst an, dass Option 1 (Index 0) richtig ist.
        </p>
      </div>

      <div className="flex-between mb-8">
        <button className="btn btn-outline" onClick={onHome}>
          <ArrowLeft size={20} />
          Zur Startseite
        </button>
        <button className="btn" onClick={onRetry}>
          <RotateCcw size={20} />
          Nochmal versuchen
        </button>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 className="mb-4">Detaillierte Auswertung</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div key={q.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600 }}>Frage {q.id}</span>
                  <span style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                    {isCorrect ? 'Richtig' : 'Falsch'}
                  </span>
                </div>
                <p className="mb-4">{q.text}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.options.map((opt, idx) => {
                    let className = 'option-btn';
                    if (idx === q.correctAnswer) className += ' correct';
                    else if (idx === userAnswer) className += ' incorrect';
                    
                    return (
                      <div key={idx} className={className} style={{ pointerEvents: 'none', margin: 0, padding: '0.75rem 1rem' }}>
                        {opt || `Option ${idx + 1}`}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

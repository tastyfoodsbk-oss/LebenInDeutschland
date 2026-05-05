import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Filter } from 'lucide-react';
import type { Question } from './types';

interface ResultsProps {
  questions: Question[];
  answers: Record<number, number>;
  onHome: () => void;
  onRetry: () => void;
}

export const Results: React.FC<ResultsProps> = ({ questions, answers, onHome, onRetry }) => {
  const [showOnlyWrong, setShowOnlyWrong] = useState(false);

  const score = questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0),
    0
  );
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 50;

  const wrongCount = questions.filter(q => answers[q.id] !== q.correctAnswer).length;
  const displayedQuestions = showOnlyWrong
    ? questions.filter(q => answers[q.id] !== q.correctAnswer)
    : questions;

  return (
    <div className="card">
      {/* ── Score header ── */}
      <div className="text-center mb-8">
        <h2 style={{ fontSize: '2rem', color: passed ? 'var(--success)' : 'var(--error)' }}>
          {passed ? 'Bestanden! 🎉' : 'Nicht bestanden'}
        </h2>
        <div style={{ fontSize: '4rem', fontWeight: 800, margin: '1rem 0' }}>
          {score}{' '}
          <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/ {questions.length}</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          {percentage}% korrekt &nbsp;·&nbsp; {wrongCount} Fehler
        </div>
      </div>

      {/* ── Actions ── */}
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

      {/* ── Filter bar ── */}
      <div className="flex-between mb-4">
        <h3>Detaillierte Auswertung</h3>
        {wrongCount > 0 && (
          <button
            className={`btn ${showOnlyWrong ? '' : 'btn-outline'}`}
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            onClick={() => setShowOnlyWrong(v => !v)}
          >
            <Filter size={15} />
            {showOnlyWrong ? `Nur Fehler (${wrongCount})` : 'Alle anzeigen'}
          </button>
        )}
      </div>

      {/* ── Question list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {displayedQuestions.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            Keine Fehler – perfekt! 🏆
          </p>
        )}

        {displayedQuestions.map((q) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div
              key={q.id}
              style={{
                padding: '1.5rem',
                border: `1px solid ${isCorrect ? 'var(--border-color)' : 'var(--error)'}`,
                borderRadius: '12px',
                background: isCorrect
                  ? 'transparent'
                  : 'color-mix(in srgb, var(--error) 5%, var(--card-bg))',
              }}
            >
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600 }}>Frage {q.id}</span>
                <span
                  style={{
                    color: isCorrect ? 'var(--success)' : 'var(--error)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {isCorrect ? '✓ Richtig' : '✗ Falsch'}
                </span>
              </div>
              <p className="mb-4">{q.text}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {q.options.map((opt, idx) => {
                  let className = 'option-btn';
                  if (idx === q.correctAnswer) className += ' correct';
                  else if (idx === userAnswer) className += ' incorrect';

                  return (
                    <div
                      key={idx}
                      className={className}
                      style={{ pointerEvents: 'none', margin: 0, padding: '0.75rem 1rem' }}
                    >
                      <span style={{ opacity: 0.5, marginRight: '0.6rem', fontSize: '0.85rem' }}>
                        {idx + 1}
                      </span>
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
  );
};

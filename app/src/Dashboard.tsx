import React, { useState } from 'react';
import { Play, RotateCcw, Trash2, BookOpen } from 'lucide-react';
import type { ProgressData, SavedSession } from './types';
import { ACTIVE_SESSION_KEY } from './Quiz';

interface DashboardProps {
  onStartQuiz: (startId: number, endId: number) => void;
  onResumeQuiz: (session: SavedSession) => void;
  onResetStats: () => void;
  progress: ProgressData;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartQuiz,
  onResumeQuiz,
  onResetStats,
  progress,
}) => {
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(310);

  // Read saved session from localStorage
  const [savedSession, setSavedSession] = useState<SavedSession | null>(() => {
    try {
      const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz(rangeStart, rangeEnd);
  };

  const handleFullTest = () => onStartQuiz(1, 310);

  const handleDiscardSession = () => {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    setSavedSession(null);
  };

  const handleResetStats = () => {
    if (window.confirm('Statistiken wirklich zurücksetzen?')) {
      onResetStats();
    }
  };

  const testsCompleted = progress.history.length;
  const averageScore =
    testsCompleted > 0
      ? Math.round(
          progress.history.reduce(
            (acc, curr) => acc + (curr.score / curr.total) * 100,
            0
          ) / testsCompleted
        )
      : 0;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const sessionProgress = savedSession
    ? Math.round((Object.keys(savedSession.answers).length / savedSession.totalQuestions) * 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Stats ── */}
      <div className="card">
        <div className="flex-between mb-6">
          <h2 style={{ fontSize: '1.6rem' }}>Willkommen zum Einbürgerungstest</h2>
          {testsCompleted > 0 && (
            <button
              className="btn btn-outline"
              onClick={handleResetStats}
              title="Statistiken zurücksetzen"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--error)' }}
            >
              <Trash2 size={16} />
              Stats zurücksetzen
            </button>
          )}
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{testsCompleted}</div>
            <div className="stat-label">Tests absolviert</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{averageScore}%</div>
            <div className="stat-label">Durchschnitt</div>
          </div>
        </div>

        {/* ── Quiz selector ── */}
        <form onSubmit={handleStart} style={{ marginTop: '1.5rem' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
            className="mb-4"
          >
            <div className="form-group">
              <label>Von Frage (1–310)</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={310}
                value={rangeStart}
                onChange={(e) => setRangeStart(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Bis Frage (1–310)</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={310}
                value={rangeEnd}
                onChange={(e) => setRangeEnd(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex-between mt-8">
            <button type="submit" className="btn">
              <Play size={20} />
              Auswahl starten
            </button>
            <button type="button" className="btn btn-outline" onClick={handleFullTest}>
              Alle 310 Fragen üben
            </button>
          </div>
        </form>
      </div>

      {/* ── Resumed session ── */}
      {savedSession && (
        <div
          className="card"
          style={{
            border: '1.5px solid var(--accent)',
            background: 'color-mix(in srgb, var(--accent) 6%, var(--card-bg))',
          }}
        >
          <div className="flex-between mb-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BookOpen size={20} style={{ color: 'var(--accent)' }} />
              <span style={{ fontWeight: 700 }}>Angefangenes Quiz</span>
            </div>
            <button
              className="btn-icon"
              onClick={handleDiscardSession}
              title="Verwerfen"
              style={{ color: 'var(--text-muted)' }}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
            Fragen {savedSession.startId}–{savedSession.endId} &nbsp;·&nbsp;
            {Object.keys(savedSession.answers).length} von {savedSession.totalQuestions} beantwortet
            &nbsp;·&nbsp; gespeichert {formatDate(savedSession.savedAt)}
          </div>

          {/* mini progress bar */}
          <div className="progress-bar-container" style={{ marginBottom: '1rem' }}>
            <div className="progress-bar" style={{ width: `${sessionProgress}%` }} />
          </div>

          <button className="btn" style={{ width: '100%' }} onClick={() => onResumeQuiz(savedSession)}>
            <RotateCcw size={18} />
            Weitermachen
          </button>
        </div>
      )}
    </div>
  );
};

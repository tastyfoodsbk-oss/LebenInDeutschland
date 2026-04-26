import React, { useState } from 'react';
import { Play } from 'lucide-react';
import type { ProgressData } from './types';

interface DashboardProps {
  onStartQuiz: (startId: number, endId: number, includeState: string | null) => void;
  progress: ProgressData;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz, progress }) => {
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(310);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz(rangeStart, rangeEnd, null);
  };

  const handleFullTest = () => {
    onStartQuiz(1, 310, null);
  };

  const testsCompleted = progress.history.length;
  const averageScore = testsCompleted > 0 
    ? Math.round(progress.history.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / testsCompleted)
    : 0;

  return (
    <div className="card">
      <h2 className="mb-8 text-center" style={{ fontSize: '2rem' }}>Willkommen zum Einbürgerungstest</h2>
      
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

      <form onSubmit={handleStart}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="mb-4">
          <div className="form-group">
            <label>Von Frage (1-310)</label>
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
            <label>Bis Frage (1-310)</label>
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
  );
};

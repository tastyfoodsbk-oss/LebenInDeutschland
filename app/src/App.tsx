import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { Quiz, ACTIVE_SESSION_KEY } from './Quiz';
import { Results } from './Results';
import { TranslationWidget } from './TranslationWidget';
import type { Question, ProgressData, SavedSession } from './types';
import questionsData from './data/questions.json';

const STORAGE_KEY = 'lid_progress';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [progress, setProgress] = useState<ProgressData>({ history: [] });
  const [appState, setAppState] = useState<'dashboard' | 'quiz' | 'results'>('dashboard');

  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Load theme and progress
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Could not parse progress', e);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const saveProgress = (score: number, total: number) => {
    const newProgress = {
      history: [{ date: new Date().toISOString(), score, total }, ...progress.history],
    };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const handleResetStats = () => {
    const empty: ProgressData = { history: [] };
    setProgress(empty);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
  };

  const handleStartQuiz = (startId: number, endId: number) => {
    const allQs = questionsData as Question[];
    const selected = allQs.filter(q => q.id >= startId && q.id <= endId);
    if (selected.length > 0) {
      // Overwrite any existing session immediately
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      setCurrentQuestions(selected);
      setAnswers({});
      setAppState('quiz');
    } else {
      alert('Ungültiger Bereich oder keine Fragen gefunden.');
    }
  };

  const handleResumeQuiz = (session: SavedSession) => {
    const allQs = questionsData as Question[];
    const selected = allQs.filter(q => q.id >= session.startId && q.id <= session.endId);
    if (selected.length > 0) {
      setCurrentQuestions(selected);
      setAnswers(session.answers);
      setAppState('quiz');
    }
  };

  const handleFinishQuiz = (finalAnswers: Record<number, number>) => {
    setAnswers(finalAnswers);
    const score = currentQuestions.reduce(
      (acc, q) => acc + (finalAnswers[q.id] === q.correctAnswer ? 1 : 0),
      0
    );
    saveProgress(score, currentQuestions.length);
    setAppState('results');
  };

  const handleCancel = () => {
    if (window.confirm('Test wirklich abbrechen? Dein Fortschritt wird gespeichert.')) {
      setAppState('dashboard');
    }
  };

  return (
    <>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>Leben in Deutschland</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <TranslationWidget />
          <button className="btn-icon" onClick={toggleTheme} title="Dark Mode Toggle">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main className="container">
        {appState === 'dashboard' && (
          <Dashboard
            onStartQuiz={handleStartQuiz}
            onResumeQuiz={handleResumeQuiz}
            onResetStats={handleResetStats}
            progress={progress}
          />
        )}

        {appState === 'quiz' && (
          <Quiz
            questions={currentQuestions}
            onFinish={handleFinishQuiz}
            onCancel={handleCancel}
          />
        )}

        {appState === 'results' && (
          <Results
            questions={currentQuestions}
            answers={answers}
            onHome={() => setAppState('dashboard')}
            onRetry={() => {
              localStorage.removeItem(ACTIVE_SESSION_KEY);
              setAnswers({});
              setAppState('quiz');
            }}
          />
        )}
      </main>
    </>
  );
}

export default App;

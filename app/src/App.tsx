import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { Quiz } from './Quiz';
import { Results } from './Results';
import { TranslationWidget } from './TranslationWidget';
import type { Question, ProgressData } from './types';
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
        console.error("Could not parse progress", e);
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
      history: [
        { date: new Date().toISOString(), score, total },
        ...progress.history
      ]
    };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const handleStartQuiz = (startId: number, endId: number) => {
    const allQs = questionsData as Question[];
    let selected = allQs.filter(q => q.id >= startId && q.id <= endId);
    
    // In the real catalog, 1-300 are general. 301-310 are specific to a state.
    // Our JSON just has 460 questions consecutively. 
    // Usually 301-310 is Baden-Württemberg, 311-320 Bayern, etc.
    // For demo purposes, we just take the requested range.
    
    if (selected.length > 0) {
      setCurrentQuestions(selected);
      setAnswers({});
      setAppState('quiz');
    } else {
      alert("Ungültiger Bereich oder keine Fragen gefunden.");
    }
  };

  const handleFinishQuiz = (finalAnswers: Record<number, number>) => {
    setAnswers(finalAnswers);
    const score = currentQuestions.reduce((acc, q) => acc + (finalAnswers[q.id] === q.correctAnswer ? 1 : 0), 0);
    saveProgress(score, currentQuestions.length);
    setAppState('results');
  };

  const handleCancel = () => {
    if (window.confirm("Test wirklich abbrechen?")) {
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
          <Dashboard onStartQuiz={handleStartQuiz} progress={progress} />
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

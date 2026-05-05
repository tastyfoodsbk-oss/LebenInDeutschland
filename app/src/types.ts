export interface Question {
  id: number;
  text: string;
  options: string[];
  image: string | null;
  correctAnswer: number;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number>;
  isFinished: boolean;
}

export interface ProgressData {
  history: {
    date: string;
    score: number;
    total: number;
  }[];
}

// A single saved (unfinished) quiz session
export interface SavedSession {
  startId: number;
  endId: number;
  currentIndex: number;
  totalQuestions: number;
  answers: Record<number, number>;
  savedAt: string;
}

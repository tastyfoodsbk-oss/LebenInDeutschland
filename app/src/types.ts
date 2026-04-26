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

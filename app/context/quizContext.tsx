import { allQuiz } from "@/utils/config";
import { PropsWithChildren, useContext, useState } from "react";
import { createContext } from "react";

export type Quiz = (typeof allQuiz)[number];
export interface QuizContextInterface {
  quiz: Quiz;
  quizType: "translation";
  quizcount: number;
  updateQuizcount: (val: number) => void;
  updateQuiz: (val: Quiz) => void;
}

const quizContext = createContext<QuizContextInterface | null>(null);

export const useQuizContext = () =>
  useContext(quizContext) as unknown as QuizContextInterface;

export const QuizProvider = ({ children }: PropsWithChildren) => {
  const [quizcount, setQuizcount] = useState(10);
  const [quiz, setQuiz] = useState<QuizContextInterface["quiz"]>("CET4");

  const quizValue: QuizContextInterface = {
    quiz,
    quizType: "translation",
    quizcount,
    updateQuizcount: (val) => setQuizcount(val),
    updateQuiz: (val) => setQuiz(val),
  };

  return (
    <quizContext.Provider value={quizValue}>{children}</quizContext.Provider>
  );
};

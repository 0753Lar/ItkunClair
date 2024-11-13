import { PropsWithChildren, useContext } from "react";
import { createContext } from "react";

export interface QuizContextInterface {
  quiz: "CET4" | "CET6";
  quizType: "translation";
  quizcount: number;

  done: boolean;
  quizList: unknown[];
}

const quizContext = createContext<QuizContextInterface | null>(null);

export const useQuizContext = () =>
  useContext(quizContext) as unknown as QuizContextInterface;

export const QuizProvider = ({ children }: PropsWithChildren) => {
  const quizValue: QuizContextInterface = {
    quiz: "CET4",
    quizType: "translation",
    quizcount: 10,
    done: false,
    quizList: [],
  };

  return (
    <quizContext.Provider value={quizValue}>{children}</quizContext.Provider>
  );
};

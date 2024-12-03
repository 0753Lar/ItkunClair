import { OXFORD_3000_WORD } from "@/lib/mongoose/models/FormalWord";
import { allChallenge, allQuiz } from "@/utils/config";
import { PropsWithChildren, useContext, useState } from "react";
import { createContext } from "react";

export type Quiz = (typeof allQuiz)[number];
export type Challenge = (typeof allChallenge)[number];
export interface QuizContextInterface {
  quiz: Quiz;
  quizType: Challenge;
  quizcount: number;
  updateQuizcount: (val: number) => void;
  updateQuiz: (val: Quiz) => void;
  updateQuizType: (val: Challenge) => void;
}

const quizContext = createContext<QuizContextInterface | null>(null);

export const useQuizContext = () =>
  useContext(quizContext) as unknown as QuizContextInterface;

export const mapWordModal = (quiz: Quiz): typeof OXFORD_3000_WORD => {
  switch (quiz) {
    case "Oxford3000":
      return OXFORD_3000_WORD;
  }
};

export const QuizProvider = ({ children }: PropsWithChildren) => {
  const [quizcount, setQuizcount] = useState(10);
  const [quiz, setQuiz] = useState<QuizContextInterface["quiz"]>("Oxford3000");
  const [quizType, setQuizType] =
    useState<QuizContextInterface["quizType"]>("guessWord");

  const quizValue: QuizContextInterface = {
    quiz,
    quizType,
    quizcount,
    updateQuizcount: (val) => setQuizcount(val),
    updateQuiz: (val) => setQuiz(val),
    updateQuizType: (val) => setQuizType(val),
  };

  return (
    <quizContext.Provider value={quizValue}>{children}</quizContext.Provider>
  );
};

"use client";
import { useQuizContext } from "../context/quizContext";
import Translation from "./Translation";

export default function Page() {
  const { quizType } = useQuizContext();

  return (
    <section className="py-2 px-4">
      <div className="md:flex md:justify-center">
        {quizType === "guessWord" && (
          <div className="md:max-w-2xl md:w-3/5">
            <Translation />
          </div>
        )}
      </div>
    </section>
  );
}

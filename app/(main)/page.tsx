"use client";
import { useQuizContext } from "../context/quizContext";
import GuessWord from "./GuessWord";
import ListenVoice from "./ListenVoice";

export default function Page() {
  const { quizType } = useQuizContext();

  return (
    <section className="px-4 py-2">
      <div className="md:flex md:justify-center">
        {quizType === "guessWord" && (
          <div className="md:w-3/5 md:max-w-2xl">
            <GuessWord />
          </div>
        )}
        {quizType === "listenVoice" && (
          <div className="md:w-3/5 md:max-w-2xl">
            <ListenVoice />
          </div>
        )}
      </div>
    </section>
  );
}

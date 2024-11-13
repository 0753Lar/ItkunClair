"use client";
import { useEffect, useState } from "react";
import { useQuizContext } from "../context/quizContext";
import Translation from "./Translation";
import { fetchWords } from "@/lib/mongoose/actions/fetchWords";
import { useLocale } from "@/hooks/useLocale";
import { IWord } from "@/lib/mongoose/models/Word";

export default function Page() {
  const { quiz, quizcount, quizType } = useQuizContext();
  const t = useLocale();

  const [current, setCurrent] = useState(0);

  const [quizList, setQuizList] = useState<IWord[]>([]);

  const onTranslationContinue = () => {
    fetchWords(quiz === "CET6" ? "cet6_word" : "cet4_word", quizcount).then(
      (res) => {
        setQuizList(res);
        setCurrent(0);
      }
    );
  };

  useEffect(() => {
    fetchWords(quiz === "CET6" ? "cet6_word" : "cet4_word", quizcount).then(
      setQuizList
    );
  }, []);

  const isTranslationFinished = current + 1 === quizcount;

  return (
    <section className="py-2 px-4 ">
      <div>
        {quizType === "translation" && quizList.length !== 0 && (
          <div>
            <div className="mb-2 flex justify-between">
              <span>{t("home_quiz_type_translation")}</span>
              {!isTranslationFinished && (
                <span>
                  {current + 1}/{quizcount}
                </span>
              )}
            </div>
            {isTranslationFinished ? (
              <div className="card text-center">
                <div className="flex flex-col items-center mb-2">
                  <div>Congratulations!</div>
                  <p className="text-sm text-slate-200">
                    You finished a round of {quizcount} quiz!
                  </p>
                  <p className="text-sm text-slate-200">
                    Click on below button to start a new round.
                  </p>
                </div>
                <button
                  className="border rounded-md p-1 text-sm"
                  onClick={onTranslationContinue}
                >
                  Continue
                </button>
              </div>
            ) : (
              <Translation
                item={quizList[current]}
                onDone={() => setCurrent(current + 1)}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

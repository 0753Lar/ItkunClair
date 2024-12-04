"use client";
import { useLocale } from "@/hooks/useLocale";
import { useQuizContext } from "../context/quizContext";
import GuessWord from "./GuessWord";
import ListenVoice from "./ListenVoice";
import Option from "@/components/Option";
import { allChallenge } from "@/utils/config";
import { camel2Snake } from "@/utils";

export default function Page() {
  const { quizType, updateQuizType } = useQuizContext();
  const t = useLocale();

  const title = (
    <Option
      options={allChallenge.map((v) => ({
        value: v,
        label: t(`home_quiz_type_${camel2Snake(v)}`),
      }))}
      selectedLabel={t(`home_quiz_type_${camel2Snake(quizType)}`)}
      onSelect={updateQuizType as (val: string) => void}
    />
  );

  return (
    <section className="px-4 py-2">
      <div className="flex flex-col items-center">
        {quizType === "guessWord" && (
          <div className="md:w-3/5 md:max-w-2xl">
            <GuessWord title={title} />
          </div>
        )}
        {quizType === "listenVoice" && (
          <div className="md:w-3/5 md:max-w-2xl">
            <ListenVoice title={title} />
          </div>
        )}
      </div>
    </section>
  );
}

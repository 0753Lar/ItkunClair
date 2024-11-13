"use client";

import { useQuizContext } from "@/app/context/quizContext";
import Github from "@/components/icons/Github";
import ToggleLanguage from "@/components/icons/ToggleLanguage";
import ToggleTheme from "@/components/icons/ToggleTheme";
import { useLocale } from "@/hooks/useLocale";
import pkg from "@/package.json";

export default function Header() {
  const { quiz, quizType, quizcount } = useQuizContext();

  const t = useLocale();

  return (
    <header>
      <div className="flex flex-row justify-between items-start py-4 ml-4 md:ml-2 mr-4">
        <div className="text-sm flex flex-col md:flex-row md:gap-2">
          <div>
            {t("home_quiz_vocabulary_title")}: {quiz}
          </div>
          <div>
            {t("home_quiz_challenge_title")}: {quizType}
          </div>
          <div>
            {t("home_quiz_count_title")}: {quizcount}
          </div>
        </div>
        <div className="py-1 px-2 rounded-md bg-slate-100 border-slate-100 gap-2 flex justify-center items-center">
          <ToggleLanguage />
          <ToggleTheme />
          <Github />
        </div>
      </div>

      <div className="relative text-center">
        <div className="text-6xl text-white animate__animated animate__zoomIn">{pkg.name}</div>
        <div className="glass-header absolute  right-1/2 top-0 -mr-2 animate__animated animate__zoomInDown"></div>
      </div>
    </header>
  );
}

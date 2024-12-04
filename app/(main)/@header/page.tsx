"use client";

import { useQuizContext } from "@/app/context/quizContext";
import Github from "@/components/icons/Github";
import Setting from "@/components/icons/Setting";
import ToggleLanguage from "@/components/icons/ToggleLanguage";
import ToggleTheme from "@/components/icons/ToggleTheme";
import { useLocale } from "@/hooks/useLocale";
import pkg from "@/package.json";
import Option from "@/components/Option";
import { allQuiz } from "@/utils/config";

export default function Header() {
  const { quiz, updateQuiz } = useQuizContext();

  const t = useLocale();

  return (
    <header>
      <div className="ml-4 mr-4 flex flex-row items-start justify-between py-4 md:ml-2">
        <div className="flex flex-col text-sm md:flex-row md:gap-2">
          <div className="flex justify-between">
            <span>{t("home_quiz_vocabulary_title")} &nbsp;</span>
            <div>
              <Option
                options={allQuiz.map((v) => ({ label: v }))}
                selectedLabel={quiz}
                onSelect={updateQuiz as (val: string) => void}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 rounded-md border-slate-100 bg-slate-100 px-2 py-1">
          <Setting />
          <ToggleLanguage />
          <ToggleTheme />
          <Github />
        </div>
      </div>

      <div className="relative text-center">
        <div className="animate__animated animate__zoomIn text-6xl text-white">
          {pkg.name}
        </div>
        <div className="glass-header animate__animated animate__zoomInDown absolute right-1/2 top-0 -mr-2"></div>
      </div>
    </header>
  );
}

"use client";

import { useQuizContext } from "@/app/context/quizContext";
import Github from "@/components/icons/Github";
import ToggleLanguage from "@/components/icons/ToggleLanguage";
import ToggleTheme from "@/components/icons/ToggleTheme";
import pkg from "@/package.json";

export default function Header() {
  const { quiz, quizType, quizcount } = useQuizContext();

  return (
    <header>
      <div className="flex flex-row justify-between items-start py-4 ml-4 md:ml-2 mr-8 md:mr-4">
        <div className="text-sm flex flex-col md:flex-row md:gap-2">
          <div>词库： {quiz}</div>
          <div>挑战：{quizType}</div>
          <div>题目数量：{quizcount}</div>
        </div>
        <div className="py-1 px-2 rounded-md bg-slate-100 border-slate-100 gap-2 flex justify-center items-center">
          <ToggleLanguage />
          <ToggleTheme />
          <Github />
        </div>
      </div>

      <div className="relative text-center">
        <div className="text-6xl text-white">{pkg.name}</div>
        <div className="glass-header absolute  left-1/2 top-0"></div>
      </div>
    </header>
  );
}

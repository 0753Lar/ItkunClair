import { useState } from "react";
import Modal from "../Modal";
import { useQuizContext } from "@/app/context/quizContext";
import { useLocale } from "@/hooks/useLocale";
import EditableNumber from "../EditableNumber";
import {
  allChallenge,
  allQuiz,
  guessWordDefaultMaxCount,
  guessWordDefaultMinCount,
} from "@/utils/config";
import Option from "../Option";
import Switch from "./Switch";
import { useRootContext } from "@/app/context/rootContext";
import { camel2Snake } from "@/utils";

export default function Setting() {
  const [isSetting, setIsSetting] = useState(false);
  const {
    quiz,
    quizType,
    updateQuizType,
    updateQuiz,
    quizcount,
    updateQuizcount,
  } = useQuizContext();

  const { config, updateConfig } = useRootContext();

  const t = useLocale();

  return (
    <div>
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5079"
        width="200"
        height="200"
        className="h-5 w-5 cursor-pointer text-slate-800 md:h-6 md:w-6"
        onClick={() => setIsSetting(true)}
      >
        <path
          d="M411.53536 53.443584l0.002048 0.014336c19.13856 35.8912 56.947712 60.319744 100.462592 60.319744 43.51488 0 81.324032-24.428544 100.462592-60.319744l0.003072-0.013312c96.596992 21.065728 182.080512 71.877632 246.370304 142.35648-21.475328 34.512896-23.7056 79.43168-1.96608 117.088256 21.76512 37.696512 61.843456 58.227712 102.508544 56.84224 14.261248 44.87168 21.95456 92.672 21.95456 142.268416 0 49.59744-7.693312 97.398784-21.951488 142.27456-40.670208-1.389568-80.74752 19.140608-102.510592 56.836096-21.742592 37.658624-19.510272 82.58048 1.96096 117.090304-64.28672 70.4768-149.77024 121.288704-246.365184 142.354432-19.134464-35.899392-56.947712-60.33408-100.466688-60.33408-43.51488 0-81.325056 24.429568-100.463616 60.321792l-0.001024 0.013312c-96.596992-21.066752-182.080512-71.878656-246.370304-142.35648 21.474304-34.51392 23.7056-79.43168 1.964032-117.08928-21.764096-37.696512-61.843456-58.227712-102.508544-56.84224-14.260224-44.87168-21.95456-92.672-21.95456-142.268416 0-49.59744 7.694336-97.39776 21.952512-142.272512 40.667136 1.389568 80.746496-19.141632 102.510592-56.838144 21.741568-37.6576 19.510272-82.57536-1.957888-117.085184 64.283648-70.48192 149.767168-121.293824 246.36416-142.360576zM512 398.22336c-62.83776 0-113.777664 50.939904-113.777664 113.777664S449.16224 625.777664 512 625.777664 625.777664 574.83776 625.777664 512 574.83776 398.222336 512 398.222336z"
          fill="currentColor"
          p-id="5080"
        ></path>
      </svg>

      <Modal open={isSetting} onClose={() => setIsSetting(false)}>
        <div className="flex flex-col gap-2 pt-1 text-sm">
          <div className="flex justify-between">
            <span>{t("home_quiz_vocabulary_title")}:</span>
            <div>
              <Option
                options={allQuiz.map((v) => ({ label: v }))}
                selectedLabel={quiz}
                onSelect={updateQuiz as (val: string) => void}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <span>{t("home_quiz_challenge_title")}:</span>
            <div>
              <Option
                options={allChallenge.map((v) => ({
                  label: t(`home_quiz_type_${camel2Snake(v)}`),
                }))}
                selectedLabel={t(`home_quiz_type_${camel2Snake(quizType)}`)}
                onSelect={updateQuizType as (val: string) => void}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <span>{t("home_quiz_count_title")}:</span>
            <EditableNumber
              initialValue={quizcount}
              onSave={updateQuizcount}
              min={guessWordDefaultMinCount}
              max={guessWordDefaultMaxCount}
            />
          </div>
          <div className="flex justify-between">
            <span>{t("config_pronounciation_auto_title")}:</span>
            <Switch
              isOn={config.pronounciation.auto}
              onToggle={() =>
                updateConfig((config) => {
                  config.pronounciation.auto = !config.pronounciation.auto;
                  return config;
                })
              }
            />
          </div>
          {quizType === "guessWord" && (
            <>
              <div className="flex justify-between">
                <span>{t("config_guess_word_meaning_title")}:</span>
                <Switch
                  isOn={config.guessWord.showMeaning}
                  onToggle={() =>
                    updateConfig((config) => {
                      config.guessWord.showMeaning =
                        !config.guessWord.showMeaning;
                      return config;
                    })
                  }
                />
              </div>
              <div className="flex justify-between">
                <span>{t("config_guess_word_example_title")}:</span>
                <Switch
                  isOn={config.guessWord.showExamples}
                  onToggle={() =>
                    updateConfig((config) => {
                      config.guessWord.showExamples =
                        !config.guessWord.showExamples;
                      return config;
                    })
                  }
                />
              </div>
              <div className="flex justify-between">
                <span>
                  {t("config_guess_word_example_interpretation_title")}:
                </span>
                <Switch
                  isOn={config.guessWord.showExamplesInterpretation}
                  onToggle={() =>
                    updateConfig((config) => {
                      config.guessWord.showExamplesInterpretation =
                        !config.guessWord.showExamplesInterpretation;
                      return config;
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

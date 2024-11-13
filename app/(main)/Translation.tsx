import { IWord } from "@/lib/mongoose/models/Word";
import { createRef, KeyboardEventHandler, useEffect, useState } from "react";
import "animate.css";
import Enter from "@/components/icons/Enter";
import { useLocale } from "@/hooks/useLocale";
import { fetchWords } from "@/lib/mongoose/actions/fetchWords";
import { useQuizContext } from "../context/quizContext";
import Empty from "@/components/icons/Empty";
import { montserrat } from "../fonts";

const animateDuration = 500;

type InputStatus = "success" | "error" | "normal";

export default function Translation() {
  const { quiz, quizcount } = useQuizContext();
  const t = useLocale();
  const [current, setCurrent] = useState(0);
  const [quizList, setQuizList] = useState<IWord[]>([]);
  const [status, setStatus] = useState<InputStatus>("normal");
  const [value, setValue] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = createRef<HTMLInputElement>();

  const requestList = () => {
    fetchWords(quiz === "CET6" ? "cet6_word" : "cet4_word", quizcount).then(
      (res) => {
        setQuizList(res);
        setCurrent(0);
      }
    );
  };

  const submit = (val: string) => {
    if (val.trim() === item.word.trim()) {
      setStatus("success");
    } else {
      setStatus("error");
      console.dir(item);
    }
  };

  const onKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    console.log("e.key: ", e.key);
    if (e.key === "Enter") {
      submit(value);
    } else if (e.key === "Escape") {
      setValue("");
    }
  };
  const emptyValue = () => {
    setValue("");
    inputRef.current?.focus();
  };

  const isSuccess = status === "success";
  const isError = status === "error";
  const isTranslationFinished = current + 1 === quizcount;
  const item = quizList[current];

  useEffect(() => {
    inputRef.current?.focus();
    requestList();
  }, []);

  useEffect(() => {
    if (status !== "normal") {
      // todo: add debounce
      setTimeout(() => {
        setStatus("normal");
        inputRef.current?.focus();
        if (isSuccess) {
          setValue("");
          setShowAnswer(false);
          setCurrent((pre) => pre + 1);
        }
      }, animateDuration);
    }
  }, [isSuccess, status]);

  return (
    <div className={`gap-2 flex flex-col ${montserrat.className}`}>
      <div className="flex justify-between md:text-lg items-baseline">
        <span>{t("home_quiz_type_translation")}</span>
        {!isTranslationFinished && (
          <span className="text-sm md:text-base">
            {current + 1}/{quizcount}
          </span>
        )}
      </div>
      {quizList.length === 0 ? (
        <div>loading...</div>
      ) : isTranslationFinished ? (
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
            onClick={requestList}
          >
            Continue
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-col md:w-full gap-4  animate__animated ${
            isSuccess
              ? "animate__backOutDown"
              : "animate__fadeInDownBig animate__faster"
          }`}
        >
          <div className={`card flex flex-col md:w-full gap-4`}>
            <div>
              <div className="text-sm text-fuchsia-100">中文释义: </div>
              {item.translations.map((t, i) => (
                <div key={`translations-${i}`}>
                  <span className="text-md text-white">
                    {t.type}. {t.translation}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <div className={`mb-2 mt-4relative`}>
                <span className="text-sm text-fuchsia-100">输入单词:</span>

                <div className="relative flex items-center gap-2">
                  <div
                    className={`relative w-full ${
                      isError ? "animate__animated animate__headShake" : ""
                    }`}
                  >
                    <input
                      onKeyDown={onKeydown}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      ref={inputRef}
                      type="text"
                      className={`border border-slate-100 bg-transparent rounded-md text-md outline-none
           flex-1 shadow-sm  p-1 w-full text-white
         
          ${isError ? "border-transparent bg-red-900/30" : ""}  `}
                    />
                    {!!value && (
                      <div
                        className="absolute right-1 top:0 bottom-0 h-full w-6 p-1 flex items-center justify-center cursor-pointer
                     text-red-900/40 md:hover:text-red-800"
                        onClick={emptyValue}
                      >
                        <Empty />
                      </div>
                    )}
                  </div>

                  <div
                    className=" cursor-pointer w-5 h-5 flex items-center justify-center 
                md:hover:text-slate-200 overflow-hidden"
                    onClick={() => submit(value)}
                  >
                    <Enter />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`text-center ${isSuccess ? "hidden" : ""}`}>
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="text-white outline-none border-none 
           bg-gradient-to-br from-pink-500 to-orange-400 md:hover:bg-gradient-to-bl rounded-lg px-4 py-1.5"
            >
              Show Answer
            </button>

            {showAnswer && (
              <div>
                Answer is <span className="text-xl">{item.word}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

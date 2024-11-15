import { IWord } from "@/lib/mongoose/models/Word";
import { createRef, KeyboardEventHandler, useEffect, useState } from "react";
import "animate.css";
import Enter from "@/components/icons/Enter";
import { useLocale } from "@/hooks/useLocale";
import { fetchWords } from "@/lib/mongoose/actions/fetchWords";
import { useQuizContext } from "../context/quizContext";
import Empty from "@/components/icons/Empty";
import { montserrat } from "../fonts";
import Loading from "@/components/icons/Loading";
import { translationdefaultMaxCount } from "@/utils/config";

const animateDuration = 500;

type InputStatus = "success" | "error" | "normal";

export default function Translation() {
  const { quiz, quizcount } = useQuizContext();
  const t = useLocale();
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [quizList, setQuizList] = useState<IWord[]>([]);
  const [status, setStatus] = useState<InputStatus>("normal");
  const [value, setValue] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = createRef<HTMLInputElement>();

  const requestList = () => {
    setLoading(true);
    fetchWords(
      quiz === "CET6" ? "cet6_word" : "cet4_word",
      translationdefaultMaxCount,
    ).then((res) => {
      setLoading(false);
      setQuizList(res);
      setCurrent(0);
    });
  };

  const submit = (val: string) => {
    if (
      val.trim().toLocaleLowerCase() === item.word.trim().toLocaleLowerCase()
    ) {
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
  const isTranslationFinished = current + 1 >= quizcount;
  const item = quizList[current];

  useEffect(() => {
    inputRef.current?.focus();
    requestList();
  }, [quiz]);

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
  }, [inputRef, isSuccess, status]);

  if (quizcount === 0 || !item) {
    return null;
  }
  return (
    <div className={`flex flex-col gap-2 ${montserrat.className}`}>
      <div className="flex items-baseline justify-between md:text-lg">
        <span>{t("home_quiz_type_translation")}</span>
        {!isTranslationFinished && (
          <span className="text-sm md:text-base">
            {current + 1}/{quizcount}
          </span>
        )}
      </div>
      {loading ? (
        <div className="flex h-32 w-full items-center justify-center">
          <Loading className="fill-slate-200 text-transparent" />
        </div>
      ) : isTranslationFinished ? (
        <div className="card text-center">
          <div className="mb-2 flex flex-col items-center">
            <div>Congratulations!</div>
            <p className="text-sm text-slate-200">
              You finished a round of {quizcount} quiz!
            </p>
            <p className="text-sm text-slate-200">
              Click on below button to start a new round.
            </p>
          </div>
          <button
            className="rounded-md border p-1 text-sm"
            onClick={requestList}
          >
            Continue
          </button>
        </div>
      ) : (
        <div
          className={`animate__animated flex flex-col gap-4 md:w-full ${
            isSuccess
              ? "animate__backOutDown"
              : "animate__fadeInDownBig animate__faster"
          }`}
        >
          <div className={`card flex flex-col gap-4 md:w-full`}>
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
              <div className={`mt-4relative mb-2`}>
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
                      className={`text-md w-full flex-1 rounded-md border border-slate-100 bg-transparent p-1 text-white shadow-sm outline-none ${isError ? "border-transparent bg-red-900/30" : ""} `}
                    />
                    {!!value && (
                      <div
                        className="top:0 absolute bottom-0 right-1 flex h-full w-6 cursor-pointer items-center justify-center p-1 text-red-900/40 md:hover:text-red-800"
                        onClick={emptyValue}
                      >
                        <Empty />
                      </div>
                    )}
                  </div>

                  <div
                    className="flex h-5 w-5 cursor-pointer items-center justify-center overflow-hidden md:hover:text-slate-200"
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
              className="rounded-lg border-none bg-gradient-to-br from-pink-500 to-orange-400 px-4 py-1.5 text-white outline-none md:hover:bg-gradient-to-bl"
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

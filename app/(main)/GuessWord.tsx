import {
  createRef,
  KeyboardEventHandler,
  ReactNode,
  useEffect,
  useState,
} from "react";
import "animate.css";
import Enter from "@/components/icons/Enter";
import { useLocale } from "@/hooks/useLocale";
import { fetchFormalWords } from "@/lib/mongoose/actions/fetchWords";
import { mapWordModal, useQuizContext } from "../context/quizContext";
import Empty from "@/components/icons/Empty";
import { montserrat, notoSans } from "../fonts";
import Loading from "@/components/icons/Loading";
import { FormalWord } from "@/ai/data/template/word";
import { useRootContext } from "../context/rootContext";
import Sound from "@/components/icons/Sound";
import Pagination from "@/components/Pagination";
import Congratulation from "@/components/Congratulation";
import { usePronounce } from "@/hooks/usePronounce";

const animateDuration = 500;

type InputStatus = "success" | "error" | "normal";

interface GuessWordProps {
  title: ReactNode;
}
export default function GuessWord({ title }: GuessWordProps) {
  const { quiz, quizcount } = useQuizContext();
  const { config } = useRootContext();
  const t = useLocale();
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [quizList, setQuizList] = useState<FormalWord[]>([]);
  const [status, setStatus] = useState<InputStatus>("normal");
  const [value, setValue] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = createRef<HTMLInputElement>();
  const [finishedRound, setFinishedRound] = useState(false);

  const requestList = () => {
    setLoading(true);
    fetchFormalWords(mapWordModal(quiz), quizcount).then((res) => {
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
  const item = quizList[current];

  useEffect(() => {
    inputRef.current?.focus();
    requestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, quizcount]);

  useEffect(() => {
    if (status !== "normal") {
      // todo: add debounce
      setTimeout(() => {
        setStatus("normal");
        inputRef.current?.focus();
        if (isSuccess) {
          setValue("");
          setShowAnswer(false);
          setCurrent((pre) => {
            if (pre === quizcount - 1) {
              setFinishedRound(true);
              return pre;
            } else {
              return pre + 1;
            }
          });
        }
      }, animateDuration);
    }
  }, [inputRef, isSuccess, quizcount, status]);

  if (quizcount === 0 || !item) {
    return <LoadingSection />;
  }

  return (
    <div className={`flex flex-col gap-2 ${montserrat.className}`}>
      <div className="flex items-baseline justify-between md:text-lg">
        {title}
        {!finishedRound && (
          <Pagination
            current={current}
            total={quizcount}
            onChange={setCurrent}
          />
        )}
      </div>
      {loading ? (
        <LoadingSection />
      ) : finishedRound ? (
        <Congratulation
          onNext={() => {
            setFinishedRound(false);
            requestList();
          }}
          onRetry={() => {
            setFinishedRound(false);
            setCurrent(0);
          }}
        />
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
              <Pronounciation word={item.word} />
            </div>

            {config.guessWord.showMeaning && (
              <div>
                <Meaning meaning={item.meaning} />
              </div>
            )}

            {config.guessWord.showExamples && (
              <div>
                <Example
                  examples={item.examples}
                  word={item.word}
                  value={value}
                />
              </div>
            )}

            <div>
              <div className={`mt-4relative mb-2`}>
                <span className="text-sm text-fuchsia-100">
                  {t("home_guess_word_enter_title")}:
                </span>

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
              {t("home_guess_word_show_answer_title")}
            </button>

            {showAnswer && (
              <Answer
                word={item.word}
                meaning={item.meaning}
                phonetics={item.phonetics}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Answer({
  word,
  meaning,
  phonetics,
}: Pick<FormalWord, "word" | "meaning" | "phonetics">) {
  const { pronounce, cancel, playing } = usePronounce();
  const onSoundClick = (text: string) => {
    if (playing) {
      cancel();
    }
    pronounce(text);
  };

  return (
    <div>
      <div className="text-xl">{word}</div>
      <div>
        <div className="flex items-center justify-center">
          <span>{phonetics.uk}</span>
          &nbsp;
          <span
            className="h-4 md:hover:cursor-pointer md:hover:text-slate-300"
            onClick={() => onSoundClick(word)}
          >
            <Sound />
          </span>
        </div>
      </div>
      <div>
        <Meaning meaning={meaning} hideTitle />
      </div>
    </div>
  );
}

function LoadingSection() {
  return (
    <div className="flex h-32 w-full items-center justify-center">
      <Loading className="fill-slate-200 text-transparent" />
    </div>
  );
}

function Pronounciation({ word }: { word: string }) {
  const { config } = useRootContext();
  const t = useLocale();
  const { pronounce, cancel, playing } = usePronounce();
  const onSoundClick = (text: string) => {
    if (playing) {
      cancel();
    }
    pronounce(text);
  };

  useEffect(() => {
    if (config.guessWord.autoPronounce) {
      setTimeout(() => pronounce(word), animateDuration);
    }
  }, [word, config.guessWord.autoPronounce]);

  return (
    <div className="flex items-center">
      <span className="text-sm text-fuchsia-100">
        {t("home_pronounciation_title")}{" "}
      </span>
      &nbsp;
      <span
        className="h-4 md:hover:cursor-pointer md:hover:text-slate-300"
        onClick={() => onSoundClick(word)}
      >
        <Sound />
      </span>
    </div>
  );
}

function Meaning({
  meaning,
  hideTitle,
}: Pick<FormalWord, "meaning"> & { hideTitle?: boolean }) {
  const t = useLocale();
  return (
    <div>
      {!hideTitle && (
        <div className="text-sm text-fuchsia-100">
          {t("home_guess_word_meaning_title")}:{" "}
        </div>
      )}
      {Object.entries(meaning).map((t, i) => (
        <div key={`guess-words-meaning-${i}`}>
          <span className="text-md text-white">
            {t[0]}. {t[1]}
          </span>
        </div>
      ))}
    </div>
  );
}

function Example({
  examples,
  word,
  value,
}: Pick<FormalWord, "examples" | "word"> & { value: string }) {
  const t = useLocale();
  const { config } = useRootContext();
  const { pronounce, cancel, playing } = usePronounce();
  const onSoundClick = (text: string) => {
    if (playing) {
      cancel();
    }
    pronounce(text);
  };

  const listTobeShow = examples
    .map((v) => splitWordFromSentence(word, value, v.sentence))
    .filter((v) => !!v);

  return (
    <div>
      <div className="text-sm text-fuchsia-100">
        {t("home_guess_word_examples_title")}:
      </div>
      {!listTobeShow.length ? (
        <div className="w-full text-center">
          {t("home_guess_word_examples_empty_error")}
        </div>
      ) : (
        <div>
          {listTobeShow.map((v, i) => (
            <div className="flex" key={`guess-words-example-${i}`}>
              <span className={`text-sm`}>{i + 1}.</span>
              <div>
                <div className={`mb-2 flex flex-col ${notoSans.className}`}>
                  <div className="text-sm leading-tight text-white">
                    <span>{v[0]}</span>
                    <span className="relative">
                      <span className="border-b-[1px] border-emerald-200 text-transparent">
                        {v[1]}
                      </span>
                      <span className="absolute inset-0">
                        {value.slice(0, word.length)}
                      </span>
                    </span>
                    <span className="leading-tight">{v[2]}</span>
                    &nbsp;
                    <span
                      className="inline-block h-4 translate-y-0.5 md:hover:cursor-pointer md:hover:text-slate-300"
                      onClick={() => onSoundClick(v[0] + word + v[2])}
                    >
                      <Sound />
                    </span>
                  </div>
                  {config.guessWord.showExamplesInterpretation && (
                    <div>{examples[i].translation}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function splitWordFromSentence(word: string, value: string, sentence: string) {
  if (!sentence.includes(word)) {
    return null;
  }
  const [start, end] = sentence.split(word);
  const mask = word;
  return [start, mask, end] as const;
}

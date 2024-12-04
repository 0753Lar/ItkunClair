import { useLocale } from "@/hooks/useLocale";
import { montserrat } from "../fonts";
import Sound from "@/components/icons/Sound";
import { fetchFormalWords } from "@/lib/mongoose/actions/fetchWords";
import { mapWordModal, useQuizContext } from "../context/quizContext";
import { useCallback, useEffect, useState } from "react";
import { FormalWord } from "@/ai/data/template/word";
import Loading from "@/components/icons/Loading";
import { pronounce, PronounceOptions, sleep, Voice } from "@/utils";
import Pagination from "@/components/Pagination";
import Switch from "@/components/icons/Switch";
import Congratulation from "@/components/Congratulation";
import { Pause } from "@/components/icons/Pause";

export default function ListenVoice() {
  const { quiz, quizcount } = useQuizContext();
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [quizList, setQuizList] = useState<FormalWord[]>([]);
  const [finishedRound, setFinishedRound] = useState(false);
  const [showWording, setShowWording] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [showChinese, setShowChinese] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [voice, setVoice] = useState<Voice | null>(null);

  const t = useLocale();

  const requestList = () => {
    setLoading(true);
    fetchFormalWords(mapWordModal(quiz), quizcount).then((res) => {
      setLoading(false);
      setQuizList(res);
      setCurrent(0);
    });
  };

  const handlePronounce = async (text: string, options?: PronounceOptions) => {
    return new Promise<void>(async (resolve, reject) => {
      setPlaying(true);
      const voice = await pronounce(text, {
        ...options,
        onend() {
          setVoice(null);
          setPlaying(false);
          resolve();
        },
        onerror(e) {
          setVoice(null);
          setPlaying(false);
          console.error("pronounce error: ", e);
          reject();
        },
      });
      setVoice(voice);
      voice.play();
    });
  };

  const playCurrent = useCallback(async () => {
    await handlePronounce(quizList[current].word, { accent: "uk" });
    await handlePronounce(quizList[current].word, { accent: "us" });
    for (let i = 0; i < quizList[current].examples.length; i++) {
      const element = quizList[current].examples[i];
      await handlePronounce(element.sentence, { accent: "uk", rate: 0.7 });
      await sleep(100);
    }
    await handlePronounce(Object.values(quizList[current].meaning)[0], {
      accent: "zh",
      rate: 1,
    });
    await handlePronounce(quizList[current].word, { accent: "uk" });
    await handlePronounce(quizList[current].word, { accent: "us" });
  }, [current, quizList]);

  const onClick = () => {
    if (playing) {
      if (autoPlay) {
        setAutoPlay(false);
      }
      voice?.cancel();
      setPlaying(false);
      setVoice(null);
    } else {
      playCurrent();
    }
  };

  useEffect(() => {
    requestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, quizcount]);

  useEffect(() => {
    if (autoPlay) {
      playCurrent().then(() =>
        setTimeout(() => {
          if (current === quizcount - 1) {
            setFinishedRound(true);
          } else {
            setCurrent(current + 1);
          }
        }, 300),
      );
    }
  }, [autoPlay, current, playCurrent, quizcount]);

  return (
    <div className={`flex flex-col gap-2 ${montserrat.className}`}>
      <div className="flex items-baseline justify-between md:text-lg">
        <span>{t("home_quiz_type_listen_voice")}</span>
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
        <div>
          <div className={`card flex flex-col gap-2 md:w-full`}>
            <div className="flex items-center justify-between">
              <div>auto play</div>
              <Switch
                onToggle={(val) => {
                  setPlaying(val);
                  setAutoPlay(val);
                }}
                isOn={autoPlay}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>show wording</div>
              <Switch onToggle={setShowWording} isOn={showWording} />
            </div>
            <div className="flex items-center justify-between">
              <div>show Meaning</div>
              <Switch onToggle={setShowMeaning} isOn={showMeaning} />
            </div>
            <div className="flex items-center justify-between">
              <div>show Chinese</div>
              <Switch
                disabled={!showWording}
                onToggle={setShowChinese}
                isOn={showChinese}
              />
            </div>

            <div className="flex flex-col items-center py-2">
              <span className="h-10" onClick={onClick}>
                {playing ? <Sound /> : <Pause />}
              </span>
              <span>click to {playing ? "pause" : "play"}</span>
            </div>

            {showWording && <div>{quizList[current].word}</div>}
            {showMeaning && (
              <div>
                {Object.entries(quizList[current].meaning).map((v, i) => (
                  <div key={`wording-${i}`}>
                    {v[0]}. {v[1]}
                  </div>
                ))}
              </div>
            )}
            {showWording && (
              <div>
                {quizList[current].examples.map((v, i) => (
                  <div key={`wording-${i}`} className="text-sm md:text-base">
                    <div>
                      {" "}
                      {i + 1}. {v.sentence}
                    </div>
                    {showChinese && <div>{v.translation}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSection() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loading className="fill-slate-200 text-transparent" />
    </div>
  );
}

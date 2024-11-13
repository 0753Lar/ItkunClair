import { IWord } from "@/lib/mongoose/models/Word";
import { createRef, KeyboardEventHandler, useEffect, useState } from "react";
import "animate.css";

const animateDuration = 500;

type InputStatus = "success" | "error" | "normal";
interface TranslationProps {
  item: IWord;
  onDone: () => void;
}
export default function Translation({ item, onDone }: TranslationProps) {
  const [status, setStatus] = useState<InputStatus>("normal");
  const [value, setValue] = useState("");
  const isSuccess = status === "success";
  const isError = status === "error";

  console.log(item);

  const inputRef = createRef<HTMLInputElement>();
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    if (status !== "normal") {
      // todo: add debounce
      setTimeout(() => {
        setStatus("normal");
        if (isSuccess) {
          setValue("");
          onDone();
        }
      }, animateDuration);
    }
  }, [isSuccess, onDone, status]);

  const validate = (val: string) => {
    if (val.trim() === item.word.trim()) {
      setStatus("success");
    } else {
      setStatus("error");
      console.dir(item);
    }
  };

  const onKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === "Enter") {
      validate((e.target as HTMLInputElement).value);
    }
  };

  return (
    <div
      className={`gap-2 flex flex-col md:flex-row animate__animated ${
        isSuccess
          ? "animate__backOutDown"
          : "animate__fadeInDownBig animate__faster"
      }`}
    >
      <div className="card flex flex-col md:w-full gap-4">
        <div>
          <div className="text-sm text-slate-200">中文释义: </div>
          {item.translations.map((t, i) => (
            <div key={`translations-${i} text-md`}>
              {t.type}. {t.translation}
            </div>
          ))}
        </div>

        <div>
          <label className={`mb-2 mt-4 text-sm text-left text-slate-200`}>
            输入单词:
          </label>
          <input
            onKeyDown={onKeydown}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            ref={inputRef}
            type="text"
            className={`border bg-transparent rounded-md text-md outline-none  block w-full p-1
              animate__animated
              ${
                isError ? "animate__headShake border-red-500 text-red-200" : ""
              }  `}
          />
        </div>
      </div>
    </div>
  );
}

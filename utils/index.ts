export interface PronounceOptions {
  accent?: "us" | "uk" | "zh";
  rate?: number;
  onend?: () => void;
  onerror?: (e: unknown) => void;
}

export type Voice = {
  play: () => void;
  pause: () => void;
  cancel: () => void;
};

export async function pronounce(
  text: string,
  options?: PronounceOptions,
): Promise<Voice> {
  if (isSpeechSynthesisSupported()) {
    try {
      const voices = await getVoices();

      const lang =
        options?.accent === "us"
          ? "en-US"
          : options?.accent === "zh"
            ? "zh-CN"
            : "en-GB";

      const langs = voices.filter((v) => v.lang === lang);
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.voice = langs[0];
      utterance.pitch = 0.8;
      utterance.rate = options?.rate ?? 0.8;
      utterance.onend = () => {
        options?.onend?.();
      };
      utterance.onerror = (e) => {
        if (!["interrupted", "canceled"].includes(e.error)) {
          console.error("utterance error, trying fallbackSpeak, error: ", e);
          return fallbackSpeak(text, options);
        } else {
          options?.onerror?.(e);
        }
      };

      return {
        play: () => speechSynthesis.speak(utterance),
        pause: speechSynthesis.pause,
        cancel: () => speechSynthesis.cancel(),
      };
    } catch (error) {
      console.warn("Speech synthesis failed:", error);
      return fallbackSpeak(text, options);
    }
  } else {
    console.warn("SpeechSynthesis not supported, using fallback.");
    return fallbackSpeak(text, options);
  }
}

export function isSpeechSynthesisSupported() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function fallbackSpeak(text: string, options?: PronounceOptions): Voice {
  const audio = new Audio(
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${text.replaceAll(" ", "+")}`,
  );
  audio.onended = () => options?.onend?.();
  audio.onerror = (e) => options?.onerror?.(e);

  return {
    play: () => audio.play().catch((e) => options?.onerror?.(e)),
    pause: audio.pause,
    cancel: () => {
      audio.pause();
      audio.currentTime = 0;
    },
  };
}

async function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length !== 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = function () {
        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) {
          setTimeout(() => {
            getVoices().then(resolve);
          }, 300);
        } else {
          resolve(voices);
        }
      };
    }
  });
}

export function camel2Snake<T extends string>(str: T): CamelToSnake<T> {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase() as CamelToSnake<T>;
}

type CamelToSnake<T extends string> = T extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? `_${Lowercase<First>}${CamelToSnake<Rest>}`
    : `${First}${CamelToSnake<Rest>}`
  : T;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

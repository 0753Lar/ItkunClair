interface PronounceOptions {
  accent?: "us" | "uk" | "zh";
  rate?: number;
  cancel?: () => void;
}

export async function pronounce(text: string, options?: PronounceOptions) {
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
      // console.log(">> langs: ", langs);

      return await new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.voice = langs[0];
        utterance.pitch = 0.8;
        utterance.rate = options?.rate ?? 0.8;
        utterance.onend = resolve;
        utterance.onerror = (e) => {
          console.error("Speech synthesis error:", e.error);
          fallbackSpeak(text).then(resolve).catch(reject);
        };
        speechSynthesis.speak(utterance);
      });
    } catch (error) {
      console.error("Speech synthesis failed:", error);
      return await fallbackSpeak(text);
    }
  } else {
    console.warn("SpeechSynthesis not supported, using fallback.");
    return await fallbackSpeak(text);
  }
}

export function isSpeechSynthesisSupported() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

async function fallbackSpeak(text: string) {
  const audio = new Audio(
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${text.replaceAll(" ", "+")}`,
  );
  return await new Promise((resolve, reject) => {
    audio.onended = resolve;
    audio.onerror = reject;
    audio.play();
  });
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

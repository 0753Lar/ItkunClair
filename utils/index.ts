export async function pronounce(text: string, accent?: "us" | "uk") {
  if (isSpeechSynthesisSupported()) {
    try {
      const voices = await getVoices();
      const accents = voices.filter((v) =>
        accent === "us" ? v.lang === "en-US" : v.lang === "en-GB",
      );
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = accents[1];
      utterance.pitch = 0.8;
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e.error);
        fallbackSpeak(text);
      };
    } catch (error) {
      console.error("Speech synthesis failed:", error);
      fallbackSpeak(text);
    }
  } else {
    console.warn("SpeechSynthesis not supported, using fallback.");
    fallbackSpeak(text);
  }
}

export function isSpeechSynthesisSupported() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function fallbackSpeak(text: string) {
  const audio = new Audio(
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${text.replaceAll(" ", "+")}`,
  );
  audio.play();
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

export function pronounce(text: string, accent?: "us" | "uk") {
  if (isSpeechSynthesisSupported()) {
    try {
      if (!speechSynthesis.onvoiceschanged) {
        speechSynthesis.onvoiceschanged = () => {
          const voices = speechSynthesis.getVoices();
          const accents = voices.filter((v) =>
            accent === "us" ? v.lang === "en-US" : v.lang === "en-GB",
          );
          utterance.voice = accents[2];
        };
      }
      const utterance = new SpeechSynthesisUtterance(text);

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

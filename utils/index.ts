import { useLayoutEffect } from "react";

export function useSound() {
  useLayoutEffect(() => {
    speechSynthesis?.getVoices();
  }, []);
  return;
}

export function pronounce(word: string, accent?: string) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.9;

    const voices = speechSynthesis.getVoices();
    const voice = voices.find((v) =>
      accent === "us" ? v.lang === "en-US" : v.lang === "en-GB",
    );
    if (voice) {
      utterance.voice = voice;
    }
    speechSynthesis.speak(utterance);
  } else {
    let audioEl = document.getElementById(
      "tts-audio",
    ) as HTMLAudioElement | null;

    if (!audioEl) {
      audioEl = document.createElement("audio");
      audioEl.setAttribute("id", "tts-audio");
      audioEl.style.width = "0";
      audioEl.style.height = "0";
      document.body.appendChild(audioEl);
    }
    audioEl.src = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${word.replaceAll(" ", "+")}`;
    audioEl.play();
  }
}

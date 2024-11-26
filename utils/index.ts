export function pronounce(word: string, accent?: string) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) =>
    accent === "us" ? v.lang === "en-US" : v.lang === "en-GB",
  );
  if (voice) {
    utterance.voice = voice;
  }
  speechSynthesis.speak(utterance);
}

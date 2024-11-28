export function pronounce(word: string) {
  let audioEl = document.getElementById("tts-audio") as HTMLAudioElement | null;

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

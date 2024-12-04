import { pronounce, PronounceOptions, Voice } from "@/utils";
import { useState } from "react";

export function usePronounce() {
  const [playing, setPlaying] = useState(false);
  const [voice, setVoice] = useState<Voice | null>(null);

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
          reject(e);
        },
      });
      setVoice(voice);
      voice.play();
    });
  };

  const cancel = () => {
    voice?.cancel();
    setPlaying(false);
    setVoice(null);
  };

  return {
    pronounce: handlePronounce,
    playing,
    cancel,
  };
}

import { QuizContextInterface } from "@/app/context/quizContext";
import { rootContextInterface } from "@/app/context/rootContext";

const ITKUNCLAIR = "itkunclair";
type PersistentData = Pick<
  rootContextInterface,
  "theme" | "language" | "config"
> &
  Pick<QuizContextInterface, "quiz" | "quizType" | "quizcount">;
export function getPersistentData() {
  const persistentStr = window.localStorage.getItem(ITKUNCLAIR);
  let persistentObj: PersistentData | null = null;

  try {
    persistentObj = persistentStr ? JSON.parse(persistentStr) : null;
  } catch (error) {
    console.error(error);
  }
  if (!persistentObj) {
    persistentObj = {
      theme: "light",
      language: "en",
      config: {
        guessWord: {
          showMeaning: true,
          showExamples: true,
          showExamplesInterpretation: false,
          exampleLimit: 3,
          autoPronounce: false,
        },
        listenVoice: {
          autoPlay: false,
          showWording: true,
          showMeaning: true,
          showChinese: false,
        },
      },
      quiz: "Oxford3000",
      quizType: "guessWord",
      quizcount: 10,
    };
    setPersistentData(persistentObj);
  }
  return persistentObj;
}

export function setPersistentData(value: PersistentData) {
  window.localStorage.setItem(ITKUNCLAIR, JSON.stringify(value));
}

export function updatePersistenData<Key extends keyof PersistentData>(
  field: Key,
  value: PersistentData[Key],
) {
  const persistentData = getPersistentData();
  setPersistentData({ ...persistentData, ...{ [field]: value } });
}

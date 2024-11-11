import { Language } from "@/app/context/rootContext";

const dictionaries = {
  en: () =>
    import("../app/[lang]/locales/en.json").then((module) => module.default),
  zh: () =>
    import("../app/[lang]/locales/zh.json").then((module) => module.default),
};

export default async function loadLocate(lang: Language) {
  return await dictionaries[lang]();
}

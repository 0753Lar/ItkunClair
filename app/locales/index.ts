import { Language } from "../context/rootContext";
import EN from "./en.json";
import ZH from "./zh.json";

export type Keys = keyof typeof EN;

export const resources: { [K in Language]: { [K in Keys]: string } } = {
  zh: ZH,
  en: EN,
};

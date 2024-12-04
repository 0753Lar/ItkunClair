"use client";

import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { montserrat } from "../fonts";
import { getPersistentData, updatePersistenData } from "@/utils/persistent";

export type ThemeMode = "light" | "dark";

export type Language = "zh" | "en";

export type Config = {
  guessWord: {
    showMeaning: boolean;
    showExamples: boolean;
    showExamplesInterpretation: boolean;
    exampleLimit: number;
    autoPronounce: boolean;
  };
  listenVoice: {
    autoPlay: boolean;
    showWording: boolean;
    showMeaning: boolean;
    showChinese: boolean;
  };
};
export interface rootContextInterface {
  theme: ThemeMode;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  config: Config;
  updateConfig: (update: (old: Config) => Config) => void;
}

const rootContext = createContext<rootContextInterface | null>(null);

export const useRootContext = () =>
  useContext(rootContext) as unknown as rootContextInterface;

export const RootProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [language, setLanguage] = useState<Language>("en");
  const [config, setConfig] = useState<Config>({
    guessWord: {
      showMeaning: true,
      showExamples: true,
      showExamplesInterpretation: false,
      exampleLimit: 3, // the example count, only 3 currently
      autoPronounce: false,
    },
    listenVoice: {
      autoPlay: false,
      showWording: true,
      showMeaning: true,
      showChinese: false,
    },
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    updatePersistenData("theme", newTheme);
  };
  const toggleLanguage = () => {
    const newLang = language === "zh" ? "en" : "zh";
    setLanguage(newLang);
    updatePersistenData("language", newLang);
  };
  const updateConfig = (update: (old: Config) => Config) => {
    const newConfig = { ...update(config) };
    setConfig(newConfig);
    updatePersistenData("config", newConfig);
  };

  useEffect(() => {
    setTimeout(() => {
      const persistentData = getPersistentData();
      setConfig(persistentData.config);
      setTheme(persistentData.theme);
      setLanguage(persistentData.language);
    }, 300);
  }, []);
  return (
    <html className={theme} lang={language}>
      <rootContext.Provider
        value={{
          theme,
          toggleTheme,
          language,
          toggleLanguage,
          config,
          updateConfig,
        }}
      >
        <body
          className={`relative min-h-screen antialiased ${montserrat.className}`}
        >
          {children}
          <div id="portal" />
        </body>
      </rootContext.Provider>
    </html>
  );
};

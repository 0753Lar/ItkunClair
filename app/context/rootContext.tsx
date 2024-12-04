"use client";

import { PropsWithChildren, useContext, useState } from "react";
import { createContext } from "react";
import { montserrat } from "../fonts";

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

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleLanguage = () => setLanguage(language === "zh" ? "en" : "zh");
  const updateConfig = (update: (old: Config) => Config) => {
    setConfig({ ...update(config) });
  };
  return (
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
      <html className={theme} lang={language}>
        <body
          className={`relative min-h-screen antialiased ${montserrat.className}`}
        >
          {children}
          <div id="portal" />
        </body>
      </html>
    </rootContext.Provider>
  );
};

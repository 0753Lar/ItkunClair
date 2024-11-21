"use client";

import { PropsWithChildren, useContext, useState } from "react";
import { createContext } from "react";
import { montserrat } from "../fonts";

export type ThemeMode = "light" | "dark";

export type Language = "zh" | "en";

export type Config = {
  translation: {
    showMeaning: boolean;
    showExamples: boolean;
    exampleLimit: number;
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
    translation: {
      showMeaning: true,
      showExamples: true,
      exampleLimit: 3, // the example count, only 3 currently
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
          className={`relative h-[100vh] antialiased ${montserrat.className}`}
        >
          {children}
          <div id="portal" />
        </body>
      </html>
    </rootContext.Provider>
  );
};

"use client";

import { PropsWithChildren, useContext, useState } from "react";
import { createContext } from "react";
import { montserrat } from "../fonts";

export type ThemeMode = "light" | "dark";

export type Language = "zh" | "en";
export interface rootContextInterface {
  theme: ThemeMode;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
}

const rootContext = createContext<rootContextInterface | null>(null);

export const useRootContext = () =>
  useContext(rootContext) as unknown as rootContextInterface;

export const RootProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [language, setLanguage] = useState<Language>("en");

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleLanguage = () => setLanguage(language === "zh" ? "en" : "zh");
  return (
    <rootContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        toggleLanguage,
      }}
    >
      <html className={theme} lang={language}>
        <body
          className={`antialiased relative h-[100vh] ${montserrat.className}`}
        >
          {children}
        </body>
      </html>
    </rootContext.Provider>
  );
};

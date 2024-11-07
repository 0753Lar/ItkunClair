"use client";

import Background from "@/components/Backgound";
import Github from "@/components/Github";
import Toggle from "@/components/Toggle";
import localFont from "next/font/local";
import { createContext, useContext, useState } from "react";

export type ThemeMode = "light" | "dark";

const systemMode: ThemeMode = window.matchMedia("(prefers-color-scheme: dark)")
  .matches
  ? "dark"
  : "light";

interface ThemeContextInterface {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const themeContext = createContext<ThemeContextInterface | null>(null);

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>(systemMode);

  const contextValue = {
    theme,
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  };

  return (
    <themeContext.Provider value={contextValue}>
      <html lang="en" className={theme}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative h-[100vh]`}
        >
          <Background />
          <div className="flex flex-row justify-end py-2">
            <div className="flex items-center gap-2 mr-2">
              <Github />
              <Toggle />
            </div>
          </div>
          <main className="px-12 py-4">
            <div className="card">HOME</div>
          </main>
        </body>
      </html>
    </themeContext.Provider>
  );
}

export const useThemeContext = () =>
  useContext(themeContext) as unknown as ThemeContextInterface;

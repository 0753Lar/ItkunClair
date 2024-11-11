"use client";

import { ThemeMode, ThemeProvider } from "@/app/context/themeContext";
import { PropsWithChildren, useState } from "react";
import { montserrat, notoSans } from "../fonts";

interface HomeProps {
  background: React.ReactNode;
  header: React.ReactNode;
}
export default function Layout({
  background,
  header,
  children,
}: PropsWithChildren<HomeProps>) {
  const [theme, setTheme] = useState<ThemeMode>("light");

  const contextValue = {
    theme,
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  };

  return (
    <ThemeProvider value={contextValue}>
      <html lang="en" className={theme}>
        <body
          className={`antialiased relative h-[100vh] ${montserrat.className}`}
        >
          {header}
          {background}
          <main className={`${notoSans.className} mt-2`}>{children}</main>
        </body>
      </html>
    </ThemeProvider>
  );
}

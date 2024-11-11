import { useContext } from "react";
import { createContext } from "react";

export type ThemeMode = "light" | "dark";

interface ThemeContextInterface {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const themeContext = createContext<ThemeContextInterface | null>(null);

export const useThemeContext = () =>
  useContext(themeContext) as unknown as ThemeContextInterface;

export const ThemeProvider = themeContext.Provider;

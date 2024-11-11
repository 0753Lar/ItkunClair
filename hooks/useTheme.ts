import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useTheme() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme") === "dark" ? "dark" : "light";

  const toggleTheme = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("theme", theme === "dark" ? "light" : "dark");
    router.push(pathname + "?" + params);
  }, [router, pathname, searchParams, theme]);

  return [theme, toggleTheme] as const;
}

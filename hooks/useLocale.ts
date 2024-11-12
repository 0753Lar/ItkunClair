import { useRootContext } from "@/app/context/rootContext";
import { Keys, resources } from "@/app/locales";

export function useLocale() {
  const { language } = useRootContext();
  return (k: Keys) => resources[language][k];
}

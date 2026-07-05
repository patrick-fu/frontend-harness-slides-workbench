import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { translate, type TranslationKey } from "../i18n/translations";

const STORAGE_KEY = "fhsw:language";

interface LanguageContextValue {
  language: "en" | "zh";
  setLanguage: (lang: "en" | "zh") => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLanguage(): "en" | "zh" {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh") return stored;
  } catch {
    // localStorage unavailable (SSR or private mode)
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<"en" | "zh">(() =>
    readStoredLanguage(),
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((lang: "en" | "zh") => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translate(key as TranslationKey, language);
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

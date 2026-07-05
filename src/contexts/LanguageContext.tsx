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

type Language = "auto" | "en" | "zh";
type ResolvedLanguage = "en" | "zh";

interface LanguageContextValue {
  language: Language;
  resolvedLanguage: ResolvedLanguage;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "auto" || stored === "en" || stored === "zh") return stored;
  } catch {
    // localStorage unavailable (SSR or private mode)
  }
  return "auto";
}

function getNavigatorLanguage(): ResolvedLanguage {
  if (typeof navigator !== "undefined" && navigator.language) {
    if (navigator.language.toLowerCase().startsWith("zh")) return "zh";
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    readStoredLanguage(),
  );
  const [systemLanguage, setSystemLanguage] = useState<ResolvedLanguage>(() =>
    getNavigatorLanguage(),
  );

  // Listen for navigator language changes (rare but possible)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      setSystemLanguage(getNavigatorLanguage());
    };
    window.addEventListener("languagechange", handler);
    return () => window.removeEventListener("languagechange", handler);
  }, []);

  const resolvedLanguage: ResolvedLanguage =
    language === "auto" ? systemLanguage : language;

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translate(key as TranslationKey, resolvedLanguage);
    },
    [resolvedLanguage],
  );

  return (
    <LanguageContext.Provider
      value={{ language, resolvedLanguage, setLanguage, t }}
    >
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

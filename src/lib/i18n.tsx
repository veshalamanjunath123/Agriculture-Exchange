import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { enKeys } from "@/locales/en";
import { hi } from "@/locales/hi";
import { te } from "@/locales/te";
import { ta } from "@/locales/ta";
import { kn } from "@/locales/kn";
import { mr } from "@/locales/mr";
import { ml } from "@/locales/ml";
import { bn } from "@/locales/bn";
import { pa } from "@/locales/pa";

export type LangCode = "en" | "hi" | "te" | "ta" | "kn" | "mr" | "ml" | "bn" | "pa";

export const languages: { code: LangCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

/** Centralised dictionaries. Keys are the canonical English strings, so English needs no table. */
const dictionaries: Record<LangCode, Record<string, string>> = {
  en: {},
  hi,
  te,
  ta,
  kn,
  mr,
  ml,
  bn,
  pa,
};

const STORAGE_KEY = "agx.lang";
const warned = new Set<string>();

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  /** Translate an English source string; falls back to English, never to a raw key. */
  t: (key: string) => string;
  /** Translate with interpolation, e.g. t2("{n} km away", { n: 8.4 }). */
  tf: (key: string, vars: Record<string, string | number>) => string;
  langLabel: string;
};

const I18nContext = createContext<Ctx | null>(null);

function readStored(): LangCode {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return languages.some((l) => l.code === raw) ? (raw as LangCode) : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    setLangState(readStored());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string) => {
      if (lang === "en") return key;
      const dict = dictionaries[lang];
      const hit = dict[key];
      if (hit) return hit;
      if (import.meta.env.DEV) {
        const id = `${lang}:${key}`;
        if (!warned.has(id)) {
          warned.add(id);
          console.warn(`[i18n] missing ${lang} translation for: "${key}" (showing English)`);
        }
      }
      // English fallback — never surface a raw key.
      return key;
    },
    [lang],
  );

  const tf = useCallback(
    (key: string, vars: Record<string, string | number>) =>
      Object.entries(vars).reduce(
        (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
        t(key),
      ),
    [t],
  );

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t,
      tf,
      langLabel: languages.find((l) => l.code === lang)?.native ?? "English",
    }),
    [lang, setLang, t, tf],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

/** Dev helper: how much of each language is covered. */
export function coverageReport() {
  return languages
    .filter((l) => l.code !== "en")
    .map((l) => {
      const dict = dictionaries[l.code];
      const missing = enKeys.filter((k) => !dict[k]);
      return { lang: l.code, translated: enKeys.length - missing.length, missing };
    });
}

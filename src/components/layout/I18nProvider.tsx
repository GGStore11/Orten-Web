"use client";

import { useState, useCallback, ReactNode } from "react";
import { I18nContext, Locale, getTranslation } from "@/lib/i18n";

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");

  const t = useCallback(
    (key: string) => getTranslation(locale, key),
    [locale]
  );

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      <div dir={dir} className={locale === "ar" ? "font-cairo" : ""}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function LocalizedText({ id }) {
  const { t } = useLocale();
  return t(id);
}

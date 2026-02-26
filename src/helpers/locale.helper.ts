export type Locale = 'uz' | 'ru' | 'en';

/** Returns localized field value: field_uz / field_ru / field_en or fallback field */
export function getLocalized(obj: object | null | undefined, field: string, locale: Locale): string {
  if (!obj || typeof obj !== 'object') return '';
  const record = obj as Record<string, unknown>;
  const key = `${field}_${locale}`;
  const val = record[key];
  if (val != null && String(val).trim() !== '') return String(val);
  const fallback = record[field];
  if (fallback == null) return '';
  if (Array.isArray(fallback)) return (fallback as string[]).join(', ');
  return String(fallback);
}

/** Resolve i18n language to our locale (uz, ru, en) */
export function resolveLocale(lang: string | undefined): Locale {
  if (lang === 'uz' || lang === 'ru' || lang === 'en') return lang;
  return 'uz';
}

import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ja from './locales/ja.json'

export const SUPPORTED_LOCALES = ['ja', 'en'] as const
export type AppLocale = typeof SUPPORTED_LOCALES[number]
export const DEFAULT_LOCALE: AppLocale = 'ja'

// Nuxt 2 版 (@nuxtjs/i18n v7) の detectBrowserLanguage と同じ cookie を使い、選んだ言語を引き継ぎます。
export const LOCALE_COOKIE = 'i18n_redirected'
const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60

function isAppLocale (value: string | undefined): value is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value ?? '')
}

/**
 * 最初に表示する言語を決めます。cookie に保存した言語 > ブラウザの言語 > 日本語 の順です。
 */
export function detectInitialLocale (cookie: string, browserLanguages: readonly string[]): AppLocale {
  const saved = cookie
    .split(';')
    .map(entry => entry.trim().split('='))
    .find(([key]) => key === LOCALE_COOKIE)?.[1]
  if (isAppLocale(saved)) {
    return saved
  }
  const browser = browserLanguages
    .map(language => language.toLowerCase().split('-')[0])
    .find(isAppLocale)
  return browser ?? DEFAULT_LOCALE
}

export function persistLocale (locale: AppLocale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`
  document.documentElement.lang = locale
}

export function createAppI18n (locale: AppLocale = DEFAULT_LOCALE) {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages: { ja, en }
  })
}

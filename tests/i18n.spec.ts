import { describe, expect, test } from 'vitest'
import { detectInitialLocale, LOCALE_COOKIE } from '../src/i18n'
import en from '../src/locales/en.json'
import ja from '../src/locales/ja.json'

describe('detectInitialLocale', () => {
  test.each([
    [`${LOCALE_COOKIE}=en`, ['ja-JP'], 'en'],
    [`other=1; ${LOCALE_COOKIE}=ja`, ['en-US'], 'ja'],
    ['', ['en-US', 'ja'], 'en'],
    ['', ['fr-FR'], 'ja'],
    [`${LOCALE_COOKIE}=fr`, [], 'ja']
  ])('cookie %j and browser languages %j start in %s', (cookie, languages, expected) => {
    expect(detectInitialLocale(cookie, languages)).toBe(expected)
  })
})

describe('locale files', () => {
  test('Japanese and English define the same message keys', () => {
    expect(Object.keys(en.indexPage).sort()).toEqual(Object.keys(ja.indexPage).sort())
  })
})

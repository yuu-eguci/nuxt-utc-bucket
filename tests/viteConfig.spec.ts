import { describe, expect, test } from 'vitest'
import { GITHUB_PAGES_BASE, resolveBase } from '../vite.config'

describe('build base path', () => {
  test('GitHub Pages builds keep the existing /nuxt-utc-bucket/ URL', () => {
    expect(resolveBase('github-pages')).toBe('/nuxt-utc-bucket/')
    expect(GITHUB_PAGES_BASE).toBe('/nuxt-utc-bucket/')
  })

  test.each(['development', 'production', 'test'])('%s mode serves from the root', (mode) => {
    expect(resolveBase(mode)).toBe('/')
  })
})

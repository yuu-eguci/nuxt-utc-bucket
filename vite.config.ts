import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import vuetify from 'vite-plugin-vuetify'

// GitHub Pages serves this app from https://yuu-eguci.github.io/nuxt-utc-bucket/
export const GITHUB_PAGES_BASE = '/nuxt-utc-bucket/'

export function resolveBase (mode: string): string {
  return mode === 'github-pages' ? GITHUB_PAGES_BASE : '/'
}

export default defineConfig(({ mode }) => ({
  base: resolveBase(mode),
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts'],
    setupFiles: ['tests/setup.ts'],
    server: {
      deps: {
        inline: ['vuetify']
      }
    }
  }
}))

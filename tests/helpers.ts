import { vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Component } from 'vue'
import { createVuetify } from 'vuetify'
import { createAppI18n, type AppLocale } from '../src/i18n'

export function mountWithPlugins (component: Component, props: Record<string, unknown> = {}, locale: AppLocale = 'ja') {
  return mount(component, {
    props,
    global: {
      plugins: [createVuetify(), createAppI18n(locale)]
    }
  })
}

export function mockClipboard (writeText: (text: string) => Promise<void>) {
  const spy = vi.fn(writeText)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: spy }, configurable: true })
  return spy
}

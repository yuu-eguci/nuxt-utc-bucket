import { afterEach, describe, expect, test } from 'vitest'
import TheDescription from '../../src/components/TheDescription.vue'
import { LOCALE_COOKIE } from '../../src/i18n'
import { mountWithPlugins } from '../helpers'

describe('TheDescription', () => {
  afterEach(() => {
    document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`
  })

  test('switching to English updates the text, the cookie and <html lang>', async () => {
    const wrapper = mountWithPlugins(TheDescription)
    expect(wrapper.text()).toContain('UTC を打てば JST にするし')

    const english = wrapper.findAll('button').find(button => button.text() === 'English')
    await english?.trigger('click')

    expect(wrapper.text()).toContain('If UTC is typed, it is set to JST')
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=en`)
    expect(document.documentElement.lang).toBe('en')
  })

  test('the bucket button emits showBucket', async () => {
    const wrapper = mountWithPlugins(TheDescription)
    const bucket = wrapper.findAll('button').find(button => button.text() === 'バケツをまた開ける')
    await bucket?.trigger('click')
    expect(wrapper.emitted('showBucket')).toHaveLength(1)
  })
})

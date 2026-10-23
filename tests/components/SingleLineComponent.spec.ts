import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import SingleLineComponent from '../../src/components/SingleLineComponent.vue'
import { mockClipboard, mountWithPlugins } from '../helpers'

const props = { fromTz: 'UTC', toTz: 'Asia/Tokyo' }

describe('SingleLineComponent', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('typing a UTC datetime shows JST, including a lowercase z suffix', async () => {
    const wrapper = mountWithPlugins(SingleLineComponent, props)
    await wrapper.find('input').setValue('2023-06-30 15:00:00z')
    expect(wrapper.find('[data-test="result"]').text()).toContain('2023-07-01T00:00:00+09:00')
  })

  test('clicking an empty result does not touch the clipboard', async () => {
    const writeText = mockClipboard(async () => {})
    const wrapper = mountWithPlugins(SingleLineComponent, props)
    await wrapper.find('[data-test="result"]').trigger('click')
    await flushPromises()
    expect(writeText).not.toHaveBeenCalled()
    expect(wrapper.find('[data-test="copy-state"]').exists()).toBe(false)
  })

  test('a successful copy shows the copied label for 3 seconds', async () => {
    vi.useFakeTimers()
    const writeText = mockClipboard(async () => {})
    const wrapper = mountWithPlugins(SingleLineComponent, props)
    await wrapper.find('input').setValue('2023-12-31 23:00:00')
    await wrapper.find('[data-test="result"]').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('2024-01-01T08:00:00+09:00')
    expect(wrapper.find('[data-test="copy-state"]').text()).toBe('コピーしたよ')

    vi.advanceTimersByTime(3000)
    await flushPromises()
    expect(wrapper.find('[data-test="copy-state"]').exists()).toBe(false)
  })

  test('a rejected clipboard write shows an error instead of throwing', async () => {
    // Vitest fails the run on unhandled rejections, so this also proves nothing is re-thrown.
    mockClipboard(async () => {
      throw new DOMException('Write permission denied.', 'NotAllowedError')
    })
    const wrapper = mountWithPlugins(SingleLineComponent, props, 'en')
    await wrapper.find('input').setValue('2023-12-31 23:00:00')
    await wrapper.find('[data-test="result"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-test="copy-state"]').text()).toBe('Could not copy')
  })
})

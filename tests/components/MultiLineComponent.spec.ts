import { flushPromises } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import MultiLineComponent from '../../src/components/MultiLineComponent.vue'
import { mockClipboard, mountWithPlugins } from '../helpers'

describe('MultiLineComponent', () => {
  // A textarea normalizes CRLF to LF in its value (HTML spec), so the component sees LF;
  // CRLF handling of the conversion itself is covered in tests/utils.
  test('pasted CRLF text is converted line by line, blank lines included', async () => {
    const writeText = mockClipboard(async () => {})
    const wrapper = mountWithPlugins(MultiLineComponent, { fromTz: 'Asia/Tokyo', toTz: 'UTC' })
    await wrapper.find('textarea').setValue('2023-04-29 09:00:00\r\n\r\n2023-04-30T09:00:00+09:00')
    await wrapper.find('[data-test="result"]').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('2023-04-29T00:00:00Z\n\n2023-04-30T00:00:00Z')
    expect(wrapper.find('[data-test="copy-state"]').text()).toBe('コピーしたよ')
  })
})

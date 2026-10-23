import { onBeforeUnmount, ref, type Ref } from 'vue'

export type CopyState = 'idle' | 'copied' | 'failed'

const MESSAGE_DURATION_MS = 3000

/**
 * 変換結果をクリップボードにコピーし、3 秒間だけ結果 (コピーした / できなかった) を表示します。
 * SingleLineComponent と MultiLineComponent で共通です。
 */
export function useCopy (text: Ref<string>) {
  const state = ref<CopyState>('idle')
  let timer: ReturnType<typeof setTimeout> | undefined

  function show (next: CopyState): void {
    state.value = next
    clearTimeout(timer)
    timer = setTimeout(() => {
      state.value = 'idle'
    }, MESSAGE_DURATION_MS)
  }

  async function copy (): Promise<void> {
    // 空文字列の場合はコピーせず、通知も表示しません。
    if (text.value === '') {
      return
    }
    try {
      await navigator.clipboard.writeText(text.value)
      show('copied')
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('Failed to copy text', err)
      }
      show('failed')
    }
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { state, copy }
}

import { Plugin } from '@nuxt/types'

// NOTE: _ をつけると、 "使わない引数なので気にしないでね" という意味になる。らしい。
const myPlugin: Plugin = (context, inject) => {
  // 開発環境でのみ console.log する関数を、 plugin として inject します。
  if (context.isDev) {
    // eslint-disable-next-line no-console
    inject('debug', (...args: any[]) => console.log(...args))
    return
  }
  inject('debug', () => {})
}

export default myPlugin

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md2 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import colors from 'vuetify/util/colors'

// Nuxt 2 版 (@nuxtjs/vuetify) と同じダークテーマの色です。
export const themeColors = {
  primary: colors.blue.darken2,
  accent: colors.grey.darken3,
  secondary: colors.amber.darken3,
  info: colors.teal.lighten1,
  warning: colors.amber.base,
  error: colors.deepOrange.accent4,
  success: colors.green.accent3,
  // Vuetify 2 と同じく、アンバーのボタンの文字を白にします。
  'on-secondary': '#FFFFFF'
}

export const vuetify = createVuetify({
  // Vuetify 2 に近い見た目にするため Material Design 2 の blueprint を使います。
  blueprint: md2,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: themeColors
      }
    }
  }
})

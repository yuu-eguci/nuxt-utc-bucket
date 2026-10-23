import { createApp } from 'vue'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import App from './App.vue'
import { createAppI18n, detectInitialLocale, persistLocale } from './i18n'
import { vuetify } from './plugins/vuetify'

const locale = detectInitialLocale(document.cookie, navigator.languages)
persistLocale(locale)

createApp(App)
  .use(createAppI18n(locale))
  .use(vuetify)
  .mount('#app')

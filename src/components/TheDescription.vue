<template>
  <v-card
    class="mt-4"
  >
    <v-card-title class="text-headline-small">
      Nuxt UTC Bucket
    </v-card-title>
    <v-card-text>
      {{ t('indexPage.description') }}
    </v-card-text>
    <v-card-text>
      {{ t('indexPage.descriptionMultiple') }}
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="secondary"
        variant="flat"
        :disabled="locale === 'en'"
        @click="setLocale('en')"
      >
        English
      </v-btn>
      <v-btn
        color="secondary"
        variant="flat"
        :disabled="locale === 'ja'"
        @click="setLocale('ja')"
      >
        日本語でおｋ
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="secondary"
        variant="flat"
        :prepend-icon="mdiPailOutline"
        @click="emit('showBucket')"
      >
        {{ t('indexPage.showBucket') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { mdiPailOutline } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { persistLocale, type AppLocale } from '@/i18n'

const emit = defineEmits<{
  showBucket: []
}>()

const { t, locale } = useI18n()

function setLocale (next: AppLocale): void {
  locale.value = next
  persistLocale(next)
}
</script>

<template>
  <v-card
    class="mt-4"
  >
    <v-card-title class="headline">
      Nuxt UTC Bucket
    </v-card-title>
    <v-card-text>
      {{ $t('indexPage.description') }}
    </v-card-text>
    <v-card-text>
      {{ $t('indexPage.descriptionMultiple') }}
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="secondary"
        :disabled="$i18n.locale === 'en'"
        @click="$i18n.setLocale('en')"
      >
        English
      </v-btn>
      <v-btn
        color="secondary"
        :disabled="$i18n.locale === 'ja'"
        @click="$i18n.setLocale('ja')"
      >
        日本語でおｋ
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="secondary"
        @click="showBucketFunction"
      >
        <v-icon
          class="mr-2"
        >
          mdi-pail-outline
        </v-icon>
        {{ $t('indexPage.showBucket') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TheDescription',
  props: {
    showBucketFunction: {
      type: Function,
      required: true
    }
  }
})
</script>

<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-text-field
        v-model="utcInput"
        :counter="20"
        label="UTC"
        outlined
        style="font-size: 1.3rem; padding: 0.5rem 0;"
      />
      <v-card
        :ripple="false"
        @click="copyUtcConverted"
      >
        <v-card-subtitle>
          JST
        </v-card-subtitle>
        <v-card-text
          class="d-flex align-center justify-center font-weight-bold"
          style="font-size: 1.3rem; padding: 0.5rem 0;"
        >
          {{ utcConverted }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <template
            v-if="utcConvertedCopied"
          >
            {{ $t('indexPage.copied') }}
          </template>
          <v-icon
            fab
            class="ml-2"
            small
          >
            mdi-content-copy
          </v-icon>
        </v-card-actions>
      </v-card>
      <v-card
        class="mt-4"
      >
        <v-card-title class="headline">
          Nuxt UTC Bucket
        </v-card-title>
        <v-card-text>
          <p>
            {{ $t('indexPage.description') }}
          </p>
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
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export default Vue.extend({
  name: 'IndexPage',
  data () {
    return {
      innerUtcInput: '',
      utcConverted: '',
      utcConvertedCopied: false
    }
  },
  computed: {
    utcInput: {
      get () {
        return this.innerUtcInput
      },
      set (value: string) {
        this.innerUtcInput = value
        try {
          this.utcConverted = (dayjs as any).tz(value, 'utc').tz('Asia/Tokyo').format()
        } catch (err: unknown) {
          this.utcConverted = (err as any).message
        }
      }
    }
  },
  methods: {
    async copyUtcConverted () {
      try {
        this.$debug(`Copy text: ${this.utcConverted}`)
        await navigator.clipboard.writeText(this.utcConverted)
        this.utcConvertedCopied = true
        setTimeout(() => {
          this.utcConvertedCopied = false
        }, 3000)
      } catch (err) {
        this.$debug(`Failed to copy text: ${this.utcConverted}`)
      }
    }
  }
})
</script>

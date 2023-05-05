<template>
  <div>
    <v-text-field
      v-model="inputText"
      :label="fromTz"
      outlined
      style="font-size: 1.3rem; padding: 0.5rem 0;"
    />
    <v-card
      :ripple="false"
      @click="copyConvertedText"
    >
      <v-card-subtitle>
        {{ toTz }}
      </v-card-subtitle>
      <v-card-text
        class="d-flex align-center justify-center font-weight-bold"
        style="font-size: 1.3rem; padding: 0.5rem 0;"
      >
        {{ convertedText }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <template
          v-if="copied"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { convertDatetime } from '@/utils/CommonUtils'

export default Vue.extend({
  name: 'MainComponent',
  props: {
    fromTz: {
      type: String,
      required: true
    },
    toTz: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      innerInputText: '',
      convertedText: '',
      copied: false
    }
  },
  computed: {
    inputText: {
      get () {
        return (this as any).innerInputText
      },
      set (value: string) {
        this.innerInputText = value
        this.convertedText = convertDatetime(value, this.fromTz, this.toTz)
      }
    }
  },
  methods: {
    async copyConvertedText () {
      try {
        this.$debug(`Copy text: ${this.convertedText}`)
        await navigator.clipboard.writeText(this.convertedText)
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 3000)
      } catch (err) {
        this.$debug(`Failed to copy text: ${this.convertedText}`)
      }
    }
  }
})
</script>

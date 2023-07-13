<template>
  <div>
    <v-text-field
      v-model="inputText"
      :label="fromTz"
      :autofocus="autofocus"
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
  name: 'SingleLineComponent',
  props: {
    fromTz: {
      type: String,
      required: true
    },
    toTz: {
      type: String,
      required: true
    },
    autofocus: {
      type: Boolean,
      default: false
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
      get (): string {
        return this.innerInputText
      },
      set (value: string) {
        this.innerInputText = value
        this.convertedText = convertDatetime(value, this.fromTz, this.toTz)
      }
    }
  },
  methods: {
    // NOTE: MultiLineComponent と重複しているのだが、これを共通化するには
    //       Mixin, Composition API などを使う必要があるっぽくて、どれも今回は不可。
    async copyConvertedText () {
      if (this.convertedText === '') {
        return
      }
      try {
        this.$debug(`Copy text: ${this.convertedText}`)
        await navigator.clipboard.writeText(this.convertedText)
      } catch (err) {
        this.$debug(`Failed to copy text: ${this.convertedText}`)
        throw err
      }
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 3000)
    }
  }
})
</script>

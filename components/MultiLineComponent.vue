<template>
  <div>
    <v-textarea
      v-model="inputText"
      :label="fromTz"
      outlined
      no-resize
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
        <!-- NOTE: 改行すると white-space: pre-line; が改行を表示してしまうので、改行を消している。 -->
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="multiline-text">{{ convertedText }}</div>
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
import { convertDatetimeLines } from '@/utils/CommonUtils'

export default Vue.extend({
  name: 'MultiLineComponent',
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

        // ここだけ SingleLineComponent と違う。
        // 複数行のテキストを変換する。
        this.convertedText = convertDatetimeLines(value, this.fromTz, this.toTz)
      }
    },

    convertedTextWithBr (): string {
      return this.convertedText.replace(/\n/g, '<br>')
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

<style scoped>
.multiline-text {
  /*
    改行文字（\n）がある場所で改行される。
    連続する半角スペースやタブ文字は、1つの半角スペースとして扱われる。
    文字列の先頭や末尾の空白（スペースやタブ）は削除される。
  */
  white-space: pre-line;
  /*
    5行以上の場合に省略記号（...）を表示する
  */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}
</style>

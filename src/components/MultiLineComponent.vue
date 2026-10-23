<template>
  <div>
    <v-textarea
      v-model="inputText"
      :label="fromTz"
      variant="outlined"
      no-resize
    />
    <v-card
      :ripple="false"
      data-test="result"
      @click="copy"
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
        <span
          v-if="state !== 'idle'"
          data-test="copy-state"
        >
          {{ state === 'copied' ? t('indexPage.copied') : t('indexPage.copyFailed') }}
        </span>
        <v-icon
          class="ml-2"
          size="small"
          :icon="mdiContentCopy"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { mdiContentCopy } from '@mdi/js'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCopy } from '@/composables/useCopy'
import { convertDatetimeLines } from '@/utils/CommonUtils'

const props = defineProps<{
  fromTz: string
  toTz: string
}>()

const { t } = useI18n()
const inputText = ref('')
// ここだけ SingleLineComponent と違う。複数行のテキストを変換する。
const convertedText = computed(() => convertDatetimeLines(inputText.value, props.fromTz, props.toTz))
const { state, copy } = useCopy(convertedText)
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

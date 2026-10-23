<template>
  <div>
    <v-text-field
      v-model="inputText"
      :label="fromTz"
      :autofocus="autofocus"
      variant="outlined"
      style="font-size: 1.3rem; padding: 0.5rem 0;"
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
        {{ convertedText }}
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
import { convertDatetime } from '@/utils/CommonUtils'

const props = withDefaults(defineProps<{
  fromTz: string
  toTz: string
  autofocus?: boolean
}>(), {
  autofocus: false
})

const { t } = useI18n()
const inputText = ref('')
const convertedText = computed(() => inputText.value === '' ? '' : convertDatetime(inputText.value, props.fromTz, props.toTz))
const { state, copy } = useCopy(convertedText)
</script>

<template>
  <v-app>
    <v-app-bar>
      <!-- pail-outline のアイコン -->
      <v-icon
        class="ml-4"
        size="large"
        color="green"
        :icon="mdiPailOutline"
      />
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row
          align="start"
          style="position: relative;"
        >
          <v-col
            cols="12"
            md="8"
          >
            <v-tabs
              v-model="activeTab"
              fixed-tabs
            >
              <v-tab :value="0">
                {{ t('indexPage.tabNameSingle') }}
              </v-tab>
              <v-tab :value="1">
                {{ t('indexPage.tabNameMultiple') }}
              </v-tab>
            </v-tabs>
            <v-tabs-window v-model="activeTab">
              <v-tabs-window-item :value="0">
                <single-line-component
                  from-tz="UTC"
                  to-tz="Asia/Tokyo"
                  :autofocus="true"
                />

                <single-line-component
                  from-tz="Asia/Tokyo"
                  to-tz="UTC"
                />
              </v-tabs-window-item>
              <v-tabs-window-item :value="1">
                <multi-line-component
                  from-tz="UTC"
                  to-tz="Asia/Tokyo"
                />

                <multi-line-component
                  from-tz="Asia/Tokyo"
                  to-tz="UTC"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <the-description @show-bucket="showBucket" />
          </v-col>

          <v-overlay
            :model-value="showOverlay"
            contained
            persistent
            :close-on-back="false"
            scrim="grey"
            opacity="0.5"
            class="align-center justify-center"
          >
            <v-icon
              :class="{ 'rotate-animation': animation }"
              size="56"
              :icon="animation ? mdiBucketOutline : mdiPailOutline"
            />
          </v-overlay>
        </v-row>
      </v-container>
    </v-main>
    <v-footer app>
      <span>
        &copy; {{ new Date().getFullYear() }}
      </span>
      <v-spacer />
      <a
        href="https://github.com/yuu-eguci/nuxt-utc-bucket"
        class="text-high-emphasis"
        aria-label="GitHub"
      >
        <v-icon
          size="large"
          :icon="mdiGithub"
        />
      </a>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { mdiBucketOutline, mdiGithub, mdiPailOutline } from '@mdi/js'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MultiLineComponent from '@/components/MultiLineComponent.vue'
import SingleLineComponent from '@/components/SingleLineComponent.vue'
import TheDescription from '@/components/TheDescription.vue'

const { t } = useI18n()
const showOverlay = ref(false)
const animation = ref(false)
const activeTab = ref(0)

function showBucket (): void {
  // overlay 開始; anime も開始
  showOverlay.value = true
  animation.value = true
  setTimeout(() => {
    // 1秒後に anime 終了
    animation.value = false
    setTimeout(() => {
      // 1秒後に overlay 終了
      showOverlay.value = false
    }, 1000)
  }, 1000)
}

onMounted(showBucket)
</script>

<style>
.rotate-animation {
  animation: rotation 1s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>

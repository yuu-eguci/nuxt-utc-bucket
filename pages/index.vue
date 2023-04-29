<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <main-component
        :from-tz="'UTC'"
        :to-tz="'Asia/Tokyo'"
      />

      <main-component
        :from-tz="'Asia/Tokyo'"
        :to-tz="'UTC'"
      />

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
          <v-btn
            color="secondary"
            @click="showBucket"
          >
            {{ $t('indexPage.showBucket') }}
          </v-btn>
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

    <v-overlay
      opacity="0.5"
      color="grey"
      :absolute="true"
      :value="showOverlay"
    >
      <v-icon v-if="animation" class="rotate-animation" size="56">
        mdi-bucket-outline
      </v-icon>
      <v-icon v-else size="56">
        mdi-pail-outline
      </v-icon>
    </v-overlay>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import MainComponent from '@/components/MainComponent.vue'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    MainComponent
  },
  data () {
    return {
      showOverlay: false,
      animation: false
    }
  },
  mounted () {
    this.showBucket()
  },
  methods: {
    showBucket () {
      // overlay 開始; anime も開始
      this.showOverlay = true
      this.animation = true
      setTimeout(() => {
        // 1秒後に anime 終了
        this.animation = false
        setTimeout(() => {
          // 1秒後に overlay 終了
          this.showOverlay = false
        }, 1000)
      }, 1000)
    }
  }
})
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

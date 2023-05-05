<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="8">
      <v-tabs
        v-model="activeTab"
        fixed-tabs
        dark
      >
        <v-tab>
          {{ $t('indexPage.tabNameSingle') }}
        </v-tab>
        <v-tab>
          {{ $t('indexPage.tabNameMultiple') }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="activeTab">
        <v-tab-item>
          <!-- XXX: ここに padding を設ける方法がよくわからない。 -->
          <single-line-component
            :from-tz="'UTC'"
            :to-tz="'Asia/Tokyo'"
            class="mb-4"
          />

          <single-line-component
            :from-tz="'Asia/Tokyo'"
            :to-tz="'UTC'"
          />
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              To be implemented.
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>

    <v-col cols="12" md="4">
      <the-description
        :show-bucket-function="showBucket"
      />
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
import SingleLineComponent from '~/components/SingleLineComponent.vue'
import TheDescription from '@/components/TheDescription.vue'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    SingleLineComponent,
    TheDescription
  },
  data () {
    return {
      showOverlay: false,
      animation: false,
      activeTab: 0
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

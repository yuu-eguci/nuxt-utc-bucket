<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <!-- pail-outline のアイコン -->
      <v-icon
        large
        color="green"
      >
        mdi-pail-outline
      </v-icon>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="false"
      app
    >
      <span>
        &copy; {{ new Date().getFullYear() }}
      </span>
      <v-spacer />
      <a href="https://github.com/yuu-eguci/nuxt-utc-bucket">
        <v-icon
          large
        >
          mdi-github
        </v-icon>
      </a>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
    }
  }
}
</script>

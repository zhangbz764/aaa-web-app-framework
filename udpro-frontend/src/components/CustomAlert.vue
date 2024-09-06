<template>
  <v-snackbar
    content-class="pa-0"
    v-model="snackbarVisible"
    :timeout="timeout"
    top
    absolute
    elevation="6"
    :color="color"
    style="z-index: 500"
  >
    <v-icon class="py-2 px-3">
      {{ icon }}
    </v-icon>

    <span style="font-size: small; vertical-align: middle">
      {{ $t(alertLabel) }}
    </span>
    <template v-slot:action="{ attrs }">
      <v-btn
        color="white"
        icon
        v-bind="attrs"
        @click="snackbarVisible = false"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>

</template>

<script>
import {component} from "@inst-aaa/archiweb-core/src/components/component";

export default {
  data: () => ({
    snackbarVisible: false,

    timeout: 2000,
    icon: "mdi-alert-outline",
    alertLabel: "waitRequest",
    color: "red lighten-2",
  }),

  mounted() {
    component.CustomAlert = this
  },

}
</script>

<style scoped>

</style>
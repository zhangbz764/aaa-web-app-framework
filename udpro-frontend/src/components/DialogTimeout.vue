<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600"
    style="z-index: 3000"
  >
    <v-alert
      :color="COLORS.PRIMARY"
      type="warning"
      class="ma-0"
      icon="mdi-account-clock-outline"
    >
      {{ $t('clientTimeout1') }}
      <br>
      {{ $t('clientTimeout2') }}
    </v-alert>

  </v-dialog>
</template>

<script>
import {component} from "@inst-aaa/archiweb-core/src/components/component";
import {COLORS} from "@/gui/constantInfo";

export default {
  data() {
    return {
      COLORS,
      dialog: false,
    }
  },
  mounted() {
    component.DialogTimeout = this;
  },
}
</script>

<style scoped>

</style>
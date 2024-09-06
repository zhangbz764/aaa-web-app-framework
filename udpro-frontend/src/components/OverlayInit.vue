<template>
  <v-overlay
    :value="overlay"
    absolute
    style="z-index: 2999"
    opacity="0.9"
  >
    <v-col>
      <v-progress-circular
        indeterminate
        :color="COLORS.PRIMARY"
        width="7"
        size="150"
      >
        <p class="progress-text">
          {{ $t('init1') }}
          <br>
          {{ $t('init2') }}
        </p>
      </v-progress-circular>

    </v-col>
  </v-overlay>
</template>

<script>
import {component} from "@inst-aaa/archiweb-core/src/components/component";
import {COLORS} from "@/gui/constantInfo";

export default {
  data: () => ({
    COLORS,
    overlay: false
  }),

  mounted() {
    component.OverlayInit = this;
  },
}
</script>

<style scoped lang="scss">
@import "@/gui/colors";

.progress-text {
  text-align: center;
  font-style: italic;
  margin-top: 15px;
  font-size: 12px;
  color: $TITLE_WHITE;
}
</style>
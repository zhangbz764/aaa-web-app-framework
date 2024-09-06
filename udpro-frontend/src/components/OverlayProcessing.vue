<template>
  <v-overlay
    :value="overlay"
    absolute
    style="z-index: 500"
    opacity="0.7"
  >
    <v-col>
      <v-progress-circular
        indeterminate
        :color="COLORS.TITLE_WHITE"
        width="7"
        size="150"
      >
        <p v-if="overlayMessage===0" class="progress-text">
          {{ $t('generatingPlots') }}
        </p>
        <p v-if="overlayMessage===1" class="progress-text">
          {{ $t('generatingModel') }}
        </p>
        <p v-if="overlayMessage===2" class="progress-text">
          {{ $t('clearingScene') }}
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
    overlay: false,
    overlayMessage: 0
  }),

  mounted() {
    component.OverlayProcessing = this;
  },

  methods: {
    overlayBegin(messageID) {
      this.overlay = true
      this.overlayMessage = messageID
    },
    overlayEnd() {
      this.overlay = false
    },
  }
}
</script>

<style scoped lang="scss">
@import "@/gui/colors";

.progress-text {
  text-align: center; /* 文本居中对齐 */
  font-style: italic;
  margin-top: 15px; /* 调整文本与圆圈的垂直间距 */
  font-size: 12px; /* 调整文本字体大小 */
  color: $TITLE_WHITE; /* 设置文本颜色 */
}
</style>
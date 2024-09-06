<template>
  <div>
    <div class="app-version-info">
      <v-tooltip right :color=COLORS.INFO>
        <template v-slot:activator="{ on, attrs }">
        <span
          style="display: flex; align-items: center;"
          :style="{color: COLORS.INFO}"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon
            small
            color="#6f6f6f"
            class="pr-1"
          >
          mdi-copyright
          </v-icon>
          {{ $t('copyright1') }}
<!--          <br>-->
<!--          {{ $t('copyright2') }}-->
          <br>
          {{ $t('copyright3') }}
        </span>
        </template>

        <p class="pa-0 ma-0" style="font-size: 12px">{{ version }}</p>
        <p class="pa-0 ma-0 pb-2" style="font-size: 12px">{{ $t('info') }}</p>
        <v-divider dark></v-divider>
        <p class="pa-0 ma-0 pt-2 author-info" >{{ $t('author') }}</p>
      </v-tooltip>
    </div>

    <div class="app-power-info">
      <span>
        Powered by
        <a href="https://web.archialgo.com/#/" target="_blank">ArchiWeb</a>
      </span>
    </div>
  </div>

</template>

<script>
import {component} from "@inst-aaa/archiweb-core/src/components/component";
import {COLORS} from "@/gui/constantInfo";

export default {
  data() {
    return {
      COLORS,
      version: 'v1.4.0',
      showInfo: false,
    };
  },
  mounted() {
    component.AppInfo = this;
  },
};
</script>

<style scoped lang="scss">
@import "@/gui/colors";

.app-version-info {
  position: fixed;
  left: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.app-version-info v-icon {
  margin-right: 5px;
}

.app-version-info span {
  padding-right: 2px;
  font-size: 12px;
  color: $INFO;
  display: inline-block;
  max-width: 500px; /* 调整版本号显示的最大宽度 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.author-info{
  font-size: 10px;
  font-style: italic;
  color: $EMPTY
}

.app-power-info {
  position: fixed;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
}

.app-power-info span{
  padding-right: 2px;
  font-size: 12px;
  color: $INFO;
  display: inline-block;
  max-width: 150px; /* 调整版本号显示的最大宽度 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.app-power-info a{
  color: $PRIMARY;
  font-style: italic;
  text-decoration: none;
}
</style>
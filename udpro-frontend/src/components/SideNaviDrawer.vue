<template>
  <v-card
    :class="[isMobilePortrait?'floating-bottom-drawer':'floating-right-drawer']"
    :width="isMobilePortrait&&!mini?'100%':'auto'"
    style="user-select: none"
  >
    <v-navigation-drawer
      :width="isMobilePortrait?'100%':320"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      :bottom="isMobilePortrait"
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-btn
            icon
            @click="toggleDrawer"
            v-if="!isMobilePortrait"
          >
            <v-icon large v-if="mini">mdi-chevron-left</v-icon>
            <v-icon large v-if="!mini">mdi-chevron-right</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="toggleDrawer"
            v-else
          >
            <v-icon large v-if="mini">mdi-chevron-left</v-icon>
            <v-icon large v-if="!mini">mdi-chevron-right</v-icon>
          </v-btn>
        </v-list-item-avatar>

        <v-list-item-title><b>{{ $t('appOptions') }}</b></v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        style="padding: 0"
        :dense="isMobilePortrait"
      >
        <!--    group    -->
        <v-list-group
          v-for="(item, ID) in options"
          :key="ID"
          :value="false"
          :prepend-icon=item.icon
          v-model="item.active"
          :color="COLORS.PRIMARY"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ $t(item.label) }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            class="group-list-item py-0"
            v-for="(item, subID) in item.items"
            :key="subID"
          >

            <v-list-item-content :class="[isMobilePortrait?'py-1':'py-3']">
              <!-- slider -->
              <v-row v-if="item.type==='slider'" class="ma-0 pa-0 align-end">
                <v-col class="col-12 py-0 px-0">
                  <v-slider
                    @change="item.onChange"
                    :max="item.max"
                    :min="item.min"
                    :step="item.step"
                    :ticks="item.ticks"
                    tick-size="3"
                    v-model="item.value"
                    dense
                    hide-details
                    :color="COLORS.PRIMARY"
                    :track-color="COLORS.EMPTY"
                    :disabled="item.disabled"
                  >
                    <template #label>
                      <span :class="[item.disabled?'custom-slider-label-disabled':'custom-slider-label']">{{
                          $t(item.label)
                        }}</span>
                    </template>
                    <template v-slot:append>
                      <span
                        :class="[item.disabled?'custom-slider-value-disabled':'custom-slider-value']"
                        type="number"
                        style="width: 40px"
                      >
                        {{ item.value }} {{ item.unit }}
                      </span>
                    </template>
                  </v-slider>
                </v-col>
              </v-row>

              <!-- button -->
              <v-btn v-if="item.type==='button'"
                     @click="item.value"
                     :color="item.color || COLORS.PRIMARY"
                     :block="item.block"
                     :outlined="item.outlined"
                     :disabled="item.disabled"
                     class="white--text"
              >
                <v-icon v-if="item.icon" left>{{ item.icon }}</v-icon>
                <div class="text-items">{{ $t(item.label) }}</div>
              </v-btn>

              <!-- switch -->
              <v-row v-if="item.type==='switch'" class="ma-0 pa-0 text-items ">
                <v-col class="col-8 pa-0 ma-0">
                  <div :class="[item.disabled?'custom-slider-label-disabled':'custom-slider-label']">{{
                      $t(item.label)
                    }}
                  </div>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="col-4 pa-0 ma-0">
                  <v-switch
                    dense
                    :ripple="false"
                    class="my-0 py-0 px-0 ml-12"
                    :color="COLORS.PRIMARY"
                    v-on:change="item.onChange"
                    v-model="item.value"
                    hide-details
                    :disabled="item.disabled"
                  >
                  </v-switch>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>
      </v-list>

    </v-navigation-drawer>

    <!--    指标面板    -->
    <v-card v-if="!mini"
            class="rounded-t-0 data-board-card"
            flat
    >
      <v-card-text class="pt-3 pb-2" v-if="!isMobilePortrait">
        <p class="parameters-board-title">
          {{ $t('dataBoardTitle') }}
        </p>
        <v-row
          class="pa-0 ma-0 col-12"
          v-for="(para, ID) in dataBoard"
          :key="ID"
        >
          <v-col class="col-6 col-xs-3 py-0 px-0">
            <p class="parameters-board-text">
              {{ $t(para.label) }}
            </p>
          </v-col>
          <v-col class="col-6 col-xs-3 py-0">
            <p class="parameters-board-value">
              {{ para.value + " " + para.unit }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="pt-3 pb-2" v-if="isMobilePortrait">
        <v-row
          class="pa-0 ma-0 col-12 col-sm-6"
        >
          <v-col class="col-6  py-0 px-0"
                 v-for="(para, ID) in dataBoard"
                 :key="ID"
          >
            <span class="parameters-board-text">{{ $t(para.label) }}:  </span>
            <span class="parameters-board-value">{{ para.value + " " + para.unit }}</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-card>

</template>

<script>
import {component} from "@inst-aaa/archiweb-core/src/components/component";
import {COLORS} from "@/gui/constantInfo";

export default {
  data() {
    return {
      COLORS,
      drawer: true,
      mini: false,
      displayBoard: false,

      isMobilePortrait: false,

      prompts: 'red',

      options: [
        {
          type: 'group',
          icon: 'mdi-apps',
          label: 'siteSettings',
          active: false,
          items: [
            {type: 'button', label: "generate"},
          ],
        },
      ],
      dataBoard: [
        {label: 'siteArea', value: 1, unit: ""},
      ],
    };
  },
  created() {
    this.isMobilePortrait = this.checkMobilePortrait(); // 初始化时判断一次
    window.addEventListener('resize', this.handleResize);
  },
  mounted() {
    component.SideNaviDrawer = this;
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleDrawer() {
      this.mini = !this.mini;
    },
    checkMobilePortrait() {
      return window.innerWidth <= 600 && window.innerHeight > window.innerWidth;
    },
    handleResize() {
      this.isMobilePortrait = this.checkMobilePortrait();
    }
  },
  watch: {
    mini(newValue) {
      if (newValue === true) {
        // mini
        for (let item of this.options) {
          item.active = false
        }
        setTimeout(() => {
          this.displayBoard = false;
        }, 300);
      } else {
        //expand
        setTimeout(() => {
          this.displayBoard = true;
        }, 300);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/gui/colors";

.floating-right-drawer {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 2;
}

.floating-bottom-drawer {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.group-list-item {
  background-color: $TITLE_WHITE;
}

.text-items {
  display: flex;
  align-items: center;
  font-size: small;
}

.custom-slider-label {
  font-size: small;
  color: $TITLE_BLACK;
}

.custom-slider-label-disabled {
  font-size: small;
  color: $EMPTY;
}

.custom-slider-value {
  padding-top: 4px;
  font-size: small;
  color: $TITLE_BLACK;
}

.custom-slider-value-disabled {
  padding-top: 4px;
  font-size: small;
  color: $EMPTY;
}

.radio-button >>> label {
  font-size: small;
}

.data-board-card {
  border-top: 1px solid $TITLE_WHITE;
  border-left: none;
  border-right: 1px solid $TITLE_WHITE;
  border-bottom: none;
}

.parameters-board-fadeout {
  opacity: 0;
  transform: translatey(-10px);
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}

.parameters-board-fadein {
  transform: translatey(0);
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}

.parameters-board-title {
  padding-top: 0;
  padding-bottom: 8px;
  margin: 0;
  font-size: 15px;
  color: $TITLE_BLACK;
}

.parameters-board-text {
  margin: 0;
  font-size: x-small;
  font-style: italic;
}

.parameters-board-value {
  margin: 0;
  font-size: x-small;
  color: $TITLE_BLACK;
  font-style: italic;
}
</style>
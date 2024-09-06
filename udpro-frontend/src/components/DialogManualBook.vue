<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    width="1400"
  >
    <template v-slot:activator="{}">
      <v-btn
        fab
        small
        color="secondary"
        @click="dialog = !dialog"
        class="manual-book-btn"
        style="z-index: 600"
      >
        <v-icon size="20px">mdi-lightbulb-on-outline</v-icon>
      </v-btn>

      <v-snackbar
        content-class="py-0 justify-center"
        v-model="showSnackbar"
        timeout="2500"
        top
        right
        rounded
        absolute
        :color="COLORS.PRIMARY"
        style="z-index: 600; right: 158px; top: 2px"
        transition="slide-x-reverse-transition"
      >
        <span style="font-size: small; vertical-align: middle">
          {{ $t('manualBookHint') }}
        </span>
        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            icon
            v-bind="attrs"
            @click="showSnackbar = false"
          >
            <v-icon>mdi-hand-pointing-right</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

    </template>

    <v-card>
      <v-card-title class="dialog-title">
        <b>{{ $t('manual_book') }}</b>
      </v-card-title>

      <v-card-text class="pa-0">
        <v-stepper
          outlined
          v-model="currStep"
        >
          <!--    header    -->
          <v-stepper-header>
            <v-stepper-step
              v-for="(step, index) in manualBookSteps"
              :key="index"
              :step="index"
              :color="COLORS.PRIMARY"
              editable
            >
              {{ $t(step.title) }}
            </v-stepper-step>
          </v-stepper-header>

          <!--    items    -->
          <v-stepper-items>
            <v-stepper-content
              v-for="(step, index) in manualBookSteps"
              :key="index"
              :step="index"
              class="px-5 pb-3 pt-5"
            >
              <!--     gif & descriptions    -->
              <v-card
                class="mb-4"
                outlined
              >
                <v-card-text class="pa-0">
                  <v-row>
                    <v-col cols="6">
                      <v-img
                        :src="step.gif"
                      ></v-img>
                    </v-col>
                    <v-col cols="6" align-self="center" class="pa-3 pr-6">
                      <p class="my-3 instruction-title-in-card">
                        {{ $t(step.title) }}
                      </p>
                      <p
                        v-for="(desc, descID) in step.descriptions"
                        :key="descID"
                        class="my-3">
                        {{ $t(desc) }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <!--     prev & next buttons    -->
              <div
                style="display: flex; align-content: center; justify-content: center"
              >
                <v-btn
                  :color="COLORS.SECONDARY"
                  outlined
                  @click="currStep = step.prev"
                  small
                  class="mr-2 pl-0 pr-2"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                  {{ $t('prev') }}
                </v-btn>
                <v-btn
                  :color="COLORS.SECONDARY"
                  outlined
                  @click="currStep = step.next"
                  small
                  class="pl-2 pr-0"
                >
                  {{ $t('next') }}
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>

      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="closeDialog"
        >
          <v-icon left>mdi-cancel</v-icon>
          {{ $t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {component} from "@inst-aaa/archiweb-core/src/components/component";
import {publicPath} from "@/../vue.config";
import {COLORS} from "@/gui/constantInfo";

export default {
  data() {
    return {
      COLORS,
      publicPath,
      dialog: false,

      currStep: 0,
      manualBookSteps: [
        {
          title: 'stepTitle0', gif: 'https://archialgo-com-sources.oss-cn-hangzhou.aliyuncs.com/images/simforms/mb0.gif', next: 1, prev: 3,
          descriptions: [
            'description01', 'description02', 'description03',
          ],
        },
        {
          title: 'stepTitle1', gif: 'https://archialgo-com-sources.oss-cn-hangzhou.aliyuncs.com/images/simforms/mb1.gif', next: 2, prev: 0,
          descriptions: [
            'description11', 'description12',
          ],
        },
        {
          title: 'stepTitle2', gif: 'https://archialgo-com-sources.oss-cn-hangzhou.aliyuncs.com/images/simforms/mb2.gif', next: 3, prev: 1,
          descriptions: [
            'description21', 'description22', 'description23',
          ],
        },
        {
          title: 'stepTitle3', gif: 'https://archialgo-com-sources.oss-cn-hangzhou.aliyuncs.com/images/simforms/mb3.gif', next: 0, prev: 2,
          descriptions: [
            'description31', 'description32', 'description33', 'description34',
          ],
        }
      ],

      showSnackbar: false,
      firstOpen: true,
    }
  },

  methods: {
    closeDialog() {
      if (this.firstOpen) {
        this.showSnackbar = true
        this.firstOpen = false
      } else {
        this.showSnackbar = false
      }
      this.dialog = false
    }
  },

  mounted() {
    component.DialogManualBook = this;
  },
}
</script>

<style scoped lang="scss">
@import "@/gui/colors.scss";

.dialog-title {
  background-color: $SECONDARY;
  color: $TITLE_WHITE;
}

.full-height-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.instruction-title-in-card {
  color: $PRIMARY;
  font-size: medium;
  font-weight: bold;
}

.manual-book-btn {
  position: absolute;
  top: 12px;
  right: 113px;
  color: white;
}

</style>
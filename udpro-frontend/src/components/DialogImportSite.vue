<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="1400"
  >
    <v-card style="user-select: none">
      <v-card-title class="dialog-title">
        <b>{{ $t('dialogTitle') }}</b>
      </v-card-title>
      <v-card-text class="px-1 py-1">

        <v-container>
          <v-row>
            <v-col
              v-for="(card, index) in cardContents"
              :key="index"
              class="col-12 col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6"
            >
              <v-card outlined class="full-height-card">
                <v-img
                  max-height="250"
                  height="250"
                  :src="card.gif"
                ></v-img>
                <v-card-title>
                  <b>{{ $t(card.title) }}</b>
                </v-card-title>
                <v-card-text style="flex-grow: 1">
                  <p
                    v-for="(des, id) in card.description"
                    :key="id"
                  >
                    {{ $t(des) }}
                    <v-btn
                      icon
                      x-small
                      :color=copyIconColor
                      v-if="index===0 && id===0"
                      @click="writeToClipboard"
                    >
                      <v-icon size="13px">{{ copyIcon }}</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      small
                      :color="COLORS.PRIMARY_DARK"
                      v-if="index===0 && id===2"
                      @click="openANYSite"
                    >
                      <v-icon size="13px">mdi-open-in-new</v-icon>
                    </v-btn>
                  </p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn
                    :color="COLORS.PRIMARY"
                    outlined
                    block
                    @click="cardButtons[index].value()"
                  >
                    <v-icon left>{{ cardButtons[index].icon }}</v-icon>
                    {{ $t(cardButtons[index].label) }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :color="COLORS.SECONDARY"
          @click="templateButton.value()"
        >
          <v-icon left>{{ templateButton.icon }}</v-icon>
          {{ $t(templateButton.label) }}
        </v-btn>
        <v-btn
          @click="dialog = false"
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
import {COLORS} from "@/gui/constantInfo";

export default {
  data() {
    return {
      COLORS,
      dialog: false,
      copyIcon: 'mdi-content-copy',
      copyIconColor: COLORS.INFO,

      cardContents: [
        {
          title: 'importTitle',
          description: ['importDesc1', 'importDesc2', 'importDesc3'],
          gif: 'https://archialgo-com-sources.oss-cn-hangzhou.aliyuncs.com/images/app-import/im1.gif',
        },
        {
          title: 'customTitle',
          description: ['customDesc1', 'customDesc2', 'customDesc3'],
          gif: 'https://archialgo-com-sources.oss-cn-hangzhou.aliyuncs.com/images/app-import/im2.gif',
        },
      ],

      cardButtons: [
        {
          type: 'button', label: "importSite",
          icon: 'mdi-file-import-outline',
          value: function () {
          }
        },
        {
          type: 'button', label: "importSite",
          icon: 'mdi-file-import-outline',
          value: function () {
          }
        },
        {
          type: 'button', label: "importSite",
          icon: 'mdi-file-import-outline',
          value: function () {
          }
        },
      ],

      templateButton: {
        label: "importSite",
        value: function () {
          this.dialog = false
        }
      },
    }
  },

  methods: {
    writeToClipboard() {
      const text = 'simforms-site'
      navigator.clipboard.writeText(text).then(
        () => {
          this.copyIcon = 'mdi-check-bold'
          this.copyIconColor = COLORS.PRIMARY
        },
        () => {
          alert("clipboard write failed");
        }
      )
    },
    openANYSite() {
      // 替换 'https://example.com' 为你想要打开的网页地址
      let url = 'https://web.archialgo.com/anysite/';
      // 使用 window.open() 方法在新标签页中打开网页
      window.open(url, '_blank');
    }
  },

  mounted() {
    component.DialogImportSite = this;
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
</style>
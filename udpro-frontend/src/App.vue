<template>
  <v-app style="user-select: none">
    <v-snackbar
      max-width="100px"
      width="100px"
      content-class="py-0 justify-center"
      v-model="overlay"
      timeout="-1"
      absolute
      rounded
      right
      top
      :color="COLORS.PRIMARY"
      style="z-index: 602; right: 158px; top: 2px"
      transition="slide-x-reverse-transition"
    >
      <span style="font-size: 15px; vertical-align: middle">
        {{ $t('loginFirst') }}
      </span>
      <template v-slot:action="{  }">
        <v-icon
          color="white"
          class="pr-3"
        >
          mdi-alert
        </v-icon>
      </template>

    </v-snackbar>
    <v-overlay v-model="overlay" z-index="601">

    </v-overlay>
    <div id="authing-guard-container" style="z-index:1000"></div>

    <v-app-bar absolute app color="transparent" flat style="user-select: none">
      <v-img :src="logo" max-width="30px" class="mb-1"></v-img>
      <h2
        class="pl-2 pt-3 app-title"
      >
        UD<span :style="{color: COLORS.PRIMARY}">Pro</span>
      </h2>
      <v-spacer></v-spacer>

    </v-app-bar>

    <!-- language button -->
    <v-btn
      fab
      small
      color="secondary"
      @click="changeLanguage"
      style="position:absolute; top:12px; right: 65px; z-index: 600"
    >
      <v-icon size="20px">mdi-translate-variant</v-icon>
    </v-btn>

    <!-- login button -->
    <v-btn
      v-if="token==null"
      :color="COLORS.PRIMARY"
      small
      fab
      style="position:absolute; color: white; top:12px; right: 16px; z-index: 602"
      @click="login"
    >
      <v-icon size="20px">mdi-account-circle</v-icon>
    </v-btn>
    <v-menu
      v-else
      offset-y
      nudge-bottom="10px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          small
          fab
          style="position:absolute; top:12px; right: 16px; z-index: 602"
        >
          <v-avatar
            size="40px"
          >
            <v-img :src="photo"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list
        class="pa-0"
        dense
      >
        <v-list-item @click="logout" dense>
          {{ $t('logout') }}
        </v-list-item>
      </v-list>
    </v-menu>


    <v-main class="pt-0">
      <SideNaviDrawer ref="sideNaviDrawer"></SideNaviDrawer>

      <DialogManualBook ref="DialogManualBook"></DialogManualBook>
      <DialogStyleMenu ref="styleMenu"></DialogStyleMenu>
      <DialogRenderWindow ref="RenderWindow"></DialogRenderWindow>
      <DialogTimeout ref="DialogTimeout"></DialogTimeout>
      <DialogImportSite ref="DialogImportSite"></DialogImportSite>

      <OverlayInit ref="OverlayInit"></OverlayInit>
      <OverlayProcessing ref="OverlayProcessing"></OverlayProcessing>
      <CustomAlert ref="CustomAlert"></CustomAlert>
      <AppInfo ref="AppInfo"></AppInfo>

      <Viewer :gui="false" container="container-style-generator" filename="index.js"></Viewer>
    </v-main>

  </v-app>

</template>

<script>

import AppInfo from "@/components/AppInfo.vue";
import CustomAlert from "@/components/CustomAlert.vue";
import OverlayInit from "@/components/OverlayInit.vue";

import SideNaviDrawer from "@/components/SideNaviDrawer.vue";
import OverlayProcessing from "@/components/OverlayProcessing.vue";

import DialogManualBook from "@/components/DialogManualBook.vue";
import DialogImportSite from "@/components/DialogImportSite.vue";
import DialogStyleMenu from "@/components/DialogStyleMenu.vue";
import DialogRenderWindow from "@/components/DialogRenderWindow.vue";
import DialogTimeout from "@/components/DialogTimeout.vue";

import {publicPath} from "../vue.config";
import {COLORS} from "@/gui/constantInfo";
import {sha256} from "js-sha256";
import {component} from "@inst-aaa/archiweb-core/src/components/component";

export default {
  name: 'App',
  components: {
    OverlayProcessing,
    AppInfo,
    DialogImportSite,
    CustomAlert,
    OverlayInit,
    DialogTimeout,
    SideNaviDrawer,
    DialogManualBook,
    DialogStyleMenu,
    DialogRenderWindow
  },
  data: () => ({
      overlay: true,
      COLORS,
      logo: publicPath + '/aaa_favicon_black.ico',
      drawer: null,
      authors: ['zhangbz764'],
      items: [{
        icon: 'mdi-blur',
        title: 'Item Example',
        content: '<p class="text-h4 ma-4">Content can be <code>html</code> <span class="mdi mdi-flag"></span></p>'
      }],

      isChinese: true,
      supportedChinese: [
        'zh', 'zh-CN', 'zh-HK', 'zh-TW',
      ],
      photo: 'https://files.authing.co/authing-console/default-user-avatar.png',
      token: null,
    }
  ),

  methods: {
    async setKnownUser(userInfo) {
      if (userInfo.email && userInfo.photo === this.photo) {
        this.photo = `https://gravatar.com/avatar/${sha256(userInfo.email)}?s=200&d=identicon`
      } else {
        this.photo = userInfo.photo;
      }
      this.overlay = false
      this.token = userInfo.id;
    },
    logout() {
      this.photo = 'https://files.authing.co/authing-console/default-user-avatar.png';
      this.token = null;
      this.$guard.logout();
    },
    login() {
      this.$guard.show();
    },


    changeLanguage() {
      if (this.isChinese) {
        this.$i18n.locale = 'en-US';
      } else {
        this.$i18n.locale = 'zh-CN';
      }
      this.isChinese = !this.isChinese
    },
  },

  mounted() {
    const navLang = navigator.language

    if (this.supportedChinese.includes(navLang)) {
      this.isChinese = true
      this.$i18n.locale = 'zh-CN'
    } else {
      this.isChinese = false
      this.$i18n.locale = 'en-US'
    }

    let scope = this;
    this.$guard.trackSession().then((userInfo) => {
      if (userInfo == null) return;
      scope.setKnownUser(userInfo)
    }).finally(() => {
      if (this.token == null) {
        this.$guard.start("#authing-guard-container").then((userInfo) => {
          this.$guard.hide()
          this.setKnownUser(userInfo);
          this.overlay = false
          component.DialogManualBook.dialog = true
        });

      }
    })
  },
};
</script>

<style>
.authing-ant-btn-primary {
  border: #009999 !important;
  background-color: #009999 !important;
}

@media only screen and (min-width: 450px) {
  #authing-guard-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.authing-ant-modal-close {
  display: none;
}

.app-title {
  font-weight: bold;
  font-size: x-large;
}

.custom-btn {
  width: 30px; /* 宽度是 FAB 的直径，所以这里设为 30px */
  height: 30px; /* 同样设置高度为 30px */
  min-width: unset; /* 取消默认最小宽度 */
  line-height: 30px; /* 设置行高为按钮高度，使图标垂直居中 */
}
</style>
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from "@/language/i18n";
import ArchiWeb from '@inst-aaa/archiweb-core';
import { GuardPlugin } from "@authing/guard-vue2";
import "@authing/guard-vue2/dist/esm/guard.min.css";
Vue.use(GuardPlugin, {
  appId: "6617931567d1a78f30583fbb",
  mode: "modal",
  redirectUri: process.env.NODE_ENV === 'production'? '/render/': '/',
});
Vue.use(ArchiWeb)
Vue.config.productionTip = false
new Vue({
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')

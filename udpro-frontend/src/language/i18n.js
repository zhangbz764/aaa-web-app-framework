/**
 * description
 *
 * @author Baizhou Zhang zhangbz
 * @project SIMForms
 * @date 2023/10/19
 * @time 10:35
 */
import zh_CN from "@/language/zh-CN";
import en_US from "@/language/en-US";
import VueI18n from 'vue-i18n'
import Vue from "vue";

Vue.use(VueI18n)

const messages = {
    "en-US": en_US,
    "en": en_US,
    "en-GB": en_US,

    "zh": zh_CN,
    "zh-CN": zh_CN,
    "zh-HK": zh_CN,
    "zh-TW": zh_CN,
};

const i18n = new VueI18n({
    locale: 'en-US',
    fallbackLocale:'en-US',
    messages,
});

export default i18n;
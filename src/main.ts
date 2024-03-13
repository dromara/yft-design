import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import { setupI18n } from '@/plugins/i18n'

import "@/extension/index"

import "@icon-park/vue-next/styles/index.css"
import "@/assets/style/global.scss"
import "@/assets/style/font.scss"
import "@/assets/style/element-plus.scss"

import SvgIcon from "@/icons"
import Icon from "@/plugins/icon"
import Component from "@/plugins/component"
import Directive from "@/plugins/directive"

import "virtual:svg-icons-register"
import { useRegisterSW } from 'virtual:pwa-register/vue'
useRegisterSW()

async function start() {
    const app = createApp(App);
    await setupI18n(app)
    app.use(createPinia());
    app.use(Icon);
    app.use(SvgIcon);
    app.use(Component);
    app.use(Directive);
    app.mount("#app");
}

start()

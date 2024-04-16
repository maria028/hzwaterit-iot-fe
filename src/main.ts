/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-27 15:26:28
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-16 09:07:12
 * @Description:
 */
import { createApp } from "vue"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import ElementPlus from "element-plus"
import zhCn from "element-plus/dist/locale/zh-cn.mjs"
import "element-plus/dist/index.css"
import "@/assets/css/index.scss"
import App from "./App.vue"
import router from "./router"
import { registerGlobalPermissionDirective } from "@/directives/permission"
import GlobalComponents from "@/components"

const app = createApp(App)
registerGlobalPermissionDirective(app)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
    .use(ElementPlus, {
        locale: zhCn
    })
    .use(GlobalComponents)
    .mount("#app")

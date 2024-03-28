/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-27 15:26:28
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-28 14:45:21
 * @Description:
 */
import { createApp } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(router).use(ElementPlus).mount("#app");

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-27 15:26:28
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-29 11:30:46
 * @Description:
 */
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": resolve("src"),
            lodash: "lodash-es"
        }
    },
    server: {
        //vue3 vite配置热更新不用手动刷新
        hmr: true
    }
})

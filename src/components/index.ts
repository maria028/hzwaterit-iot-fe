/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 11:19:46
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-16 10:51:58
 * @Description: 全局引用
 */
import { App } from "vue"
import CSearchTable from "./CSearchTable/index.vue"
import CSearchBar from "./CSearchBar/index.vue"
import CSearchBarItem from "./CSearchBarItem/index.vue"

export default {
    install(Vue: App) {
        Vue.component("CSearchTable", CSearchTable)
        Vue.component("CSearchBar", CSearchBar)
        Vue.component("CSearchBarItem", CSearchBarItem)
    }
}

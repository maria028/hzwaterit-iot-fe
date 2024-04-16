/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-09 14:24:10
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-11 09:34:04
 * @Description:
 */
import type { RouteRecordRaw } from "vue-router"

const DeviceRouter: RouteRecordRaw[] = [
    {
        path: "/device",
        name: "Device",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/Device/Record/index.vue")
    }
]

export default DeviceRouter

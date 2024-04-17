/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-09 14:24:10
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-17 10:49:41
 * @Description:
 */
import type { RouteRecordRaw } from "vue-router"

const DeviceRouter: RouteRecordRaw[] = [
    {
        path: "/instance",
        name: "Instance",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/Device/Instance/index.vue")
    }
]

export default DeviceRouter

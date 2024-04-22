/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-09 14:24:10
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-22 09:36:20
 * @Description:
 */
import type { RouteRecordRaw } from "vue-router"

const DeviceRouter: RouteRecordRaw[] = [
    // 设备列表
    {
        path: "/instance",
        name: "Instance",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/Device/Instance/index.vue")
    },
    // 产品分类
    {
        path: "/category",
        name: "Category",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/Device/Category/index.vue")
    }
]

export default DeviceRouter

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-09 14:24:10
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 14:24:41
 * @Description:
 */
import type { RouteRecordRaw } from "vue-router"

const DeviceRouter: RouteRecordRaw[] = [
    {
        path: "/employee",
        name: "Employee",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/System/Employee/index.vue")
    }
]

export default DeviceRouter

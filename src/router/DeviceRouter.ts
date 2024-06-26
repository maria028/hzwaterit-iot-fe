/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-09 14:24:10
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-22 11:42:16
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
    },
    // 产品
    {
        path: "/product",
        name: "Product",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/Device/Product/index.vue")
    },
    // 产品详情
    {
        path: "/product/detail",
        name: "ProductDetail",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/Device/Product/ProductDetail.vue")
    }
]

export default DeviceRouter

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-27 16:00:52
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-16 09:31:49
 * @Description:routes
 */
import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import systemRouter from "./systemRouter"
import deviceRouter from "./deviceRouter"

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        redirect: "/index",
        component: () => import("@/views/Home.vue"),
        children: [
            {
                path: "/index",
                name: "Index",
                component: () => import("@/views/index.vue")
            },
            {
                path: "/profile",
                name: "Profile",
                component: () => import("@/views/Profile/index.vue")
            },
            ...systemRouter,
            ...deviceRouter
        ]
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Login/index.vue")
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router

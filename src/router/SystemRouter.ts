/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 11:41:00
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 16:09:27
 * @Description:
 */
import type { RouteRecordRaw } from "vue-router"

const SystemRouter: RouteRecordRaw[] = [
    {
        path: "/employee",
        name: "Employee",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/System/Employee/index.vue")
    },
    {
        path: "/department",
        name: "Department",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/System/Department/index.vue")
    },
    {
        path: "/department-employee",
        name: "DepartmentEmployee",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/System/DepartmentEmployee/index.vue")
    },
    {
        path: "/role",
        name: "Role",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/System/Role/index.vue")
    },
    {
        path: "/role-employee",
        name: "RoleEmployee",
        component: () => import(/* webpackChunkName: "system-router" */ "@/views/System/RoleEmployee/index.vue")
    }

    // {
    //     path: "/position",
    //     name: "Position",
    //     component: () => import(/* webpackChunkName: "system-router" */ "@/views/system/Position.vue")
    // },
    // {
    //     path: "/position-employee",
    //     name: "PositionEmployee",
    //     component: () => import(/* webpackChunkName: "system-router" */ "@/views/system/PositionEmployee.vue")
    // },
    // {
    //     path: "/resource",
    //     name: "Resource",
    //     component: () => import(/* webpackChunkName: "system-router" */ "@/views/system/Resource.vue")
    // },
    // {
    //     path: "/property",
    //     name: "Property",
    //     component: () => import(/* webpackChunkName: "system-router" */ "@/views/system/Property.vue")
    // },
    // {
    //     path: "/dict",
    //     name: "Dict",
    //     component: () => import(/* webpackChunkName: "system-router" */ "@/views/system/Dict.vue")
    // },
    // {
    //     path: "/login-log",
    //     name: "LoginLog",
    //     component: () => import(/* webpackChunkName: "system-router" */ "@/views/system/LoginLog.vue")
    // },
    // {
    //     path: "/operation-log",
    //     name: "OperationLog",
    //     component: () => import(/* webpackChunkName: "system-router" */ "@/views/system/OperationLog.vue")
    // }
]

export default SystemRouter

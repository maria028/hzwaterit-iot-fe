<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-18 09:57:24
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-19 16:38:24
 * @Description: 面包屑
-->
<template>
    <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(breadcrumbItem, index) in breadcrumbItems" :key="index">{{ breadcrumbItem }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script setup lang="ts">
import localStorageKeyConstant from "@/constant/localStorageKeyConstant"
import { MenuBO } from "@/types/auth"
import { onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()

// path 与面包屑对应关系
const breadcrumbItemMap = new Map()

// 面包屑
const breadcrumbItems = ref<string[]>()
// 当前选中菜单
const activedMenu = ref<string>("/index")
const menus = ref<MenuBO[]>([])

// onMounted
onMounted(() => {
    menus.value = JSON.parse(localStorage.getItem(localStorageKeyConstant.MENU) as string)
    activedMenu.value = router.currentRoute.value.path

    setBreadcrumbItemMap("", menus.value)
    setBreadcrumbItems(activedMenu.value)

    //#region 子页面 path 与面包屑对应关系
    breadcrumbItemMap.set("/profile", "个人中心")
    //#endregion
})

// 设置 path 与面包屑对应关系
const setBreadcrumbItemMap = (names: string, menus: MenuBO[]) => {
    if (!menus) return
    for (const menu of menus) {
        const currentNames = names == "" ? menu.name : names + "," + menu.name
        const children = menu.children
        if (children.length == 0) {
            breadcrumbItemMap.set(menu.url, currentNames)
        } else {
            setBreadcrumbItemMap(currentNames, children)
        }
    }
}
// 设置面包屑
const setBreadcrumbItems = (path: string) => {
    if (path == "/index") {
        breadcrumbItems.value = []
    } else {
        const names = breadcrumbItemMap.get(path)
        if (names) {
            breadcrumbItems.value = names.split(",")
        }
    }
}

// 监听路由  调整setBreadcrumbItems与watch的先后顺序 否则报错
watch(
    () => router.currentRoute.value,
    () => {
        setBreadcrumbItems(router.currentRoute.value.path)
    },
    { immediate: true }
)
</script>
<style lang="scss" scoped>
.breadcrumb {
    height: 40px;
    display: flex;
    align-items: center;
}
</style>

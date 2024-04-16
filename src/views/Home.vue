<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-27 16:05:18
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-16 15:27:31
 * @Description: Layout 
-->
<template>
    <div>
        <div class="header">
            <div class="header-left">
                <div class="logo">
                    <el-image :src="logo" fit="scale-down" />
                </div>
                <div class="logo-content">{{ title }}</div>
            </div>
            <div class="header-right avatar">
                <el-dropdown trigger="click">
                    <el-avatar v-if="account.avatarImgUrl" :src="account.avatarImgUrl"></el-avatar>
                    <el-avatar v-else>{{ account.lastName }}</el-avatar>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item disabled>{{ account.name }}</el-dropdown-item>
                            <el-dropdown-item divided @click.native="gotoPersonalCenter"
                                ><el-icon><User /></el-icon>个人中心</el-dropdown-item
                            >
                            <el-dropdown-item @click.native="logoutHandel"
                                ><el-icon><SwitchButton /></el-icon>退出</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div>
            <div class="menu">
                <el-menu :default-active="activedMenu" router unique-opened mode="vertical">
                    <el-menu-item index="/index">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <template v-for="firstLevelMenu in menus">
                        <el-sub-menu v-if="firstLevelMenu.url == ''" :key="firstLevelMenu.id" :index="firstLevelMenu.id.toString()">
                            <template #title>
                                <el-image v-if="firstLevelMenu.icon" :src="firstLevelMenu.icon"></el-image>
                                <span>{{ firstLevelMenu.name }}</span>
                            </template>
                            <template v-for="secondLevelMenu in firstLevelMenu.children">
                                <el-sub-menu v-if="secondLevelMenu.url == ''" :key="secondLevelMenu.id" :index="secondLevelMenu.id.toString()">
                                    <template #title>
                                        <el-image v-if="secondLevelMenu.icon" :src="secondLevelMenu.icon" />
                                        <span>{{ secondLevelMenu.name }}</span>
                                    </template>
                                    <el-menu-item v-for="thirdLevelMenu in secondLevelMenu.children" :key="thirdLevelMenu.id" :index="thirdLevelMenu.url.toString()">
                                        <el-image v-if="thirdLevelMenu.icon" :src="thirdLevelMenu.icon" />
                                        <span slot="title">{{ thirdLevelMenu.name }}</span>
                                    </el-menu-item>
                                </el-sub-menu>
                                <el-menu-item v-else :key="`#` + secondLevelMenu.id" :index="secondLevelMenu.url.toString()">
                                    <el-image v-if="secondLevelMenu.icon" :src="secondLevelMenu.icon" />
                                    <span slot="title">{{ secondLevelMenu.name }}</span>
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                        <el-menu-item v-else :key="`#` + firstLevelMenu.id" :index="firstLevelMenu.url.toString()">
                            <el-image v-if="firstLevelMenu.icon" :src="firstLevelMenu.icon" />
                            <span slot="title">{{ firstLevelMenu.name }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>
            <div class="main">
                <div class="breadcrumb">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item>首页</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(breadcrumbItem, index) in breadcrumbItems" :key="index">{{ breadcrumbItem }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="content">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import logo from "@/assets/img/logo.png"
import localStorageKeyConstant from "@/constant/localStorageKeyConstant"
import { dictTree, logout } from "@/service/auth"
import { DictBO, Result } from "@/types/common"
import { MenuBO } from "@/types/auth"
const router = useRouter()

// title
const title = ref<string>(import.meta.env.VITE_TITLE || "")
// 当前选中菜单
const activedMenu = ref<string>("/index")
const menus = ref<MenuBO[]>([])
// path 与面包屑对应关系
const breadcrumbItemMap = new Map()
// 面包屑
const breadcrumbItems = ref<string[]>()
// 帐号信息
const account = reactive({
    name: "",
    lastName: "",
    avatarImgUrl: ""
})
// onMounted
onMounted(() => {
    console.log(`the component is now mounted.`)
    //#region 默认 path 与面包屑对应关系
    breadcrumbItemMap.set("/profile", "个人中心")
    //#endregion

    menus.value = JSON.parse(localStorage.getItem(localStorageKeyConstant.MENU) as string)
    account.name = localStorage.getItem(localStorageKeyConstant.ACCOUNT_NAME) as string
    if (account.name) {
        account.lastName = account.name.substr(0, 1)
    }
    account.avatarImgUrl = localStorage.getItem(localStorageKeyConstant.ACCOUNT_AVATAR_IMG_URL) as string
    activedMenu.value = router.currentRoute.value.path

    setBreadcrumbItemMap("", menus.value)
    setBreadcrumbItems(activedMenu.value)

    //#region 子页面 path 与面包屑对应关系
    breadcrumbItemMap.set("/position-employee", breadcrumbItemMap.get("/position") + ",关联员工")
    breadcrumbItemMap.set("/department-employee", breadcrumbItemMap.get("/department") + ",关联员工")
    breadcrumbItemMap.set("/role-employee", breadcrumbItemMap.get("/role") + ",关联员工")
    //#endregion

    dictTree().then((response: Result<DictBO[]>) => {
        const result = response
        localStorage.setItem(localStorageKeyConstant.DICT, JSON.stringify(result.data))
    })
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
// 监听路由
watch(
    () => router.currentRoute.value,
    () => {
        setBreadcrumbItems(router.currentRoute.value.path)
    },
    { immediate: true }
)

const logoutHandel = () => {
    logout().then(() => {
        localStorage.removeItem(localStorageKeyConstant.TOKEN)
        router.replace({
            path: "/login"
        })
    })
}
// 个人中心
const gotoPersonalCenter = () => {
    router.replace({
        path: "/profile"
    })
}
</script>

<style scoped lang="scss">
.header {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 50px;
    background-color: var(--el-color-primary);
}

.header-left {
    float: left;
    width: 200px;
    height: 50px;
    display: flex;
    align-items: center;
}

.header-right {
    float: right;
}

.logo {
    float: left;
    width: 40px;
    height: 40px;
    margin-left: 20px;
}

.logo-content {
    margin-left: 10px;
    color: #ffffff;
    font-family: DingTalk-JinBuTi;
    font-size: 20px;
}

.avatar {
    width: 50px;
    height: 50px;
    margin-top: 5px;
}

.menu {
    position: fixed;
    left: 0px;
    top: 50px;
    bottom: 0px;
    width: 200px;
    overflow: auto;
}

.main {
    position: fixed;
    left: 200px;
    right: 0px;
    top: 50px;
    bottom: 0px;
    overflow: auto;
    background: #f1f2f6;
    padding: 0 16px;
}

.breadcrumb {
    height: 40px;
    display: flex;
    align-items: center;
}

.content {
    margin-top: 0px;
    height: calc(100vh - 100px);
}
</style>
@/constant/localStorageKeyConstant@/types/auth@/types/common

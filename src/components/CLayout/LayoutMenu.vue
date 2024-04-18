<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-18 11:22:58
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-18 11:27:41
 * @Description: 菜单栏
-->
<template>
    <div class="menu">
        <el-menu :default-active="activedMenu" router unique-opened mode="vertical">
            <el-menu-item index="/index">
                <span slot="title">首页</span>
            </el-menu-item>
            <template v-for="firstLevelMenu in menus">
                <el-sub-menu v-if="firstLevelMenu.url == ''" :key="firstLevelMenu.id" :index="firstLevelMenu.id.toString()">
                    <template #title>
                        <el-image class="menu-icon" v-if="firstLevelMenu.icon" :src="firstLevelMenu.icon" />
                        <span>{{ firstLevelMenu.name }}</span>
                    </template>
                    <template v-for="secondLevelMenu in firstLevelMenu.children">
                        <el-sub-menu v-if="secondLevelMenu.url == ''" :key="secondLevelMenu.id" :index="secondLevelMenu.id.toString()">
                            <template #title>
                                <el-image class="menu-icon" v-if="secondLevelMenu.icon" :src="secondLevelMenu.icon" />
                                <span>{{ secondLevelMenu.name }}</span>
                            </template>
                            <el-menu-item v-for="thirdLevelMenu in secondLevelMenu.children" :key="thirdLevelMenu.id" :index="thirdLevelMenu.url.toString()">
                                <el-image class="menu-icon" v-if="thirdLevelMenu.icon" :src="thirdLevelMenu.icon" />
                                <span slot="title">{{ thirdLevelMenu.name }}</span>
                            </el-menu-item>
                        </el-sub-menu>
                        <el-menu-item v-else :key="`#` + secondLevelMenu.id" :index="secondLevelMenu.url.toString()">
                            <el-image class="menu-icon" v-if="secondLevelMenu.icon" :src="secondLevelMenu.icon" />
                            <span slot="title">{{ secondLevelMenu.name }}</span>
                        </el-menu-item>
                    </template>
                </el-sub-menu>
                <el-menu-item v-else :key="`#` + firstLevelMenu.id" :index="firstLevelMenu.url.toString()">
                    <el-image class="menu-icon" v-if="firstLevelMenu.icon" :src="firstLevelMenu.icon" />
                    <span slot="title">{{ firstLevelMenu.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>
<script setup lang="ts">
import localStorageKeyConstant from "@/constant/localStorageKeyConstant"
import { MenuBO } from "@/types/auth"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

// 当前选中菜单
const activedMenu = ref<string>("/index")
const menus = ref<MenuBO[]>([])

onMounted(() => {
    menus.value = JSON.parse(localStorage.getItem(localStorageKeyConstant.MENU) as string)
    activedMenu.value = router.currentRoute.value.path
})
</script>
<style lang="scss" scoped>
.menu {
    position: fixed;
    left: 0px;
    top: 50px;
    bottom: 0px;
    width: 200px;
    overflow: auto;
}
.menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
}
</style>

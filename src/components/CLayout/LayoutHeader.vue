<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-18 09:35:50
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-18 09:56:51
 * @Description: 页面头部:logo、标题、用户头像
-->
<template>
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
                        <el-dropdown-item divided @click.native="gotoPersonalCenter">
                            <el-icon><User /></el-icon>
                            个人中心
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="logoutHandel">
                            <el-icon><SwitchButton /></el-icon>退出
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { logout } from "@/service/auth"
import localStorageKeyConstant from "@/constant/localStorageKeyConstant"
import logo from "@/assets/img/logo.png"

const router = useRouter()

// title
const title = ref<string>(import.meta.env.VITE_TITLE || "")

// 帐号信息
const account = reactive({
    name: "",
    lastName: "",
    avatarImgUrl: ""
})
onMounted(() => {
    account.name = localStorage.getItem(localStorageKeyConstant.ACCOUNT_NAME) as string
    if (account.name) {
        account.lastName = account.name.substr(0, 1)
    }
    account.avatarImgUrl = localStorage.getItem(localStorageKeyConstant.ACCOUNT_AVATAR_IMG_URL) as string
})
// 个人中心
const gotoPersonalCenter = () => {
    router.replace({
        path: "/profile"
    })
}
// 退出
const logoutHandel = () => {
    logout().then(() => {
        localStorage.removeItem(localStorageKeyConstant.TOKEN)
        router.replace({
            path: "/login"
        })
    })
}
</script>
<style lang="scss" scoped>
.header {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 50px;
    background-color: var(--el-color-primary);
    .header-left {
        float: left;
        width: 200px;
        height: 50px;
        display: flex;
        align-items: center;

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
    }

    .header-right {
        float: right;
    }
    .avatar {
        width: 50px;
        height: 50px;
        margin-top: 5px;
    }
}
</style>

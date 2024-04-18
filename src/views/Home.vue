<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-27 16:05:18
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-18 11:28:40
 * @Description: Layout 
-->
<template>
    <div>
        <!-- 头部 -->
        <LayoutHeader />
        <div>
            <!-- 菜单 -->
            <LayoutMenu />
            <div class="main">
                <!-- 面包屑 -->
                <LayoutBreadcrumb />
                <div class="content">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import localStorageKeyConstant from "@/constant/localStorageKeyConstant"
import { dictTree } from "@/service/auth"
import { DictBO, Result } from "@/types/common"
import LayoutHeader from "@/components/CLayout/LayoutHeader.vue"
import LayoutBreadcrumb from "@/components/CLayout/LayoutBreadcrumb.vue"
import LayoutMenu from "@/components/CLayout/LayoutMenu.vue"

// onMounted
onMounted(() => {
    dictTree().then((response: Result<DictBO[]>) => {
        const result = response
        localStorage.setItem(localStorageKeyConstant.DICT, JSON.stringify(result.data))
    })
})
</script>

<style scoped lang="scss">
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

.content {
    margin-top: 0px;
    height: calc(100vh - 100px);
}
</style>

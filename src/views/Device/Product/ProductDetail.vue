<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-22 11:41:13
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-25 09:05:25
 * @Description: 产品详情页
-->
<template>
    <el-card shadow="never" style="margin-bottom: 16px">
        <el-page-header :icon="ArrowLeft" @back="goBack">
            <template #content>
                <span>{{ productDetail.name }}XX </span>
            </template>
            <template #extra>
                <el-button type="primary" class="ml-2">Edit</el-button>
            </template>
        </el-page-header>
    </el-card>
    <el-card shadow="never">
        <span class="label-title" style="margin-bottom: 16px">物模型配置</span>
        <el-tabs type="card">
            <el-tab-pane label="属性定义">
                <PropertiesTable />
            </el-tab-pane>
            <el-tab-pane label="指令定义">指令定义</el-tab-pane>
            <el-tab-pane label="标签定义">标签定义</el-tab-pane>
        </el-tabs>
    </el-card>
</template>
<script setup lang="ts">
import { getProductById } from "@/service/device/product"
import { Result } from "@/types/common"
import { ArrowLeft } from "@element-plus/icons-vue"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import PropertiesTable from "./components/MetadataTable/PropertiesTable.vue"
const router = useRouter()
const route = useRoute()

const loading = ref(false)

const productId = ref()
const productDetail = ref({
    name: "产品名称"
})

// 获取产品详情
const getProductDetail = () => {
    if (!productId.value) return
    getProductById(productId.value)
        .then((response: Result<any>) => {
            const result = response
            productDetail.value = result.data
        })
        .finally(() => {
            loading.value = false
        })
}

onMounted(() => {
    productId.value = route.query.id
    // getProductDetail()
})

/**
 * 返回父级
 */
const goBack = () => {
    router.replace({
        path: "/product"
    })
}
</script>

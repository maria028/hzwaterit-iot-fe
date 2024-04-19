<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-19 08:56:20
 * @Description: 字典  左侧父级，右侧子集
-->
<template>
    <el-row :gutter="16" style="height: 100%">
        <el-col :span="parent ? 12 : 24" style="height: 100%">
            <DictList @parentChange="parentChangeHandel"></DictList>
        </el-col>
        <el-col v-if="parent" :span="12" style="height: 100%">
            <DictList :parent="parent"></DictList>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import DictList from "./components/DictList.vue"
const parent = ref(null)
const parentChangeHandel = (e: any) => {
    parent.value = e
}
</script>

<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 11:37:11
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 12:59:53
 * @Description: 搜索框  单项
-->

<template>
    <el-col v-bind="$attrs" class="search_col_element" :xs="24" :sm="24" :md="12" :lg="8" :xl="8" :xxl="6">
        <el-form-item v-bind="$attrs" :label="props.label">
            <slot></slot>
        </el-form-item>
    </el-col>
</template>

<script lang="ts" setup>
const props = defineProps({
    label: {
        type: String,
        default: undefined
    }
});
</script>

<style></style>

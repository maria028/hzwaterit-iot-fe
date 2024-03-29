<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 11:06:59
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 17:21:16
 * @Description: 查询框

-->
<template>
    <el-form :model="formModel" label-width="auto" label-position="left">
        <el-row>
            <!-- 搜索项 -->
            <el-col :xs="12" :sm="16" :md="16" :lg="16" :xl="16" :xxl="18">
                <el-row ref="searchRowElement" class="search_row_element" :gutter="10">
                    <slot></slot>
                </el-row>
            </el-col>

            <!-- 搜索\重置 -->
            <el-col :flex="'86px'" style="text-align: right" :xs="12" :sm="8" :md="8" :lg="8" :xl="8" :xxl="6">
                <el-space :size="16" style="margin-bottom: 24px">
                    <el-button v-bind="$attrs" @click="clearHandel">
                        <template #icon>
                            <el-icon><Refresh /></el-icon></template
                        >重置
                    </el-button>
                    <el-button v-bind="$attrs" type="primary" @click="searchHandel">
                        <template #icon>
                            <el-icon><Search /></el-icon></template
                        >查询
                    </el-button>
                    <el-button v-bind="$attrs" type="primary" text @click="ChangeShowAllSearch">
                        {{ showAllSearch ? "收起" : "展开" }}
                        <el-icon v-if="!showAllSearch"><ArrowDown /></el-icon>
                        <el-icon v-else><ArrowUp /></el-icon>
                    </el-button>
                </el-space>
            </el-col>
        </el-row>
    </el-form>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick, useAttrs } from "vue";
const emit = defineEmits(["heightChange"]);
const attrs = useAttrs();
const searchRowElement = ref<HTMLElement | null>(null);
const searchColElements = ref<any>(null);
const formModel = ref({});
const showAllSearch = ref(false); // 展开\收起  所有搜索项

// 展开 显示全部
function openAllSearch() {
    if (typeof searchColElements.value === "object" && searchColElements.value !== null) {
        Object.keys(searchColElements.value).forEach((key) => {
            const element = searchColElements.value[key];
            element.style.display = "block";
        });
    }
}
// 收起 显示前2个col
function hideAllSearch() {
    if (typeof searchColElements.value === "object" && searchColElements.value !== null) {
        Object.keys(searchColElements.value).forEach((key, index) => {
            const element = searchColElements.value[key];
            if (index < 3) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        });
    }
}

// 展开\收起  所有搜索项
function ChangeShowAllSearch() {
    showAllSearch.value = !showAllSearch.value;
    emit("heightChange");

    if (showAllSearch.value) {
        openAllSearch();
    } else {
        hideAllSearch();
    }
}

// 初始化  默认收起
function initShowAllSearch() {
    showAllSearch.value = false;
    hideAllSearch();
}
// 搜索按钮点击
function searchHandel() {
    if (attrs.onSearch) {
        attrs.onSearch();
    }
}
// 重置按钮点击
function clearHandel() {
    if (attrs.onClear) {
        attrs.onClear();
    }
}
onMounted(async () => {
    await nextTick(); // DOM 更新
    searchColElements.value = document.querySelector(".search_row_element")?.children || [];
    initShowAllSearch();
});
</script>

<style></style>

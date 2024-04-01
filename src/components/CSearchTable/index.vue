<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 11:42:36
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 09:04:01
 * @Description: 查询表格通用组件
-->
<template>
    <el-card :body-style="{ height: '100%', position: 'relative' }" style="height: 100%; position: relative">
        <div ref="searchBarRef">
            <CSearchBar v-bind="$attrs" @heightChange="setTableHeight">
                <slot name="search"></slot>
            </CSearchBar>
        </div>
        <el-divider />
        <div ref="tableMenuRef">
            <el-row v-if="$slots.tableLeft || $slots.tableRight" justify="space-between" style="margin-bottom: 16px">
                <el-col :span="12" style="text-align: left">
                    <span class="label-title">{{ tableName }}</span>
                    <slot name="tableLeft"></slot>
                </el-col>
                <el-col :span="12" style="text-align: right">
                    <slot name="tableRight"></slot>
                </el-col>
            </el-row>
        </div>
        <div :style="{ height: tableHeight }">
            <el-table v-bind="$attrs" v-loading="loading" stripe border height="100%">
                <template #default>
                    <slot name="columns"></slot>
                </template>
            </el-table>
        </div>

        <div style="margin-top: 16px; display: flex; justify-content: end">
            <el-pagination
                v-bind="$attrs"
                ref="paginationRef"
                layout="total,sizes, prev, pager, next, jumper, ->"
                :page-sizes="[10, 20, 30, 50, 100]"
                @size-change="handleSizeChange"
                @currentChange="handleCurrentChange" />
        </div>
    </el-card>
</template>

<script lang="ts" setup>
import { useAttrs, onMounted, ref, nextTick } from "vue";
defineProps(["loading", "tableName", "pageSize", "currentPage"]);
const emit = defineEmits(["update:pageSize", "update:currentPage"]);
const attrs = useAttrs();
const paginationRef = ref();
const searchBarRef = ref();
const tableMenuRef = ref();

const tableHeight = ref("100%");
onMounted(async () => {
    // onMounted后执行首次查询
    search();

    setTableHeight();
});
const search = () => {
    if (attrs) {
        attrs.onSearch();
    }
};
const setTableHeight = async () => {
    await nextTick();
    let searchBarHeight = searchBarRef.value.offsetHeight;
    let tableMenuHeight = tableMenuRef.value.offsetHeight;
    // 32分割线 + 32分页 + 16分页margin + 40Card  padding
    let height = searchBarHeight + tableMenuHeight + 32 + 32 + 16 + 40;

    tableHeight.value = `calc(100% - ${height}px)`;
};
// 修改每页大小
const handleSizeChange = (pageSize: number) => {
    emit("update:pageSize", pageSize);
    search();
};
// 修改当前页
const handleCurrentChange = (pageNum: number) => {
    emit("update:currentPage", pageNum);
    search();
};
</script>

<style scoped>
::v-deep.el-divider--horizontal {
    margin: 0 0 16px !important;
}
</style>

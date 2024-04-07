<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 11:42:36
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-07 10:14:47
 * @Description: 查询表格通用组件
-->
<template>
    <el-card :body-style="{ height: '100%', position: 'relative' }" style="height: 100%; position: relative">
        <div v-if="hasSearchSlot" ref="searchBarRef">
            <CSearchBar v-bind="$attrs" @heightChange="setTableHeight" @search="searchHandel" @clear="clearHandel">
                <slot name="search"></slot>
            </CSearchBar>
        </div>
        <el-divider v-if="hasSearchSlot" />
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
            <el-table v-bind="$attrs" v-loading="loading" stripe height="100%">
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
                :current-page="currentPage"
                :page-size="pageSize"
                :page-sizes="[10, 20, 30, 50, 100]"
                @size-change="handleSizeChange"
                @currentChange="handleCurrentChange"
            />
        </div>
    </el-card>
</template>

<script lang="ts" setup>
import { useAttrs, useSlots, onMounted, ref, nextTick } from "vue"
defineProps(["loading", "tableName", "pageSize", "currentPage"])
const emit = defineEmits(["update:pageSize", "update:currentPage"])
const attrs = useAttrs()
const slots = useSlots()
const hasSearchSlot = ref(false)
const paginationRef = ref()
const searchBarRef = ref()
const tableMenuRef = ref()

const tableHeight = ref("100%")
onMounted(async () => {
    // onMounted后执行首次查询
    searchHandel()

    setTableHeight()

    if (slots["search"]) {
        hasSearchSlot.value = true
    }
})
const search = () => {
    if (attrs) {
        attrs.onSearch()
    }
}

const searchHandel = () => {
    emit("update:currentPage", 1)
    search()
}

const clearHandel = () => {
    emit("update:currentPage", 1)
    if (attrs) {
        attrs.onClear()
    }
}
// 计算表格高度
const setTableHeight = async () => {
    await nextTick()
    let height = 0

    if (hasSearchSlot.value) {
        height += searchBarRef.value.offsetHeight
        height += 16 // 分割线
    }
    height += tableMenuRef.value.offsetHeight
    height += 32 + 16 + 40 // 32分页 + 16分页margin + 40Card  padding
    height += 16 // 留余

    tableHeight.value = `calc(100% - ${height}px)`
}
// 修改每页大小
const handleSizeChange = (pageSize: number) => {
    emit("update:pageSize", pageSize)
    search()
}
// 修改当前页
const handleCurrentChange = (pageNum: number) => {
    emit("update:currentPage", pageNum)
    search()
}
</script>

<style scoped lang="scss">
:deep(.el-divider--horizontal) {
    margin: 0 0 16px !important;
}
</style>

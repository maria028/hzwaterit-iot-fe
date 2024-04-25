<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 11:42:36
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-24 14:15:34
 * @Description: 查询表格通用组件 整页组件，不建议嵌套在其他内容中，高度计算会失效
-->
<template>
    <el-card :class="isCard ? ' ' : 'is-card'" :body-style="{ height: '100%', position: 'relative' }" style="height: 100%; position: relative">
        <!-- 复合搜索框 -->
        <div v-if="hasSearchSlot" ref="searchBarRef">
            <CSearchBar v-bind="$attrs" @heightChange="setTableHeight" @search="searchHandel" @clear="clearHandel">
                <slot name="search"></slot>
            </CSearchBar>
        </div>
        <!-- 分割线 随搜索框显示 -->
        <el-divider v-if="hasSearchSlot" />

        <!-- 表格上方 单行显示  标题、按钮等 -->
        <div v-if="$slots.tableMenuLeft || $slots.tableMenuRight" ref="tableMenuRef" style="margin-bottom: 16px">
            <div style="display: flex; align-items: start; justify-content: space-between; flex-wrap: wrap">
                <div>
                    <span v-if="tableName" class="label-title">{{ tableName }}</span>
                    <slot name="tableMenuLeft"></slot>
                </div>
                <div>
                    <slot name="tableMenuRight"></slot>
                </div>
            </div>
        </div>
        <!-- 表格上方 其他块级内容  自定义 -->
        <div v-if="$slots.tableTop" ref="tableTopRef">
            <slot name="tableTop"></slot>
        </div>

        <!-- table -->
        <div :style="{ height: tableHeight }">
            <div style="display: flex; align-items: start">
                <!-- 表格左侧 块级内容  自定义 -->
                <div v-if="$slots.tableLeft" ref="tableLeftRef" style="width: fit-content">
                    <slot name="tableLeft"></slot>
                </div>
                <el-table v-bind="$attrs" v-loading="loading" stripe :height="tableFixHeight ? tableFixHeight : '100%'">
                    <template #default>
                        <slot name="columns"></slot>
                    </template>
                </el-table>
            </div>
        </div>
        <!-- 分页 随table显示  total非0时显示 -->
        <div v-if="hasPage" style="margin-top: 16px; display: flex; justify-content: end">
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
import { useAttrs, useSlots, onMounted, ref, nextTick, computed } from "vue"
defineProps({
    loading: Boolean, // laoding
    tableName: String, // table名称
    pageSize: Number, // 分页数量
    currentPage: Number, // 分页位置
    tableFixHeight: String, //table 固定高度
    // 是否卡片式 默认true
    isCard: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(["update:pageSize", "update:currentPage"])
const attrs = useAttrs()
const { onSearch, onClear } = useAttrs() as { onSearch: () => void; onClear: () => void }

// slots
const slots = useSlots()
const hasSearchSlot = ref(false)
const hasTableTopSlot = ref(false)
//  DOM REF
const paginationRef = ref()
const searchBarRef = ref()
const tableMenuRef = ref()
const tableTopRef = ref()

const tableHeight = ref("100%")

const hasPage = computed(() => {
    return attrs.total ? true : false
})
onMounted(async () => {
    // onMounted后执行首次查询
    searchHandel()
    setTableHeight()

    if (slots["search"]) {
        hasSearchSlot.value = true
    }
    if (slots["tableTop"]) {
        hasTableTopSlot.value = true
    }
})
const search = () => {
    onSearch()
}

const searchHandel = () => {
    emit("update:currentPage", 1)
    search()
}

const clearHandel = () => {
    emit("update:currentPage", 1)
    onClear()
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

    if (hasTableTopSlot.value) {
        height += tableTopRef.value.offsetHeight
    }

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
//移除card的所有样式
.is-card {
    background-color: transparent;
    border: none !important;
    border-radius: none;
    color: transparent;
    overflow: hidden;
    padding: 0;

    :deep(.el-card__body) {
        padding: 0;
    }
}
</style>

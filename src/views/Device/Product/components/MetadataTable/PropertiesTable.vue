<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-24 15:50:12
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-30 15:30:41
 * @Description: 物模型属性table
-->
<template>
    <CSearchTable
        :isCard="false"
        :data="tableData"
        :loading="loading"
        :total="rows"
        @search="getTableData"
        v-model:currentPage="queryModel.pageNum"
        v-model:pageSize="queryModel.pageSize"
    >
        <template #tableMenuLeft>
            <el-input v-model="queryModel.name" clearable maxlength="30" placeholder="请输入名称" @clear="searchClearHandel">
                <template #append> <el-button :icon="Search" @click="searchHandel" /> </template
            ></el-input>
        </template>
        <template #tableMenuRight>
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </template>
        <template #columns>
            <el-table-column
                v-for="column in dynamicColumns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :show-overflow-tooltip="column.showOverflowTooltip"
            >
                <template v-if="column.template" v-slot:default="scope">
                    {{ column.template(scope) }}
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right">
                <template #default="scope">
                    <el-button type="primary" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="danger" text @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <PropertiesEdit v-model:dialogVisible="dialogVisible" :dialogData="dialogData" @close="closePropertiesEdit" @confirm="confirmPropertiesEdit" />
</template>
<script lang="ts" setup>
import { ref, onMounted, provide } from "vue"
import { MetadataColumnBO, createInitData } from "@/types/metadata"
import { Result } from "@/types/common"
import { ElMessage, ElMessageBox } from "element-plus"
import { Search } from "@element-plus/icons-vue"
import { addProduct, getProduct, updateProduct } from "@/service/device/product"
import metadataMock from "../metadataMock"
import PropertiesEdit from "../MetadataForm/PropertiesEdit.vue"
// props
const props = defineProps({
    type: {
        type: String,
        required: true
    }
})
const metadataType: string = props.type
provide("metadataType", metadataType)

// 根据 props 中的 type 属性获取对应的 ColumnBO
type ColumnBO = MetadataColumnBO<typeof metadataType>
const initColumnData = createInitData(metadataType)

// 表格列字段
const MetadataMappingColumns = new Map<string, any>()
MetadataMappingColumns.set("properties", [
    { prop: "id", label: "属性标识", showOverflowTooltip: true },
    { prop: "name", label: "属性名称", showOverflowTooltip: true },
    { prop: "valueType.type", label: "数据类型" },
    { prop: "expands.source", label: "属性值来源" },
    { prop: "expands.readOnly", label: "是否只读", template: (scope: any) => (scope.row.expands.readOnly === "true" ? "是" : "否") },
    { prop: "description", label: "说明" }
])
MetadataMappingColumns.set("functions", [
    { prop: "id", label: "标识", showOverflowTooltip: true },
    { prop: "name", label: "名称", showOverflowTooltip: true },
    { prop: "description", label: "说明" },
    { prop: "async", label: "是否异步", template: (scope: any) => (scope.row.async ? "是" : "否") }
])
MetadataMappingColumns.set("tags", [
    { prop: "id", label: "标识", showOverflowTooltip: true },
    { prop: "name", label: "名称", showOverflowTooltip: true },
    { prop: "description", label: "说明" },
    { prop: "valueType", label: "数据类型", template: (scope: any) => scope.row.valueType.type }
])
const dynamicColumns = MetadataMappingColumns.get(metadataType)

const loading = ref(false)

// 查询条件
const initQueryModel = {
    pageNum: 1,
    pageSize: 10,
    name: ""
}
const queryModel = ref(initQueryModel)

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<ColumnBO[]>([])

//总数据  没有分页需要手动分页
const tableDataTotal = ref<ColumnBO[]>([])

// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<ColumnBO>(initColumnData)

onMounted(() => {
    getMetadata()
})

// 获取数据
const getMetadata = () => {
    // getProduct(queryModel.value)
    //     .then((response: Result<ProductBO[]>) => {
    //         const result = response
    //         // rows.value = result.rows
    //         // tableData.value = result.data
    //     })
    //     .finally(() => {})

    // 假数据
    tableDataTotal.value = metadataMock[metadataType]
    rows.value = tableDataTotal.value.length
}
// 手动截取数组  分页
const getTableData = () => {
    loading.value = true
    setTimeout(() => {
        let filterData = tableDataTotal.value
        // 过滤筛选关键词
        if (queryModel.value.name) {
            filterData = tableDataTotal.value.filter((i) => {
                return i.name.indexOf(queryModel.value.name) > -1
            })
            rows.value = filterData.length
        }
        const startIndex = (queryModel.value.pageNum - 1) * queryModel.value.pageSize
        const endIndex = startIndex + queryModel.value.pageSize
        tableData.value = filterData.slice(startIndex, endIndex)
        loading.value = false
    }, 1000)
}
//  输入框搜索
const searchHandel = () => {
    queryModel.value.pageNum = 1
    getTableData()
}
// 输入框搜索清空
const searchClearHandel = () => {
    queryModel.value.pageNum = 1
    queryModel.value.name = ""
    rows.value = tableDataTotal.value.length

    getTableData()
}

// 新增
const handleAdd = () => {
    dialogVisible.value = true
    dialogData.value = initColumnData
}
// 修改
const handleEdit = (row: ColumnBO) => {
    dialogVisible.value = true
    dialogData.value = row
}

// 删除
const handleDelete = (row: ColumnBO) => {
    ElMessageBox.confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {})
        .catch(() => {
            ElMessage.info("已取消")
        })
}

// 对话框关闭
const closePropertiesEdit = () => {
    dialogVisible.value = false
    dialogData.value = initColumnData
}
// 对话框确定
const confirmPropertiesEdit = (formData: ColumnBO) => {
    ElMessage.success("操作成功！")
    getTableData()
    closePropertiesEdit()
}
</script>

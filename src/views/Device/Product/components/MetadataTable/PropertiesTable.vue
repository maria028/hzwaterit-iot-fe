<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-24 15:50:12
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-29 12:30:27
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
            <el-table-column prop="id" label="属性标识" show-overflow-tooltip />
            <el-table-column prop="name" label="属性名称" show-overflow-tooltip />
            <el-table-column prop="valueType.type" label="数据类型" />
            <el-table-column prop="expands.source" label="属性值来源" />
            <el-table-column prop="expands.readOnly" label="是否只读">
                <template #default="scope">
                    {{ scope.row.expands.readOnly == "true" ? "是" : "否" }}
                </template>
            </el-table-column>
            <el-table-column prop="description" label="说明" />
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
import { ref, onMounted } from "vue"
import { ProductBO, ProductDTO } from "@/types/device"
import { PropertiesBO, initPropertiesData } from "@/types/metadata"
import { Result } from "@/types/common"
import { ElMessage, ElMessageBox } from "element-plus"
import { Search } from "@element-plus/icons-vue"
import { addProduct, getProduct, updateProduct } from "@/service/device/product"
import metadataMock from "../metadataMock"
import PropertiesEdit from "../MetadataForm/PropertiesEdit.vue"
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
const tableData = ref<PropertiesBO[]>([])

//总数据  没有分页需要手动分页
const tableDataTotal = ref<PropertiesBO[]>([])

// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<PropertiesBO>(initPropertiesData)

onMounted(() => {
    getMetadata()
})

// 获取数据
const getMetadata = () => {
    getProduct(queryModel.value)
        .then((response: Result<ProductBO[]>) => {
            const result = response
            // rows.value = result.rows
            // tableData.value = result.data
        })
        .finally(() => {})

    // 假数据
    const properties = metadataMock.properties
    tableDataTotal.value = properties
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
    dialogData.value = initPropertiesData
}
// 修改
const handleEdit = (propertie: PropertiesBO) => {
    dialogVisible.value = true
    dialogData.value = propertie
}

// 删除
const handleDelete = (propertie: PropertiesBO) => {
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
    dialogData.value = initPropertiesData
}
// 对话框确定
const confirmPropertiesEdit = (formData: PropertiesBO) => {
    ElMessage.success("操作成功！")
    getTableData()
    closePropertiesEdit()
}
</script>

<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-22 11:36:53
 * @Description: 产品分类
-->
<template>
    <CSearchTable
        tableName="产品分类"
        :data="tableData"
        @search="getTableData"
        @clear="reset"
        :loading="loading"
        :total="rows"
        v-model:currentPage="queryModel.pageNum"
        v-model:pageSize="queryModel.pageSize"
    >
        <template #search>
            <CSearchBarItem label="名称">
                <el-input v-model="queryModel.name" clearable maxlength="30" placeholder="请输入名称" />
            </CSearchBarItem>
        </template>
        <template #tableMenuLeft> </template>
        <template #tableMenuRight>
            <el-button v-permission="'POST/category'" type="primary" @click="handleAdd">新增</el-button>
        </template>
        <template #columns>
            <el-table-column type="index" label="序号" min-width="80" />
            <el-table-column label="名称" prop="name" min-width="120px" show-overflow-tooltip />
            <el-table-column label="说明" prop="description" min-width="200px" show-overflow-tooltip />

            <el-table-column label="操作" fixed="right" min-width="200">
                <template #default="scope">
                    <el-button v-permission="'PUT/category'" type="primary" text @click="handleEdit(scope.row.id)">修改</el-button>
                    <el-button v-permission="'DELETE/category/{id}'" type="danger" text @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <CategoryForm v-model:dialogVisible="dialogVisible" :dialogData="dialogData" @close="closeEmployeeForm" @confirm="confirmEmployeeForm" />
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { CategoryBO, CategoryDTO } from "@/types/device"
import { Result } from "@/types/common"
import { ElMessage, ElMessageBox } from "element-plus"
import CategoryForm from "./components/CategoryForm.vue"
import { addCategory, deleteCategoryById, getCategory, getCategoryById, updateCategory } from "@/service/device/category"

const loading = ref(false)
// 查询条件
const initQueryModel = {
    pageNum: 1,
    pageSize: 10,
    name: null
}
const queryModel = ref(initQueryModel)

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<CategoryBO[]>([])

// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<CategoryDTO>({
    id: 0,
    name: "",
    description: ""
})

onMounted(() => {})

// 搜索
const getTableData = () => {
    loading.value = true
    getCategory(queryModel.value)
        .then((response: Result<CategoryBO[]>) => {
            const result = response
            rows.value = result.rows
            tableData.value = result.data
        })
        .finally(() => {
            loading.value = false
        })
}

//  重置
const reset = () => {
    queryModel.value = initQueryModel
    getTableData()
}
// 新增
const handleAdd = () => {
    dialogVisible.value = true
}
// 修改
const handleEdit = (id: number) => {
    dialogVisible.value = true
    getCategoryById(id).then((response: Result<CategoryDTO>) => {
        dialogData.value = response.data
    })
}

// 删除
const handleDelete = (id: number) => {
    ElMessageBox.confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            deleteCategoryById(id).then(() => {
                ElMessage.success("操作成功！")
                getTableData()
            })
        })
        .catch(() => {
            ElMessage.info("已取消")
        })
}

// 对话框关闭
const closeEmployeeForm = () => {
    dialogVisible.value = false
    dialogData.value.id = 0
}
// 对话框确定
const confirmEmployeeForm = (formData: CategoryDTO) => {
    const request = formData.id == 0 ? addCategory(formData) : updateCategory(formData)
    request.then(() => {
        ElMessage.success("操作成功！")
        getTableData()
        closeEmployeeForm()
    })
}
</script>

<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-24 14:57:21
 * @Description: 产品列表
-->
<template>
    <CSearchTable
        tableName="产品列表"
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
            <el-button v-permission="'POST/product'" type="primary" @click="handleAdd">新增</el-button>
        </template>
        <template #columns>
            <el-table-column type="index" label="序号" min-width="80" />
            <el-table-column label="名称" prop="name" min-width="120px" show-overflow-tooltip />
            <el-table-column label="说明" prop="description" min-width="200px" show-overflow-tooltip />

            <el-table-column label="操作" fixed="right" min-width="200">
                <template #default="scope">
                    <el-button v-permission="'PUT/product'" type="primary" text @click="handleEdit(scope.row.id)">修改</el-button>
                    <el-button v-permission="'GET/product/{id}'" type="primary" text @click="handleDetail(scope.row.id)">详情</el-button>
                    <el-button v-permission="'DELETE/product/{id}'" type="danger" text @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <ProductForm v-model:dialogVisible="dialogVisible" :dialogData="dialogData" @close="closeEmployeeForm" @confirm="confirmEmployeeForm" />
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { ProductBO, ProductDTO } from "@/types/device"
import { Result } from "@/types/common"
import { ElMessage, ElMessageBox } from "element-plus"
import ProductForm from "./components/ProductForm.vue"
import { addProduct, deleteProductById, getProduct, getProductById, updateProduct } from "@/service/device/product"
import { useRouter } from "vue-router"
const router = useRouter()

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
const tableData = ref<ProductBO[]>([])

// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<ProductDTO>({
    id: 0,
    name: "",
    description: "",
    category: ""
})

onMounted(() => {})

// 搜索
const getTableData = () => {
    loading.value = true
    getProduct(queryModel.value)
        .then((response: Result<ProductBO[]>) => {
            const result = response
            rows.value = result.rows
            tableData.value = result.data
        })
        .finally(() => {
            loading.value = false
            tableData.value = [
                {
                    id: 0,
                    name: "",
                    description: "",
                    createGmt: "",
                    modifiedGmt: "",
                    category: ""
                }
            ]
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
    getProductById(id).then((response: Result<ProductDTO>) => {
        dialogData.value = response.data
    })
}

// 详情
const handleDetail = (id: number) => {
    router.push({
        path: "/product/detail",
        query: { id }
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
            deleteProductById(id).then(() => {
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
const confirmEmployeeForm = (formData: ProductDTO) => {
    const request = formData.id == 0 ? addProduct(formData) : updateProduct(formData)
    request.then(() => {
        ElMessage.success("操作成功！")
        getTableData()
        closeEmployeeForm()
    })
}
</script>

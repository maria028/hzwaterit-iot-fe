<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-02 11:25:02
 * @Description: 
-->
<template>
    <CSearchTable
        tableName="属性列表"
        :data="tableData"
        @search="getTableData"
        @clear="reset"
        :loading="loading"
        :total="rows"
        v-model:currentPage="queryModel.pageNum"
        v-model:pageSize="queryModel.pageSize"
    >
        <template #search>
            <CSearchBarItem label="属性名">
                <el-input v-model="queryModel.name" clearable maxlength="30" placeholder="请输入属性名" />
            </CSearchBarItem>
        </template>
        <template #tableLeft> </template>
        <template #tableRight>
            <el-button v-permission="'POST/property'" type="primary" @click="handleAdd">新增</el-button>
        </template>
        <template #columns>
            <el-table-column type="index" label="序号" min-width="80" />
            <el-table-column label="属性名" prop="name" min-width="120px" show-overflow-tooltip />
            <el-table-column label="属性值" prop="value" min-width="120px" show-overflow-tooltip />
            <el-table-column label="描述" prop="description" min-width="200px" show-overflow-tooltip />
            <el-table-column label="创建时间" prop="createGmt" min-width="120" />
            <el-table-column label="修改时间" prop="modifiedGmt" min-width="120" />

            <el-table-column label="操作" fixed="right" min-width="200">
                <template #default="scope">
                    <el-button v-permission="'PUT/property'" type="primary" text @click="handleEdit(scope.row.id)">修改</el-button>
                    <el-button v-permission="'DELETE/property/{id}'" type="danger" text @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body>
        <el-form :model="dialogData" ref="dialogFormRef" label-width="auto" :rules="dialogRules">
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="属性名" prop="name">
                        <el-input v-model="dialogData.name" placeholder="请输入名称" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="属性值" prop="value">
                        <el-input v-model="dialogData.value" placeholder="请输入属性值" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="描述" prop="description">
                        <el-input v-model="dialogData.description" placeholder="请输入描述" type="textarea" :rows="5" maxlength="200" show-word-limit />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-button @click="dialogCancel">取消</el-button>
            <el-button type="primary" @click="dialogConfirm">确定</el-button>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { PropertyBO, PropertyDTO } from "@/types/System"
import { Result } from "@/types/Common"
import { ElMessage, ElMessageBox } from "element-plus"
import { addProperty, deletePropertyById, getProperty, getPropertyById, updateProperty } from "@/service/system/property"
const dialogFormRef = ref()

const loading = ref(false)
// 查询条件
const queryModel = ref({
    pageNum: 1,
    pageSize: 10,
    name: null
})

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<PropertyBO[]>([])

// 对话框标题
const dialogTitle = ref("")
// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<PropertyDTO>({
    id: 0,
    name: "",
    value: "",
    description: ""
})
// 对话框校验
const dialogRules = {
    name: [{ required: true, message: "请输入属性名", trigger: "blur" }],
    value: [{ required: true, message: "请输入属性值", trigger: "blur" }]
}

onMounted(() => {})

// 搜索
const getTableData = () => {
    loading.value = true
    getProperty(queryModel.value)
        .then((response: Result<PropertyBO[]> | any) => {
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
    queryModel.value = {
        pageNum: 1,
        pageSize: 10,
        name: null
    }
    getTableData()
}
// 新增
const handleAdd = () => {
    dialogTitle.value = "新增"
    dialogVisible.value = true
}
// 修改
const handleEdit = (id: number) => {
    dialogTitle.value = "修改"
    dialogVisible.value = true
    getPropertyById(id).then((response: Result<PropertyDTO> | any) => {
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
            deletePropertyById(id).then(() => {
                ElMessage.success("操作成功！")
                getTableData()
            })
        })
        .catch(() => {
            ElMessage.info("已取消")
        })
}

// 对话框关闭
const dialogClose = () => {
    dialogVisible.value = false
    dialogData.value.id = 0
    dialogFormRef.value.resetFields()
}
// 对话框取消
const dialogCancel = () => {
    dialogClose()
}

// 对话框确定
const dialogConfirm = () => {
    dialogFormRef.value.validate((valid: boolean) => {
        if (valid) {
            const request = dialogData.value.id == 0 ? addProperty(dialogData.value) : updateProperty(dialogData.value)
            request.then(() => {
                ElMessage.success("操作成功！")
                dialogClose()
                getTableData()
            })
        }
    })
}
</script>

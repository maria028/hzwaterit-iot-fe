<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-19 14:28:49
 * @Description: 角色列表
-->
<template>
    <CSearchTable
        tableName="角色列表"
        :data="tableData"
        @search="getTableData"
        @clear="reset"
        :loading="loading"
        :total="rows"
        v-model:currentPage="queryModel.pageNum"
        v-model:pageSize="queryModel.pageSize"
    >
        <template #tableMenuLeft> </template>
        <template #tableMenuRight>
            <el-space>
                <CSelectInput
                    v-model="queryModel"
                    :option="[
                        {
                            label: '编码',
                            value: 'code'
                        },
                        {
                            label: '名称',
                            value: 'name'
                        }
                    ]"
                    @search="getTableData"
                />
                <el-button v-permission="'POST/role'" type="primary" @click="handleAdd">新增</el-button>
            </el-space>
        </template>
        <template #columns>
            <el-table-column type="index" label="序号" min-width="50" />
            <el-table-column label="编码" prop="code" min-width="100" />
            <el-table-column label="名称" prop="name" min-width="100" />
            <!-- <el-table-column label="创建时间" prop="createGmt" min-width="120" /> -->
            <!-- <el-table-column label="修改时间" prop="modifiedGmt" min-width="120" /> -->
            <el-table-column label="操作" fixed="right" min-width="200">
                <template #default="scope">
                    <el-button v-permission="'PUT/role'" type="primary" text @click="handleEdit(scope.row.id)">修改</el-button>
                    <el-button v-permission="'PUT/role-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 1)">上移</el-button>
                    <el-button v-permission="'PUT/role-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 2)">下移</el-button>
                    <el-button v-permission="'DELETE/role/{id}'" type="danger" text @click="handleDelete(scope.row.id)" :disabled="scope.row.id <= 3">删除</el-button>
                    <el-button v-permission="'GET/role-employee'" type="primary" text @click="handleRelationEmployee(scope.row)">关联员工</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <RoleForm v-model:dialogVisible="dialogVisible" :dialogData="dialogData" @close="closeEmployeeForm" @confirm="confirmEmployeeForm" />
</template>
<script lang="ts" setup>
import { ref } from "vue"
import { RoleBO, RoleDTO } from "@/types/system"
import { Result } from "@/types/common"
import { ElMessage, ElMessageBox } from "element-plus"
import { addRole, deleteRoleById, getRole, getRoleById, setRoleSort, updateRole } from "@/service/system/role"
import CSelectInput from "@/components/CSelectInput/index.vue"
import RoleForm from "./RoleForm.vue"

const emit = defineEmits(["roleChange"])

const loading = ref(false)
// 查询条件
const initQueryModel = {
    pageNum: 1,
    pageSize: 10,
    code: null,
    name: null
}
const queryModel = ref(initQueryModel)

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<RoleBO[]>([])

// 对话框是否显示
const dialogVisible = ref(false)
// 对话框数据
const dialogData = ref<RoleDTO>({
    id: 0,
    code: "",
    name: "",
    resourceIds: []
})

// 搜索
const getTableData = () => {
    loading.value = true
    getRole(queryModel.value)
        .then((response: Result<RoleBO[]>) => {
            const result = response
            rows.value = result.rows
            tableData.value = result.data
            // 默认显示列表第一项关联员工  有无权限父级判断，此处无影响
            tableData.value.length > 0 && emit("roleChange", tableData.value[0])
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
    getRoleById(id).then((response: Result<RoleDTO>) => {
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
            deleteRoleById(id).then(() => {
                ElMessage.success("操作成功！")
                getTableData()
            })
        })
        .catch(() => {
            ElMessage.info("已取消")
        })
}

// 修改排序
const handlerUpdateSort = (id: number, moveTypeCode: number) => {
    setRoleSort({
        id: id,
        moveTypeCode: moveTypeCode
    }).then(() => {
        ElMessage.success("操作成功！")
        getTableData()
    })
}

// 对话框关闭
const closeEmployeeForm = () => {
    dialogVisible.value = false
    dialogData.value.id = 0
}
// 对话框确定
const confirmEmployeeForm = (formData: RoleDTO) => {
    const request = formData.id == 0 ? addRole(formData) : updateRole(formData)
    request.then(() => {
        ElMessage.success("操作成功！")
        getTableData()
        closeEmployeeForm()
    })
}

//  关联员工
const handleRelationEmployee = (role: RoleBO) => {
    emit("roleChange", role)
}
</script>

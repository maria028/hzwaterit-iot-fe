<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 10:11:50
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-18 14:36:24
 * @Description: 
-->
<template>
    <el-row :gutter="16" style="height: 100%">
        <el-col :span="4" style="height: 100%">
            <el-card>
                <CTree :data="treeData" defaultKey="0" @nodeClick="handlerNodeClick" />
            </el-card>
        </el-col>
        <el-col :span="20" style="height: 100%">
            <CSearchTable
                tableName="部门列表"
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
                <template #tableLeft> </template>
                <template #tableRight>
                    <el-button v-permission="'POST/department'" type="primary" @click="handleAdd">新增</el-button>
                </template>
                <template #columns>
                    <el-table-column type="index" label="序号" width="80" />
                    <el-table-column label="名称" prop="name" width="200" />
                    <el-table-column label="创建时间" prop="createGmt" width="200" />
                    <el-table-column label="修改时间" prop="modifiedGmt" width="200" />
                    <el-table-column label="操作" fixed="right" min-width="300">
                        <template #default="scope">
                            <el-button v-permission="'PUT/department'" type="primary" text @click="handleEdit(scope.row.id)"> 修改 </el-button>
                            <el-button v-permission="'PUT/department-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 1)"> 上移 </el-button>
                            <el-button v-permission="'PUT/department-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 2)"> 下移 </el-button>
                            <el-button v-permission="'DELETE/department/{id}'" type="danger" text @click="handleDelete(scope.row.id)"> 删除 </el-button>
                            <el-button v-permission="'GET/department-employee'" type="primary" text @click="handleRelationEmployee(scope.row.id)"> 关联员工 </el-button>
                        </template>
                    </el-table-column>
                </template>
            </CSearchTable>
        </el-col>
    </el-row>
    <DepartmentForm v-model:dialogVisible="dialogVisible" :dialogData="dialogData" @close="closeEmployeeForm" @confirm="confirmEmployeeForm" />
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { DepartmentTreeBO, DepartmentBO, DepartmentDTO } from "@/types/system"
import { Result } from "@/types/common"
import { getDepartment, getDepartmentTreeData, getDepartmentById, deleteDepartmentById, setDepartmentSort, addDepartment, updateDepartment } from "@/service/system/department"
import { ElMessage, ElMessageBox } from "element-plus"
import { useRouter } from "vue-router"
import DepartmentForm from "./components/DepartmentForm.vue"
import CTree from "@/components/CTree/index.vue"

const router = useRouter()

const treeRef = ref()

// 部门树数据
const treeData = ref<DepartmentTreeBO[]>([])

// 当前选中的节点
const currentNodeKey = ref(0)
const loading = ref(false)

// 查询条件
const initQueryModel = {
    pageNum: 1,
    pageSize: 10,
    parentId: 0,
    name: null
}
const queryModel = ref(initQueryModel)

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<DepartmentBO[]>([])

// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<DepartmentDTO>({
    id: 0,
    parentId: 0,
    name: ""
})

onMounted(() => {
    getDepartmentTree()
})

// 获取部门树
const getDepartmentTree = () => {
    getDepartmentTreeData().then(async (response: Result<DepartmentTreeBO[]>) => {
        const result = response
        treeData.value = [{ id: 0, name: "部门树", children: [...result.data] }]
        getTableData()
    })
}

// 搜索
const getTableData = () => {
    loading.value = true
    queryModel.value.parentId = currentNodeKey.value
    getDepartment(queryModel.value)
        .then((response: Result<DepartmentBO[]>) => {
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
// 树节点点击
const handlerNodeClick = (key: any) => {
    currentNodeKey.value = key
    getTableData()
}
// 新增
const handleAdd = () => {
    dialogVisible.value = true
}
// 修改
const handleEdit = (id: number) => {
    dialogVisible.value = true
    getDepartmentById(id).then((response: Result<DepartmentDTO>) => {
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
            deleteDepartmentById(id).then(() => {
                ElMessage.success("操作成功！")
                getTableData()
                getDepartmentTree()
            })
        })
        .catch(() => {
            ElMessage.info("已取消")
        })
}
// 修改排序
const handlerUpdateSort = (id: number, moveTypeCode: number) => {
    setDepartmentSort({
        id: id,
        moveTypeCode: moveTypeCode
    }).then(() => {
        ElMessage.success("操作成功！")
        getTableData()
        getDepartmentTree()
    })
}

// 对话框关闭
const closeEmployeeForm = () => {
    dialogVisible.value = false
    dialogData.value.id = 0
}
// 对话框确定
const confirmEmployeeForm = (formData: DepartmentDTO) => {
    if (formData.id == 0) {
        formData.parentId = currentNodeKey.value
    }
    const request = formData.id == 0 ? addDepartment(formData) : updateDepartment(formData)
    request.then(() => {
        ElMessage.success("操作成功！")
        getTableData()
        getDepartmentTree()
        closeEmployeeForm()
    })
}

//  关联员工
const handleRelationEmployee = (id: number) => {
    router.replace({
        path: "/department-employee",
        query: {
            departmentId: id + ""
        }
    })
}
</script>

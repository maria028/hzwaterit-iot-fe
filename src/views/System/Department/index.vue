<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 10:11:50
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:31:40
 * @Description: 
-->
<template>
    <el-row :gutter="16" style="height: 100%">
        <el-col :span="4" style="height: 100%">
            <el-card>
                <el-tree :data="treeData" :props="treeProps" node-key="id" highlight-current accordion ref="treeRef" default-expand-all @node-click="handlerNodeClick" />
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body>
        <el-form :model="dialogData" ref="dialogFormRef" label-width="auto" :rules="dialogRules">
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialogData.name" placeholder="请输入名称" maxlength="30" style="width: 240px" />
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
import { ref, onMounted, nextTick } from "vue"
import { DepartmentTreeBO, DepartmentBO, DepartmentDTO } from "@/types/System"
import { Result } from "@/types/Common"
import { getDepartment, getDepartmentTreeData, getDepartmentById, deleteDepartmentById, setDepartmentSort, addDepartment, updateDepartment } from "@/service/system/department"
import { ElMessage, ElMessageBox } from "element-plus"
import { useRouter } from "vue-router"
const router = useRouter()

const treeRef = ref()
const dialogFormRef = ref()

// 部门树数据
const treeData = ref<DepartmentTreeBO[]>([])
// 树属性
const treeProps = ref({
    children: "children",
    label: "name"
})
// 当前选中的节点
const currentNodeKey = ref(0)
const loading = ref(false)

// 查询条件
const queryModel = ref({
    pageNum: 1,
    pageSize: 10,
    parentId: 0,
    name: ""
})

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<DepartmentBO[]>([])

// 对话框标题
const dialogTitle = ref("")
// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<DepartmentDTO>({
    id: 0,
    parentId: 0,
    name: ""
})
// 对话框校验
const dialogRules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }]
}

onMounted(() => {
    getDepartmentTree()
})

// 获取部门树
const getDepartmentTree = () => {
    getDepartmentTreeData().then(async (response: Result<DepartmentTreeBO[]>) => {
        const result = response
        treeData.value = [{ id: 0, name: "部门树", children: [...result.data] }]
        getTableData()

        await nextTick()
        treeRef.value.setCurrentKey(currentNodeKey.value)
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
    queryModel.value = {
        pageNum: 1,
        pageSize: 10,
        parentId: 0,
        name: ""
    }
    getTableData()
}
// 树节点点击
const handlerNodeClick = () => {
    currentNodeKey.value = treeRef.value.getCurrentKey()
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
            dialogData.value.parentId = currentNodeKey.value
            const request = dialogData.value.id == 0 ? addDepartment(dialogData.value) : updateDepartment(dialogData.value)
            request.then(() => {
                ElMessage.success("操作成功！")
                dialogClose()
                getTableData()
            })
        }
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

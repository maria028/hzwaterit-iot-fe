<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:36:55
 * @Description: 
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
        <template #search>
            <CSearchBarItem label="编码">
                <el-input v-model="queryModel.code" clearable maxlength="30" placeholder="请输入编码" />
            </CSearchBarItem>
            <CSearchBarItem label="编码">
                <el-input v-model="queryModel.name" clearable maxlength="30" placeholder="请输入名称" />
            </CSearchBarItem>
        </template>
        <template #tableLeft> </template>
        <template #tableRight>
            <el-button v-permission="'POST/role'" type="primary" @click="handleAdd">新增</el-button>
        </template>
        <template #columns>
            <el-table-column type="index" label="序号" min-width="80" />
            <el-table-column label="编码" prop="code" min-width="100" />
            <el-table-column label="名称" prop="name" min-width="100" />
            <el-table-column label="创建时间" prop="createGmt" min-width="120" />
            <el-table-column label="修改时间" prop="modifiedGmt" min-width="120" />

            <el-table-column label="操作" fixed="right" min-width="200">
                <template #default="scope">
                    <el-button v-permission="'PUT/role'" type="primary" text @click="handleEdit(scope.row.id)">修改</el-button>
                    <el-button v-permission="'PUT/role-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 1)">上移</el-button>
                    <el-button v-permission="'PUT/role-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 2)">下移</el-button>
                    <el-button v-permission="'DELETE/role/{id}'" type="danger" text @click="handleDelete(scope.row.id)" :disabled="scope.row.id <= 3">删除</el-button>
                    <el-button v-permission="'GET/role-employee'" type="primary" text @click="handleRelationEmployee(scope.row.id)">关联员工</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body>
        <el-form :model="dialogData" ref="dialogFormRef" label-width="auto" :rules="dialogRules">
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="dialogData.code" placeholder="请输入编码" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialogData.name" placeholder="请输入名称" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="权限" prop="resourceIds">
                        <el-tree :data="treeData" :props="treeProps" node-key="id" show-checkbox ref="treeRef" />
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
import { ResourceTreeBO, RoleBO, RoleDTO } from "@/types/System"
import { Result } from "@/types/Common"
import { getResourceTreeData } from "@/service/system/resource"
import { ElMessage, ElMessageBox } from "element-plus"
import { useRouter } from "vue-router"
import { addRole, deleteRoleById, getRole, getRoleById, setRoleSort, updateRole } from "@/service/system/role"
const router = useRouter()

const treeRef = ref()
const dialogFormRef = ref()

// 部门树数据
const treeData = ref<ResourceTreeBO[]>([])
// 树属性
const treeProps = ref({
    children: "children",
    label: "name"
})

const loading = ref(false)
// 查询条件
const queryModel = ref({
    pageNum: 1,
    pageSize: 10,
    code: null,
    name: null
})

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<RoleBO[]>([])

// 对话框标题
const dialogTitle = ref("")
// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<RoleDTO>({
    id: 0,
    code: "",
    name: "",
    resourceIds: []
})
// 对话框校验
const dialogRules = {
    code: [{ required: true, message: "请输入编号", trigger: "blur" }],
    name: [{ required: true, message: "请输入名称", trigger: "blur" }]
}

onMounted(() => {
    getResourceTree()
})

//  获取资源树
const getResourceTree = () => {
    getResourceTreeData().then((response: Result<ResourceTreeBO[]>) => {
        treeData.value = response.data
    })
}

// 搜索
const getTableData = () => {
    loading.value = true
    getRole(queryModel.value)
        .then((response: Result<RoleBO[]>) => {
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
        code: null,
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
    getRoleById(id).then((response: Result<RoleDTO>) => {
        dialogData.value = response.data
        treeRef.value.setCheckedKeys(dialogData.value.resourceIds)
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
            dialogData.value.resourceIds = treeRef.value.getCheckedKeys()
            const request = dialogData.value.id == 0 ? addRole(dialogData.value) : updateRole(dialogData.value)
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
        path: "/role-employee",
        query: {
            roleId: id + ""
        }
    })
}
</script>

<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-11 09:14:44
 * @Description: 
-->
<template>
    <CSearchTable
        tableName="职位列表"
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
            <el-button v-permission="'POST/position'" type="primary" @click="handleAdd">新增</el-button>
        </template>
        <template #columns>
            <el-table-column type="index" label="序号" min-width="80" />
            <el-table-column label="名称" prop="name" min-width="100" />
            <el-table-column label="创建时间" prop="createGmt" min-width="120" />
            <el-table-column label="修改时间" prop="modifiedGmt" min-width="120" />
            <el-table-column label="操作" fixed="right" min-width="160">
                <template #default="scope">
                    <el-button v-permission="'PUT/position'" type="primary" text @click="handleEdit(scope.row.id)">修改</el-button>
                    <el-button v-permission="'PUT/position-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 1)">上移</el-button>
                    <el-button v-permission="'PUT/position-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 2)">下移</el-button>
                    <el-button v-permission="'DELETE/position/{id}'" type="danger" text @click="handleDelete(scope.row.id)">删除</el-button>
                    <el-button v-permission="'GET/position-employee'" type="primary" text @click="handleRelationEmployee(scope.row.id)">关联员工</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body>
        <el-form :model="dialogData" ref="dialogFormRef" label-width="auto" :rules="dialogRules">
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialogData.name" placeholder="请输入名称" maxlength="30" />
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
import { PositionBO, PositionDTO } from "@/types/System"
import { Result } from "@/types/Common"
import { ElMessage, ElMessageBox } from "element-plus"
import { useRouter } from "vue-router"
import { addPosition, deletePositionById, getPosition, getPositionById, setPositionSort, updatePosition } from "@/service/system/position"
const router = useRouter()

const treeRef = ref()
const dialogFormRef = ref()

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
const tableData = ref<PositionBO[]>([])

// 对话框标题
const dialogTitle = ref("")
// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<PositionDTO>({
    id: 0,
    name: ""
})
// 对话框校验
const dialogRules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }]
}

onMounted(() => {})

// 搜索
const getTableData = () => {
    loading.value = true
    getPosition(queryModel.value)
        .then((response: Result<PositionBO[]>) => {
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
    dialogTitle.value = "新增"
    dialogVisible.value = true
}
// 修改
const handleEdit = (id: number) => {
    dialogTitle.value = "修改"
    dialogVisible.value = true
    getPositionById(id).then((response: Result<PositionDTO>) => {
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
            deletePositionById(id).then(() => {
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
    setPositionSort({
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
            const request = dialogData.value.id == 0 ? addPosition(dialogData.value) : updatePosition(dialogData.value)
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
        path: "/position-employee",
        query: {
            positionId: id + ""
        }
    })
}
</script>

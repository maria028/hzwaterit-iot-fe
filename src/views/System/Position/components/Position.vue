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
        <template #tableMenuLeft> </template>
        <template #tableMenuRight>
            <el-space>
                <el-input v-model="queryModel.name" clearable maxlength="30" placeholder="请输入名称" @clear="getTableData">
                    <template #append>
                        <el-icon style="vertical-align: middle" @click="getTableData">
                            <Search />
                        </el-icon>
                    </template>
                </el-input>

                <el-button v-permission="'POST/position'" type="primary" @click="handleAdd">新增</el-button>
            </el-space>
        </template>
        <template #columns>
            <el-table-column type="index" label="序号" min-width="80" />
            <el-table-column label="名称" prop="name" min-width="100" />
            <!-- <el-table-column label="创建时间" prop="createGmt" min-width="120" /> -->
            <!-- <el-table-column label="修改时间" prop="modifiedGmt" min-width="120" /> -->
            <el-table-column label="操作" fixed="right" min-width="160">
                <template #default="scope">
                    <el-button v-permission="'PUT/position'" type="primary" text @click="handleEdit(scope.row.id)">修改</el-button>
                    <el-button v-permission="'PUT/position-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 1)">上移</el-button>
                    <el-button v-permission="'PUT/position-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 2)">下移</el-button>
                    <el-button v-permission="'DELETE/position/{id}'" type="danger" text @click="handleDelete(scope.row.id)">删除</el-button>
                    <el-button v-permission="'GET/position-employee'" type="primary" text @click="handleRelationEmployee(scope.row)">关联员工</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <PositionForm v-model:dialogVisible="dialogVisible" :dialogData="dialogData" @close="closeEmployeeForm" @confirm="confirmEmployeeForm" />
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { PositionBO, PositionDTO } from "@/types/system"
import { Result } from "@/types/common"
import { ElMessage, ElMessageBox } from "element-plus"
import PositionForm from "./PositionForm.vue"
import { addPosition, deletePositionById, getPosition, getPositionById, setPositionSort, updatePosition } from "@/service/system/position"
const emit = defineEmits(["positionChange"])

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
            // 默认显示列表第一项关联员工  有无权限父级判断，此处无影响
            tableData.value.length > 0 && emit("positionChange", tableData.value[0])
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
const closeEmployeeForm = () => {
    dialogVisible.value = false
    dialogData.value.id = 0
}
// 对话框确定
const confirmEmployeeForm = (formData: PositionDTO) => {
    const request = formData.id == 0 ? addPosition(formData) : updatePosition(formData)
    request.then(() => {
        ElMessage.success("操作成功！")
        getTableData()
        closeEmployeeForm()
    })
}

//  关联员工
const handleRelationEmployee = (position: PositionBO) => {
    emit("positionChange", position)
}
</script>

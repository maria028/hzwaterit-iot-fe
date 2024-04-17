<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-17 16:06:03
 * @Description: 
-->
<template>
    <CSearchTable
        :tableName="parentCode ? `${parent.name}-字典详情` : '字典'"
        :data="tableData"
        @search="getTableData"
        @clear="reset"
        :loading="loading"
        :total="rows"
        v-model:currentPage="queryModel.pageNum"
        v-model:pageSize="queryModel.pageSize"
    >
        <template #tableLeft> </template>
        <template #tableRight>
            <el-space>
                <!-- 编码  queryModel.code -->
                <el-input v-model="queryModel.name" placeholder="请输入名称" maxlength="30" clearable>
                    <template #append>
                        <el-button @click="getTableData">
                            <el-icon><Search /></el-icon>
                        </el-button>
                    </template>
                </el-input>
                <el-button v-permission="'POST/dict'" type="primary" @click="handleAdd">新增</el-button>
            </el-space>
        </template>
        <template #columns>
            <el-table-column type="index" label="序号" />
            <el-table-column label="编码" prop="code" show-overflow-tooltip />
            <el-table-column label="名称" prop="name" show-overflow-tooltip />
            <el-table-column label="创建时间" prop="createGmt" show-overflow-tooltip />
            <el-table-column label="修改时间" prop="modifiedGmt" show-overflow-tooltip />
            <el-table-column label="操作" fixed="right">
                <template #default="scope">
                    <el-button v-if="parentCode == ''" type="primary" text @click="onRowClick(scope.row)">子集</el-button>
                    <el-button v-permission="'PUT/dict'" type="primary" text @click="handleEdit(scope.row.id)">修改</el-button>
                    <el-button v-permission="'PUT/dict-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 1)" v-if="parentCode != ''">上移</el-button>
                    <el-button v-permission="'PUT/dict-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 2)" v-if="parentCode != ''">下移</el-button>
                    <el-button v-permission="'DELETE/dict/{id}'" type="danger" text @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <DictForm v-model:dialogVisible="dialogVisible" :dialogData="dialogData" @close="closeEmployeeForm" @confirm="confirmEmployeeForm" />
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import { DictBO, DictDTO } from "@/types/system"
import { Result } from "@/types/common"
import { ElMessage, ElMessageBox } from "element-plus"
import DictForm from "./DictForm.vue"
import { getDict, getDictById, deleteDictById, setDictSort, addDict, updateDict } from "@/service/system/dict"
const props = defineProps(["parent"])
const emit = defineEmits(["parentChange"])

const loading = ref(false)
// 查询条件
const initQueryModel = {
    pageNum: 1,
    pageSize: 10,
    parentCode: "",
    code: null,
    name: null
}
const queryModel = ref(initQueryModel)

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<DictBO[]>([])

// 父级编码
const parentCode = ref("")

if (props.parent) {
    parentCode.value = props.parent.code
    queryModel.value.parentCode = props.parent.code
}

const onRowClick = (row: DictBO) => {
    emit("parentChange", row)
}

// 监听 parentCode 的变化
watch(
    () => props.parent,
    (newValue, oldValue) => {
        parentCode.value = newValue.code
        queryModel.value.parentCode = newValue.code
        getTableData()
    }
)

// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<DictDTO>({
    id: 0,
    parentCode: "",
    name: "",
    code: ""
})

onMounted(() => {})

// 搜索
const getTableData = () => {
    loading.value = true
    getDict(queryModel.value)
        .then((response: Result<DictBO[]>) => {
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
    getDictById(id).then((response: Result<DictDTO>) => {
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
            deleteDictById(id).then(() => {
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
    setDictSort({
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
const confirmEmployeeForm = (formData: DictDTO) => {
    formData.parentCode = parentCode.value
    const request = formData.id == 0 ? addDict(formData) : updateDict(formData)
    request.then(() => {
        ElMessage.success("操作成功！")
        getTableData()
        closeEmployeeForm()
    })
}
</script>

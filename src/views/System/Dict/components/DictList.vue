<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:34:12
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body width="450">
        <el-form :model="dialogData" ref="dialogFormRef" label-width="auto" :rules="dialogRules">
            <el-row :gutter="32">
                <el-col :span="24">
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="dialogData.code" placeholder="请输入编码" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
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
import { ref, onMounted, watch } from "vue"
import { DictBO, DictDTO } from "@/types/System"
import { Result } from "@/types/Common"
import { ElMessage, ElMessageBox } from "element-plus"
import { getDict, getDictById, deleteDictById, setDictSort, addDict, updateDict } from "@/service/system/dict"
const props = defineProps(["parent"])
const emit = defineEmits(["parentChange"])

const dialogFormRef = ref()

const loading = ref(false)
// 查询条件
const queryModel = ref({
    pageNum: 1,
    pageSize: 10,
    parentCode: "",
    code: null,
    name: null
})

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

// 对话框标题
const dialogTitle = ref("")
// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<DictDTO>({
    id: 0,
    parentCode: "",
    name: "",
    code: ""
})

// 参数校验
const validateCode = (rule: object, value: string, callback: (e?: string) => void) => {
    if (dialogData.value.parentCode == "") {
        if (value == "") {
            callback("请输入编码")
        } else {
            callback()
        }
    } else {
        callback()
    }
}
// 对话框校验
const dialogRules = {
    code: [
        { required: true, message: "请输入编码", trigger: "blur" },
        { validator: validateCode, trigger: "blur" }
    ],
    name: [{ required: true, message: "请输入名称", trigger: "blur" }]
}

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
    queryModel.value = {
        pageNum: 1,
        pageSize: 10,
        parentCode: "",
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
            dialogData.value.parentCode = parentCode.value
            const request = dialogData.value.id == 0 ? addDict(dialogData.value) : updateDict(dialogData.value)
            request.then(() => {
                ElMessage.success("操作成功！")
                dialogClose()
                getTableData()
            })
        }
    })
}
</script>

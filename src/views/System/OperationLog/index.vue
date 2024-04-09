<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-07 10:31:25
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:36:21
 * @Description: 操作日志
-->
<template>
    <CSearchTable
        tableName="操作日志"
        :data="tableData"
        @search="getTableData"
        @clear="reset"
        @selection-change="handleSelectionChange"
        :loading="loading"
        :total="rows"
        v-model:currentPage="queryModel.pageNum"
        v-model:pageSize="queryModel.pageSize"
    >
        <template #search>
            <CSearchBarItem label="操作人姓名">
                <el-input v-model="queryModel.operatorName" clearable maxlength="30" placeholder="请输入操作人姓名" />
            </CSearchBarItem>
            <CSearchBarItem label="操作人手机号码">
                <el-input v-model="queryModel.operatorPhoneNumber" clearable maxlength="30" placeholder="请输入操作人手机号码" />
            </CSearchBarItem>
            <CSearchBarItem label="状态">
                <el-select v-model="queryModel.statusCode" placeholder="请选择" clearable>
                    <el-option v-for="loginStatusDict in operationStatusDicts" :key="loginStatusDict.code" :label="loginStatusDict.name" :value="loginStatusDict.code" />
                </el-select>
            </CSearchBarItem>
            <CSearchBarItem label="请求方式">
                <el-select v-model="queryModel.requestMethod" placeholder="请选择" clearable>
                    <el-option v-for="requestMethodDict in requestMethodDicts" :key="requestMethodDict.code" :label="requestMethodDict.name" :value="requestMethodDict.code" />
                </el-select>
            </CSearchBarItem>
            <CSearchBarItem label="请求地址">
                <el-input v-model="queryModel.requestUrl" clearable maxlength="30" placeholder="请输入请求地址" />
            </CSearchBarItem>
            <CSearchBarItem label="操作日期">
                <el-date-picker v-model="createGmt" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" />
            </CSearchBarItem>
        </template>
        <template #tableLeft> </template>
        <template #tableRight>
            <el-button v-permission="'DELETE/operation-log'" type="danger" @click="handleBatchDelete" :disabled="buttonStatus">批量删除</el-button>
            <el-button v-permission="'DELETE/operation-log-empty'" type="danger" @click="handleEmpty">清空</el-button>
        </template>
        <template #columns>
            <el-table-column type="selection" width="40px" />
            <el-table-column type="index" label="序号" width="60px" />
            <el-table-column label="操作人姓名" prop="operatorName" min-width="100px" />
            <el-table-column label="操作人手机号码" prop="operatorPhoneNumber" min-width="130px" />
            <el-table-column label="操作模块" prop="module" min-width="260px" />
            <el-table-column label="操作类型" prop="type" min-width="100px" />
            <el-table-column label="IP" prop="ip" min-width="130px" />
            <el-table-column label="地理位置" prop="location" min-width="150px" />
            <el-table-column label="操作系统" prop="os" min-width="100px" />
            <el-table-column label="浏览器" prop="browser" min-width="120px" />
            <el-table-column label="状态" prop="status" min-width="60px" />
            <el-table-column label="错误信息" prop="errorMsg" min-width="150px" show-overflow-tooltip />
            <el-table-column label="请求方式" prop="requestMethod" min-width="100px" />
            <el-table-column label="请求地址" prop="requestUrl" min-width="200px" />
            <el-table-column label="耗时 (毫秒)" prop="waitTime" min-width="100px" />
            <el-table-column label="操作时间" prop="createGmt" width="185px" />
            <el-table-column label="操作" fixed="right">
                <template #default="scope">
                    <el-button v-permission="'GET/operation-log/{id}'" type="primary" text @click="handleDetails(scope.row.id)">详情</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body>
        <el-form :model="dialogData" ref="dialogForm" label-width="auto">
            <el-form-item label="操作人姓名">{{ dialogData.operatorName }}</el-form-item>
            <el-form-item label="操作人手机号码">{{ dialogData.operatorPhoneNumber }}</el-form-item>
            <el-form-item label="操作模块">{{ dialogData.module }}</el-form-item>
            <el-form-item label="操作类型">{{ dialogData.type }}</el-form-item>
            <el-form-item label="IP">{{ dialogData.ip }}</el-form-item>
            <el-form-item label="地理位置">{{ dialogData.location }}</el-form-item>
            <el-form-item label="操作系统">{{ dialogData.os }}</el-form-item>
            <el-form-item label="浏览器">{{ dialogData.browser }}</el-form-item>
            <el-form-item label="请求方式">{{ dialogData.requestMethod }}</el-form-item>
            <el-form-item label="请求地址">{{ dialogData.requestUrl }}</el-form-item>
            <el-form-item label="请求 content-type">{{ dialogData.requestContentType }}</el-form-item>
            <el-form-item label="请求 user-agent">{{ dialogData.requestUserAgent }}</el-form-item>
            <el-form-item label="请求参数">{{ dialogData.requestParam }}</el-form-item>
            <el-form-item label="响应结果">{{ dialogData.responseResult }}</el-form-item>
            <el-form-item label="耗时 (毫秒)">{{ dialogData.waitTime }}</el-form-item>
            <el-form-item label="状态">{{ dialogData.status }}</el-form-item>
            <el-form-item label="错误信息">{{ dialogData.errorMsg }}</el-form-item>
            <el-form-item label="操作时间">{{ dialogData.createGmt }}</el-form-item>
        </el-form>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { OperationLogBO } from "@/types/System"
import { ElMessage, ElMessageBox } from "element-plus"
import { DictBO, Result } from "@/types/Common"
import DictCodeConstant from "@/constant/DictCodeConstant"
import DictUtils from "@/utils/DictUtils"
import { getOperationLog, deleteOperationLog, clearOperationLog, getOperationLogById } from "@/service/system/operationLog"

const loading = ref(false)
// 查询条件
const queryModel = ref({
    pageNum: 1,
    pageSize: 10,
    operatorName: "",
    operatorPhoneNumber: "",
    statusCode: "",
    requestMethod: "",
    requestUrl: "",
    startCreateGmt: null,
    endCreateGmt: null
})

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<OperationLogBO[]>([])
// 操作日期
const createGmt = ref([])
// 字典
const operationStatusDicts: DictBO[] = DictUtils.list(DictCodeConstant.OPERATION_STATUS)
const requestMethodDicts: DictBO[] = DictUtils.list(DictCodeConstant.REQUEST_METHOD)
// 按钮状态. 默认禁用
const buttonStatus = ref(true)
// 多选选中 ids
const selectedIds = ref<number[]>([])

// 对话框标题
const dialogTitle = ref("")
// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<OperationLogBO>({
    id: 0,
    operatorName: "",
    operatorPhoneNumber: "",
    module: "",
    type: "",
    ip: "",
    location: "",
    os: "",
    browser: "",
    status: "",
    errorMsg: "",
    requestMethod: "",
    requestUrl: "",
    requestContentType: "",
    requestUserAgent: "",
    requestParam: "",
    responseResult: "",
    waitTime: 0,
    createGmt: ""
})

onMounted(() => {})

// 搜索
const getTableData = () => {
    if (createGmt.value.length > 0) {
        queryModel.value.startCreateGmt = createGmt.value[0]
        queryModel.value.endCreateGmt = createGmt.value[1]
    }
    loading.value = true
    getOperationLog(queryModel.value)
        .then((response: Result<OperationLogBO[]>) => {
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
        operatorName: "",
        operatorPhoneNumber: "",
        statusCode: "",
        requestMethod: "",
        requestUrl: "",
        startCreateGmt: null,
        endCreateGmt: null
    }
    getTableData()
}

// 表格多选
const handleSelectionChange = (selectedRows: OperationLogBO[]) => {
    selectedIds.value = []

    if (selectedRows.length <= 0) {
        buttonStatus.value = true
    } else {
        buttonStatus.value = false
        for (const selectedRow of selectedRows) {
            selectedIds.value.push(selectedRow.id)
        }
    }
}

// 删除
const handleBatchDelete = () => {
    ElMessageBox.confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            deleteOperationLog({
                data: selectedIds.value
            }).then(() => {
                ElMessage.success("操作成功！")
                buttonStatus.value = true
                getTableData()
            })
        })
        .catch(() => {
            ElMessage.info("已取消")
        })
}

//  清空
const handleEmpty = () => {
    ElMessageBox.confirm("确定清空? 清空后仅保留最近一个月数据.", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            clearOperationLog("/login-log-empty").then(() => {
                ElMessage.success("操作成功！")
                getTableData()
            })
        })
        .catch(() => {
            ElMessage.info("已取消")
        })
}

//  详情
const handleDetails = (id: number) => {
    dialogTitle.value = "详情"
    dialogVisible.value = true

    getOperationLogById(id).then((response: Result<OperationLogBO>) => {
        dialogData.value = response.data
    })
}

//  对话框关闭
const dialogClose = () => {
    dialogVisible.value = false
}
</script>

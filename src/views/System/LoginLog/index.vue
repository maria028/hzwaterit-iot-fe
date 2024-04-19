<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-07 09:12:59
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-16 14:43:47
 * @Description: 登录日志
-->
<template>
    <CSearchTable
        tableName="登录日志"
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
            <CSearchBarItem label="用户姓名">
                <el-input v-model="queryModel.loginUserName" clearable maxlength="30" placeholder="请输入属用户姓名" />
            </CSearchBarItem>
            <CSearchBarItem label="用户手机号码">
                <el-input v-model="queryModel.loginUserPhoneNumber" clearable maxlength="11" placeholder="请输入用户手机号码" />
            </CSearchBarItem>
            <CSearchBarItem label="登陆日期">
                <el-date-picker v-model="queryModel.createGmt" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" />
            </CSearchBarItem>
            <CSearchBarItem label="状态">
                <el-select v-model="queryModel.statusCode" placeholder="请选择" clearable>
                    <el-option v-for="loginStatusDict in loginStatusDicts" :key="loginStatusDict.code" :label="loginStatusDict.name" :value="loginStatusDict.code" />
                </el-select>
            </CSearchBarItem>
        </template>
        <template #tableMenuLeft> </template>
        <template #tableMenuRight>
            <el-button v-permission="'DELETE/login-log'" type="danger" @click="handleBatchDelete" :disabled="buttonStatus">批量删除</el-button>
            <el-button v-permission="'DELETE/login-log-empty'" type="danger" @click="handleEmpty">清空</el-button>
        </template>
        <template #columns>
            <el-table-column type="selection" width="50px" />
            <el-table-column type="index" label="序号" width="50px" />
            <el-table-column label="用户姓名" prop="loginUserName" min-width="100px" />
            <el-table-column label="用户手机号码" prop="loginUserPhoneNumber" min-width="120px" />
            <el-table-column label="IP" prop="ip" min-width="130px" />
            <el-table-column label="地理位置" prop="location" min-width="150px" />
            <el-table-column label="操作系统" prop="os" min-width="100px" />
            <el-table-column label="浏览器" prop="browser" min-width="120px" />
            <el-table-column label="状态" prop="status" min-width="50px" />
            <el-table-column label="错误信息" prop="errorMsg" min-width="150px" />
            <el-table-column label="登陆时间" prop="createGmt" width="185px" />
        </template>
    </CSearchTable>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { LoginLogBO } from "@/types/system"
import { ElMessage, ElMessageBox } from "element-plus"
import { DictBO, Result } from "@/types/common"
import dictCodeConstant from "@/constant/dictCodeConstant"
import dictUtils from "@/utils/dictUtils"
import { getLoginLog, deleteLoginLog, clearLoginLog } from "@/service/system/loginLog"

const loading = ref(false)
const initQueryModel = {
    pageNum: 1,
    pageSize: 10,
    loginUserName: null,
    loginUserPhoneNumber: null,
    statusCode: null,
    createGmt: null,
    startCreateGmt: null,
    endCreateGmt: null
}
// 查询条件
const queryModel = ref(initQueryModel)

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<LoginLogBO[]>([])
// 登陆状态字典
const loginStatusDicts: DictBO[] = dictUtils.list(dictCodeConstant.LOGIN_STATUS)
// 按钮状态. 默认禁用
const buttonStatus = ref(true)
// 多选选中 ids
const selectedIds = ref<number[]>([])

onMounted(() => {})

// 搜索
const getTableData = () => {
    if (queryModel.value.createGmt) {
        queryModel.value.startCreateGmt = queryModel.value.createGmt[0]
        queryModel.value.endCreateGmt = queryModel.value.createGmt[1]
        queryModel.value.createGmt = null
    }
    loading.value = true
    getLoginLog(queryModel.value)
        .then((response: Result<LoginLogBO[]>) => {
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

// 表格多选
const handleSelectionChange = (selectedRows: LoginLogBO[]) => {
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
            deleteLoginLog({
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
            clearLoginLog("/login-log-empty").then(() => {
                ElMessage.success("操作成功！")
                getTableData()
            })
        })
        .catch(() => {
            ElMessage.info("已取消")
        })
}
</script>

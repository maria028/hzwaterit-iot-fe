<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 14:19:36
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:32:12
 * @Description: 
-->
<template>
    <el-page-header @back="goBack"> </el-page-header>
    <CSearchTable
        tableName=""
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
            <CSearchBarItem label="员工姓名">
                <el-input v-model="queryModel.employeeName" clearable maxlength="30" placeholder="请输入员工姓名" />
            </CSearchBarItem>
            <CSearchBarItem label="手机号码">
                <el-input v-model="queryModel.phoneNumber" clearable maxlength="11" placeholder="请输入手机号码" />
            </CSearchBarItem>
        </template>
        <template #tableLeft>
            <el-tabs v-model="relationStatusCode" @tab-click="handleTabClick">
                <el-tab-pane label="已关联" name="1" />
                <el-tab-pane label="未关联" name="0" />
            </el-tabs>
        </template>
        <template #tableRight>
            <el-button v-permission="'POST/department-employee'" type="primary" @click="handleBatchRelation" :disabled="buttonStatus" v-if="relationStatusCode == '0'"
                >批量关联</el-button
            >
            <el-button v-permission="'DELETE/department-employee'" type="danger" @click="handleBatchDelete" :disabled="buttonStatus" v-if="relationStatusCode == '1'"
                >批量删除</el-button
            >
        </template>
        <template #columns>
            <el-table-column type="selection" width="40px" />
            <el-table-column type="index" label="序号" min-width="80" />
            <el-table-column v-if="relationStatusCode == '1'" label="部门" prop="departmentName" min-width="100px" />
            <el-table-column label="员工姓名" prop="employeeName" min-width="100px" />
            <el-table-column label="手机号码" prop="phoneNumber" min-width="120px" />
        </template>
    </CSearchTable>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue"
import { DepartmentEmployeeBO } from "@/types/System"
import { Result } from "@/types/Common"
import { getDepartmentEmployee, bindDepartmentEmployee, deleteDepartmentEmployee } from "@/service/system/departmentEmployee"
import { ElMessage, ElMessageBox } from "element-plus"
import { useRouter, useRoute } from "vue-router"
const route = useRoute()
const router = useRouter()

const loading = ref(false)

// 查询条件
const queryModel = ref({
    pageNum: 1,
    pageSize: 10,
    departmentId: 0,
    relationStatusCode: "1",
    employeeName: null,
    phoneNumber: null
})

// departmentId
const departmentId = ref(0)

// 关联状态
const relationStatusCode = ref("1")

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<DepartmentEmployeeBO[]>([])

// 按钮状态. 默认禁用
const buttonStatus = ref(true)

// 多选选中 ids
const selectedIds = ref<number[]>([])
// 多选选中 employeeIds
const selectedEmployeeIds = ref<number[]>([])

onMounted(() => {
    departmentId.value = Number(route.query.departmentId)
    if (isNaN(departmentId.value)) {
        ElMessage.error("参数错误")
        goBack()
        return
    }
    getTableData()
})
// 搜索
const getTableData = () => {
    loading.value = true
    queryModel.value.departmentId = departmentId.value
    queryModel.value.relationStatusCode = relationStatusCode.value
    getDepartmentEmployee(queryModel.value)
        .then((response: Result<DepartmentEmployeeBO[]>) => {
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
        departmentId: 0,
        relationStatusCode: "1",
        employeeName: null,
        phoneNumber: null
    }
    getTableData()
}

// 表格多选
const handleSelectionChange = (selectedRows: DepartmentEmployeeBO[]) => {
    selectedIds.value = []
    selectedEmployeeIds.value = []

    if (selectedRows.length <= 0) {
        buttonStatus.value = true
    } else {
        buttonStatus.value = false
        if (relationStatusCode.value == "0") {
            for (const selectedRow of selectedRows) {
                selectedEmployeeIds.value.push(selectedRow.employeeId)
            }
        } else if (relationStatusCode.value == "1") {
            for (const selectedRow of selectedRows) {
                selectedIds.value.push(selectedRow.id)
            }
        }
    }
}

//  tab 点击
const handleTabClick = async () => {
    await nextTick()
    getTableData()
}

//  批量关联
const handleBatchRelation = () => {
    ElMessageBox.confirm("确定关联?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            bindDepartmentEmployee({
                departmentId: departmentId.value,
                employeeIds: selectedEmployeeIds.value
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

//  批量删除
const handleBatchDelete = () => {
    ElMessageBox.confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            deleteDepartmentEmployee({
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

// 返回父级
const goBack = () => {
    router.replace({
        path: "/department"
    })
}
</script>

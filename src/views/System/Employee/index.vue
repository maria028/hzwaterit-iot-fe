<template>
    <CSearchTable
        tableName="员工列表"
        :data="tableData"
        @search="getTableData"
        @clear="reset"
        :loading="loading"
        :total="rows"
        v-model:currentPage="queryModel.pageNum"
        v-model:pageSize="queryModel.pageSize"
    >
        <template #search>
            <CSearchBarItem label="部门">
                <el-tree-select v-model="queryModel.departmentId" :data="treeData" :props="{ children: 'children', label: 'name' }" node-key="id" clearable check-strictly />
            </CSearchBarItem>
            <CSearchBarItem label="姓名">
                <el-input v-model="queryModel.name" clearable maxlength="30" placeholder="请输入姓名" />
            </CSearchBarItem>
            <CSearchBarItem label="手机号码">
                <el-input v-model="queryModel.phoneNumber" clearable maxlength="11" placeholder="请输入手机号码" />
            </CSearchBarItem>
            <CSearchBarItem label="状态">
                <el-select v-model="queryModel.statusCode" placeholder="请选择" clearable>
                    <el-option v-for="employeeStatusDict in employeeStatusDicts" :key="employeeStatusDict.code" :label="employeeStatusDict.name" :value="employeeStatusDict.code" />
                </el-select>
            </CSearchBarItem>
        </template>
        <template #tableLeft> </template>
        <template #tableRight>
            <el-button v-permission="'POST/employee'" type="primary" @click="handleAdd">新增</el-button>
        </template>
        <template #columns>
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column label="头像" width="80">
                <template #default="scope">
                    <el-avatar :size="30" v-if="scope.row.avatarImgUrl" :src="scope.row.avatarImgUrl" />
                    <el-avatar :size="30" v-else>{{ scope.row.name.substr(0, 1) }}</el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="姓名" prop="name" width="100" />
            <el-table-column label="手机号码" prop="phoneNumber" width="120" />
            <el-table-column label="帐号状态" prop="accountStatus" width="100" />
            <el-table-column label="状态" prop="status" width="100" />
            <el-table-column label="部门" prop="departmentNames" width="100" />
            <el-table-column label="职位" prop="positionNames" width="100" />
            <el-table-column label="角色" prop="roleName" width="100" />
            <el-table-column label="性别" prop="gender" width="80" />
            <el-table-column label="工号" prop="jobNumber" width="100" />
            <el-table-column label="邮箱" prop="email" width="200" />
            <el-table-column label="创建时间" prop="createGmt" width="200" />
            <el-table-column label="修改时间" prop="modifiedGmt" width="200" />
            <el-table-column label="操作" fixed="right" width="220">
                <template #default="scope">
                    <el-button type="primary" text @click="handleEdit(scope.row.id)" v-permission="'PUT/employee'">修改</el-button>
                    <el-button
                        type="primary"
                        text
                        @click="handlerUpdateAccountStatus(scope.row.id, 1)"
                        v-if="scope.row.accountStatusCode == '2'"
                        v-permission="'PUT/employee-account-status'"
                        >启用</el-button
                    >
                    <el-button
                        type="primary"
                        text
                        @click="handlerUpdateAccountStatus(scope.row.id, 2)"
                        v-if="scope.row.accountStatusCode == '1'"
                        v-permission="'PUT/employee-account-status'"
                        >禁用</el-button
                    >
                    <el-button type="primary" text @click="handlerUpdateStatus(scope.row.id, 1)" v-if="scope.row.statusCode == '2'" v-permission="'PUT/employee-status'"
                        >在职</el-button
                    >
                    <el-button type="primary" text @click="handlerUpdateStatus(scope.row.id, 2)" v-if="scope.row.statusCode == '1'" v-permission="'PUT/employee-status'"
                        >离职</el-button
                    >
                    <el-button type="danger" text @click="handleResetPassword(scope.row.id)" v-permission="'PUT/employee-password'">重置密码</el-button>
                </template>
            </el-table-column>
        </template>
    </CSearchTable>
    <EmployeeForm v-model:dialogVisible="dialogVisible" :dialogData="dialogData" @close="closeEmployeeForm" @confirm="confirmEmployeeForm" />
</template>
<script lang="ts" setup>
import { ref, onMounted, provide, computed } from "vue"
import { DepartmentTreeBO, EmployeeBO, EmployeeDTO, PositionBO, RoleBO } from "@/types/system"
import dictCodeConstant from "@/constant/dictCodeConstant"
import dictUtils from "@/utils/dictUtils"
import { DictBO, Result } from "@/types/common"
import { addEmployee, getEmployee, getEmployeeById, updateEmployeeAccountStatus, updateEmployeeStatus, updateEmployee, resetEmployeePassword } from "@/service/system/employee"
import { getDepartmentTreeData } from "@/service/system/department"
import { getPosition } from "@/service/system/position"
import { getRole } from "@/service/system/role"
import { ElMessage, ElMessageBox } from "element-plus"
import EmployeeForm from "./components/EmployeeForm.vue"

// 部门树数据
const treeData = ref<DepartmentTreeBO[]>([])
// 数据是异步的所以需要使用computed
provide(
    "treeData",
    computed(() => treeData.value)
)
const loading = ref(false)

// 查询条件
const initQueryModel = {
    pageNum: 1,
    pageSize: 10,
    departmentId: null,
    statusCode: null,
    name: null,
    phoneNumber: null
}
const queryModel = ref(initQueryModel)

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<EmployeeBO[]>([])

// 员工状态字典
const employeeStatusDicts: DictBO[] = dictUtils.list(dictCodeConstant.EMPLOYEE_STATUS)

// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<EmployeeDTO>({
    id: 0,
    name: "",
    phoneNumber: "",
    accountStatusCode: "1",
    statusCode: "1",
    genderCode: "2",
    departmentIds: [],
    positionIds: []
})
// 职位列表
const positions = ref<PositionBO[]>([])
provide(
    "positions",
    computed(() => positions.value)
)

// 角色列表
const roles = ref<RoleBO[]>([])
provide(
    "roles",
    computed(() => roles.value)
)

onMounted(() => {
    getDepartmentTree()
    listPosition()
    listRole()
})
// 获取部门树
const getDepartmentTree = () => {
    getDepartmentTreeData().then(async (response: Result<DepartmentTreeBO[]>) => {
        treeData.value = response.data
    })
}
// 获取职位列表
const listPosition = () => {
    getPosition({ pagination: 0 }).then((response: Result<PositionBO[]>) => {
        positions.value = response.data
    })
}
// 获取角色列表
const listRole = () => {
    getRole({ pagination: 0 }).then((response: Result<RoleBO[]>) => {
        roles.value = response.data
    })
}

// 搜索
const getTableData = () => {
    loading.value = true
    getEmployee(queryModel.value)
        .then((response: Result<EmployeeBO[]>) => {
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
    getEmployeeById(id).then((response: Result<EmployeeDTO>) => {
        dialogData.value = response.data
        //请求返回类型是Number，字典中是String
        dialogData.value.accountStatusCode = dialogData.value.accountStatusCode + ""
        dialogData.value.statusCode = dialogData.value.statusCode + ""
        dialogData.value.genderCode = dialogData.value.genderCode + ""
    })
}

// 修改帐号状态
const handlerUpdateAccountStatus = (id: number, accountStatusCode: number) => {
    updateEmployeeAccountStatus({
        id: id,
        accountStatusCode: accountStatusCode
    }).then(() => {
        ElMessage.success("操作成功！")
        getTableData()
    })
}

// 修改状态
const handlerUpdateStatus = (id: number, statusCode: number) => {
    updateEmployeeStatus({
        id: id,
        statusCode: statusCode
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
const confirmEmployeeForm = (formData: EmployeeDTO) => {
    const request = formData.id == 0 ? addEmployee(formData) : updateEmployee(formData)
    request.then(() => {
        ElMessage.success("操作成功！")
        getTableData()
        closeEmployeeForm()
    })
}

// 重置密码
const handleResetPassword = (id: number) => {
    ElMessageBox.confirm("确定重置密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            resetEmployeePassword({ id: id }).then(() => {
                ElMessage.success("操作成功！")
            })
        })
        .catch(() => {
            ElMessage.info("已取消")
        })
}
</script>

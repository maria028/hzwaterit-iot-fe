<template>
    <el-row :gutter="16" style="height: 100%">
        <el-col :span="4" style="height: 100%">
            <el-card>
                <el-tree :data="treeData" :props="treeProps" node-key="id" highlight-current accordion ref="treeRef" default-expand-all @node-click="handlerNodeClick" />
            </el-card>
        </el-col>
        <el-col :span="20" style="height: 100%">
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
                    <CSearchBarItem label="姓名">
                        <el-input v-model="queryModel.name" clearable maxlength="30" placeholder="请输入姓名" />
                    </CSearchBarItem>
                    <CSearchBarItem label="手机号码">
                        <el-input v-model="queryModel.phoneNumber" clearable maxlength="11" placeholder="请输入手机号码" />
                    </CSearchBarItem>
                    <CSearchBarItem label="状态">
                        <el-select v-model="queryModel.statusCode" placeholder="请选择" clearable>
                            <el-option
                                v-for="employeeStatusDict in employeeStatusDicts"
                                :key="employeeStatusDict.code"
                                :label="employeeStatusDict.name"
                                :value="employeeStatusDict.code"
                            />
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
        </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body>
        <el-form ref="dialogFormRef" :model="dialogData" inline label-width="auto" :rules="dialogRules" class="dialog-form-inline">
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialogData.name" placeholder="请输入名称" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号码" prop="phoneNumber">
                        <el-input v-model="dialogData.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="帐号状态" prop="accountStatusCode">
                        <el-select v-model="dialogData.accountStatusCode" placeholder="请选择">
                            <el-option
                                v-for="accountStatusDict in accountStatusDicts"
                                :key="accountStatusDict.code"
                                :label="accountStatusDict.name"
                                :value="accountStatusDict.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态" prop="statusCode">
                        <el-select v-model="dialogData.statusCode" placeholder="请选择">
                            <el-option
                                v-for="employeeStatusDict in employeeStatusDicts"
                                :key="employeeStatusDict.code"
                                :label="employeeStatusDict.name"
                                :value="employeeStatusDict.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别" prop="genderCode">
                        <el-radio-group v-model="dialogData.genderCode">
                            <el-radio v-for="genderDict in genderDicts" :value="genderDict.code" :label="genderDict.code">{{ genderDict.name }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工号" prop="jobNumber">
                        <el-input v-model="dialogData.jobNumber" placeholder="请输入工号" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="dialogData.email" placeholder="请输入邮箱" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="部门" prop="departmentIds">
                        <el-tree :data="treeData" :props="treeProps" node-key="id" show-checkbox check-strictly ref="checkTreeRef" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职位" prop="positionIds">
                        <el-select v-model="dialogData.positionIds" multiple placeholder="请选择">
                            <el-option v-for="position in positions" :key="position.id" :label="position.name" :value="position.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="角色" prop="roleId">
                        <el-select v-model="dialogData.roleId" placeholder="请选择">
                            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
                        </el-select>
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
import { DepartmentTreeBO, EmployeeBO, EmployeeDTO, PositionBO, RoleBO } from "@/types/System"
import DictCodeConstant from "@/constant/DictCodeConstant"
import DictUtils from "@/utils/DictUtils"
import { DictBO, Result } from "@/types/Common"
import CommonRegexConstant from "@/constant/CommonRegexConstant"
import { addEmployee, getEmployee, getEmployeeById, updateEmployeeAccountStatus, updateEmployeeStatus, updateEmployee, resetEmployeePassword } from "@/service/system/employee"
import { getDepartmentTreeData } from "@/service/system/department"
import { getPosition } from "@/service/system/position"
import { getRole } from "@/service/system/role"
import { ElMessage, ElMessageBox } from "element-plus"

const treeRef = ref()
const checkTreeRef = ref()
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
const initQueryModel = {
    pageNum: 1,
    pageSize: 10,
    departmentId: 0,
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
const employeeStatusDicts: DictBO[] = DictUtils.list(DictCodeConstant.EMPLOYEE_STATUS)
// 员工帐号状态字典
const accountStatusDicts: DictBO[] = DictUtils.list(DictCodeConstant.ACCOUNT_STATUS)
// 性别字典
const genderDicts: DictBO[] = DictUtils.list(DictCodeConstant.GENDER)

// 对话框标题
const dialogTitle = ref("")
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
// 角色列表
const roles = ref<RoleBO[]>([])
// 对话框校验
const dialogRules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    phoneNumber: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        { pattern: CommonRegexConstant.PHONE_NUMBER, message: "手机号码格式错误", trigger: "blur" }
    ],
    email: [{ pattern: CommonRegexConstant.EMAIL, message: "邮箱格式错误", trigger: "blur" }],
    positionIds: [{ required: true, message: "请选择职位", trigger: "blur" }]
}
onMounted(() => {
    getDepartmentTree()
    listPosition()
    listRole()
})
// 获取部门树
const getDepartmentTree = () => {
    getDepartmentTreeData().then(async (response: Result<DepartmentTreeBO[]>) => {
        const result = response
        treeData.value = [{ id: 0, name: "部门树", children: [...result.data] }]
        await nextTick()
        treeRef.value.setCurrentKey(currentNodeKey.value)
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
    queryModel.value.departmentId = currentNodeKey.value
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
    getEmployeeById(id).then((response: Result<EmployeeDTO>) => {
        dialogData.value = response.data
        dialogData.value.accountStatusCode = dialogData.value.accountStatusCode + ""
        dialogData.value.statusCode = dialogData.value.statusCode + ""
        dialogData.value.genderCode = dialogData.value.genderCode + ""
        checkTreeRef.value.setCheckedKeys(dialogData.value.departmentIds)
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
const dialogClose = () => {
    dialogVisible.value = false
    dialogData.value.id = 0
    dialogFormRef.value.resetFields()
    checkTreeRef.value.setCheckedKeys([])
}
// 对话框取消
const dialogCancel = () => {
    dialogClose()
}
// 对话框确定
const dialogConfirm = () => {
    dialogFormRef.value.validate((valid: boolean) => {
        if (valid) {
            const checkedKeys = checkTreeRef.value.getCheckedKeys()
            if (checkedKeys.length == 0) {
                ElMessage.error("请选择部门")
                return
            }
            dialogData.value.departmentIds = checkedKeys
            const request = dialogData.value.id == 0 ? addEmployee(dialogData.value) : updateEmployee(dialogData.value)
            request.then(() => {
                ElMessage.success("操作成功！")
                dialogClose()
                getTableData()
            })
        }
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

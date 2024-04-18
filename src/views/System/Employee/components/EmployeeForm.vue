<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-17 11:00:13
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-18 15:11:04
 * @Description: 员工管理表单弹框
-->
<template>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body>
        <el-form ref="dialogFormRef" :model="formData" inline label-width="auto" :rules="dialogRules" class="dialog-form-inline">
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入名称" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号码" prop="phoneNumber">
                        <el-input v-model="formData.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="帐号状态" prop="accountStatusCode">
                        <el-select v-model="formData.accountStatusCode" placeholder="请选择">
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
                        <el-select v-model="formData.statusCode" placeholder="请选择">
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
                        <el-radio-group v-model="formData.genderCode">
                            <el-radio v-for="genderDict in genderDicts" :value="genderDict.code" :label="genderDict.code">{{ genderDict.name }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工号" prop="jobNumber">
                        <el-input v-model="formData.jobNumber" placeholder="请输入工号" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formData.email" placeholder="请输入邮箱" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="部门" prop="departmentIds">
                        <el-tree-select
                            v-model="formData.departmentIds"
                            :data="treeData"
                            :props="{ children: 'children', label: 'name' }"
                            multiple
                            node-key="id"
                            show-checkbox
                            check-strictly
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职位" prop="positionIds">
                        <el-select v-model="formData.positionIds" multiple placeholder="请选择">
                            <el-option v-for="position in positions" :key="position.id" :label="position.name" :value="position.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="角色" prop="roleId">
                        <el-select v-model="formData.roleId" placeholder="请选择">
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
import { ref, inject, computed, watch } from "vue"
import { DepartmentTreeBO, EmployeeDTO, PositionBO, RoleBO } from "@/types/system"
import commonRegexConstant from "@/constant/commonRegexConstant"
import { DictBO } from "@/types/common"
import dictCodeConstant from "@/constant/dictCodeConstant"
import dictUtils from "@/utils/dictUtils"
import { ElMessage } from "element-plus"

// 对话框是否显示
const dialogVisible = defineModel("dialogVisible", { required: true, default: false })
// props
const props = defineProps(["dialogData"])
// emit
const emit = defineEmits(["close", "confirm"])
// dialogTitle
const dialogTitle = computed(() => {
    return props.dialogData.id == 0 ? "新增" : "修改"
})

const dialogFormRef = ref()
// 复制 dialogData 到一个可变的变量中
const formData = ref<EmployeeDTO>(props.dialogData)

// 监听 props.dialogData 的变化，并更新 formData
watch(
    () => props.dialogData,
    () => {
        formData.value = props.dialogData
    }
)

// 员工状态字典
const employeeStatusDicts: DictBO[] = dictUtils.list(dictCodeConstant.EMPLOYEE_STATUS)
// 员工帐号状态字典
const accountStatusDicts: DictBO[] = dictUtils.list(dictCodeConstant.ACCOUNT_STATUS)
// 性别字典
const genderDicts: DictBO[] = dictUtils.list(dictCodeConstant.GENDER)

// 部门树数据
const treeData = inject<DepartmentTreeBO[]>("treeData")
// 职位列表
const positions = inject<PositionBO[]>("positions")
// 角色列表
const roles = inject<RoleBO[]>("roles")
// 对话框校验
const dialogRules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    phoneNumber: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        { pattern: commonRegexConstant.PHONE_NUMBER, message: "手机号码格式错误", trigger: "blur" }
    ],
    email: [{ pattern: commonRegexConstant.EMAIL, message: "邮箱格式错误", trigger: "blur" }],
    positionIds: [{ required: true, message: "请选择职位", trigger: "blur" }]
}

// 对话框关闭
const dialogClose = () => {
    dialogFormRef.value.resetFields()
    emit("close")
}
// 对话框取消
const dialogCancel = () => {
    dialogClose()
}

// 对话框确定
const dialogConfirm = () => {
    dialogFormRef.value.validate((valid: boolean) => {
        if (valid) {
            if (formData.value.departmentIds.length == 0) {
                ElMessage.error("请选择部门")
                return
            }
            emit("confirm", formData.value)
        }
    })
}
</script>

<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 10:11:50
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-19 16:30:17
 * @Description: 部门列表
-->
<template>
    <el-row :gutter="16" style="height: 100%">
        <el-col :span="departmentEmployeePermission ? 13 : 24" style="height: 100%">
            <Department @departmentChange="departmentChangeHandel"></Department>
        </el-col>
        <el-col v-if="departmentEmployeePermission" :span="11" style="height: 100%">
            <DepartmentEmployee :department="department"></DepartmentEmployee>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue"
import Department from "./components/Department.vue"
import DepartmentEmployee from "./components/DepartmentEmployee.vue"
import { hasPermission } from "@/directives/permission"
import { DepartmentBO } from "@/types/system"
const departmentEmployeePermission = ref(true)

const department = ref<{ id: number; name: string }>({
    id: 0,
    name: ""
})
const departmentChangeHandel = (e: DepartmentBO) => {
    department.value = {
        id: e.id,
        name: e.name + ""
    }
}
onMounted(() => {
    // 是否有查看关联列表的权限
    departmentEmployeePermission.value = hasPermission("GET/department-employee")
})
</script>

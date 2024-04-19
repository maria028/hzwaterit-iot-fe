<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-19 14:08:22
 * @Description: 左侧角色列表  右侧角色关联员工
-->
<template>
    <el-row :gutter="16" style="height: 100%">
        <el-col :span="roleEmployeePermission ? 13 : 24" style="height: 100%">
            <Role @roleChange="roleChangeHandel"></Role>
        </el-col>
        <el-col v-if="roleEmployeePermission" :span="11" style="height: 100%">
            <RoleEmployee :role="role"></RoleEmployee>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue"
import Role from "./components/Role.vue"
import RoleEmployee from "./components/RoleEmployee.vue"
import { hasPermission } from "@/directives/permission"
import { RoleBO } from "@/types/system"
const roleEmployeePermission = ref(true)

const role = ref<{ id: number; name: string }>({
    id: 0,
    name: ""
})
const roleChangeHandel = (e: RoleBO) => {
    role.value = {
        id: e.id,
        name: e.name + ""
    }
}
onMounted(() => {
    // 是否有查看关联列表的权限
    roleEmployeePermission.value = hasPermission("GET/role-employee")
})
</script>

<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:28:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-19 14:24:01
 * @Description:  左侧职位列表  右侧职位关联员工
-->
<template>
    <el-row :gutter="16" style="height: 100%">
        <el-col :span="positionEmployeePermission ? 13 : 24" style="height: 100%">
            <Position @positionChange="positionChangeHandel"></Position>
        </el-col>
        <el-col v-if="positionEmployeePermission" :span="11" style="height: 100%">
            <PositionEmployee :position="position"></PositionEmployee>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue"
import Position from "./components/Position.vue"
import PositionEmployee from "./components/PositionEmployee.vue"
import { hasPermission } from "@/directives/permission"
import { PositionBO } from "@/types/system"
const positionEmployeePermission = ref(true)

const position = ref<{ id: number; name: string }>({
    id: 0,
    name: ""
})
const positionChangeHandel = (e: PositionBO) => {
    position.value = {
        id: e.id,
        name: e.name + ""
    }
}
onMounted(() => {
    // 是否有查看关联列表的权限
    positionEmployeePermission.value = hasPermission("GET/position-employee")
})
</script>

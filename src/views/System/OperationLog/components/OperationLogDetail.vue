<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-17 16:00:50
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-17 16:02:57
 * @Description: 操作日志详情弹框
-->
<template>
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
import { ref, computed, watch } from "vue"

// 对话框是否显示
const dialogVisible = defineModel("dialogVisible", { required: true, default: false })
// props
const props = defineProps(["dialogData"])
// emit
const emit = defineEmits(["close"])
// dialogTitle
const dialogTitle = computed(() => {
    return props.dialogData.id == 0 ? "新增" : "修改"
})

// 复制 dialogData 到一个可变的变量中
const formData = ref(props.dialogData)

// 监听 props.dialogData 的变化，并更新 formData
watch(
    () => props.dialogData,
    () => {
        formData.value = props.dialogData
    }
)

// 对话框关闭
const dialogClose = () => {
    emit("close")
}
</script>

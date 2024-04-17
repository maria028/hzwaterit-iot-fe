<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-17 15:51:13
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-17 15:59:00
 * @Description: 字典表单弹框
-->
<template>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body width="450">
        <el-form :model="dialogData" ref="dialogFormRef" label-width="auto" :rules="dialogRules">
            <el-row :gutter="32">
                <el-col :span="24">
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="dialogData.code" placeholder="请输入编码" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialogData.name" placeholder="请输入名称" maxlength="30" />
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
import { ref, computed, watch } from "vue"
import { DictDTO } from "@/types/system"

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
const formData = ref<DictDTO>(props.dialogData)

// 监听 props.dialogData 的变化，并更新 formData
watch(
    () => props.dialogData,
    () => {
        formData.value = props.dialogData
    }
)

// 参数校验
const validateCode = (rule: object, value: string, callback: (e?: string) => void) => {
    if (formData.value.parentCode == "") {
        if (value == "") {
            callback("请输入父级编码")
        } else {
            callback()
        }
    } else {
        callback()
    }
}
// 对话框校验
const dialogRules = {
    code: [
        { required: true, message: "请输入编码", trigger: "blur" },
        { validator: validateCode, trigger: "blur" }
    ],
    name: [{ required: true, message: "请输入名称", trigger: "blur" }]
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
            emit("confirm", formData.value)
        }
    })
}
</script>

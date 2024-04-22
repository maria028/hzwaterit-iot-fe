<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-17 15:45:11
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-22 11:19:34
 * @Description: 产品表单弹框
-->
<template>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%" :before-close="dialogClose" append-to-body>
        <el-form :model="dialogData" ref="dialogFormRef" label-position="top" label-width="auto" :rules="dialogRules">
            <el-row :gutter="32">
                <el-col :span="24">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialogData.name" placeholder="请输入名称" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="说明" prop="description">
                        <el-input v-model="dialogData.description" placeholder="请输入说明" type="textarea" :rows="5" maxlength="200" show-word-limit />
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
import { ProductDTO } from "@/types/device"

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
const formData = ref<ProductDTO>(props.dialogData)

// 监听 props.dialogData 的变化，并更新 formData
watch(
    () => props.dialogData,
    () => {
        formData.value = props.dialogData
    }
)

// 对话框校验
const dialogRules = {
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

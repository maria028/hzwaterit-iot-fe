<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-24 15:50:12
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-05-06 14:47:38
 * @Description: 物模型属性表单
-->
<template>
    <div class="my-drawer">
        <el-drawer v-model="dialogVisible" direction="rtl" :show-close="false" :before-close="dialogClose">
            <template #header="{ close, titleId, titleClass }">
                <el-button text @click="dialogClose">
                    <el-icon size="22"><Close /></el-icon>
                </el-button>
                <h4 :id="titleId" :class="titleClass">{{ dialogTitle }}</h4>
                <el-button type="primary" @click="dialogConfirm"> 保存 </el-button>
            </template>
            <PropertiesForm ref="dialogFormRef" :formData="dialogData" :visible="dialogVisible" />
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, isRef } from "vue"
import PropertiesForm from "./PropertiesForm.vue"
import { PropertiesBO } from "@/types/metadata"

const metadataType = inject<String>("metadataType")

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

// 对话框关闭
const dialogClose = () => {
    dialogFormRef.value.resetFields()
    emit("close")
}

// 对话框确定
const dialogConfirm = async () => {
    dialogFormRef.value.validate((res: any) => {
        let result = res
        // todo  根据不同类型
        if (metadataType == "properties") {
        } else if (metadataType == "functions") {
            result.inputs = result.inputsCopy.properties
            // 删除对象中inputsCopy
            delete result.inputsCopy
        } else if (metadataType == "tags") {
        }
        emit("confirm", result)
    })
}
</script>

<style lang="scss" scoped>
.my-drawer {
    :deep(.el-drawer) {
        .el-drawer__header > :first-child {
            flex: 0;
        }
    }
}
</style>

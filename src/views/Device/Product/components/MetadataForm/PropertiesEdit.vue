<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-24 15:50:12
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-25 17:36:39
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
            <el-form :model="formData" ref="dialogFormRef" label-position="top" label-width="auto" :rules="dialogRules">
                <!-- 标识 -->
                <el-form-item label="标识" prop="id">
                    <el-input v-model="formData.id" maxlength="30" :disabled="dialogData.id ? true : false" />
                </el-form-item>
                <!-- 名称 -->
                <el-form-item label="名称" prop="name">
                    <el-input v-model="formData.name" maxlength="30" />
                </el-form-item>
                <!-- 数据类型 -->
                <el-form-item label="数据类型" prop="valueType.type">
                    <el-select v-model="formData.valueType.type" :disabled="dialogData.id ? true : false">
                        <el-option v-for="item in valueTypes" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <!-- 数值 单位 -->
                <el-form-item v-if="['int', 'float', 'long', 'double'].includes(formData.valueType.type)" label="单位" prop="valueType.unit">
                    <el-input v-model="formData.valueType.unit" maxlength="10" />
                </el-form-item>
                <!-- 数值 精度 -->
                <el-form-item v-if="['int', 'float', 'long', 'double'].includes(formData.valueType.type)" label="精度" prop="valueType.expands.scale">
                    <el-input v-model.number="formData.valueType.expands.scale" />
                </el-form-item>
                <!-- 长度 -->
                <el-form-item v-if="['int', 'float', 'long', 'double'].includes(formData.valueType.type)" label="长度" prop="valueType.expands.maxLength">
                    <el-input v-model.number="formData.valueType.expands.maxLength" />
                </el-form-item>
                <!-- 时间格式化 -->
                <el-form-item v-if="['timestamp'].includes(formData.valueType.type)" label="时间格式化" prop="valueType.format">
                    <el-input v-model="formData.valueType.format" placeholder="例如：YYYY-MM-DD" />
                </el-form-item>
                <!-- 来源 -->
                <el-form-item label="来源" prop="expands.source">
                    <el-select v-model="formData.expands.source">
                        <el-option label="设备" value="device" />
                    </el-select>
                </el-form-item>
                <!-- 是否只读 -->
                <el-form-item label="是否只读" prop="expands.readOnly">
                    <el-radio-group v-model="formData.expands.readOnly">
                        <el-radio value="true">是</el-radio>
                        <el-radio value="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 说明 -->
                <el-form-item label="说明" prop="description">
                    <el-input v-model="formData.description" type="textarea" maxlength="200" show-word-limit />
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { cloneDeep } from "lodash"
import { PropertiesBO } from "@/types/metadata"
import metadataConstant from "@/constant/metadataConstant"
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

// 数据类型枚举值
const valueTypes = metadataConstant.VALUE_TYPES

// 复制 dialogData 到一个可变的变量中
const formData = ref<PropertiesBO>(props.dialogData)

// 监听 props.dialogData 的变化，并更新 formData
watch(
    () => props.dialogData,
    () => {
        if (dialogVisible) {
            const data = cloneDeep(props.dialogData)
            //必填项expands.source、valueType.type等缺省时补上，解决报错
            formData.value = {
                ...data,
                valueType: {
                    ...data?.valueType,
                    type: data.valueType?.type || " ", // 默认类型值 空
                    expands: {
                        ...data?.valueType?.expands,
                        maxLength: data.valueType?.expands?.maxLength || " ", // 最大长度
                        scale: data.valueType?.expands?.scale || " " // 精度
                    }
                },
                expands: {
                    ...data?.expands,
                    source: data.expands?.source || "device", // 默认来源device
                    readOnly: data.expands?.readOnly || "true" // 默认值 是
                }
            }
        }
    },
    {
        deep: true
    }
)

// 对话框校验
const dialogRules = {
    id: [
        { required: true, message: "请输入标识", trigger: "blur" },
        { pattern: /^[a-z][a-z0-9_]*$/, message: "只能由小写字母、数字和下划线组成，且不能以数字开头", trigger: "blur" }
    ],
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    "expands.source": [{ required: true, message: "请选择来源" }],
    "valueType.type": [{ required: true, message: "请选择数据类型" }],
    "valueType.expands.maxLength": [{ type: "number", min: 0, max: 5000, message: "请输入0-5000之间的正整数", trigger: "blur" }],
    "valueType.expands.scale": [{ type: "number", min: 0, max: 10, message: "请输入0-10之间的正整数", trigger: "blur" }]
}

// 对话框关闭
const dialogClose = () => {
    dialogFormRef.value.resetFields()
    emit("close")
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

<style lang="scss" scoped>
.my-drawer {
    :deep(.el-drawer) {
        .el-drawer__header > :first-child {
            flex: 0;
        }
    }
}
</style>

<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-24 15:50:12
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-26 17:57:19
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
            <el-form :model="formData" ref="dialogFormRef" label-position="top" label-width="auto">
                <!-- 标识 -->
                <el-form-item
                    label="标识"
                    prop="id"
                    :rules="[
                        { required: true, message: '请输入标识', trigger: 'blur' },
                        { pattern: /^[a-z][a-z0-9_]*$/, message: '只能由小写字母、数字和下划线组成，且不能以数字开头', trigger: 'blur' }
                    ]"
                >
                    <el-input v-model="formData.id" maxlength="30" :disabled="dialogData.id ? true : false" />
                </el-form-item>
                <!-- 名称 -->
                <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
                    <el-input v-model="formData.name" maxlength="30" />
                </el-form-item>

                <!-- 数据类型 -->
                <el-form-item label="数据类型" prop="valueType.type" :rules="[{ required: true, message: '请选择数据类型' }]">
                    <el-select v-model="formData.valueType.type" :disabled="dialogData.id ? true : false">
                        <el-option v-for="item in valueTypes" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <!-- 数值 单位 -->
                <el-form-item v-if="['int', 'float', 'long', 'double'].includes(formData.valueType.type)" label="单位" prop="valueType.unit">
                    <el-input v-model="formData.valueType.unit" maxlength="10" />
                </el-form-item>
                <!-- 浮点数值 精度 -->
                <el-form-item
                    v-if="['float', 'double'].includes(formData.valueType.type)"
                    label="精度"
                    prop="valueType.scale"
                    :rules="[{ type: 'number', min: 0, max: 10, message: '请输入0-10之间的正整数', trigger: 'blur' }]"
                >
                    <el-input v-model.number="formData.valueType.scale" />
                </el-form-item>
                <!-- 最大长度 -->
                <el-form-item
                    v-if="['string'].includes(formData.valueType.type)"
                    label="最大长度"
                    prop="valueType.expands.maxLength"
                    :rules="[{ type: 'number', min: 0, max: 10, message: '请输入0-5000之间的正整数', trigger: 'blur' }]"
                >
                    <el-input v-model.number="formData.valueType.expands!.maxLength" />
                </el-form-item>
                <!-- 时间格式化 -->
                <el-form-item
                    v-if="['timestamp'].includes(formData.valueType.type)"
                    label="时间格式化"
                    prop="valueType.format"
                    :rules="[{ required: true, message: '请输入时间格式化', trigger: 'blur' }]"
                >
                    <el-input v-model="formData.valueType.format" placeholder="例如：YYYY-MM-DD" />
                </el-form-item>
                <!-- 枚举值列表 -->
                <el-form-item
                    v-if="['enum'].includes(formData.valueType.type)"
                    label="枚举项"
                    prop="valueType.elements"
                    :rules="[{ validator: validatorElements, message: '请将枚举项补充完整' }]"
                >
                    <div v-for="(item, index) in formData.valueType.elements" :key="item.value" style="width: 100%" class="enum-list">
                        <el-space spacer=":">
                            <el-input v-model="item.value" placeholder="value" />
                            <el-input v-model="item.text" placeholder="text" />
                        </el-space>
                        <el-button text @click.stop="removeElementsHandel(index)">
                            <el-icon><Delete /></el-icon>
                        </el-button>
                    </div>
                    <el-button :icon="Plus" style="width: 100%" @click="addElementsHandel">添加枚举项</el-button>
                </el-form-item>
                <!-- 布尔列表 -->
                <el-form-item v-if="['bool'].includes(formData.valueType.type)" label="布尔值">
                    <div v-for="(item, index) in formData.valueType.elements" :key="item.value" style="width: 100%" class="enum-list">
                        <el-space spacer=":">
                            <el-input v-model="item.value" placeholder="例如：true" />
                            <el-input v-model="item.text" placeholder="例如：是" />
                        </el-space>
                    </div>
                    <el-button v-if="formData.valueType.elements && formData.valueType.elements.length < 2" :icon="Plus" style="width: 100%" @click="addElementsHandel">
                        添加布尔值
                    </el-button>
                </el-form-item>
                <!-- 数组 元素类型 -->
                <el-form-item
                    v-if="['array'].includes(formData.valueType.type)"
                    label="元素类型"
                    prop="valueType.elementType"
                    :rules="[{ required: true, message: '请选择元素类型', trigger: 'blur' }]"
                >
                    <el-select v-model="formData.valueType.elementType">
                        <el-option v-for="item in valueTypes" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <!-- 子对象 -->
                <el-form-item v-if="['array', 'object'].includes(formData.valueType.type)" label="JSON对象" prop="valueType.properties">
                    <el-button :icon="Plus" @click="addPropertiesHandel"> 添加参数 </el-button>
                </el-form-item>

                <!-- 来源 -->
                <el-form-item label="来源" prop="expands.source" :rules="[{ required: true, message: '请选择来源' }]">
                    <el-select v-model="formData.expands.source">
                        <el-option label="设备" value="device" />
                    </el-select>
                </el-form-item>
                <!-- 是否只读 默认是-->
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
import { Plus } from "@element-plus/icons-vue"
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
                    scale: data.valueType?.scale || "", // 精度
                    elementType: data.valueType?.elementType || "", // 数组元素类型
                    elements: data.valueType?.elements || [{ text: "", value: "" }], //枚举项
                    expands: {
                        ...data?.valueType?.expands,
                        maxLength: data.valueType?.expands?.maxLength || "" // 最大长度
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
// 添加枚举值
const addElementsHandel = () => {
    // 默认项
    const elementsItem = {
        text: "",
        value: ""
    }
    //添加或创建
    formData.value.valueType?.elements?.push(elementsItem) ?? (formData.value.valueType.elements = [elementsItem])
}
// 移除枚举值
const removeElementsHandel = (index: number) => {
    formData.value.valueType!.elements!.splice(index, 1)
}
// 枚举项检验规则
const validatorElements = (rule: any, elements: any, callback: any) => {
    if (elements.length === 0) {
        callback(new Error("请添加枚举项"))
    } else if (
        elements.some((el: any) => {
            return el.value == "" || el.text == ""
        })
    ) {
        callback(new Error("请将枚举项补充完整"))
    } else {
        callback()
    }
}

// 添加子对象
const addPropertiesHandel = () => {
    // 默认项
    const propertiesItem = {
        id: "",
        name: "",
        valueType: {
            type: ""
        }
    }
    //添加或创建
    formData.value.valueType?.properties?.push(propertiesItem) ?? (formData.value.valueType.properties = [propertiesItem])
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
.enum-list {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 11px;
    border: 1px dashed var(--el-border-color);
}
</style>

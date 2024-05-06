<template>
    <el-form :model="form" ref="formRef" label-position="top" label-width="auto">
        <!-- 标识 -->
        <el-form-item
            label="标识"
            prop="id"
            :rules="[
                { required: true, message: '请输入标识', trigger: 'blur' },
                { pattern: /^[a-z][a-z0-9_]*$/, message: '只能由小写字母、数字和下划线组成，且不能以数字开头', trigger: 'blur' }
            ]"
        >
            <el-input v-model="form.id" maxlength="30" :disabled="disableId" />
        </el-form-item>
        <!-- 名称 -->
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
            <el-input v-model="form.name" maxlength="30" />
        </el-form-item>

        <!-- valueType 结构 -->
        <template v-if="metadataType == 'properties'">
            <ValueTypeForm v-model="form.valueType" propPath="valueType" />
            <!-- 来源 -->
            <el-form-item v-if="!isChildJSON" label="来源" prop="expands.source" :rules="[{ required: true, message: '请选择来源' }]">
                <el-select v-model="(form as PropertiesBO).expands.source">
                    <el-option label="设备" value="device" />
                </el-select>
            </el-form-item>
            <!-- 是否只读 默认是-->
            <el-form-item v-if="!isChildJSON" label="是否只读" prop="expands.readOnly">
                <el-radio-group v-model="(form as PropertiesBO).expands.readOnly">
                    <el-radio value="true">是</el-radio>
                    <el-radio value="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </template>
        <template v-else-if="metadataType == 'functions'">
            <!-- 是否异步 默认否-->
            <el-form-item v-if="!isChildJSON" label="是否异步" prop="async">
                <el-radio-group v-model="(form as FunctionsBO).async">
                    <el-radio :value="true">是</el-radio>
                    <el-radio :value="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 输入参数 -->
            <ValueTypeForm v-if="(form as FunctionsBO).inputsCopy && !isChildJSON" v-model="(form as FunctionsBO).inputsCopy" propPath="inputsCopy" />
            <!-- 输出参数 -->
            <ValueTypeForm v-if="(form as FunctionsBO).output && !isChildJSON" v-model="(form as FunctionsBO).output" propPath="output" />
            <!-- 子级 -->
            <ValueTypeForm v-if="isChildJSON" v-model="form.valueType" propPath="valueType" />
        </template>
        <template v-else-if="metadataType == 'tags'">
            <ValueTypeForm v-model="form.valueType" propPath="valueType" />
            <!-- 是否只读 默认是-->
            <el-form-item v-if="!isChildJSON" label="是否只读" prop="expands.readOnly">
                <el-radio-group v-model="(form as PropertiesBO).expands.readOnly">
                    <el-radio value="true">是</el-radio>
                    <el-radio value="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </template>

        <!-- 说明 -->
        <el-form-item label="说明" prop="description">
            <el-input v-model="(form as PropertiesBO).description" type="textarea" maxlength="200" show-word-limit />
        </el-form-item>
    </el-form>
</template>
<script lang="ts" setup>
import { ref, watch, inject, provide } from "vue"
import { PropertiesBO, MetadataBasicBO, createInitData, MetadataColumnBO, FunctionsBO, TagsBO } from "@/types/metadata"
import { cloneDeep } from "lodash"
import ValueTypeForm from "./ValueTypeForm.vue"

// props
const props = defineProps({
    formData: {
        type: Object as () => PropertiesBO | FunctionsBO | TagsBO | MetadataBasicBO,
        required: true
    },
    visible: Boolean,
    isChildJSON: Boolean
})

// 根据  type 属性获取对应的 BO
const metadataType = inject<string>("metadataType") || ""
const initFormData = createInitData(metadataType)
type ColumnBO = MetadataColumnBO<typeof metadataType>

const formRef = ref()
provide("formRef", formRef)

// 复制 formData 到一个可变的变量form中
const form = ref<ColumnBO>(props.formData!)

const disableId = ref<boolean>(false)

// 监听 props.formData 的变化，并更新 form
watch(
    () => props.visible,
    (val) => {
        if (val) {
            const data = cloneDeep(props.formData)
            // todo  根据不同类型  赋值默认值
            if (metadataType == "properties") {
                form.value = {
                    ...data,
                    expands: {
                        ...data?.expands,
                        source: data.expands?.source || "device", // 默认来源device
                        readOnly: data.expands?.readOnly || "true" // 默认值 是
                    }
                }
            } else if (metadataType == "functions") {
                form.value = {
                    ...data,
                    inputsCopy: {
                        type: "object",
                        expands: {},
                        properties: data.inputs
                    }
                }
            }
            disableId.value = props.isChildJSON ? false : props.formData.id ? true : false
        }
    },
    {
        deep: true,
        immediate: true
    }
)
// 检验表单
const validate = (callback: (res: any) => void) => {
    formRef.value.validate((valid: boolean) => {
        if (valid) {
            callback(form.value) // 表单有效，通过回调返回 form.value
        } else {
            // callback(new Error(`请将字段补充完整`))
        }
    })
}
// 清空表单
const resetFields = () => {
    console.log("resetFields")
    formRef.value.resetFields() // 数据结构复杂，需要再手动重置数据
    form.value = initFormData
}

// 组件中要暴露出去的属性
defineExpose({
    resetFields,
    validate
})
</script>
<style lang="scss" scoped>
.element-list,
.object-list {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 11px;
    border: 1px dashed var(--el-border-color);
}
</style>

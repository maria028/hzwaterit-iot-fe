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

        <!-- 数据类型 -->
        <el-form-item label="数据类型" prop="valueType.type" :rules="[{ required: true, message: '请选择数据类型' }]">
            <el-select v-model="form.valueType.type" :disabled="disableId" @change="valueTypeChangeHandel">
                <el-option v-for="item in valueTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <!-- 数值 单位 -->
        <el-form-item v-if="['int', 'float', 'long', 'double'].includes(form.valueType.type)" label="单位" prop="valueType.unit">
            <el-input v-model="form.valueType.unit" maxlength="10" />
        </el-form-item>
        <!-- 浮点数值 精度 -->
        <el-form-item
            v-if="['float', 'double'].includes(form.valueType.type)"
            label="精度"
            prop="valueType.scale"
            :rules="[{ type: 'number', min: 0, max: 10, message: '请输入0-10之间的正整数', trigger: 'blur' }]"
        >
            <el-input v-model.number="form.valueType.scale" />
        </el-form-item>
        <!-- 最大长度 -->
        <el-form-item
            v-if="['string'].includes(form.valueType.type)"
            label="最大长度"
            prop="valueType.expands.maxLength"
            :rules="[{ type: 'number', min: 0, max: 10, message: '请输入0-5000之间的正整数', trigger: 'blur' }]"
        >
            <el-input-number v-model="form.valueType.expands!.maxLength" :min="maxlength" :max="5000" controls-position="right" step-strictly style="width: 100%" />
        </el-form-item>
        <!-- 时间格式化 -->
        <el-form-item
            v-if="['timestamp'].includes(form.valueType.type)"
            label="时间格式化"
            prop="valueType.format"
            :rules="[{ required: true, message: '请输入时间格式化', trigger: 'blur' }]"
        >
            <el-input v-model="form.valueType.format" placeholder="例如：YYYY-MM-DD" />
        </el-form-item>
        <!-- 枚举值列表 -->
        <el-form-item v-if="['enum'].includes(form.valueType.type)" label="枚举项" prop="valueType.elements" :rules="[{ validator: validatorElements }]">
            <div v-for="(item, index) in form.valueType.elements" :key="item.value" style="width: 100%" class="element-list">
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
        <el-form-item v-if="['bool'].includes(form.valueType.type)" label="布尔值" prop="valueType.elements" :rules="[{ validator: validatorElements }]">
            <div v-for="(item, index) in form.valueType.elements" :key="item.value" style="width: 100%" class="element-list">
                <el-space spacer=":">
                    <el-input v-model="item.value" placeholder="value,例如：true" />
                    <el-input v-model="item.text" placeholder="text,例如：是" />
                </el-space>
            </div>
            <el-button v-if="form.valueType.elements && form.valueType.elements.length < 2" :icon="Plus" style="width: 100%" @click="addElementsHandel"> 添加布尔值 </el-button>
        </el-form-item>
        <!-- 数组 元素类型 -->
        <el-form-item
            v-if="['array'].includes(form.valueType.type)"
            label="元素类型"
            prop="valueType.elementType"
            :rules="[{ required: true, message: '请选择元素类型', trigger: 'blur' }]"
        >
            <el-select v-model="form.valueType.elementType">
                <el-option v-for="item in valueTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <!-- 子对象  嵌套 -->
        <el-form-item
            v-if="form.valueType.type === 'object' || (form.valueType.type === 'array' && form.valueType.elementType === 'object')"
            label="JSON对象"
            prop="valueType.properties"
            :rules="[{ validator: validatorProperties }]"
        >
            <div v-for="(item, index) in form.valueType.properties" :key="item.id" style="width: 100%" class="object-list">
                <!-- 避免自动关闭  使用visible -->
                <!-- 因为存在嵌套 propertiesFormVisibleFlag等不能使用方法调用，要直接在组件中写 -->
                <el-popover :visible="propertiesFormVisibleFlag === index" :width="250" placement="bottom" trigger="click">
                    <template #reference>
                        <!-- propertiesFormVisibleHandel -->
                        <el-button text @click="propertiesFormVisibleFlag = index">
                            {{ item.name ? `${item.name}` : "请配置字段" }}
                            <el-icon style="margin-left: 10px"><Edit /></el-icon>
                        </el-button>
                    </template>
                    <div style="display: flex; justify-content: space-between; align-items: center">
                        <div></div>
                        <el-button text @click="propertiesFormVisibleFlag = -1">
                            <el-icon><Close /></el-icon>
                        </el-button>
                    </div>
                    <PropertiesForm :ref="(el) => setPropertiesFormRefs(el, index)" :formData="item" isProperties />
                    <el-button size="small" text @click="propertiesFormVisibleFlag = -1">取消</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        @click="
                            () => {
                                propertiesFormRefList[index]?.value!.validate((res: any) => {
                                    propertiesFormVisibleFlag = -1
                                })
                            }
                        "
                    >
                        确认
                    </el-button>
                </el-popover>
                <el-button text @click.stop="removePropertiesHandel(index)">
                    <el-icon><Delete /></el-icon>
                </el-button>
            </div>
            <el-button :icon="Plus" @click="addPropertiesHandel" style="width: 100%"> 添加参数 </el-button>
        </el-form-item>
        <div v-if="!isProperties">
            <!-- 来源 -->
            <el-form-item label="来源" prop="expands.source" :rules="[{ required: true, message: '请选择来源' }]">
                <el-select v-model="(form as PropertiesBO).expands.source">
                    <el-option label="设备" value="device" />
                </el-select>
            </el-form-item>
            <!-- 是否只读 默认是-->
            <el-form-item label="是否只读" prop="expands.readOnly">
                <el-radio-group v-model="(form as PropertiesBO).expands.readOnly">
                    <el-radio value="true">是</el-radio>
                    <el-radio value="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 说明 -->
            <el-form-item label="说明" prop="description">
                <el-input v-model="(form as PropertiesBO).description" type="textarea" maxlength="200" show-word-limit />
            </el-form-item>
        </div>
    </el-form>
    <!-- <el-button type="primary" @click="validate(() => {})"> 校验 </el-button> -->
</template>
<script lang="ts" setup>
import { ref, Ref, watch } from "vue"
import { Plus, Edit, Close } from "@element-plus/icons-vue"
import metadataConstant from "@/constant/metadataConstant"
import { PropertiesBO, PropertiesBasicBO, initPropertiesData } from "@/types/metadata"
import { cloneDeep } from "lodash"
import metadataUtils from "@/utils/metadataUtils"

// props
const props = defineProps({
    formData: {
        type: Object as () => PropertiesBO | PropertiesBasicBO,
        required: true
    },
    visible: Boolean,
    isProperties: Boolean
})
const formRef = ref()

//子对象弹框循环ref
const propertiesFormRefList: Ref<any>[] = []
const setPropertiesFormRefs = (el: any, index: number) => {
    propertiesFormRefList[index] = ref(el)
}

// 复制 formData 到一个可变的变量form中
const form = ref<PropertiesBO | PropertiesBasicBO>(props.formData!)

const disableId = ref<boolean>(false)

// 数据类型枚举值
const valueTypes = metadataConstant.VALUE_TYPES

// 最大长度修改时 只可改大，不可改小
const maxlength = ref(0)

// 子对象显隐控制flag
const propertiesFormVisibleFlag = ref<number>(-1)

// 监听 props.formData 的变化，并更新 form
watch(
    () => props.visible,
    (val) => {
        if (val) {
            const data = cloneDeep(props.formData)

            form.value = {
                ...data,
                expands: {
                    ...data?.expands,
                    source: data.expands?.source || "device", // 默认来源device
                    readOnly: data.expands?.readOnly || "true" // 默认值 是
                }
            }
            maxlength.value = data.valueType?.expands?.maxLength || 0
            disableId.value = props.isProperties ? false : props.formData.id ? true : false
        }
    },
    {
        deep: true,
        immediate: true
    }
)
// 监听数据类型变化，修改valueType对应的字段，防止报错
const valueTypeChangeHandel = (type: string) => {
    form.value.valueType = metadataUtils.valueTypeInitData(type)
}
watch(
    () => form.value.valueType.type,
    (type) => {}
)
/***枚举值 startd**/
// 添加枚举值
const addElementsHandel = () => {
    // 默认项
    const elementsItem = {
        text: "",
        value: ""
    }
    //添加或创建
    form.value.valueType?.elements?.push(elementsItem) ?? (form.value.valueType.elements = [elementsItem])
}
// 移除枚举值
const removeElementsHandel = (index: number) => {
    form.value.valueType!.elements!.splice(index, 1)
}
// valueType.elements 变化时检验
watch(
    () => form.value.valueType?.elements,
    () => {
        if (formRef.value) checkElements()
    },
    { deep: true }
)
// 枚举项检验
const checkElements = () => {
    if (form.value.valueType.elements) {
        formRef.value.validateField("valueType.elements", () => {})
    }
}
// 枚举项/布尔值检验规则
const validatorElements = (rule: any, elements: any, callback: any) => {
    const type = form.value.valueType.type === "bool" ? "布尔值" : "枚举值"
    if (!elements || elements.length === 0) {
        callback(new Error(`请添加${type}`))
    } else if (
        elements.some((el: any) => {
            return el.value == "" || el.text == ""
        })
    ) {
        //含有空值
        callback(new Error(`含有空值，请将${type}补充完整`))
    } else if (form.value.valueType.type === "bool" && elements.length < 2) {
        // 布尔值必须2项
        callback(new Error(`不足2项，请将${type}补充完整`))
    } else {
        callback()
    }
}
/***枚举值 end**/

/***子对象 start**/
// 添加子对象
const addPropertiesHandel = () => {
    // 默认项
    const propertiesItem: PropertiesBasicBO = initPropertiesData
    //添加或创建
    form.value.valueType?.properties?.push(propertiesItem) ?? (form.value.valueType.properties = [propertiesItem])
}
// 移除子对象
const removePropertiesHandel = (index: number) => {
    form.value.valueType!.properties!.splice(index, 1)
}
// 子对象检验规则
const validatorProperties = (rule: any, properties: any, callback: any) => {
    if (!properties || properties.length === 0) {
        callback(new Error(`请添加字段`))
    } else if (
        properties.some((el: any) => {
            return el.id == "" || el.name == "" || el.valueType.type == ""
        })
    ) {
        //含有空值  目前仅对\id name type做检查
        callback(new Error(`请将字段补充完整`))
    } else {
        callback()
    }
}

/***子对象 end**/

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
    formRef.value.resetFields() // 数据结构复杂，需要再手动重置数据
    form.value = initPropertiesData
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

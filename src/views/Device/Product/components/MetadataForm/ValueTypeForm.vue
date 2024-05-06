<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-30 16:28:24
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-05-06 14:38:48
 * @Description: ValueType 结构表单  ：嵌套在上层form中，valueType绑定父级， 不可单独使用
-->
<template>
    <!-- 数据类型 -->
    <el-form-item
        v-if="propPath != 'inputsCopy'"
        :label="propPath == 'output' ? '输出参数' : '数据类型'"
        :prop="`${propPath}.type`"
        :rules="propPath == 'valueType' ? [{ required: true, message: '请选择数据类型' }] : []"
    >
        <!-- :disabled="false"    todo  -->
        <el-select v-model="valueType.type" :disabled="false" @change="valueTypeChangeHandel">
            <el-option v-for="item in valueTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
    </el-form-item>
    <!-- 数值 单位 -->
    <el-form-item v-if="['int', 'float', 'long', 'double'].includes(valueType.type)" label="单位" :prop="`${propPath}.unit`">
        <el-input v-model="valueType.unit" maxlength="10" />
    </el-form-item>
    <!-- 浮点数值 精度 -->
    <el-form-item
        v-if="['float', 'double'].includes(valueType.type)"
        label="精度"
        :prop="`${propPath}.scale`"
        :rules="[{ type: 'number', min: 0, max: 10, message: '请输入0-10之间的正整数', trigger: 'blur' }]"
    >
        <el-input v-model.number="valueType.scale" />
    </el-form-item>
    <!-- 最大长度 -->
    <el-form-item
        v-if="['string'].includes(valueType.type)"
        label="最大长度"
        :prop="`${propPath}.expands.maxLength`"
        :rules="[{ type: 'number', min: 0, max: 10, message: '请输入0-5000之间的正整数', trigger: 'blur' }]"
    >
        <el-input-number
            v-model="valueType.expands!.maxLength"
            :min="maxlength"
            :max="5000"
            controls-position="right"
            step-strictly
            style="width: 100%"
        />
    </el-form-item>
    <!-- 时间格式化 -->
    <el-form-item
        v-if="['timestamp'].includes(valueType.type)"
        label="时间格式化"
        :prop="`${propPath}.format`"
        :rules="[{ required: true, message: '请输入时间格式化', trigger: 'blur' }]"
    >
        <el-input v-model="valueType.format" placeholder="例如：YYYY-MM-DD" />
    </el-form-item>
    <!-- 枚举值列表 -->
    <el-form-item v-if="['enum'].includes(valueType.type)" label="枚举项" :prop="`${propPath}.elements`" :rules="[{ validator: validatorElements }]">
        <div v-for="(item, index) in valueType.elements" :key="item.value" style="width: 100%" class="element-list">
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
    <el-form-item v-if="['bool'].includes(valueType.type)" label="布尔值" :prop="`${propPath}.elements`" :rules="[{ validator: validatorElements }]">
        <div v-for="(item, index) in valueType.elements" :key="item.value" style="width: 100%" class="element-list">
            <el-space spacer=":">
                <el-input v-model="item.value" placeholder="value,例如：true" />
                <el-input v-model="item.text" placeholder="text,例如：是" />
            </el-space>
        </div>
        <el-button v-if="valueType.elements && valueType.elements.length < 2" :icon="Plus" style="width: 100%" @click="addElementsHandel">
            添加布尔值
        </el-button>
    </el-form-item>
    <!-- 数组 元素类型 -->
    <el-form-item
        v-if="['array'].includes(valueType.type)"
        label="元素类型"
        :prop="`${propPath}.elementType`"
        :rules="[{ required: true, message: '请选择元素类型', trigger: 'blur' }]"
    >
        <el-select v-model="valueType.elementType">
            <el-option v-for="item in valueTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
    </el-form-item>
    <!-- 子对象  嵌套 -->
    <el-form-item
        v-if="valueType.type === 'object' || (valueType.type === 'array' && valueType.elementType === 'object')"
        :label="propPath == 'inputsCopy' ? '输入参数' : 'JSON对象'"
        :prop="`${propPath}.properties`"
        :rules="propPath == 'valueType' ? [{ required: true, message: '请填写JSON对象', trigger: 'blur' }, { validator: validatorProperties }] : []"
    >
        <div v-for="(item, index) in valueType.properties" :key="item.id" style="width: 100%" class="object-list">
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
                    <el-button
                        text
                        @click="
                            () => {
                                propertiesFormRefList[index]?.value!.validate((res: any) => {
                                    propertiesFormVisibleFlag = -1
                                })
                            }
                        "
                    >
                        <el-icon><Close /></el-icon>
                    </el-button>
                </div>
                <PropertiesForm :ref="(el: any) => setPropertiesFormRefs(el, index)" :formData="item" isChildJSON />
            </el-popover>
            <el-button text @click.stop="removePropertiesHandel(index)">
                <el-icon><Delete /></el-icon>
            </el-button>
        </div>
        <el-button :icon="Plus" @click="addPropertiesHandel" style="width: 100%"> 添加参数</el-button>
    </el-form-item>
</template>
<script lang="ts" setup>
import { Ref, inject, ref, watch } from "vue"
import metadataConstant from "@/constant/metadataConstant"
import { MetadataBasicBO, ValueTypeBO } from "@/types/metadata"
import metadataUtils from "@/utils/metadataUtils"
import { Plus, Edit, Close } from "@element-plus/icons-vue"
import PropertiesForm from "./PropertiesForm.vue"

//绑定的valueType
const valueType = defineModel({ type: Object as () => ValueTypeBO, required: true })
// props
const props = defineProps(["propPath"])

const metadataType = inject<string>("metadataType") || ""

const formRef = inject("formRef", ref())

// 最大长度修改时 只可改大，不可改小
const maxlength = ref(0)

watch(
    valueType,
    () => {
        // console.log("valueTypeForm组件收到的值：", valueType.value)
        maxlength.value = valueType.value.expands?.maxLength || 0
    },
    { deep: true, immediate: true }
)

// 数据类型枚举值
const valueTypes = metadataConstant.VALUE_TYPES

// 监听数据类型变化，修改valueType对应的字段，防止报错
const valueTypeChangeHandel = (type: string) => {
    valueType.value = metadataUtils.valueTypeInitData(type)
}

/***枚举值 \布尔值 startd**/
// 添加枚举值
const addElementsHandel = () => {
    // 默认项
    const elementsItem = {
        text: "",
        value: ""
    }
    //添加或创建
    valueType.value.elements!.push(elementsItem) ?? (valueType.value.elements = [elementsItem])
}
// 移除枚举值
const removeElementsHandel = (index: number) => {
    valueType.value.elements!.splice(index, 1)
}
// valueType.elements 变化时检验
if (valueType.value?.elements) {
    watch(
        () => valueType.value.elements,
        () => {
            if (formRef.value) checkElements()
        },
        { deep: true }
    )
}

// 枚举项检验
const checkElements = () => {
    if (valueType.value.elements) {
        formRef.value.validateField("valueType.elements", () => {})
    }
}
// 枚举项/布尔值检验规则
const validatorElements = (rule: any, elements: any, callback: any) => {
    const type = valueType.value.type === "bool" ? "布尔值" : "枚举值"
    if (!elements || elements.length === 0) {
        callback(new Error(`请添加${type}`))
    } else if (
        elements.some((el: any) => {
            return el.value == "" || el.text == ""
        })
    ) {
        //含有空值
        callback(new Error(`含有空值，请将${type}补充完整`))
    } else if (valueType.value.type === "bool" && elements.length < 2) {
        // 布尔值必须2项
        callback(new Error(`不足2项，请将${type}补充完整`))
    } else {
        callback()
    }
}
/***枚举值 \布尔值 end**/

/***子对象 start**/
// 子对象显隐控制flag
const propertiesFormVisibleFlag = ref<number>(-1)
//子对象弹框循环ref
const propertiesFormRefList: Ref<any>[] = []
const setPropertiesFormRefs = (el: any, index: number) => {
    propertiesFormRefList[index] = ref(el)
}
// 添加子对象
const addPropertiesHandel = () => {
    // 默认项
    const propertiesItem: MetadataBasicBO = {
        id: "propertiesItem",
        name: "",
        valueType: {
            type: ""
        }
    }
    //添加或创建
    valueType.value.properties?.push(propertiesItem) ?? (valueType.value.properties = [propertiesItem])
}
// 移除子对象
const removePropertiesHandel = (index: number) => {
    valueType.value.properties!.splice(index, 1)
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

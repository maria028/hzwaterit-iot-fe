<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-19 10:40:21
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-19 17:53:55
 * @Description: 复合型输入框，左侧选择框，右侧输入框。 option中的字段要属于model
 option="[
            {
                label: '员工姓名',
                value: 'employeeName'
            },
            {
                label: '手机号码',
                value: 'phoneNumber'
            }
          ]"
  model={
    employeeName:'',
    phoneNumber:'',
    ...
  }
-->
<template>
    <el-input v-model="input" placeholder="请输入" clearable @clear="clearHandel">
        <template #prepend>
            <el-select v-model="select" placeholder="请选择" style="width: 100px">
                <el-option v-for="(item, index) in option" :label="item.label" :value="item.value" />
            </el-select>
        </template>
        <template #append>
            <el-button @click="searchHandel">
                <el-icon style="vertical-align: middle">
                    <Search />
                </el-icon>
            </el-button>
        </template>
    </el-input>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"

interface OptionBO {
    value: string
    label: string
}

const model = defineModel({ type: Object }) //绑定的数据对象
// const props = defineProps(["option"]) //select 对象
const props = defineProps({
    option: {
        type: Array as () => OptionBO[],
        required: true // 将 option 标记为必填项
    }
})

const emit = defineEmits(["search"])

const select = ref<string>("")
const input = ref<string>("")

onMounted(() => {
    select.value = props.option[0].value
})
// 搜索
const searchHandel = () => {
    //仅保留当前选择的项，其他项数据清空
    props.option.forEach((el: OptionBO) => {
        if (el.value === select.value) {
            model.value[el.value] = input.value ? input.value : null
        } else {
            model.value[el.value] = null
        }
    })
    emit("search")
}
// 清空
const clearHandel = () => {
    searchHandel()
}
</script>

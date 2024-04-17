<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-17 15:33:42
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-17 15:40:37
 * @Description: 资源表单弹框
-->
<template>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body>
        <el-form ref="dialogFormRef" :model="dialogData" inline label-width="auto" :rules="dialogRules" class="dialog-form-inline">
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialogData.name" placeholder="请输入名称" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="类型" prop="typeCode">
                        <el-select v-model="dialogData.typeCode" placeholder="请选择">
                            <el-option v-for="resourceTypeDict in resourceTypeDicts" :key="resourceTypeDict.code" :label="resourceTypeDict.name" :value="resourceTypeDict.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="请求方式" prop="requestMethod">
                        <el-select v-model="dialogData.requestMethod" placeholder="请选择">
                            <el-option
                                v-for="requestMethodDict in requestMethodDicts"
                                :key="requestMethodDict.code"
                                :label="requestMethodDict.name"
                                :value="requestMethodDict.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地址" prop="url">
                        <el-input v-model="dialogData.url" placeholder="请输入地址" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态" prop="statusCode">
                        <el-select v-model="dialogData.statusCode" placeholder="请选择">
                            <el-option
                                v-for="resourceStatusDict in resourceStatusDicts"
                                :key="resourceStatusDict.code"
                                :label="resourceStatusDict.name"
                                :value="resourceStatusDict.code"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="图标" prop="icon">
                        <el-input
                            v-model="dialogData.icon"
                            placeholder="请选择图标"
                            style="cursor: pointer"
                            :suffix-icon="iconSelectVisible ? 'ArrowUp' : 'ArrowDown'"
                            clearable
                            @click="iconSelectVisible = true"
                            @clear="dialogData.icon = ''"
                        >
                            <template #prepend>
                                <el-image v-if="dialogData.icon" :src="dialogData.icon" />
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-button @click="dialogCancel">取消</el-button>
            <el-button type="primary" @click="dialogConfirm">确定</el-button>
        </template>
    </el-dialog>
    <IconSelect v-model:visible="iconSelectVisible" @confirmIcon="confirmIconHandel" />
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { IconBO, ResourceDTO } from "@/types/system"
import dictCodeConstant from "@/constant/dictCodeConstant"
import dictUtils from "@/utils/dictUtils"
import { DictBO } from "@/types/common"
import IconSelect from "./IconSelect/index.vue"

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

// 图标选择弹框显示
const iconSelectVisible = ref(false)

// 资源状态字典
const resourceStatusDicts: DictBO[] = dictUtils.list(dictCodeConstant.RESOURCE_STATUS)
// 资源类型字典
const resourceTypeDicts: DictBO[] = dictUtils.list(dictCodeConstant.RESOURCE_TYPE)
// 请求方式字典
const requestMethodDicts: DictBO[] = dictUtils.list(dictCodeConstant.REQUEST_METHOD)

// 复制 dialogData 到一个可变的变量中
const formData = ref<ResourceDTO>(props.dialogData)

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
// 选择图标
const confirmIconHandel = (icon: IconBO) => {
    formData.value.icon = icon.path
}
</script>

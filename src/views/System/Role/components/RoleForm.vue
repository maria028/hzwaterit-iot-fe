<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-17 15:11:07
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-17 15:24:51
 * @Description: 角色表单弹框
-->
<template>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="dialogClose" append-to-body>
        <el-form :model="dialogData" ref="dialogFormRef" label-width="auto" :rules="dialogRules">
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="dialogData.code" placeholder="请输入编码" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dialogData.name" placeholder="请输入名称" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="权限" prop="resourceIds">
                        <el-tree :data="treeData" :props="{ children: 'children', label: 'name' }" node-key="id" show-checkbox ref="treeRef" />
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
import { ref, computed, watch, onMounted } from "vue"
import { RoleDTO, ResourceTreeBO } from "@/types/system"
import { getResourceTreeData } from "@/service/system/resource"
import { Result } from "@/types/common"

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
const treeRef = ref()

// 复制 dialogData 到一个可变的变量中
const formData = ref<RoleDTO>(props.dialogData)

// 监听 props.dialogData 的变化，并更新 formData
watch(
    () => props.dialogData,
    () => {
        formData.value = props.dialogData
        treeRef.value.setCheckedKeys(props.dialogData.resourceIds)
    }
)

// 部门树数据
const treeData = ref<ResourceTreeBO[]>([])

// 对话框校验
const dialogRules = {
    code: [{ required: true, message: "请输入编号", trigger: "blur" }],
    name: [{ required: true, message: "请输入名称", trigger: "blur" }]
}
onMounted(() => {
    getResourceTree()
})
//  获取资源树
const getResourceTree = () => {
    getResourceTreeData().then((response: Result<ResourceTreeBO[]>) => {
        treeData.value = response.data
    })
}
// 对话框关闭
const dialogClose = () => {
    dialogFormRef.value.resetFields()
    treeRef.value.setCheckedKeys([])
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
            formData.value.resourceIds = treeRef.value.getCheckedKeys()
            emit("confirm", formData.value)
        }
    })
}
</script>

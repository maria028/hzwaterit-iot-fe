<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 17:30:13
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:36:51
 * @Description: 
-->
<template>
    <el-row :gutter="16" style="height: 100%">
        <el-col :span="4" style="height: 100%">
            <el-card>
                <el-tree :data="treeData" :props="treeProps" node-key="id" highlight-current accordion ref="treeRef" @node-click="handlerNodeClick" />
            </el-card>
        </el-col>
        <el-col :span="20" style="height: 100%">
            <CSearchTable
                tableName="资源列表"
                :data="tableData"
                @search="getTableData"
                @clear="reset"
                :loading="loading"
                :total="rows"
                v-model:currentPage="queryModel.pageNum"
                v-model:pageSize="queryModel.pageSize"
            >
                <template #search>
                    <CSearchBarItem label="状态">
                        <el-select v-model="queryModel.statusCode" placeholder="请选择" clearable>
                            <el-option
                                v-for="resourceStatusDict in resourceStatusDicts"
                                :key="resourceStatusDict.code"
                                :label="resourceStatusDict.name"
                                :value="resourceStatusDict.code"
                            />
                        </el-select>
                    </CSearchBarItem>
                </template>
                <template #tableLeft> </template>
                <template #tableRight>
                    <el-button v-permission="'POST/resource'" type="primary" @click="handleAdd">新增</el-button>
                </template>
                <template #columns>
                    <el-table-column type="index" label="序号" min-width="80" />
                    <el-table-column label="名称" prop="name" min-width="100px" />
                    <el-table-column label="类型" prop="type" min-width="60px" />
                    <el-table-column label="请求方式" prop="requestMethod" min-width="90px" />
                    <el-table-column label="地址" prop="url" min-width="180px" />
                    <el-table-column label="状态" prop="status" min-width="60px" />
                    <el-table-column label="图标" prop="icon" min-width="150px" />
                    <el-table-column label="创建时间" prop="createGmt" min-width="180" />
                    <el-table-column label="修改时间" prop="modifiedGmt" min-width="180" />
                    <el-table-column label="操作" fixed="right" min-width="380">
                        <template #default="scope">
                            <el-button v-permission="'PUT/resource'" type="primary" text @click="handleEdit(scope.row.id)">修改</el-button>
                            <el-button v-permission="'PUT/resource-status'" type="primary" text @click="handlerUpdateStatus(scope.row.id, 1)" v-if="scope.row.statusCode == '2'"
                                >启用</el-button
                            >
                            <el-button v-permission="'PUT/resource-status'" type="primary" text @click="handlerUpdateStatus(scope.row.id, 2)" v-if="scope.row.statusCode == '1'"
                                >禁用</el-button
                            >
                            <el-button v-permission="'PUT/resource-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 1)">上移</el-button>
                            <el-button v-permission="'PUT/resource-sort'" type="primary" text @click="handlerUpdateSort(scope.row.id, 2)">下移</el-button>
                            <el-button v-permission="'DELETE/resource/{id}'" type="danger" text @click="handleDelete(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </template>
            </CSearchTable>
        </el-col>
    </el-row>
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
                        <el-input v-model="dialogData.icon" placeholder="请输入图标" maxlength="30" />
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
import { ref, onMounted, nextTick } from "vue"
import { ResourceBO, ResourceDTO, ResourceTreeBO } from "@/types/System"
import DictCodeConstant from "@/constant/DictCodeConstant"
import DictUtils from "@/utils/DictUtils"
import { DictBO, Result } from "@/types/Common"
import { ElMessage, ElMessageBox } from "element-plus"
import {
    addResource,
    deleteResourceById,
    getResource,
    getResourceById,
    getResourceTreeData,
    setResourceSort,
    updateResource,
    updateResourceStatus
} from "@/service/system/resource"

const treeRef = ref()
const dialogFormRef = ref()

// 树数据
const treeData = ref<ResourceTreeBO[]>([])
// 树属性
const treeProps = ref({
    children: "children",
    label: "name"
})
// 当前选中的节点
const currentNodeKey = ref(0)
const loading = ref(false)

// 查询条件
const queryModel = ref({
    pageNum: 1,
    pageSize: 10,
    parentId: 0,
    statusCode: ""
})

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<ResourceBO[]>([])

// 资源状态字典
const resourceStatusDicts: DictBO[] = DictUtils.list(DictCodeConstant.RESOURCE_STATUS)
// 资源类型字典
const resourceTypeDicts: DictBO[] = DictUtils.list(DictCodeConstant.RESOURCE_TYPE)
// 请求方式字典
const requestMethodDicts: DictBO[] = DictUtils.list(DictCodeConstant.REQUEST_METHOD)

// 对话框标题
const dialogTitle = ref("")
// 对话框是否显示
const dialogVisible = ref(false)

// 对话框数据
const dialogData = ref<ResourceDTO>({
    id: 0,
    parentId: 0,
    name: "",
    typeCode: "1",
    requestMethod: "GET",
    url: "",
    statusCode: "1",
    icon: ""
})

// 对话框校验
const dialogRules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }]
}

onMounted(() => {
    getResourceTree()
})

// 获取资源树
const getResourceTree = () => {
    getResourceTreeData().then(async (response: Result<ResourceTreeBO[]>) => {
        const result = response
        treeData.value = [{ id: 0, name: "资源树", children: [...result.data] }]
        getTableData()
        await nextTick()
        treeRef.value.setCurrentKey(currentNodeKey.value)
    })
}

// 搜索
const getTableData = () => {
    loading.value = true
    queryModel.value.parentId = currentNodeKey.value
    getResource(queryModel.value)
        .then((response: Result<ResourceBO[]>) => {
            const result = response
            rows.value = result.rows
            tableData.value = result.data
        })
        .finally(() => {
            loading.value = false
        })
}

//  重置
const reset = () => {
    queryModel.value = {
        pageNum: 1,
        pageSize: 10,
        parentId: 0,
        statusCode: ""
    }
    getTableData()
}
// 树节点点击
const handlerNodeClick = () => {
    currentNodeKey.value = treeRef.value.getCurrentKey()
    getTableData()
}
// 新增
const handleAdd = () => {
    dialogTitle.value = "新增"
    dialogVisible.value = true
}
// 修改
const handleEdit = (id: number) => {
    dialogTitle.value = "修改"
    dialogVisible.value = true
    getResourceById(id).then((response: Result<ResourceDTO>) => {
        dialogData.value = response.data
        dialogData.value.typeCode = dialogData.value.typeCode + ""
        dialogData.value.requestMethod = dialogData.value.requestMethod + ""
        dialogData.value.statusCode = dialogData.value.statusCode + ""
    })
}
// 删除
const handleDelete = (id: number) => {
    ElMessageBox.confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            deleteResourceById(id).then(() => {
                ElMessage.success("操作成功！")
                getTableData()
            })
        })
        .catch(() => {
            ElMessage.info("已取消")
        })
}

// 修改排序
const handlerUpdateSort = (id: number, moveTypeCode: number) => {
    setResourceSort({
        id: id,
        moveTypeCode: moveTypeCode
    }).then(() => {
        ElMessage.success("操作成功！")
        getTableData()
    })
}

// 修改状态
const handlerUpdateStatus = (id: number, statusCode: number) => {
    updateResourceStatus({
        id: id,
        statusCode: statusCode
    }).then(() => {
        ElMessage.success("操作成功！")
        getTableData()
    })
}

// 对话框关闭
const dialogClose = () => {
    dialogVisible.value = false
    dialogData.value.id = 0
    dialogFormRef.value.resetFields()
}
// 对话框取消
const dialogCancel = () => {
    dialogClose()
}
// 对话框确定
const dialogConfirm = () => {
    dialogFormRef.value.validate((valid: boolean) => {
        if (valid) {
            dialogData.value.parentId = currentNodeKey.value
            const request = dialogData.value.id == 0 ? addResource(dialogData.value) : updateResource(dialogData.value)
            request.then(() => {
                ElMessage.success("操作成功！")
                dialogClose()
                getTableData()
            })
        }
    })
}
</script>

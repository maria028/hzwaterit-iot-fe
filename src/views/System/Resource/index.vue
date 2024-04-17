<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 17:30:13
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-17 16:06:20
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
                    <el-table-column label="图标" prop="icon" min-width="150px">
                        <template #default="scope">
                            <el-image v-if="scope.row.icon" :src="scope.row.icon" />
                        </template>
                    </el-table-column>
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
    <ResourceForm v-model:dialogVisible="dialogVisible" :dialogData="dialogData" @close="closeEmployeeForm" @confirm="confirmEmployeeForm" />
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue"
import { IconBO, ResourceBO, ResourceDTO, ResourceTreeBO } from "@/types/system"
import dictCodeConstant from "@/constant/dictCodeConstant"
import dictUtils from "@/utils/dictUtils"
import { DictBO, Result } from "@/types/common"
import { ElMessage, ElMessageBox } from "element-plus"
import ResourceForm from "./components/ResourceForm.vue"
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
const initQueryModel = {
    pageNum: 1,
    pageSize: 10,
    parentId: 0,
    statusCode: null
}
const queryModel = ref(initQueryModel)

// 总行数
const rows = ref(0)
// 表格数据
const tableData = ref<ResourceBO[]>([])

// 资源状态字典
const resourceStatusDicts: DictBO[] = dictUtils.list(dictCodeConstant.RESOURCE_STATUS)

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
    queryModel.value = initQueryModel
    getTableData()
}
// 树节点点击
const handlerNodeClick = () => {
    currentNodeKey.value = treeRef.value.getCurrentKey()
    getTableData()
}
// 新增
const handleAdd = () => {
    dialogVisible.value = true
}
// 修改
const handleEdit = (id: number) => {
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
                getResourceTree()
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
        getResourceTree()
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
const closeEmployeeForm = () => {
    dialogVisible.value = false
    dialogData.value.id = 0
}
// 对话框确定
const confirmEmployeeForm = (formData: ResourceDTO) => {
    if (formData.id == 0) {
        formData.parentId = currentNodeKey.value
    }
    const request = formData.id == 0 ? addResource(formData) : updateResource(formData)
    request.then(() => {
        ElMessage.success("操作成功！")
        getTableData()
        getResourceTree()

        closeEmployeeForm()
    })
}
</script>

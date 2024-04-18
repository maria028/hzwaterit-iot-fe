<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-18 14:12:59
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-18 16:26:03
 * @Description: 自定义树形控件，个性化样式
-->
<template>
    <div>
        <el-tree
            class="mytree"
            :data="data"
            :props="{ children: 'children', label: 'name' }"
            node-key="id"
            :indent="0"
            highlight-current
            accordion
            ref="treeRef"
            @node-click="handlerNodeClick"
        >
            <template #default="{ node, data }">
                <span>
                    <span style="padding-left: 4px">{{ node.label }}</span>
                </span>
            </template>
        </el-tree>
    </div>
    <!-- <el-tree :data="data" :props="{ children: 'children', label: 'name' }" node-key="id" :indent="0" highlight-current accordion ref="treeRef" @node-click="handlerNodeClick" /> -->
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue"

const props = defineProps({
    data: Array, //树形数据
    defaultKey: [Number, String] //默认节点
})
const emit = defineEmits(["nodeClick"])

const treeRef = ref()

onMounted(async () => {
    // 设置节点
    treeRef.value.setCurrentKey(props.defaultKey)
})

// 树节点点击
const handlerNodeClick = () => {
    // 向父组件传递当前点击节点
    emit("nodeClick", treeRef.value.getCurrentKey())
}
</script>
<style lang="scss" scoped>
:deep(.mytree) {
    // overflow-y: auto;
    &.el-tree > .el-tree-node:after {
        border-top: none;
    }
    &.el-tree > .el-tree-node {
        padding-left: 0px;
    }
    .el-tree-node {
        position: relative;
        padding-left: 16px;
    }
    //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
    .el-tree-node__expand-icon.is-leaf {
        display: none;
    }
    .el-tree-node__children {
        padding-left: 16px;
    }

    .el-tree-node :last-child:before {
        height: 38px;
    }

    &.el-tree > .el-tree-node:before {
        border-left: none;
    }

    &.el-tree > .el-tree-node:after {
        border-top: none;
    }

    .el-tree-node:before {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
    }

    .el-tree-node:after {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
    }

    .el-tree-node:before {
        border-left: 1px dashed var(--el-color-primary);
        bottom: 0px;
        height: 100%;
        top: -26px;
        width: 1px;
    }

    .el-tree-node:after {
        border-top: 1px dashed var(--el-color-primary);
        height: 20px;
        top: 12px;
        width: 18px;
    }
    .el-tree .el-tree-node__expand-icon.expanded {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    .el-tree .el-icon-caret-right:before {
        content: "\e723";
        font-size: 16px;
        color: var(--el-color-primary);
        position: absolute;
        left: -20px;
        top: -8px;
    }
    .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        content: "\e722";
        font-size: 16px;
        color: var(--el-color-primary);
        position: absolute;
        left: -20px;
        top: -8px;
    }
    .el-tree-node__content > .el-tree-node__expand-icon {
        padding: 0;
    }
}
</style>

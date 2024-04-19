<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-18 14:12:59
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-19 16:20:34
 * @Description: 自定义树形控件，可过滤关键字，个性化样式
-->
<template>
    <div>
        <el-input v-model="filterText" placeholder="搜索关键字" :prefix-icon="Search" style="margin-bottom: 16px" />
        <el-tree
            v-bind="$attrs"
            class="mytree"
            :data="data"
            :props="{ children: 'children', label: 'name' }"
            node-key="id"
            :indent="0"
            highlight-current
            accordion
            ref="treeRef"
            :filter-node-method="filterNode"
            @node-click="handlerNodeClick"
        >
            <template #default="{ node, data }">
                <el-tooltip effect="dark" :content="node.label" placement="top-start">
                    <el-text truncated> {{ node.label }} </el-text>
                </el-tooltip>
            </template>
        </el-tree>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
import { Search } from "@element-plus/icons-vue"
const props = defineProps({
    data: Array, //树形数据
    defaultKey: [Number, String] //默认节点
})
const emit = defineEmits(["nodeClick"])

const treeRef = ref()
// 过滤关键字
const filterText = ref("")

onMounted(async () => {
    // 设置节点
    treeRef.value.setCurrentKey(props.defaultKey)
})

// 树节点点击
const handlerNodeClick = () => {
    // 向父组件传递当前点击节点
    emit("nodeClick", treeRef.value.getCurrentKey())
}
// 过滤关键字start
interface Tree {
    [key: string]: any
}
const filterNode = (value: string, data: Tree) => {
    if (!value) return true
    return data.name.includes(value)
}
watch(filterText, (val) => {
    treeRef.value!.filter(val)
})
// 过滤关键字end
</script>
<style lang="scss" scoped>
:deep(.mytree) {
    //行高调整 默认26px
    --el-tree-node-content-height: 32px;

    // 竖线横线的位置  以转折点为参照
    --line-position-justify: -5px; //水平

    //相邻级节点间的水平缩进  默认16px
    --indent-padding: 16px;

    // 线条宽度
    --line-width: 2px;

    &.el-tree > .el-tree-node:after {
        border-top: none;
    }
    &.el-tree > .el-tree-node {
        padding-left: 0px;
    }
    // 相邻级节点间的水平缩进  默认16px
    .el-tree-node {
        position: relative;
        padding-left: var(--indent-padding);
    }
    .el-tree-node__children {
        padding-left: var(--indent-padding);
    }
    //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
    .el-tree-node__expand-icon.is-leaf {
        display: none;
    }

    .el-tree-node :last-child:before {
        height: calc(var(--el-tree-node-content-height) * 1.5);
    }

    &.el-tree > .el-tree-node:before {
        border-left: none;
    }

    &.el-tree > .el-tree-node:after {
        border-top: none;
    }

    .el-tree-node:before {
        content: "";
        left: var(--line-position-justify);
        position: absolute;
        right: auto;
        border-width: var(--line-width);
    }

    .el-tree-node:after {
        content: "";
        left: var(--line-position-justify);
        position: absolute;
        right: auto;
        border-width: var(--line-width);
    }

    .el-tree-node:before {
        border-left: var(--line-width) solid var(--el-color-primary);
        opacity: 0.5;
        bottom: 0px;
        height: 100%;
        top: calc(0px - var(--el-tree-node-content-height));
    }

    .el-tree-node:after {
        border-top: var(--line-width) solid var(--el-color-primary);
        opacity: 0.5;
        top: calc(var(--el-tree-node-content-height) / 2 - var(--line-width) / 2);
        width: calc(var(--indent-padding) + var(--line-width));
    }
    //箭头图标  padding
    .el-tree-node__content > .el-tree-node__expand-icon {
        // padding: 0;
    }
}
</style>

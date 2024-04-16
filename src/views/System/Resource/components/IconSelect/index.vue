<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-16 10:14:06
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-16 15:14:25
 * @Description: svg 图标（实则图片，仅支持本地）选择弹窗 应用于菜单
-->
<template>
    <el-dialog v-model="visible" title="图标" append-to-body>
        <div class="svg-container">
            <div class="svg-list">
                <div v-for="(item, index) in icons" :key="index" class="svg-item" :style="index == currentIndex ? 'background-color: #EEE;' : ''" @click="selectIcon(item, index)">
                    <el-image class="svg" :src="item.path" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { IconBO } from "@/types/system"
import { ref, onMounted } from "vue"
const visible = defineModel("visible", { required: true, default: false })
const emit = defineEmits(["confirmIcon"])

// 图标数据
const icons = ref<IconBO[]>([])
// 当前图标index
const currentIndex = ref(-1)

const getSvgs = async () => {
    // 使用 import.meta.glob 动态加载SVG文件
    const svgFiles = import.meta.glob("@/assets/svg/**/*.svg")
    const fileNames = Object.keys(svgFiles)
    const iconsData = await Promise.all(
        fileNames.map(async (key) => {
            return {
                path: key,
                code: key.replace(/(.*\/)*([^.]+).*/gi, "$2")
            }
        })
    )
    icons.value = iconsData
}

const selectIcon = (icon: IconBO, index: number) => {
    currentIndex.value = index
}

const handleConfirm = () => {
    emit("confirmIcon", icons.value[currentIndex.value])
    handleClose()
}

const handleClose = () => {
    visible.value = false
    currentIndex.value = -1
}

onMounted(() => {
    getSvgs()
})
</script>

<style lang="scss" scoped>
.svg-container {
    display: flex;
    flex-wrap: wrap;
    .svg-list {
        width: 105%;
        height: calc(100% - 100px);
        margin: 0 auto;
        overflow: auto;
        font-size: 0;

        .svg-item {
            position: relative;
            display: inline-block;
            width: 55px;
            height: 55px;
            margin: 11px;
            border: 1px solid #f1f1f1;
            text-align: center;
            vertical-align: center;
            cursor: pointer;

            &:hover {
                background-color: #eee;
            }

            .svg {
                display: inline-block;
                width: 36px;
                height: 36px;
                margin-top: 8px;
                overflow: hidden;
                font-size: 25px;
                color: #000;
            }

            .svg-title {
                margin-top: 10px;
                font-size: 14px;
            }
        }
    }
}
</style>

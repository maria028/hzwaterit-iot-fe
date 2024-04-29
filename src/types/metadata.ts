/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-24 10:24:16
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-29 12:29:59
 * @Description:产品物模型数据结构
 */

/**
 * @description: 产品物模型
 * @return {*}
 */
export interface MetadataBO {
    properties: PropertiesBO //属性
    functions: FunctionsBO //指令
    tags: Object //标签
}

/**
 * @description: 基本物模型结构
 * @return {*}
 */
export interface PropertiesBasicBO {
    id: string //属性标识   1.长度最大 30 个字符  2. 只能由小写字母、数字和下划线组成，且不能以数字开头
    name: string //属性名称 1. 长度最大 30 个字符
    valueType: ValueTypeBO
}

/**
 * @description: ValueType
 * string, int, long, float, double, bool, timestamp, enum, object, array  需要兼容boolean、text、date
 * @return {*}
 */
export interface ValueTypeBO {
    type: string //属性类型
    unit?: string //单位 type为 "int, long, float, double"
    scale?: number //精度 type为 "int, long, float, double",
    elements?: { value?: string; text?: string }[] // 枚举值  type为 "enum" "bool",
    elementType?: string //元素类型  为 array 必填
    format?: string // 格式化  type为 "timestamp",
    properties?: PropertiesBasicBO[] //对象  type为 object, array
    // 扩展信息  根结构会返回空，子结构不会返回
    expands?: {
        maxLength?: number // 最大长度 最大值: 50000
    }
}

/**
 * @description: 物模型属性  包含扩展字段等
 * @return {*}
 */
export interface PropertiesBO extends PropertiesBasicBO {
    expands: {
        source: string //来源 可选值 设备-device
        type?: string[] //读写类型     jetlinks  2.0新增
        readOnly?: string // 是否只读  jetlinks  1.0
        metrics?: string[]
    }
    description?: string //说明  1. 最大 200 个字符
    sortsIndex?: number //排序
}

/**
 * @description: 物模型属性初始化数据结构
 * @return {*}
 */
export const initPropertiesData: PropertiesBO = {
    id: "",
    name: "",
    expands: {
        source: ""
    },
    valueType: {
        type: ""
    }
}
/**
 * @description: 物模型指令
 * @return {*}
 */
export interface FunctionsBO {}

/**
 * @description: 物模型标签
 * @return {*}
 */
export interface TagsBO {}

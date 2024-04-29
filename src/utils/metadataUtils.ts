import { ValueTypeBO } from "@/types/metadata"

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-29 14:50:56
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-29 14:53:50
 * @Description:物模型相关工具方法
 */
export default class metadataUtils {
    /**
     * 数据类型下的valueType结构
     * @param type 数据类型
     */
    static valueTypeInitData(type: string): ValueTypeBO {
        let valueType = {}
        switch (type) {
            case "int":
            case "long":
                valueType = { type, expands: {}, unit: "" }
                break
            case "float":
            case "double":
                valueType = { type, expands: {}, unit: "", scale: 0 }
                break
            case "string":
                valueType = { type, expands: { maxLength: 0 } }
                break
            case "bool":
                valueType = {
                    type,
                    expands: {},
                    elements: []
                }
                break
            case "timestamp":
                valueType = {
                    type,
                    expands: {},
                    format: ""
                }
                break
            case "enum":
                valueType = { type, expands: {}, elements: [] }
                break
            case "array":
                valueType = { type, expands: {}, elementType: "", properties: [] }
                break
            case "object":
                valueType = { type, expands: {}, properties: [] }
                break
            default:
                break
        }
        return valueType
    }
}

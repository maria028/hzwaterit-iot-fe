/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-02 09:13:42
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 16:46:18
 * @Description:
 */
import request from "../index"
/**
 * @description: 获取字典
 * @param {any} params
 * @return {*}
 */
export const getDict = (params: any): any => {
    return request.get("/dict", params)
}

/**
 * @description: 字典详情
 * @param {string} id
 * @return {*}
 */
export const getDictById = (id: string | number): any => {
    return request.get("/dict/" + id)
}

/**
 * @description: 字典新增
 * @param {any} data
 * @return {*}
 */
export const addDict = (data: any): any => {
    return request.post("/dict", data)
}
/**
 * @description: 字典编辑
 * @param {any} data
 * @return {*}
 */
export const updateDict = (data: any): any => {
    return request.put("/dict", data)
}
/**
 * @description: 字典删除
 * @param {string} id
 * @return {*}
 */
export const deleteDictById = (id: string | number): any => {
    return request.delete("/dict/" + id)
}
/**
 * @description: 字典排序
 * @param {object} data
 * @return {*}
 */
export const setDictSort = (data: { id: string | number; moveTypeCode: any }): any => {
    return request.put("/dict-sort", data)
}

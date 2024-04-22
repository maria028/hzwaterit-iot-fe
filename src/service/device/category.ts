/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-22 10:41:23
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-22 10:43:37
 * @Description:产品分类接口
 */
import request from "../index"
/**
 * @description: 获取分类
 * @param {any} params
 * @return {*}
 */
export const getCategory = (params: any): any => {
    return request.get("/category", params)
}

/**
 * @description: 分类详情
 * @param {string} id
 * @return {*}
 */
export const getCategoryById = (id: string | number): any => {
    return request.get("/category/" + id)
}

/**
 * @description: 分类新增
 * @param {any} data
 * @return {*}
 */
export const addCategory = (data: any): any => {
    return request.post("/category", data)
}
/**
 * @description: 分类编辑
 * @param {any} data
 * @return {*}
 */
export const updateCategory = (data: any): any => {
    return request.put("/category", data)
}
/**
 * @description: 分类删除
 * @param {string} id
 * @return {*}
 */
export const deleteCategoryById = (id: string | number): any => {
    return request.delete("/category/" + id)
}

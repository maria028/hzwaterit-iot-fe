/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 18:13:14
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-22 10:42:03
 * @Description:
 */
import request from "../index"
/**
 * @description: 获取属性
 * @param {any} params
 * @return {*}
 */
export const getProperty = (params: any): any => {
    return request.get("/property", params)
}

/**
 * @description: 属性详情
 * @param {string} id
 * @return {*}
 */
export const getPropertyById = (id: string | number): any => {
    return request.get("/property/" + id)
}

/**
 * @description: 属性新增
 * @param {any} data
 * @return {*}
 */
export const addProperty = (data: any): any => {
    return request.post("/property", data)
}
/**
 * @description: 属性编辑
 * @param {any} data
 * @return {*}
 */
export const updateProperty = (data: any): any => {
    return request.put("/property", data)
}
/**
 * @description: 属性删除
 * @param {string} id
 * @return {*}
 */
export const deletePropertyById = (id: string | number): any => {
    return request.delete("/property/" + id)
}

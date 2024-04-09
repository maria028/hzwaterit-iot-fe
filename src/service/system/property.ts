/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 18:13:14
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:02:04
 * @Description:
 */
import request from "../index"
/**
 * @description: 获取资源
 * @param {any} params
 * @return {*}
 */
export const getProperty = (params: any): any => {
    return request.get("/property", params)
}

/**
 * @description: 资源详情
 * @param {string} id
 * @return {*}
 */
export const getPropertyById = (id: string | number): any => {
    return request.get("/property/" + id)
}

/**
 * @description: 资源新增
 * @param {any} data
 * @return {*}
 */
export const addProperty = (data: any): any => {
    return request.post("/property", data)
}
/**
 * @description: 资源编辑
 * @param {any} data
 * @return {*}
 */
export const updateProperty = (data: any): any => {
    return request.put("/property", data)
}
/**
 * @description: 资源删除
 * @param {string} id
 * @return {*}
 */
export const deletePropertyById = (id: string | number): any => {
    return request.delete("/property/" + id)
}

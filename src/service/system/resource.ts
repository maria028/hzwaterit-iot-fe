/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:40:33
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:02:40
 * @Description:
 */
import request from "../index"

/**
 * @description: 获取资源树
 * @return {*}
 */
export const getResourceTreeData = (): any => {
    return request.get("/resource-tree")
}

/**
 * @description: 获取资源
 * @param {any} params
 * @return {*}
 */
export const getResource = (params: any): any => {
    return request.get("/resource", params)
}

/**
 * @description: 资源详情
 * @param {string} id
 * @return {*}
 */
export const getResourceById = (id: string | number): any => {
    return request.get("/resource/" + id)
}

/**
 * @description:资源新增
 * @param {any} data
 * @return {*}
 */
export const addResource = (data: any): any => {
    return request.post("/resource", data)
}
/**
 * @description: 资源编辑
 * @param {any} data
 * @return {*}
 */
export const updateResource = (data: any): any => {
    return request.put("/resource", data)
}
/**
 * @description: 资源删除
 * @param {string} id
 * @return {*}
 */
export const deleteResourceById = (id: string | number): any => {
    return request.delete("/resource/" + id)
}
/**
 * @description: 资源排序
 * @param {object} data
 * @return {*}
 */
export const setResourceSort = (data: { id: string | number; moveTypeCode: any }): any => {
    return request.put("/resource-sort", data)
}
/**
 * @description: 修改状态
 * @param {object} data
 * @return {*}
 */
export const updateResourceStatus = (data: { id: string | number; statusCode: string | number }): any => {
    return request.put("/resource-status", data)
}

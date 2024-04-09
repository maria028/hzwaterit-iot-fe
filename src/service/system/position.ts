/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 10:10:52
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:00:14
 * @Description:
 */
import request from "../index"

/**
 * @description: 获取职位列表
 * @param {any} params
 * @return {*}
 */
export const getPosition = (params: any): any => {
    return request.get("/position", params)
}
/**
 * @description: 职位详情
 * @param {string} id
 * @return {*}
 */
export const getPositionById = (id: string | number): any => {
    return request.get("/position/" + id)
}
/**
 * @description: 职位新增
 * @param {any} data
 * @return {*}
 */
export const addPosition = (data: any): any => {
    return request.post("/position", data)
}
/**
 * @description: 职位编辑
 * @param {any} data
 * @return {*}
 */
export const updatePosition = (data: any): any => {
    return request.put("/position", data)
}
/**
 * @description: 职位删除
 * @param {string} id
 * @return {*}
 */
export const deletePositionById = (id: string | number): any => {
    return request.delete("/position/" + id)
}
/**
 * @description: 职位排序
 * @param {object} data
 * @return {*}
 */
export const setPositionSort = (data: { id: string | number; moveTypeCode: any }): any => {
    return request.put("/position-sort", data)
}

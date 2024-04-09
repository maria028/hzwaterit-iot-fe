/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 10:15:32
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:03:35
 * @Description:
 */
import request from "../index"
/**
 * @description: 获取角色列表
 * @param {any} params
 * @return {*}
 */
export const getRole = (params: any): any => {
    return request.get("/role", params)
}

/**
 * @description: 角色详情
 * @param {string} id
 * @return {*}
 */
export const getRoleById = (id: string | number): any => {
    return request.get("/role/" + id)
}
/**
 * @description: 角色新增
 * @param {any} data
 * @return {*}
 */
export const addRole = (data: any): any => {
    return request.post("/role", data)
}
/**
 * @description: 角色编辑
 * @param {any} data
 * @return {*}
 */
export const updateRole = (data: any): any => {
    return request.put("/role", data)
}
/**
 * @description: 角色删除
 * @param {string} id
 * @return {*}
 */
export const deleteRoleById = (id: string | number): any => {
    return request.delete("/role/" + id)
}
/**
 * @description: 角色排序
 * @param {object} data
 * @return {*}
 */
export const setRoleSort = (data: { id: string | number; moveTypeCode: any }): any => {
    return request.put("/role-sort", data)
}

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 10:21:26
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 16:45:19
 * @Description:
 */
import request from "../index"

/**
 * @description: 获取部门树
 * @return {*}
 */
export const getDepartmentTreeData = (): any => {
    return request.get("/department-tree")
}

/**
 * @description: 获取部门列表
 * @param {any} params
 * @return {*}
 */
export const getDepartment = (params: any): any => {
    return request.get("/department", params)
}

/**
 * @description: 部门详情
 * @param {string} id
 * @return {*}
 */
export const getDepartmentById = (id: string | number): any => {
    return request.get("/department/" + id)
}

/**
 * @description: 部门新增
 * @param {any} data
 * @return {*}
 */
export const addDepartment = (data: any): any => {
    return request.post("/department", data)
}
/**
 * @description: 部门编辑
 * @param {any} data
 * @return {*}
 */
export const updateDepartment = (data: any): any => {
    return request.put("/department", data)
}

/**
 * @description: 部门删除
 * @param {string} id
 * @return {*}
 */
export const deleteDepartmentById = (id: string | number): any => {
    return request.delete("/department/" + id)
}
/**
 * @description: 部门排序
 * @param {object} data
 * @return {*}
 */
export const setDepartmentSort = (data: { id: string | number; moveTypeCode: any }): any => {
    return request.put("/department-sort", data)
}

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 09:17:42
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 16:57:02
 * @Description:
 */
import request from "../index"

/**
 * @description: 获取员工
 * @param {any} params
 * @return {*}
 */
export const getEmployee = (params: any): any => {
    return request.get("/employee", params)
}

/**
 * @description: 员工详情
 * @param {string} id
 * @return {*}
 */
export const getEmployeeById = (id: string | number): any => {
    return request.get("/employee/" + id)
}

/**
 * @description: 员工新增
 * @param {any} data
 * @return {*}
 */
export const addEmployee = (data: any): any => {
    return request.post("/employee", data)
}
/**
 * @description: 员工编辑
 * @param {any} data
 * @return {*}
 */
export const updateEmployee = (data: any): any => {
    return request.put("/employee", data)
}

/**
 * @description: 修改帐号状态
 * @param {object} data
 * @return {*}
 */
export const updateEmployeeAccountStatus = (data: { id: string | number; accountStatusCode: string | number }): any => {
    return request.put("/employee-account-status", data)
}

/**
 * @description: 修改状态
 * @param {object} data
 * @return {*}
 */
export const updateEmployeeStatus = (data: { id: string | number; statusCode: string | number }): any => {
    return request.put("/employee-status", data)
}

/**
 * @description: 重置密码
 * @param {object} data
 * @return {*}
 */
export const resetEmployeePassword = (data: { id: string | number }): any => {
    return request.put("/employee-password", data)
}

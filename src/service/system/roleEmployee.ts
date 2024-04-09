/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 16:13:31
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:04:03
 * @Description:
 */
import request from "../index"

/**
 * @description: 获取角色-员工列表
 * @param {any} params
 * @return {*}
 */
export const getRoleEmployee = (params: any): any => {
    return request.get("/role-employee", params)
}

/**
 * @description: 批量关联角色-员工
 * @param {object} data
 * @return {*}
 */
export const bindRoleEmployee = (data: { roleId: number; employeeIds: any }): any => {
    return request.post("/role-employee", data)
}

/**
 * @description: 批量删除角色-员工
 * @param {any} data
 * @return {*}
 */
export const deleteRoleEmployee = (data: any): any => {
    return request.delete("/role-employee", data)
}

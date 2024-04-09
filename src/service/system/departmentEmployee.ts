/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 14:35:15
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 16:45:43
 * @Description:
 */
import request from "../index"
/**
 * @description: 获取部门-员工列表
 * @param {any} params
 * @return {*}
 */
export const getDepartmentEmployee = (params: any): any => {
    return request.get("/department-employee", params)
}

/**
 * @description: 批量关联部门-员工
 * @param {object} data
 * @return {*}
 */
export const bindDepartmentEmployee = (data: { departmentId: number; employeeIds: any }): any => {
    return request.post("/department-employee", data)
}

/**
 * @description: 批量删除部门-员工
 * @param {any} data
 * @return {*}
 */
export const deleteDepartmentEmployee = (data: any): any => {
    return request.delete("/department-employee", data)
}

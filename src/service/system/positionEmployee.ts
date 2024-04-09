/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 16:13:31
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:00:35
 * @Description:
 */
import request from "../index"

/**
 * @description: 获取职位-员工列表
 * @param {any} params
 * @return {*}
 */
export const getPositionEmployee = (params: any): any => {
    return request.get("/position-employee", params)
}

/**
 * @description: 批量关联职位-员工
 * @param {object} data
 * @return {*}
 */
export const bindPositionEmployee = (data: { positionId: number; employeeIds: any }): any => {
    return request.post("/position-employee", data)
}

/**
 * @description: 批量删除职位-员工
 * @param {any} data
 * @return {*}
 */
export const deletePositionEmployee = (data: any): any => {
    return request.delete("/position-employee", data)
}

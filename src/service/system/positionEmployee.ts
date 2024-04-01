/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 16:13:31
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 17:21:41
 * @Description:
 */
import request from "../index"

// 获取职位-员工列表
export const getPositionEmployee = (params: any) => {
    return request.get("/position-employee", params)
}

// 批量关联职位-员工
export const bindPositionEmployee = (data: { positionId: number; employeeIds: any }) => {
    return request.post("/position-employee", data)
}

// 批量删除职位-员工
export const deletePositionEmployee = (data: any) => {
    return request.delete("/position-employee", data)
}

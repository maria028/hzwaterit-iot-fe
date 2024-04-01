/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 16:13:31
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 16:15:21
 * @Description:
 */
import request from "../index"

// 获取角色-员工列表
export const getRoleEmployee = (params: any) => {
    return request.get("/role-employee", params)
}

// 批量关联角色-员工
export const bindRoleEmployee = (data: { roleId: number; employeeIds: any }) => {
    return request.post("/role-employee", data)
}

// 批量删除角色-员工
export const deleteRoleEmployee = (data: any) => {
    return request.delete("/role-employee", data)
}

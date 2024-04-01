/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 10:15:32
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 15:49:32
 * @Description:
 */
import request from "../index"

// 获取角色列表
export const getRole = (params: any) => {
    return request.get("/role", params)
}

// 角色详情
export const getRoleById = (id: string | number) => {
    return request.get("/role/" + id)
}
// 角色新增
export const addRole = (data: any) => {
    return request.post("/role", data)
}
// 角色编辑
export const updateRole = (data: any) => {
    return request.put("/role", data)
}
// 角色删除
export const deleteRoleById = (id: string | number) => {
    return request.delete("/role/" + id)
}
// 角色排序
export const setRoleSort = (data: { id: string | number; moveTypeCode: any }) => {
    return request.put("/role-sort", data)
}

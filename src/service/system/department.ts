/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 10:21:26
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 10:50:17
 * @Description:
 */
import request from "../index"

// 获取部门树
export const getDepartmentTreeData = () => {
    return request.get("/department-tree")
}

// 获取部门列表
export const getDepartment = (params: any) => {
    return request.get("/department", params)
}

// 部门详情
export const getDepartmentById = (id: string | number) => {
    return request.get("/department/" + id)
}

// 部门新增
export const addDepartment = (data: any) => {
    return request.post("/department", data)
}
// 部门编辑
export const updateDepartment = (data: any) => {
    return request.put("/department", data)
}

// 部门删除
export const deleteDepartmentById = (id: string | number) => {
    return request.delete("/department/" + id)
}
// 部门排序
export const setDepartmentSort = (data: { id: string | number; moveTypeCode: any }) => {
    return request.put("/department-sort", data)
}

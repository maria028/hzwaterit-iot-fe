/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:40:33
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 17:56:32
 * @Description:
 */
import request from "../index"

// 获取资源树
export const getResourceTreeData = () => {
    return request.get("/resource-tree")
}

// 获取资源
export const getResource = (params: any) => {
    return request.get("/resource", params)
}

// 资源
export const getResourceById = (id: string | number) => {
    return request.get("/resource/" + id)
}

// 资源新增
export const addResource = (data: any) => {
    return request.post("/resource", data)
}
// 资源编辑
export const updateResource = (data: any) => {
    return request.put("/resource", data)
}
// 资源删除
export const deleteResourceById = (id: string | number) => {
    return request.delete("/resource/" + id)
}
// 资源排序
export const setResourceSort = (data: { id: string | number; moveTypeCode: any }) => {
    return request.put("/resource-sort", data)
}
// 修改状态
export const updateResourceStatus = (data: { id: string | number; statusCode: string | number }) => {
    return request.put("/resource-status", data)
}

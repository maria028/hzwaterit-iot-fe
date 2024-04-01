/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 10:10:52
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 16:39:30
 * @Description:
 */
import request from "../index"

// 获取职位列表
export const getPosition = (params: any) => {
    return request.get("/position", params)
}
// 职位详情
export const getPositionById = (id: string | number) => {
    return request.get("/position/" + id)
}
// 职位新增
export const addPosition = (data: any) => {
    return request.post("/position", data)
}
// 职位编辑
export const updatePosition = (data: any) => {
    return request.put("/position", data)
}
// 职位删除
export const deletePositionById = (id: string | number) => {
    return request.delete("/position/" + id)
}
// 职位排序
export const setPositionSort = (data: { id: string | number; moveTypeCode: any }) => {
    return request.put("/position-sort", data)
}

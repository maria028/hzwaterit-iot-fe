/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-02 09:13:42
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-02 09:18:28
 * @Description:
 */
import request from "../index"
// 获取字典
export const getDict = (params: any) => {
    return request.get("/dict", params)
}

// 字典
export const getDictById = (id: string | number) => {
    return request.get("/dict/" + id)
}

// 字典新增
export const addDict = (data: any) => {
    return request.post("/dict", data)
}
// 字典编辑
export const updateDict = (data: any) => {
    return request.put("/dict", data)
}
// 字典删除
export const deleteDictById = (id: string | number) => {
    return request.delete("/dict/" + id)
}
//  字典排序
export const setDictSort = (data: { id: string | number; moveTypeCode: any }) => {
    return request.put("/dict-sort", data)
}

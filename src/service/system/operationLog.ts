/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-07 10:40:58
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-07 10:42:26
 * @Description:
 */
import request from "../index"
// 获取日志
export const getOperationLog = (params: any) => {
    return request.get("/operation-log", params)
}

// 删除日志
export const deleteOperationLog = (data: any) => {
    return request.delete("/operation-log", data)
}

// 清空日志
export const clearOperationLog = (data: any) => {
    return request.delete("/operation-log-empty", data)
}

// 日志详情
export const getOperationLogById = (id: number) => {
    return request.get("/operation-log/" + id)
}

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-07 10:40:58
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 16:59:45
 * @Description:
 */
import request from "../index"
/**
 * @description: 获取日志
 * @param {any} params
 * @return {*}
 */
export const getOperationLog = (params: any): any => {
    return request.get("/operation-log", params)
}

/**
 * @description: 删除日志
 * @param {any} data
 * @return {*}
 */
export const deleteOperationLog = (data: any): any => {
    return request.delete("/operation-log", data)
}

/**
 * @description: 清空日志
 * @param {any} data
 * @return {*}
 */
export const clearOperationLog = (data: any): any => {
    return request.delete("/operation-log-empty", data)
}

/**
 * @description: 日志详情
 * @param {number} id
 * @return {*}
 */
export const getOperationLogById = (id: number): any => {
    return request.get("/operation-log/" + id)
}

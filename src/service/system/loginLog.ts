/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-07 09:26:29
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 16:57:55
 * @Description:
 */
import request from "../index"
/**
 * @description: 获取日志
 * @param {any} params
 * @return {*}
 */
export const getLoginLog = (params: any): any => {
    return request.get("/login-log", params)
}

/**
 * @description: 删除日志
 * @param {any} data
 * @return {*}
 */
export const deleteLoginLog = (data: any): any => {
    return request.delete("/login-log", data)
}

/**
 * @description: 清空日志
 * @param {any} data
 * @return {*}
 */
export const clearLoginLog = (data: any): any => {
    return request.delete("/login-log-empty", data)
}

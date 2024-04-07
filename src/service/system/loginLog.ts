/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-07 09:26:29
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-07 09:33:03
 * @Description:
 */
import request from "../index"
// 获取日志
export const getLoginLog = (params: any) => {
    return request.get("/login-log", params)
}

// 删除日志
export const deleteLoginLog = (data: any) => {
    return request.delete("/login-log", data)
}

// 清空日志
export const clearLoginLog = (data: any) => {
    return request.delete("/login-log-empty", data)
}

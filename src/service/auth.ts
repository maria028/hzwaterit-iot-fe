/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 08:58:30
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 16:43:17
 * @Description:
 */
import request from "./index"

/**
 * @description: 登录
 * @param {object} data
 * @return {*}
 */
export const login = (data: { phoneNumber: string; password: string }): any => {
    return request.post("/login", data)
}

/**
 * @description: 退出登录
 * @return {*}
 */
export const logout = (): any => {
    return request.put("/logout")
}

/**
 * @description: 获取字典树
 * @return {*}
 */
export const dictTree = (): any => {
    return request.get("/dict-tree")
}

/**
 * @description: 获取个人信息
 * @return {*}
 */
export const getAccountProfile = (): any => {
    return request.get("/account-profile")
}

/**
 * @description: 修改信息
 * @param {object} data
 * @return {*}
 */
export const setAccount = (data: { name: string; phoneNumber: string; genderCode: string; email: string }): any => {
    return request.put("/account", data)
}

/**
 * @description: 修改密码
 * @param {object} data
 * @return {*}
 */
export const setAccountPassword = (data: { originalPassword: string; newPassword: string; confirmPassword: string }): any => {
    return request.put("/account-password", data)
}

/**
 * @description: 修改头像
 * @param {object} data
 * @return {*}
 */
export const setAccountAvatar = (data: { avatarImgUrl: string }): any => {
    return request.put("/account-avatar", data)
}

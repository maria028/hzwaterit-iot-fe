/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-17 10:50:47
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-17 10:50:57
 * @Description:
 */
import request from "../index"

/**
 * @description: 获取设备列表
 * @return {*}
 */
export const getDeviceInstance = (): any => {
    return request.get("/department-tree")
}

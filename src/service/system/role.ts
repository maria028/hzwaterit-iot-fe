/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 10:15:32
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 10:31:39
 * @Description:
 */
import request from "../index";

// 获取角色列表
export const getRole = (params: any) => {
    return request.get("/role", params);
};

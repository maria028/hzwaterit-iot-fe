/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 08:58:30
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-28 14:50:41
 * @Description:
 */
import request from "./index";

// 登录
export const login = (data: { phoneNumber: string; password: string }) => {
    return request.post("/login", data);
};

// 退出登录
export const logout = () => {
    return request.put("/logout");
};

// 字典
export const dictTree = () => {
    return request.get("/dict-tree");
};

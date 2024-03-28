/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 08:58:30
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-28 15:56:33
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

// 获取个人信息
export const getAccountProfile = () => {
    return request.get("/account-profile");
};

// 修改信息
export const setAccount = (data: { name: string; phoneNumber: string; genderCode: string; email: string }) => {
    return request.put("/account", data);
};

// 修改密码
export const setAccountPassword = (data: {
    originalPassword: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    return request.put("/account-password", data);
};

// 修改头像
export const setAccountAvatar = (data: { avatarImgUrl: string }) => {
    return request.put("/account-avatar", data);
};

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 09:17:42
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 11:04:21
 * @Description:
 */
import request from "../index";

// 获取员工
export const getEmployee = (params: any) => {
    return request.get("/employee", params);
};

// 员工详情
export const getEmployeeById = (id: string | number) => {
    return request.get("/employee/" + id);
};

// 员工新增
export const addEmployee = (data: any) => {
    return request.post("/employee", data);
};
// 员工编辑
export const updateEmployee = (data: any) => {
    return request.put("/employee", data);
};

// 修改帐号状态
export const updateEmployeeAccountStatus = (data: { id: string | number; accountStatusCode: string | number }) => {
    return request.put("/employee-account-status", data);
};

// 修改状态
export const updateEmployeeStatus = (data: { id: string | number; statusCode: string | number }) => {
    return request.put("/employee-status", data);
};

// 重置密码
export const resetEmployeePassword = (data: { id: string | number }) => {
    return request.put("/employee-password", data);
};

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 10:10:52
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 10:23:35
 * @Description:
 */
import request from "../index";

// 获取职位列表
export const getPosition = (params: any) => {
    return request.get("/position", params);
};

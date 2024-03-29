/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 10:21:26
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 10:21:41
 * @Description:
 */
import request from "../index";

// 获取部门树
export const getDepartmentTreeData = () => {
    return request.get("/department-tree");
};

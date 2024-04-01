/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-01 15:40:33
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 15:41:08
 * @Description:
 */
import request from "../index"

// 获取资源树
export const getResourceTreeData = () => {
    return request.get("/resource-tree")
}

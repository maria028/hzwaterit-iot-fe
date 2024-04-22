/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-22 10:41:23
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-22 11:17:42
 * @Description:产品接口
 */
import request from "../index"
/**
 * @description: 获取分类
 * @param {any} params
 * @return {*}
 */
export const getProduct = (params: any): any => {
    return request.get("/product", params)
}

/**
 * @description: 分类详情
 * @param {string} id
 * @return {*}
 */
export const getProductById = (id: string | number): any => {
    return request.get("/product/" + id)
}

/**
 * @description: 分类新增
 * @param {any} data
 * @return {*}
 */
export const addProduct = (data: any): any => {
    return request.post("/product", data)
}
/**
 * @description: 分类编辑
 * @param {any} data
 * @return {*}
 */
export const updateProduct = (data: any): any => {
    return request.put("/product", data)
}
/**
 * @description: 分类删除
 * @param {string} id
 * @return {*}
 */
export const deleteProductById = (id: string | number): any => {
    return request.delete("/product/" + id)
}

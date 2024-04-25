/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-22 10:37:17
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-24 10:25:15
 * @Description:设备相关数据结构
 */
/**
 * @description: 分类
 * @return {*}
 */
export interface CategoryBO {
    id: number //id
    name: string // 名称
    description: string //说明
    createGmt: string // 创建时间
    modifiedGmt: string // 修改时间
}

/**
 * @description: 分类
 * @return {*}
 */
export interface CategoryDTO {
    id?: number //id
    name: string //属性名
    description: string //说明
}

/**
 * @description: 产品
 * @return {*}
 */
export interface ProductBO {
    id: number //id
    name: string // 名称
    category: string //产品分类
    description: string //说明
    createGmt: string // 创建时间
    modifiedGmt: string // 修改时间
}

/**
 * @description: 产品
 * @return {*}
 */
export interface ProductDTO {
    id?: number //id
    name: string //属性名
    category: string //产品分类
    description: string //说明
}

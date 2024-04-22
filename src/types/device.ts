/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-22 10:37:17
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-22 10:39:57
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

export interface CategoryDTO {
    id?: number //id
    name: string //属性名
    description: string //说明
}

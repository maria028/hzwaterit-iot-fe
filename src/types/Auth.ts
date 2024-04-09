/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 10:13:35
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:18:08
 * @Description:
 */
/**
 * @description: 菜单格式
 * @return {*}
 */
export interface MenuBO {
    id: number
    name: string
    url: string
    icon: string
    children: MenuBO[]
}

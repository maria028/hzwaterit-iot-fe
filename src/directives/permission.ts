/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 09:24:00
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-19 09:30:12
 * @Description:
 */
import localStorageKeyConstant from "@/constant/localStorageKeyConstant"
import { Directive, DirectiveBinding, App } from "vue"

/**
 * @description: 检查是否具有权限
 * @param {string} value
 * @return {*}
 */
export const hasPermission = (value: string): any => {
    let result = false
    const authorizedResources: string[] = JSON.parse(localStorage.getItem(localStorageKeyConstant.AUTHORIZED_RESOURCES) as string)

    for (const authorizedResource of authorizedResources) {
        if (authorizedResource == value) {
            result = true
            break
        }
    }
    return result
}
/**
 * @description: 定义自定义权限指令
 * @return {*}
 */
const permissionDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        // 获取权限信息
        const { value } = binding
        // 检查是否具有权限
        if (hasPermission(value)) {
        } else {
            console.log(el)
            // 没有权限，移除dom
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}

// 在全局注册指令
export function registerGlobalPermissionDirective(app: App<Element>) {
    app.directive("permission", permissionDirective)
}

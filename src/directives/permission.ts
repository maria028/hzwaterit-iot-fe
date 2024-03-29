/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 09:24:00
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 09:39:04
 * @Description:
 */
import LocalStorageKeyConstant from "@/constant/LocalStorageKeyConstant";
import { Directive, DirectiveBinding, App } from "vue";

// 检查是否具有权限
const hasAuthority = (value: string) => {
    let result = false;
    const authorizedResources: string[] = JSON.parse(
        localStorage.getItem(LocalStorageKeyConstant.AUTHORIZED_RESOURCES) as string
    );

    for (const authorizedResource of authorizedResources) {
        if (authorizedResource == value) {
            result = true;
            break;
        }
    }
    return result;
};
// 定义自定义权限指令
const permissionDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        // 获取权限信息
        const { value } = binding;
        // 检查是否具有权限
        if (hasAuthority(value)) {
        } else {
            console.log(el);
            // 没有权限，移除dom
            el.parentNode && el.parentNode.removeChild(el);
        }
    }
};

// 在全局注册指令
export function registerGlobalPermissionDirective(app: App<Element>) {
    app.directive("permission", permissionDirective);
}

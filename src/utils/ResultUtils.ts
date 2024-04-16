/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 15:40:07
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-16 09:28:52
 * @Description:
 */
import { Result } from "@/types/common";
import Router from "@/router";
import { ElMessage } from "element-plus";

export default class resultUtils {
    /**
     * 获取 result.data
     * @param result result
     */
    static getData<T>(result: Result<T>): T {
        const code = result.code;
        if (code == 401) {
            Router.replace({
                path: "/login",
                query: {
                    redirect: Router.currentRoute.value.fullPath
                }
            });
        } else if (code == 200) {
            return result.data;
        } else {
            ElMessage.error(result.msg);
        }

        return result.data;
    }
}

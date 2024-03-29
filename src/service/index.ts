/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 08:49:57
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 10:59:29
 * @Description:
 */
import axios, { AxiosResponse } from "axios";
import Router from "@/router";
import LocalStorageKeyConstant from "@/constant/LocalStorageKeyConstant";
import { ElMessage } from "element-plus";

// 设置默认的请求超时时间
axios.defaults.timeout = 60000;

// 设置默认的请求基础URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL_API as string;

// 登录失效
function handerUnauthorized() {
    Router.replace({
        path: "/login",
        query: {
            redirect: Router.currentRoute.value.fullPath
        }
    });
    ElMessage.error("请重新登录！");
}
function handerAxiosError(error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === "ECONNABORTED" && errorMessage.indexOf("timeout") != -1) {
        return Promise.reject({
            code: 500,
            msg: "请求超时"
        });
    }

    return Promise.reject({
        code: errorCode,
        msg: errorMessage
    });
}

// 请求拦截器
axios.interceptors.request.use(
    (config) => {
        // 在这里可以对发送的请求做一些预处理，比如添加token等
        config.headers[import.meta.env.VITE_KEY_TOKEN] = localStorage.getItem(LocalStorageKeyConstant.TOKEN) || "";
        return config;
    },
    (error) => {
        // 请求错误处理
        return handerAxiosError(error);
    }
);

// 响应拦截器
axios.interceptors.response.use(
    (response) => {
        const statusCode = response.status;
        switch (statusCode) {
            case 200: {
                const result = response.data;
                const code = result.code;
                if (code == 401) {
                    handerUnauthorized();
                    return Promise.reject(result);
                } else if (code == 200) {
                    return Promise.resolve(result);
                } else {
                    ElMessage.error(result.msg);
                    return Promise.reject(result);
                }
            }
            case 401: {
                handerUnauthorized();
                return Promise.reject({
                    code: 401,
                    msg: "未认证"
                });
            }
            default: {
                return Promise.reject({
                    code: statusCode,
                    msg: response.statusText
                });
            }
        }
    },
    (error) => {
        // 响应错误处理
        return handerAxiosError(error);
    }
);

export default {
    get<T>(url: string, params?: T): Promise<AxiosResponse<T>> {
        return axios.get(url, { params });
    },
    post<T>(url: string, data?: T): Promise<AxiosResponse<T>> {
        return axios.post(url, data);
    },
    put<T>(url: string, data?: T): Promise<AxiosResponse<T>> {
        return axios.put(url, data);
    },
    delete(url: string): Promise<AxiosResponse> {
        return axios.delete(url);
    }
};

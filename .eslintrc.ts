/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-27 17:58:23
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-01 10:20:48
 * @Description:
 */
module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        "plugin:vue/essential",
        "eslint:recommended",
        "@vue/typescript/recommended",
        "@vue/prettier",
        "@vue/prettier/@typescript-eslint",
        "prettier"
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        indent: [
            "error",
            4,
            {
                SwitchCase: 1
            }
        ],
        "no-console": import.meta.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": import.meta.env.NODE_ENV === "production" ? "warn" : "off"
    }
};

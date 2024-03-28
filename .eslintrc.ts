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
        "@vue/prettier/@typescript-eslint"
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

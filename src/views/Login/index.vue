<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-27 17:58:23
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-28 15:00:58
 * @Description: 
-->
<template>
    <div class="login">
        <el-form :model="loginModel" :rules="rules" ref="loginForm" class="login-center">
            <el-form-item prop="phoneNumber">
                <el-input v-model="loginModel.phoneNumber" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginModel.password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="loginHandel(loginForm)" class="login-button" :loading="buttonLoading"
                    >登陆</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { FormInstance } from "element-plus";
import CommonRegexConstant from "@/constant/RegexConstant";
import LocalStorageKeyConstant from "@/constant/LocalStorageKeyConstant";
import { login } from "@/service/auth";
const router = useRouter();
const route = useRoute();

// 按钮是否加载中
const buttonLoading = ref(false);
// 请求参数
const loginModel = reactive({
    phoneNumber: "",
    password: ""
});
// 参数校验
const loginForm = ref<FormInstance>();
const rules = {
    phoneNumber: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        { pattern: CommonRegexConstant.PHONE_NUMBER, message: "手机号码格式错误", trigger: "blur" }
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }]
};
// 登陆
const loginHandel = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            login(loginModel).then((result: any) => {
                if (result) {
                    const authBo = result.data;
                    localStorage.setItem(LocalStorageKeyConstant.TOKEN, authBo.token);
                    localStorage.setItem(LocalStorageKeyConstant.MENU, JSON.stringify(authBo.menus));
                    localStorage.setItem(
                        LocalStorageKeyConstant.AUTHORIZED_RESOURCES,
                        JSON.stringify(authBo.authorizedResources)
                    );
                    localStorage.setItem(LocalStorageKeyConstant.ACCOUNT_NAME, authBo.name);
                    localStorage.setItem(LocalStorageKeyConstant.ACCOUNT_AVATAR_IMG_URL, authBo.avatarImgUrl);

                    buttonLoading.value = false;

                    router.replace({
                        path: (route.query.redirect as string) || "/"
                    });
                }
            });
        } else {
            console.log("error submit!", fields);
        }
    });
};
</script>

<style scoped lang="less">
.login {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    background: #ffffff;
}

.login-center {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    width: 240px;
    height: 200px;
    margin: auto;
}

.login-button {
    width: 240px;
}
</style>
@/constant/RegexConstant

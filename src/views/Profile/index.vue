<template>
    <el-card>
        <el-tabs v-model="activeName" :before-leave="beforLeaveTab">
            <el-tab-pane label="个人信息" name="profile">
                <el-form :model="profileModel" label-width="auto">
                    <el-form-item>
                        <el-upload
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :accept="upload.accept"
                            name="file"
                            :show-file-list="false"
                            :on-success="handleUploadSuccess"
                            :before-upload="handlerBeforeUpload"
                        >
                            <el-avatar :size="100" v-if="profileModel.avatarImgUrl" :src="profileModel.avatarImgUrl" />
                            <el-avatar :size="100" v-else>{{ profileModel.name.substr(0, 1) }}</el-avatar>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="姓名">{{ profileModel.name }}</el-form-item>
                    <el-form-item label="手机号码">{{ profileModel.phoneNumber }}</el-form-item>
                    <el-form-item label="性别">{{ profileModel.gender }}</el-form-item>
                    <el-form-item label="邮箱">{{ profileModel.email }}</el-form-item>
                    <el-form-item label="工号" v-if="profileModel.jobNumber">{{ profileModel.jobNumber }}</el-form-item>
                    <el-form-item label="部门" v-if="profileModel.departmentNames.length > 0">
                        <el-tag v-for="departmentName in profileModel.departmentNames" :key="departmentName">{{ departmentName }}</el-tag>
                    </el-form-item>
                    <el-form-item label="职位" v-if="profileModel.positionNames.length > 0">
                        <el-tag v-for="positionName in profileModel.positionNames" :key="positionName">{{ positionName }}</el-tag>
                    </el-form-item>
                    <el-form-item label="创建时间">{{ profileModel.createGmt }}</el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改信息" name="updateProfile">
                <el-form :model="profileModel" ref="profileForm" label-width="auto" :rules="profileFormRules">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="profileModel.name" placeholder="请输入姓名" maxlength="10" style="width: 240px" />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phoneNumber">
                        <el-input v-model="profileModel.phoneNumber" placeholder="请输入手机号码" maxlength="11" style="width: 240px" />
                    </el-form-item>
                    <el-form-item label="性别" prop="genderCode">
                        <el-radio-group v-model="profileModel.genderCode">
                            <el-radio v-for="genderDict in genderDicts" :value="genderDict.code" :label="genderDict.code">{{ genderDict.name }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="profileModel.email" placeholder="请输入邮箱" maxlength="30" style="width: 240px" />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="updateProfileCancel">取消</el-button>
                        <el-button type="primary" @click="updateProfileConfirm">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="updatePassword">
                <el-form :model="passwordModel" ref="passwordForm" label-width="auto" :rules="passwordFormRules">
                    <el-form-item label="原密码" prop="originalPassword">
                        <el-input v-model="passwordModel.originalPassword" placeholder="请输入原密码" show-password maxlength="16" style="width: 240px" />
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input v-model="passwordModel.newPassword" placeholder="请输入新密码 6-16 个字符" show-password maxlength="16" style="width: 240px" />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input v-model="passwordModel.confirmPassword" placeholder="请输入确认密码 6-16 个字符" show-password maxlength="16" style="width: 240px" />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="updatePasswordCancel">取消</el-button>
                        <el-button type="primary" @click="updatePasswordConfirm">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import DictCodeConstant from "@/constant/DictCodeConstant"
import DictUtils from "@/utils/DictUtils"
import { DictBO, Result, ProfileBO } from "@/types/Common"
import CommonRegexConstant from "@/constant/CommonRegexConstant"
import LocalStorageKeyConstant from "@/constant/LocalStorageKeyConstant"
import { getAccountProfile, setAccountAvatar, setAccount, logout, setAccountPassword } from "@/service/auth"
import { ElMessage } from "element-plus"
import ResultUtils from "@/utils/ResultUtils"

const router = useRouter()
const profileForm = ref()
const passwordForm = ref()

// 默认选中 tab
const activeName = ref("profile")
// 对话框标题
const dialogTitle = ref("")
// 对话框是否可见
const dialogVisible = ref(false)
// 性别字典
const genderDicts: DictBO[] = DictUtils.list(DictCodeConstant.GENDER)

// 个人信息
let profileModel = ref(<ProfileBO>{
    name: "",
    phoneNumber: "",
    avatarImgUrl: "",
    jobNumber: "",
    email: "",
    genderCode: "2",
    gender: "",
    departmentNames: [],
    positionNames: [],
    createGmt: ""
})
// 密码
const passwordModel = ref({
    originalPassword: "",
    newPassword: "",
    confirmPassword: ""
})
// 修改个人信息表单参数校验
const profileFormRules = {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    phoneNumber: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        { pattern: CommonRegexConstant.PHONE_NUMBER, message: "手机号码格式错误", trigger: "blur" }
    ],
    email: [{ pattern: CommonRegexConstant.EMAIL, message: "邮箱格式错误", trigger: "blur" }]
}
// 修改密码表单参数校验
const passwordFormRules = {
    originalPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
    newPassword: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
    ],
    confirmPassword: [
        { required: true, message: "请输入确认密码", trigger: "blur" },
        { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
    ]
}
// 上传参数
const upload = {
    action: import.meta.env.VITE_BASE_URL_API + "/upload",
    headers: {
        token: localStorage.getItem(LocalStorageKeyConstant.TOKEN) || ""
    },
    data: {
        prefix: "avatar"
    },
    accept: ".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
}

onMounted(() => {
    getAccount()
})

// 获取个人信息
const getAccount = () => {
    getAccountProfile().then((response: Result<ProfileBO>) => {
        const result = response as Result<ProfileBO>
        profileModel.value = result.data
        profileModel.value.genderCode = profileModel.value.genderCode + ""
    })
}
//  上传之前
const handlerBeforeUpload = (file: File) => {
    const fileType = file.type
    if (fileType != "image/jpeg" && fileType != "image/jpg" && fileType != "image/png") {
        ElMessage.error("文件格式错误. 支持 jpeg, jpg, png")
        return false
    }

    const fileSize = file.size
    if (fileSize / 1024 / 1024 > 2) {
        ElMessage.error("文件大小不能超过 2M")
    }
}
// 上传成功
const handleUploadSuccess = (result: Result<string>) => {
    const avatarImgUrl = ResultUtils.getData(result)
    if (avatarImgUrl) {
        profileModel.value.avatarImgUrl = avatarImgUrl
        setAccountAvatar({ avatarImgUrl: avatarImgUrl }).then(() => {
            ElMessage.success("操作成功")
        })
    }
}
// 修改信息 - 确定
const updateProfileConfirm = async () => {
    await profileForm.value.validate((valid: any, fields: any) => {
        if (valid) {
            setAccount({
                name: profileModel.value.name,
                phoneNumber: profileModel.value.phoneNumber,
                genderCode: profileModel.value.genderCode,
                email: profileModel.value.email
            }).then(() => {
                ElMessage.success("操作成功")
                updateProfileCancel()
            })
        }
    })
}
// 修改信息 - 取消
const updateProfileCancel = () => {
    profileForm.value.resetFields()
    activeName.value = "profile"
    getAccount()
}

//  修改密码 - 取消
const updatePasswordCancel = () => {
    passwordForm.value.resetFields()
    activeName.value = "profile"
    getAccount()
}
//  修改密码 - 确定
const updatePasswordConfirm = async () => {
    await passwordForm.value.validate((valid: any, fields: any) => {
        if (valid) {
            if (passwordModel.value.newPassword != passwordModel.value.confirmPassword) {
                ElMessage.error("新密码与确认密码不一致")
                return
            }
            setAccountPassword(passwordModel.value).then(() => {
                logout().then(() => {
                    ElMessage.success("操作成功" + ", 请重新登陆")
                    localStorage.removeItem(LocalStorageKeyConstant.TOKEN)
                    router.replace({
                        path: "/login"
                    })
                })
            })
        }
    })
}

//  *tab 切换
const beforLeaveTab = (activeName: any, oldActiveName: any) => {
    if (oldActiveName == "updateProfile") {
        updateProfileCancel()
    } else if (oldActiveName == "updatePassword") {
        updatePasswordCancel()
    }
}
</script>

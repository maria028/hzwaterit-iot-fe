/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 08:50:38
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-16 09:33:44
 * @Description:system
 */
/**
 * @description: 部门对象-表格数据
 * @return {*}
 */
export interface DepartmentBO {
    id: number //id
    name: string // 名称
    createGmt: string // 创建时间
    modifiedGmt: string // 修改时间
}

/**
 * @description:  部门对象-表单数据
 * @return {*}
 */
export interface DepartmentDTO {
    id?: number // id
    parentId?: number //parentId
    name: string //名称
}

/**
 * @description: 部门-员工关联对象 表格数据
 * @return {*}
 */
export interface DepartmentEmployeeBO {
    id: number // id
    departmentName: string // 部门名称
    employeeId: number // 员工 id
    employeeName: string // 员工姓名
    phoneNumber: string // 手机号码
}

/**
 * @description: 部门-员工关联对象 表单数据
 * @return {*}
 */
export interface DepartmentTreeBO {
    id: number // id
    name: string // 名称
    children: DepartmentTreeBO[] // 子集
}

/**
 * @description: 字典对象 表格数据
 * @return {*}
 */
export interface DictBO {
    id: number // id
    code: string // 编码
    name: string //名称
    createGmt: string //名称
    modifiedGmt: string //修改时间
}

/**
 * @description: 字典对象 表单数据
 * @return {*}
 */
export interface DictDTO {
    id: number // id
    parentCode: string // 父级编码
    code: string // 编码
    name: string // 名称
}

/**
 * @description: 员工对象 表格数据
 * @return {*}
 */
export interface EmployeeBO {
    id: number //id
    name: string //姓名
    phoneNumber: string //手机号码
    avatarImgUrl: string //头像
    accountStatusCode: string //帐号状态编码
    accountStatus: string //帐号状态
    statusCode: string //状态编码
    status: string //状态
    jobNumber: string //工号
    email: string //邮箱
    genderCode: string //性别编码
    gender: string //性别
    departmentIds: number[] //已勾选部门 ids
    departmentNames: string //部门名称, 英文逗号分开
    positionIds: number[] //已选择职位 ids
    positionNames: string //职位名称, 英文逗号分开
    roleId: number //已选择角色 id
    roleName: string //角色名称
    createGmt: string //创建时间
    modifiedGmt: string //修改时间
}

/**
 * @description: 员工对象 表单数据
 * @return {*}
 */
export interface EmployeeDTO {
    id?: number //id
    name: string //姓名
    phoneNumber: string //手机号码
    accountStatusCode: string //帐号状态编码
    statusCode: string //状态编码
    jobNumber?: string //工号
    email?: string //邮箱
    genderCode: string //性别编码
    departmentIds: number[] //已勾选部门 ids
    positionIds: number[] //已选择职位 ids
    roleId?: number //已选择角色 id
}

/**
 * @description: 登录日志对象 表格数据
 * @return {*}
 */
export interface LoginLogBO {
    id: number //id
    loginUserName: string //登陆人姓名
    loginUserPhoneNumber: string //登陆人手机号码
    ip: string //IP
    location: string //地理位置
    os: string //操作系统
    browser: string //浏览器
    status: string //状态
    errorMsg: string //错误信息
    createGmt: string //登陆时间
}

/**
 * @description: 操作日志对象 表格数据
 * @return {*}
 */
export interface OperationLogBO {
    id: number //id
    operatorName: string //操作人姓名
    operatorPhoneNumber: string //操作人手机号码
    module: string //操作模块
    type: string //操作类型
    ip: string //ip
    location: string //地理位置
    os: string //操作系统
    browser: string //浏览器
    status: string //状态
    errorMsg: string //错误信息
    requestMethod: string //请求方式
    requestUrl: string //请求地址
    requestContentType: string //请求 content-type
    requestUserAgent: string //请求 user-agent
    requestParam: string //请求参数
    responseResult: string //响应结果
    waitTime: number //耗时 (毫秒)
    createGmt: string //操作时间
}
/**
 * @description: 职位对象 表格数据
 * @return {*}
 */
export interface PositionBO {
    id: number //id
    name: string //名称
    createGmt: string //创建时间
    modifiedGmt: string //修改时间
}

/**
 * @description: 职位对象 表单数据
 * @return {*}
 */
export interface PositionDTO {
    id: number //id
    name: string //名称
}

/**
 * @description: 职位-员工关联对象 表格数据
 * @return {*}
 */
export interface PositionEmployeeBO {
    id: number //id
    positionName: string //职位名称
    employeeId: number //员工 id
    employeeName: string //员工姓名
    phoneNumber: string //手机号码
}
/**
 * @description:  职位-员工关联对象 表格数据
 * @return {*}
 */
export interface PropertyBO {
    id: number //id
    name: string //属性名
    value: string //属性值
    description: string //说明
    createGmt: string //创建时间
    modifiedGmt: string //修改时间
}
/**
 * @description: 属性对象 表格数据
 * @return {*}
 */
export interface PropertyDTO {
    id: number //id
    name: string //属性名
    value: string //属性值
    description: string //说明
}

/**
 * @description: 资源对象 表格数据
 * @return {*}
 */
export interface ResourceBO {
    id: number //id
    name: string //名称
    type: string //类型
    requestMethod: string //请求方式
    url: string //地址
    statusCode: string //状态编码
    status: string //状态
    icon: string //图标地址
    createGmt: string //创建时间
    modifiedGmt: string //修改时间
}

/**
 * @description: 资源对象 表单数据
 * @return {*}
 */
export interface ResourceDTO {
    id: number //id
    parentId: number //parentId
    name: string //名称
    typeCode: string //类型编码
    requestMethod: string //请求方式
    url: string //地址
    statusCode: string //状态编码
    icon: string //图标地址
}
/**
 * @description: 资源数对象 表格数据
 * @return {*}
 */
export interface ResourceTreeBO {
    id: number //id
    name: string //名称
    children: ResourceTreeBO[] //子集数据
}

/**
 * @description: 角色对象 表格数据
 * @return {*}
 */
export interface RoleBO {
    id: number //id
    code: number //编码
    name: number //名称
    resourceIds?: number[] //已勾选资源 ids
    createGmt: string //创建时间
    modifiedGmt: string //修改时间
}

/**
 * @description: 角色对象 表单数据
 * @return {*}
 */
export interface RoleDTO {
    id: number //id
    code: string //编码
    name: string //名称
    resourceIds: number[] //资源 id 数组
}

/**
 * @description: 角色-员工关联对象 表格数据
 * @return {*}
 */
export interface RoleEmployeeBO {
    id: number //id
    roleName: string //角色名称
    employeeId: number //员工 id
    employeeName: string //员工姓名
    phoneNumber: string //手机号码
}

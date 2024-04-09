/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 16:51:18
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-09 17:23:41
 * @Description:
 */
/**
 * @description: 返回格式
 * @return {*}
 */
export interface Result<T> {
    code: number // 状态码
    msg: string // 消息
    pageNum: number // 当前页码. 仅在分页查询时返回
    pageSize: number // 每页大小. 仅在分页查询时返回
    pages: number // 总页数. 仅在分页查询时返回
    rows: number // 总行数. 仅在分页查询时返回
    data: T // 数据
}

/**
 * @description: 个人信息
 * @return {*}
 */
export interface ProfileBO {
    name: string // 姓名
    phoneNumber: string // 手机号码
    avatarImgUrl: string // 头像
    jobNumber: string // 工号
    email: string // 邮箱
    genderCode: string // 性别编码
    gender: string // 性别
    departmentNames: string[] // 部门名称
    positionNames: string[] // 职位名称
    createGmt: string // 创建时间
}

/**
 * @description: 字典树
 * @return {*}
 */
export interface DictBO {
    code: string //  编码
    name: string //  名称
    children: DictBO[] //  子集
}

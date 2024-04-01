/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 09:06:48
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 17:47:26
 * @Description: 正则常量
 */
export default class CommonRegexConstant {
    // 手机号码
    public static readonly PHONE_NUMBER = "^1[3456789]\\d{9}$";
    //邮箱
    public static readonly EMAIL = "^([a-zA-Z0-9\\_\\-\\.]+)\\@([a-zA-Z0-9\\_\\-\\.]+)\\.([a-zA-Z]{2,5})$";
}

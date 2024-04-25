/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-25 11:34:35
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-25 17:07:00
 * @Description:产品物模型 常量
 */
export default class metadataConstant {
    /**
     * @description: 数据类型 枚举值
     * （string, int, long, float, double, bool, timestamp, enum, object, array）
     * @return {*}
     */
    public static readonly VALUE_TYPES = [
        {
            value: "int",
            label: "int(整数型)"
        },
        {
            value: "long",
            label: "long(长整数型)"
        },
        {
            value: "float",
            label: "float(单精度浮点型)"
        },
        {
            value: "double",
            label: "double(双精度浮点数)"
        },
        {
            value: "string",
            label: "string(字符串)"
        },
        {
            value: "boolean",
            label: "boolean(布尔型)"
        },
        {
            value: "timestamp",
            label: "timestamp(时间戳)"
        },
        {
            value: "enum",
            label: "enum(枚举)"
        },
        {
            value: "array",
            label: "array(数组)"
        },
        {
            value: "object",
            label: "object(结构体)"
        }
        // {
        //     value: "file",
        //     label: "file(文件)"
        // },
        // {
        //     value: "password",
        //     label: "password(密码)"
        // },
        // {
        //     value: "geoPoint",
        //     label: "geoPoint(地理位置)"
        // }
    ]
}

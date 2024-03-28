/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 11:06:29
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-28 11:07:29
 * @Description:
 */
export default interface Dict {
    /**
     * 编码
     */
    code: string;

    /**
     * 名称
     */
    name: string;

    /**
     * 子集
     */
    children: Dict[];
}

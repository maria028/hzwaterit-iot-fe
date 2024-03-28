/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 10:16:09
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-28 10:16:10
 * @Description: 
 */
export default interface Result<T> {
    /**
     * 状态码
     */
    code: number;

    /**
     * 消息
     */
    msg: string;

    /**
     * 当前页码. 仅在分页查询时返回
     */
    pageNum: number;

    /**
     * 每页大小. 仅在分页查询时返回
     */
    pageSize: number;

    /**
     * 总页数. 仅在分页查询时返回
     */
    pages: number;

    /**
     * 总行数. 仅在分页查询时返回
     */
    rows: number;

    /**
     * 数据
     */
    data: T;
}

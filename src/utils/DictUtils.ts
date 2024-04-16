/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 15:12:47
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-04-16 09:27:21
 * @Description:
 */

import localStorageKeyConstant from "@/constant/localStorageKeyConstant";
import { DictBO } from "@/types/common";

export default class dictUtils {
    /**
     * 获取子集
     * @param parentCode 父级编码
     */
    static list(parentCode: string): DictBO[] {
        let children: DictBO[] = [];
        const dicts: DictBO[] = JSON.parse(localStorage.getItem(localStorageKeyConstant.DICT) as string);
        for (const dict of dicts) {
            if (dict.code == parentCode) {
                children = dict.children;

                break;
            }
        }

        return children;
    }
}

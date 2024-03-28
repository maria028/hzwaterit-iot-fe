/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 15:12:47
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-28 16:53:29
 * @Description:
 */

import LocalStorageKeyConstant from "@/constant/LocalStorageKeyConstant";
import { DictBO } from "@/types/Common";

export default class DictUtils {
    /**
     * 获取子集
     * @param parentCode 父级编码
     */
    static list(parentCode: string): DictBO[] {
        let children: DictBO[] = [];
        const dicts: DictBO[] = JSON.parse(localStorage.getItem(LocalStorageKeyConstant.DICT) as string);
        for (const dict of dicts) {
            if (dict.code == parentCode) {
                children = dict.children;

                break;
            }
        }

        return children;
    }
}

/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-28 10:13:35
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-28 10:14:12
 * @Description:
 */
export interface MenuBO {
    id: number;
    name: string;
    url: string;
    icon: string;
    children: MenuBO[];
}

export interface AuthBO {
    token: string;
    name: string;
    avatarImgUrl: string;
    menus: MenuBO[];
    authorizedResources: string[];
}

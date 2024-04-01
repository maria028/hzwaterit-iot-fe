import request from "../index"
// 获取资源
export const getProperty = (params: any) => {
    return request.get("/property", params)
}

// 资源
export const getPropertyById = (id: string | number) => {
    return request.get("/property/" + id)
}

// 资源新增
export const addProperty = (data: any) => {
    return request.post("/property", data)
}
// 资源编辑
export const updateProperty = (data: any) => {
    return request.put("/property", data)
}
// 资源删除
export const deletePropertyById = (id: string | number) => {
    return request.delete("/property/" + id)
}

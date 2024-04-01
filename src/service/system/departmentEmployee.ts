import request from "../index"

// 获取部门-员工列表
export const getDepartmentEmployee = (params: any) => {
    return request.get("/department-employee", params)
}

// 批量关联部门-员工
export const bindDepartmentEmployee = (data: { departmentId: number; employeeIds: any }) => {
    return request.post("/department-employee", data)
}

// 批量删除部门-员工
export const deleteDepartmentEmployee = (data: any) => {
    return request.delete("/department-employee", data)
}

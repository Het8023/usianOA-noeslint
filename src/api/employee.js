import service from "@/utils/request";

/**
 * 获取-员工列表
 * @param {*} params
 * @returns
 */
export function getEmployeListApi(params) {
  return service({
    url: "/sys/user",
    method: "GET",
    params,
  });
}

// 导出文件
export function exportEmployeeApi() {
  return service({
    url: "/sys/user/export",
    method: "GET",
    responseType: "blob",
  });
}

// 下载导入模板
export function getExportTemplateApi() {
  return service({
    url: "/sys/user/import/template",
    method: "GET",
    responseType: "blob",
  });
}

// 员工上传
export function uploadEmployeeApi(data) {
  return service({
    url: "/sys/user/import",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}

// 删除员工
export function deleteEmployeeApi(id) {
  return service({
    url: `/sys/user/${id}`,
    method: "DELETE",
  });
}

//获取员工基本信息
export function getEmployeeDetailApi(id) {
  return service({
    url: `/sys/user/${id}`,
    method: "GET",
  });
}

// 编辑员工信息
export function updateEmployeeDetailApi(id, data) {
  return service({
    url: `/sys/user/${id}`,
    method: "PUT",
    data,
  });
}

// 新增员工
export function addEmployeeApi(data) {
  return service({
    url: "/sys/user",
    method: "POST",
    data,
  });
}

// 分配员工角色
export function assignRoleApi(data) {
  return service({
    url: "/sys/user/assignRoles",
    method: "PUT",
    data,
  });
}

import service from "@/utils/request";

// 获取部门列表
export function getDepartmentApi() {
  return service({
    url: "/company/department",
    method: "GET",
  });
}

// 获取部门负责人列表
export function getManagerListApi() {
  return service({
    url: "/sys/user/simple",
    method: "GET",
  });
}

// 新增部门
export function addDepartmentApi(data) {
  return service({
    url: "/company/department",
    method: "POST",
    data,
  });
}

// 删除部门
export function deleteDepartmentApi(id) {
  return service({
    url: `/company/department/${id}`,
    method: "DELETE",
  });
}

// 获取部门详情
export function getDepartmentDetailApi(id) {
  return service({
    url: `/company/department/${id}`,
    method: "GET",
  });
}

// 修改部门
export function updateDepartmentApi(id, data) {
  return service({
    url: `/company/department/${id}`,
    method: "PUT",
    data,
  });
}

// 删除部门
export function removeDepartmentApi(id) {
  return service({
    url: `/company/department/${id}`,
    method: "DELETE",
  });
}

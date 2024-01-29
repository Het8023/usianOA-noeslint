import service from "@/utils/request";

// 获取用户列表
export function getRoleListApi(params) {
  return service({
    url: "/sys/role",
    method: "GET",
    params,
  });
}

// 添加用户
export function addRoleApi(data) {
  return service({
    url: "/sys/role",
    method: "POST",
    data,
  });
}

// 修改用户信息
export function updateRoleInfoApi(id, data) {
  return service({
    url: `/sys/role/${id}`,
    method: "PUT",
    data,
  });
}

// 删除用户
export function removeRoleApi(id) {
  return service({
    url: `/sys/role/${id}`,
    method: "DELETE",
  });
}

// 获取-已启用的角色列表
export function getEnableRoleListApi() {
  return service({
    url: "/sys/role/list/enabled",
    method: "GET",
  });
}

// 获取角色详情
export function getRoleDetailApi(id) {
  return service({
    url: `/sys/role/${id}`,
    method: "GET",
  });
}

// 分配权限
export function assignPremissionApi(data) {
  return service({
    url: "/sys/role/assignPrem",
    method: "PUT",
    data,
  });
}

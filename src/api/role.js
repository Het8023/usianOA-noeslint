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

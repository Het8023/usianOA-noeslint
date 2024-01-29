import service from "@/utils/request";

// 获取权限列表
export function getPermissionListApi() {
  return service({
    url: "/sys/permission",
    method: "GET",
  });
}

// 新增权限
export function addPermissionListApi(data) {
  return service({
    url: "/sys/permission",
    method: "POST",
    data,
  });
}

// 删除权限
export function removePermissionListApi(id) {
  return service({
    url: `/sys/permission/${id}`,
    method: "DELETE",
  });
}

// 权限详情
export function getPermissionListDetailApi(id) {
  return service({
    url: `/sys/permission/${id}`,
    method: "GET",
  });
}

// 编辑权限
export function editPermissionListApi(id, data) {
  return service({
    url: `/sys/permission/${id}`,
    method: "PUT",
    data,
  });
}

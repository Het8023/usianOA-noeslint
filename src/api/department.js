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

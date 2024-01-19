import service from "@/utils/request";

export function loginApi(data) {
  return service({
    url: "/sys/login",
    method: "POST",
    data,
  });
}

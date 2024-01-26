import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import router from "@/router";

// axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 注入token
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.data instanceof Blob) return response.data;
    const { success, message, data } = response.data;
    if (success) {
      return data;
    } else {
      Message({ type: "error", message: message });
      return Promise.reject(new Error(message));
    }
  },
  async (error) => {
    if (error.response.status == 401) {
      Message({
        type: "warning",
        message: "token超时了",
      });
      await store.dispatch("user/logout");
      router.push("/login");

      return Promise.reject(error);
    }

    Message({ type: "error", message: error.message || "请求失败" });
    return Promise.reject(error);
  }
);

export default service;

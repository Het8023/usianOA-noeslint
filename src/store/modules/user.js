import { getToken, setToken, removeToken } from "@/utils/auth";
import { loginApi } from "@/api/user";

const state = {
  token: getToken(),
};

const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token;
    setToken(token);
  },
  // 删除token
  removeToken(state) {
    state.token = null;
    removeToken();
  },
};

const actions = {
  // 登录方法
  async login(context, payload) {
    delete payload.isAred;
    const token = await loginApi(payload);
    context.commit("setToken", token);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

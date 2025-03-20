import { createStore } from "vuex";

export default createStore({
  state: {
    counter: 1,
    loginInfo: null,
  },
  getters: {
    getCounter(state) {
      return state.counter;
    },
  },
  mutations: {
    increment(state) {
      state.counter++;
    },
    setLoginInfo(state, payload) {
      state.loginInfo = payload;
    },
    getLoginInfo() {
      return this.state.loginInfo;
    },
    setLogout(state) {
      state.loginInfo = null;
    },
  },
  actions: {},
  modules: {},
});

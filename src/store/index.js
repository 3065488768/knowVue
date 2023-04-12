import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:"",
    isLogin:false,
    url:"http://192.168.22.145:8080/api"
  },
  getters: {

  },
  mutations: {
    changeLogin(state,token,isLogin){
      state.token = token;
      state.isLogin = isLogin;
      localStorage.setItem('token',token);
      localStorage.setItem("isLogin",isLogin)
    },
    getUrl(){
      return state.url
    }
  },
  actions: {
  },
  modules: {
  }
})

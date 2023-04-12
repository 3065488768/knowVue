import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// UI
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/iconfont.css'

import axios from 'axios'
import $ from 'jquery'
import Api from './api/index'
// 废弃，未使用，处理字符的传输问题
import qs from 'qs'
import MetaInfo from 'vue-meta-info'

//引入vue懒加载
// import VueLazyload from 'vue-lazyload'

// tools
// lib-flexible插件，将页面px转换为rem
// import "lib-flexible"

// axios.defaults.baseURL = 'api';
axios.defaults.baseURL = 'http://192.168.214.144:8080/api'
// Vue.prototype.$axios = axios;

Vue.prototype.$ = $;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
axios.defaults.baseURL = "/api";
Vue.config.productionTip = false;
Vue.prototype.$api = Api;
Vue.use(elementUI)
// Vue.use(VueLazyload)
Vue.use(MetaInfo)

//路由跳转后，页面回到顶部
router.afterEach(() => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import axios from 'axios'
import { Message } from 'view-design'; // 引入iview的消息提示组件，用于提示接口的报错等
import store from '../store/index'; // 引入vuex-store
// 创建axios实例
axios.defaults.withCredentials = true;
const httpService = axios.create({
    baseURL: "http://localhost:8080/api/", // 需自定义 // url前缀-'http:xxx.xxx'
    timeout: 900000, // 需自定义 请求超时时间   十五分钟
    withCredentials: false, // `withCredentials` 表示跨域请求时是否需要使用凭证
});

// request拦截器
httpService.interceptors.request.use(
    config => {
        if (store.state.token) {
            console.log(store.state.token);
            config.headers['token'] = localStorage.getItem("token") // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config;
    },
    error => {
        // 请求错误处理
        return Promise.reject(error);
    }
)

// respone拦截器
httpService.interceptors.response.use(
    response => {
        let msg = ""
        if (response.status == 200) {
            switch (response.data.code) {
                case 1000:
                    msg = response.data.msg
                    // Message['success']({
                    //     background: true,
                    //     content: msg,
                    //     duration: 3
                    // })
                    break;
                default:
                    msg = response.data.msg
                    Message['error']({
                        background: true,
                        content: msg,
                        duration: 10,
                        closable: true
                    })

            }
            // 统一处理状态
            return Promise.resolve(response.data.data)
        } else {
            return Promise.reject(response)
        }
    },
    // 处理处理
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求';
                    break;
                case 401:
                    error.message = '未授权，请重新登录';
                    break;
                case 403:
                    error.message = '拒绝访问';
                    break;
                case 404:
                    error.message = '请求错误,未找到该资源';
                    break;
                case 500:
                    error.message = '服务器端出错';
                    break;
                default:
                    error.message = `未知错误${error.response.status}`;
            }
            Message['error']({
                background: true,
                content: error.message,
                duration: 10,
                closable: true
            })
        } else {
            error.message = "连接到服务器失败";
            Message['error']({
                background: true,
                content: error.message,
                duration: 10,
                closable: true
            })
        }
        return Promise.reject(error);
    }
)

/*网络请求部分*/

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'get',
            params: params
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}


/*
 *  delete请求
 *  url:请求地址
 *  params:参数
 * */
export function del(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService.delete(url, {
            params: params
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

/*
 *  delete请求体
 *  url:请求地址
 *  params:参数
 * */
export function delc(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService.delete(url, {
            data: params
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

/*
 *  post请求
 *  url:请求地址
 *  params:参数
 * */
export function post(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService.post(url, params)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            })
        // httpService({
        //     url: url,
        //     method: 'post',
        //     data: params
        // }).then(response => {
        //     resolve(response);
        // }).catch(error => {
        //     reject(error);
        // });
    });
}

/*
 *  put请求
 *  url:请求地址
 *  params:参数
 * */
export function put(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService.put(url, params)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            })
    });
}

/*
 *  文件上传
 *  url:请求地址
 *  params:参数
 * */
export function upload(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'post',
            data: params,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

export default {
    get,
    del,
    delc,
    post,
    put,
    upload
}
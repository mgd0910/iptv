import qs from 'qs'
import axios from 'axios'

// import store from '@/store/index';
//切换环境
// if (process.env.NODE_ENV == 'development') {
//     axios.defaults.baseURL = 'https://www.baidu.com'
// } else if (process.env.NODE_ENV == 'debug') {
//     axios.defaults.baseURL = 'https://www/ceshi.com'
// } else if (process.env.NODE_ENV == 'production') {
//     axios.defaults.baseURL = 'https://www.production.com'
// }
//设置请求超时
//通过axios.defauits.timeout设置默认的请求超时时间，例如超过了10s，就会告知用户当前请求超时，请刷新等。
// axios.defaults.timeout = 10000
//post请求头的设置
//post请求的时候，我们需要加上一个请求头，所以可以在这里进行一个默认的设置，即设置Post请求头为application/x-www-form-urlencoded;charset=UTF-8
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
//请求拦截
// 我们在发送请求前可以进行一个请求的拦截，为什么要拦截呢，我们拦截请求是用来做什么的呢？比如，有些请求是需要用户登录之后才能访问的，或者post请求的时候，我们需要序列化我们提交的数据。这时候，我们可以在请求被发送之前进行一个拦截，从而进行我们想要的操作。
//请求拦截器
axios.interceptors.request.use(config => {

    // 每次发送请求之前判断是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = store.state.token;
    // token && (config.headers.Authorization = token)
    return config
}, (error => {
    return Promise.error(error)
})

)
//响应拦截器
axios.interceptors.response.use(response => {
    //如果返回状态为200，说明接口请求成功，可以正常拿到数据
    //否则的话抛出错误
    if (response.status == 200) {

        return Promise.resolve(response)
    } else {
        return Promise.reject(response)
    }
},
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.status) {
            switch (error.status) {
                //401未登录
                //未登录则跳转登录页面，并携带当前页面的路径
                //在登录成功之后返回当前页面，这一步需要在登录页操作
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullpath
                        }
                    });
                    break;
                //403 token过期
                //登录过期对用户进行提示
                //清除本地token和清空vuex中token对象
                //跳转登录页面
                case 403:
                    Toast({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    })
                    //清除token
                    localStorage.removeItem('token')
                    store.commit('loginSuccess', null)
                    //跳转登录页面，并将要浏览器的页面fullPath传过去，登录成功后跳转需要访问的页面
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullpath

                        }
                    });
                    break;
                //页面不存在
                case 404:
                    Toast({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                //其他错误
                default:
                    Toast({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });

            }
            return Promise.reject(error.response)
        }
    })
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url).then(function (res) {
            resolve(res)
        }).catch(function (err) {
            reject(err)
        })
    })
}
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(params)).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err.data)
        })
    })
}
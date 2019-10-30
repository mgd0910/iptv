// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router.js'
import store from './store'
import './assets/resert.css'
import VueCookies from 'vue-cookies'
import axios from 'axios'
import qs from 'qs';
import VueEpg from 'vue-epg'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import gloab from './views/component/gloab'
import toast from '../src/utils/Toast'
Vue.use(ElementUI)
Vue.use(VueCookies)
Vue.use(toast)
Vue.prototype.GLOBAL = gloab
// Vue.prototype.$cookie = VueCookies;
Vue.config.productionTip = false
const epg = new VueEpg({
    focus_class: 'focus',
    group_name: '.group',
    actions: ['number'], //自定义的方法，在 组件中需指定，名称对应大写的 KeyActions 的Key 如 number 对应  NUMBER
    setKeyBoardEventListener: service => {
        //这里设置各事件监听
        //方向 上下左右必须监听  可绑定多个值 
        document.addEventListener("keydown", event => {
            const keyCode = event.keyCode ? event.keyCode : event.charCode ? event.charCode : event.which;
            service.keyActions.UP.push(...[19, 38]) //数组中的值响应 按下上键的事件
            service.keyActions.DOWN.push(...[20, 47, 40])
            service.keyActions.LEFT.push(...[29, 21, 37])
            service.keyActions.RIGHT.push(...[22, 32, 39])
            service.keyActions.ENTER.push(...[73, 66, 23]) //类似Click 点击
            service.keyActions.BACK.push(...[4, 27, 8])
            service.keyActions.NUMBER = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105] //绑定为数字键
            service.eventHandler(keyCode) //注册响应
        })
    }
})
Vue.use(epg)

// ztebw.defaultalinkBgColor=none
// ztebw.defaultFocusColor=none
// ztebw.focusWidth=0

// export default {
// 	components: VueWeui
// };
// axios.defaults.timeout = 10000
// // http请求拦截器
// var loadinginstace
// axios.interceptors.request.use(config => {
// 	// element ui Loading方法
// 	loadinginstace = Indicator.open({
// 		text: 'Loading...',
// 		spinnerType: 'snake'
// 	});

// 	return config
// }, error => {
// 	MessageBox({
// 		title: '提示',
// 		message: '加载超时',
// 		callback: action => {
// 			Indicator.close();
// 		}
// 	})
// 	return Promise.reject(error)
// })
// // http响应拦截器
// axios.interceptors.response.use(data => { // 响应成功关闭loading
// 	Indicator.close()
// 	return data
// }, error => {
// 	MessageBox({
// 		title: '提示',
// 		message: '请求失败',
// 		callback: action => {
// 			Indicator.close();
// 		}
// 	})
// 	return Promise.reject(error)
// })
/* eslint-disable no-new */

new Vue({
    el: '#app',
    router,
    store,
    components: {
        App

    },
    template: '<App/>'
})
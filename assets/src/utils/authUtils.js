import VueCookies from 'vue-cookies'
const KEY_AUTHTOKEN = 'KEY_AUTH_UTILS_TOKEN' //jwt的token
const KEY_AUTHUSERINFO = 'KEY_AUTH_UTILS_USERINFO'//用户信息
const KEY_AUTHTOKEN_TTL = 3600 // jwt的token 有效期，过期作废，一个小时
const KEY_PUSHDOCUMENT = 'KEY_PUSHDOCUMENT'//跳转点击的节点
const KEY_NAVCURRENT = 'KEY_NAVCURRENT'//记录导航焦点
const KEY_KESHICURRENT = "KEY_KESHICURRENT"
const KEY_HISTORYPATH = 'KEY_HISTORYPATH'//记录路径

//身份凭证操作
let authUtils = {
    setPublicvalue(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    getPublicvalue(key) {
        let str = localStorage.getItem(key)
        // let str = VueCookies.get('NAVDATA')
        return JSON.parse(str);
    },
    getAuthToken() {
        let str = localStorage.getItem(KEY_AUTHTOKEN)
        if (str == '') {
            return null
        }
        try {
            str = JSON.parse(str)
            if (str && str.ttl > Date.now()) {
                return str.token
            }
            return null
        } catch (e) {
            return null
        }
    },
    setAuthToken(token) {
        localStorage.setItem(KEY_AUTHTOKEN, JSON.stringify({ token: token, ttl: Date.now() + KEY_AUTHTOKEN_TTL * 1000 }))
    },
    //存储平台型号
    setparnter(params) {
        VueCookies.set('PARTNER', params)
        // localStorage.setItem(KEY_PUSHDOCUMENT, JSON.stringify(params))
    },
    getparnter() {
        let str = VueCookies.get("PARTNER")
        return str;
    },
    //缓存导航数据
    setNavdata(params) {
        localStorage.setItem('NAVDATA', JSON.stringify(params))
    },
    //获取导航数据
    getNavdata() {
        let str = localStorage.getItem('NAVDATA')
        // let str = VueCookies.get('NAVDATA')
        return JSON.parse(str);
    },
    //获取跳转点击的节点
    getDownCurrent() {
        // let str = localStorage.getItem(KEY_PUSHDOCUMENT)
        let str = VueCookies.get(KEY_PUSHDOCUMENT)
        return str;
    },
    //存储跳转点击的节点
    setDownCurrent(params) {
        VueCookies.set(KEY_PUSHDOCUMENT, params)
        // localStorage.setItem(KEY_PUSHDOCUMENT, JSON.stringify(params))
    },
    //存储导航的焦点
    setNavCurrent(index) {
        VueCookies.set(KEY_NAVCURRENT, index)
        // localStorage.setItem(KEY_NAVCURRENT, JSON.stringify(index))
    },
    //获取导航存储的焦点
    getNavCurrent() {
        let str = VueCookies.get(KEY_NAVCURRENT)
        // let str = localStorage.getItem(KEY_NAVCURRENT)
        return str;
    },
    //存储科室列表的焦点
    setKeshiCurrent(params) {
        VueCookies.set(KEY_KESHICURRENT, params)
        // localStorage.setItem(KEY_KESHICURRENT, JSON.stringify(params))
    },
    //获取科室列表的焦点
    getKeshiCurrent() {
        // let str = localStorage.getItem(KEY_KESHICURRENT)
        let str = VueCookies.get(KEY_KESHICURRENT)
        return str;
    },
    //清除存储
    clearCurrent(key) {
        localStorage.removeItem(key)
        // VueCookies.remove(key)
    },
    clear() {
        localStorage.clear()
    },
    //存储页面路劲
    setHistoryPath(path) {
        localStorage.setItem(KEY_HISTORYPATH, JSON.stringify(path))
    },
    //获取页面路劲
    getHistoryPath() {
        let str = localStorage.getItem(KEY_HISTORYPATH)
        return JSON.parse(str);
    },
    //存储更多列表页面路劲
    setmorepath(path) {
        console.log(path)
        localStorage.setItem("KEYMOREPATH", JSON.stringify(path))
    },
    //获取更多列表页面路劲
    getmorepath() {
        let str = localStorage.getItem("KEYMOREPATH")
        return JSON.parse(str);
    },
    //村入播放页面返回索引
    setIndex(index) {
        // localStorage.setItem('PROADCASTINDEX', JSON.stringify(index))
        VueCookies.set('PROADCASTINDEX', JSON.stringify(index))
    },
    //获取播放页面返回索引
    getIndex() {
        // let str = localStorage.getItem('PROADCASTINDEX')
        let str = VueCookies.get('PROADCASTINDEX')
        return JSON.parse(str);
    },
    //存储菜单页后面的参数
    setParams(params) {
        VueCookies.set('CUTPARAMS', JSON.stringify(params))
    },
    //获取菜单页后面的参数
    getParams() {
        let str = VueCookies.get('CUTPARAMS')
        return JSON.parse(str);
    }
}
export default authUtils


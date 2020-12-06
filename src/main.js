// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import ViewUI from 'view-design'
import store from './store'
import headerTitle from '@/components/header.vue'
import 'vant/lib/index.css';
// import 'view-design/dist/styles/iview.css';
import 'amfe-flexible/index.js';
import service from '@/config/httpConfig.js';
import 'view-design/dist/styles/iview.css';
import { Notify } from 'vant';
import { Tree } from 'view-design';
import { Dialog, Toast,Card } from 'vant';
Vue.config.productionTip = false
Vue.prototype.$Notify = Notify
Vue.prototype.$Dialog = Dialog
Vue.prototype.$Toast = Toast
Vue.use(Vant)
Vue.use(Card)
import { getoatoken1 } from "./api/api";
import mixin from '@/common/mixins/params'
Vue.mixin(mixin)

// 用一下
Vue.use(ViewUI);
// 注册全局标题头组件
Vue.component('header-title', headerTitle);
Vue.component('Tree', Tree);
// 注入全局混入

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

// 按钮自定义指令
Vue.directive('showBtn', {
    inserted: (el, binding) => {},
    update: (el, binding) => {
        el.style.display = 'none'
        let btnName = binding.value.name;
        try {
            binding.value.data.forEach((item, index) => {
                if (item.infoType === btnName) {
                    el.style.display = 'block'
                        // console.log(el.className)
                    if (item.infoValue.value !== '') {
                        el.innerHTML = item.infoValue.value
                    }
                }
            })
        } catch (e) {
            //TODO handle the exception
        }
    },
})

// 提供返回接口
window.goBack = function(msg) {
    location.history.back(-1)
}

// ·······························以下为本地调试方法··········································
// 获取安卓user信息
// 2020年9月30日10:59:06  已办，待阅等测试便签
window.getUserInfo = function(p) {
    // 2020年11月17日08:49:05
    // p = JSON.parse(p)
    // document.write('')
    getoatoken1({
        username: p.userName,
        password: p.passWord,
        
    }).then(msg => {
        console.log("token1返回数据");
        console.log(msg);
        store.commit('Login_in', msg.data)
        store.commit('set_token', msg.data.token)
        store.commit('set_userId', msg.data.userId)
        sessionStorage.setItem("userToken", msg.data.token);
        sessionStorage.setItem("userId", msg.data.userId);
        console.log("token"+msg.data.token)
    })
    
    // 去掉原生返回的带转义的字符\
    // msg = msg.replace(/[\\]/g, '')
    // msg = JSON.parse(msg)
    // let info = msg
    // store.commit('Login_in', msg)
    // store.commit('set_token', msg.token)
}

var p = {
    userName: 'chenqiuzhen',
    passWord: 'chenqiuzhen@123'
}
window.getUserInfo(p)

// -----------获取用户token---URL中获取-------------------

//注意： token 后面两个#/不要，要不解析不出来
// window.geIdtoken = function(){
//     // let URL = window.location.href
//     let URL = 'http://192.168.80.102/mobile/oa/?id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjU1NDEwMDIyMjYzNTI1MDkyNjEifQ.eyJlbWFpbCI6IjEzNzY1ODAxMjU4QDEzOS5jb20iLCJuYW1lIjoi6ZmIKuecnyIsIm1vYmlsZSI6IjEzNzY1ODAxMjU4IiwiZXh0ZXJuYWxJZCI6IjEwOTk2NCIsInVkQWNjb3VudFV1aWQiOiI5N2Y4ZGNmOTgwZjhjOTdkOWU3NDE4NzRlNDM5ZGIxZWN5TUxiNUM0bFFmIiwib3VJZCI6IjA5OTAwMDA0Iiwib3VOYW1lIjoi6Zmi5Yqe77yI5YWa5Yqe77yJIiwib3BlbklkIjpudWxsLCJpZHBVc2VybmFtZSI6IjEwOTk2NCIsInVzZXJuYW1lIjoiMTA5OTY0IiwiYXBwbGljYXRpb25OYW1lIjoi5pawT0Eg55S15a2Q5YWs5paHIiwiZW50ZXJwcmlzZUlkIjoidGt5IiwiaW5zdGFuY2VJZCI6InRreSIsImFsaXl1bkRvbWFpbiI6IiIsImV4dGVuZEZpZWxkcyI6eyJ0aGVtZUNvbG9yIjoiZ3JlZW4iLCJhcHBOYW1lIjoi5pawT0Eg55S15a2Q5YWs5paHIn0sImV4cCI6MTYwNjk5NDE4NywianRpIjoiSGhITkxLNU9FeXZ1QW9tdWJud2I0ZyIsImlhdCI6MTYwNjk5MzU4NywibmJmIjoxNjA2OTkzNTI3LCJzdWIiOiIxMDk5NjQifQ.d2NFPgj9TBBJVISg6E7ElHIFaB1SgnHebU-rTHh90xMq34BEmxF7Z_B9x-fiWeIzLUqPFvFOcApTPGLnp0r0qQF5FTF_r31J3lnY17pkO8PtfMBjHjQASr-STnPO3-XNiS1gyovZKh4Ak1hUAlsmMFso-uhlZh1GHDAEE64wzf23LuHmuDRO_Waxld-qPJbEq9k5hYHevCQ4BZ7BaenAzyjg-uIcanhjjL8T3xn0evSDwEuf00HradMt3izg9_Ck7NABuXmCyJebFh2hCb0Y465hwJyD3RW3FDchPcdvM6SvCGSH3JGuix6-ikXWC8rvomJuMCuY1u-IrE94utXbCg#/'
//     console.log('-------'+URL + typeof(URL));
//     let str1 = URL.split('?id_token=')[1]
//     let id_token = str1.split('#/')[0]
//     console.log(id_token);
//     return id_token
// }
// // window.geIdtoken()
// var id_token= window.geIdtoken()
// console.log('@@@@@'+id_token);
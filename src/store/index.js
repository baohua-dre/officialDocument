import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import mutations from './mutations.js'
const store = new Vuex.Store({
    state: {
        userInfo: {},
        userToken: '',
        showloading: false,
        isLogin: '',
        basicDept: [],
        optionYj: {

        },
        showBh: false,
        optionText: 1, //是否显示临时意见
        // 以下部分state没有用到
        bianhaoparams: {
            postIds: '',
            departId: '',
            numberType: '',
            drafted: ''
        },
        bianhaoData: [],
        bianhaoData1: [],
        BookUser: [],
        lsOption: '',
        submitparams: '',
        favoritesTemp: false, //控制是否收藏 默认否不收藏,
    },
    mutations
    
})

export default store
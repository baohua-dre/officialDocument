import Vue from 'vue'
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
    base: '/mobile/oa/',
    routes: [{
        path: '/',
        name: 'home',
        component: () =>
            import ('@/pages/index.vue'),
        meta: {
            title: '首页'
        }
    }, {
        path: '/DocumentList',
        name: 'DocumentList',
        component: () =>
            import ('@/pages/DocumentList')
    }, {
        path: '/DocumentToDo/Document',
        name: 'DocumentToDo',
        component: () =>
            import ('@/pages/DocumentToDo/Doucment.vue'),
        meta: {
            title: '详情'
        }
    }, {
        path: '/DocumentToRead/index',
        name: 'DocumentToRead',
        component: () =>
            import ('@/pages/DocumentToRead/index.vue'),
        meta: {
            title: '详情'
        }
    }, {
        path: '/DocumentToFinish/index',
        name: 'DocumentToFinish',
        component: () =>
            import ('@/pages/DocumentToFinish/index.vue'),
        meta: {
            title: '详情'
        }
    }, {
        path: '/DoucumentAttentionFinish/index',
        name: 'DoucumentAttentionFinish',
        component: () =>
            import ('@/pages/DoucumentAttentionFinish/index.vue'),
        meta: {
            title: '详情'
        }
    }, {
        path: '/DocumentReadFinish/index',
        name: 'DocumentReadFinish',
        component: () =>
            import ('@/pages/DocumentReadFinish/index.vue'),
        meta: {
            title: '详情'
        }
    }, {
        path: '/DocumentToDo/selectPeople/submit',
        name: 'submit',
        component: () =>
            import ('@/pages/DocumentToDo/selectPeople/submit.vue')
    }, {
        path: '/DocumentToDo/selectPeople/zhixi',
        name: 'zhixi',
        component: () =>
            import ('@/pages/DocumentToDo/selectPeople/zhixi.vue')
    }, {
        path: '/DocumentToFinish/selectPeople/reissue',
        name: 'zhixi',
        component: () =>
            import ('@/pages/DocumentToFinish/selectPeople/reissue.vue')
    }, {
        path: '/DocumentToFinish/selectPeople/backto',
        name: 'backto',
        component: () =>
            import ('@/pages/DocumentToFinish/selectPeople/backto.vue')
    }, {
        // 此页面废弃不用
        path: '/common/pdfView',
        name: 'pdfView',
        component: () =>
            import ('@/pages/Common/pdfView.vue')
    }, {
        path: '/common/ProcessView',
        name: 'ProcessView',
        component: () =>
            import ('@/pages/Common/processView.vue')
    }, {
        path: '/common/feedback',
        name: 'feedback',
        component: () =>
            import ('@/pages/Common/feedBack.vue')
    }, {
        path: '/DocumentSearch/index',
        name: 'DocumentSearchIndex',
        component: () =>
            import ('@/pages/DocumentSearch/index.vue')
    }]
})
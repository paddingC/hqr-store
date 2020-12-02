import Vue from 'vue'
import Router from 'vue-router'
import { getToken, setToken, removeToken } from '@/common/cookie'
import store from '../store'
// 按需（懒）加载（vue实现）
// const Home = () => import( /* webpackChunkName: "home" */ '../views/home')
// const Login = () => import( /* webpackChunkName: "login" */ '../views/login')
// const About = () => import( /* webpackChunkName: "about" */ '../views/about')
const Layouts = () => import( /* webpackChunkName: "index" */ '../layouts/index')
// const demo1 = () => import( /* webpackChunkName: "demo1" */ '../views/demo1')


Vue.use(Router)
let base = `${process.env.BASE_URL}` // 动态获取二级目录
console.log(base)
const router = new Router({
    mode: 'history',
    base: base,
    routes: [
        // {
        //     path: '/',
        //     name: '首页',
        //     redirect: '/dashboard',
        // },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: resolve => require(['@/views/dashboard.vue'], resolve),
        },
        // {
        //     path: '/penguinDoctor',
        //     name: '/penguinDoctor',
        //     meta: {
        //         title: '企鹅医生',
        //     },
        //     component: resolve => require([ '@/views/penguinDoctor/index.vue' ], resolve),
        // },
        {
            path: '/home',
            name: 'home',
            component: Layouts,
            children: [

                {
                    path: 'userSeting',
                    name: 'userSeting',
                    meta: {
                        title: '账户设置',
                    },
                    component: resolve => require(['@/views/userSeting.vue'], resolve),
                },
                {
                    path: 'remoteAuditing',
                    name: 'remoteAuditing',
                    component: resolve => require(['@/views/remoteAuditing/index.vue'], resolve),
                    children: [
                        {
                            path: 'auditing',
                            name: 'auditing',
                            meta: {
                                title: '远程审方'
                            },
                            component: resolve => require(['@/views/remoteAuditing/auditing.vue'], resolve),
                        },

                    ]
                },
                {
                    path: 'chronicDisease',
                    name: 'chronicDisease',
                    title: "慢病管理",
                    component: resolve => require(['@/views/chronicDisease/index.vue'], resolve),
                    children: [
                        {
                            path: 'index',
                            name: 'index',
                            component: resolve => require(['@/views/chronicDisease/home.vue'], resolve),
                            meta: {
                                title: "慢病管理",
                            }
                        },
                        {
                            path: 'search',
                            name: 'search',
                            component: resolve => require(['@/views/chronicDisease/search.vue'], resolve),
                            meta: {
                                title: "慢病管理查询",
                            }
                        },
                        {
                            path: 'detail',
                            name: 'detail',
                            component: resolve => require(['@/views/chronicDisease/detail.vue'], resolve),
                            meta: {
                                title: "慢病详情",
                            }
                        },
                        {
                            path: 'buildsProfiles',
                            name: 'buildsProfiles',
                            component: resolve => require(['@/views/chronicDisease/buildsProfiles.vue'], resolve),
                            meta: {
                                title: "建立慢病档案",
                            }
                        },

                    ]
                },
                {
                    path: 'drugAdministration',
                    name: 'drugAdministration',
                    component: resolve => require(['@/views/drugAdministration/index.vue'], resolve),
                    children: [
                        {
                            path: 'form',
                            name: 'form',
                            meta: {
                                title: '药品信息'
                            },
                            component: resolve => require(['@/views/drugAdministration/form.vue'], resolve),
                        },

                    ]
                },
                {
                    path: 'medicationGuidance',
                    name: 'medicationGuidance',
                    meta: {
                        title: '用药指导'
                    },
                    component: resolve => require(['@/views/medicationGuidance/index.vue'], resolve),
                    children: [
                        {
                            path: 'physicianList',
                            name: 'physicianList',
                            meta: {
                                title: '用药指导'
                            },
                            component: resolve => require(['@/views/medicationGuidance/physicianList.vue'], resolve),
                        },
                        {
                            path: 'connectPhysician',
                            name: 'connectPhysicianM',
                            meta: {
                                title: '连接执业药师'
                            },
                            component: resolve => require(['@/views/medicationGuidance/connectPhysician.vue'], resolve),
                        },
                    ]
                },
                {
                    path: 'remoteCall',
                    name: 'remoteCall',
                    meta: {
                        title: '远程复诊'
                    },
                    component: resolve => require(['@/views/remoteCall/index.vue'], resolve),
                    children: [
                        {
                            path: 'chooseHospital',
                            name: 'chooseHospital',
                            meta: {
                                title: '选择医院与科室'
                            },
                            component: resolve => require(['@/views/remoteCall/chooseHospital.vue'], resolve),
                        },
                        {
                            path: 'callDoctor',
                            name: 'callDoctor',
                            meta: {
                                title: '医生列表'
                            },
                            component: resolve => require(['@/views/remoteCall/callDoctor.vue'], resolve),
                        },
                        {
                            path: 'doctorVideo',
                            name: 'doctorVideo',
                            meta: {
                                title: '连接医生'
                            },
                            component: resolve => require(['@/views/remoteCall/doctorVideo.vue'], resolve),
                        }
                    ]
                },
                {
                    path: 'remoteReferral',
                    name: 'remoteReferral',
                    meta: {
                        title: '远程复诊'
                    },
                    component: resolve => require(['@/views/remoteReferral/index.vue'], resolve),
                    children: [
                        {
                            path: 'doctorList',
                            name: 'doctorList',
                            meta: {
                                title: '医生列表'
                            },
                            component: resolve => require(['@/views/remoteReferral/doctorList.vue'], resolve),
                        },
                        {
                            path: 'connectPhysician',
                            name: 'connectPhysician',
                            meta: {
                                title: '连接执业医师'
                            },
                            component: resolve => require(['@/views/remoteReferral/connectPhysician.vue'], resolve),
                        },
                        {
                            path: 'connectPharmacist',
                            name: 'connectPharmacist',
                            meta: {
                                title: '连接执业药师'
                            },
                            component: resolve => require(['@/views/remoteReferral/connectPharmacist.vue'], resolve),
                        },
                    ]
                },
                {
                    path: 'historyRecipel',
                    name: 'historyRecipel',
                    meta: {
                        title: '处方管理',
                    },
                    component: resolve => require(['@/views/historyRecipel/index.vue'], resolve),
                },
                {
                    path: 'videopage',
                    name: 'videopage',
                    meta: {
                        title: '连接执业药师'
                    },
                    component: resolve => require(['@/views/historyRecipel/videopage.vue'], resolve),
                },
                {
                    path: 'pharmacyAudit',
                    name: 'pharmacyAudit',
                    meta: {
                        title: '药店审核',
                    },
                    component: resolve => require(['@/views/pharmacyAudit/index.vue'], resolve),
                },
                {
                    path: 'drugsMaintain',
                    name: 'drugsMaintain',
                    meta: {
                        title: '处方货品维护',
                    },
                    component: resolve => require(['@/views/drugsMaintain/index.vue'], resolve),
                },

            ]
        },
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/',
            name: 'login',
            component: resolve => require(['@/views/login.vue'], resolve),
        },
        {
            path: '/znsf',
            name: 'znsf',
            meta: {
                title: '智能审方',
            },
            component: resolve => require(['@/views/znsf/index.vue'], resolve),
        },
        {
            path: '/consultation',
            name: 'consultation',
            meta: {
                title: '问诊医生',
            },
            component: resolve => require(['@/views/znsf/consultation.vue'], resolve),
        },
        {
            path: '/inquiry',
            name: 'inquiry',
            meta: {
                title: '社区580',
            },
            component: resolve => require(['@/views/inquiry/index.vue'], resolve),
        },
        {
            path: '/mountainSea',
            name: 'mountainSea',
            meta: {
                title: '山屿海',
            },
            component: resolve => require(['@/views/mountainSea/index.vue'], resolve),
        }

    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }
})
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    checkInfo()
    const loginStatus = sessionStorage.getItem('isLogin')
    console.log(loginStatus + '当前登录的状态');
    if (to.path === '/') {
        next()
    } else {
        if (loginStatus < 1) {
            // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
            next({ path: '/' })
        } else {
            // 加载动态菜单和路由
            next()
        }
    }
})
function checkInfo() {
    if (!sessionStorage.getItem('companyUrl') || sessionStorage.getItem('companyUrl') == '') {
        let uls = window.location.href.split('/')
        if (uls.length > 3) {
            store.dispatch('user/getconfig', { companycode: uls[3] }).then(res => {
            }).catch(err => {
                console.log(err);
            })
        }
    }
}
export default router

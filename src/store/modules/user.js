import {login, logout, getInfo, saveCompanyInfo, changepassword, getconfig, saveUserConfig,
    findnavtree, getUserInfo} from '@/api/user'
import {getToken, setToken, removeToken}                         from '@/common/cookie'
// import router, { resetRouter } from '@/router'

const state = {
    token: getToken(),
    introduction: '',
    userInfo: {},
    patientInfo: {},
    prescriptionPic: null,
    //inObj: {},
    //inType: false,
    prescriptionid: '',
    camerasArr: [],// 摄像头组
    camerasIdx: '',// 当前摄像头
    remoteLeave: false,//远端流是否离开
    doctorInfo: {},
    pharmacistInfo: {},
    realmName: {},
    interdoctorinfo: {}
}

const mutations = {
    SET_INTERDOCTORINFO: (state, interdoctorinfo) => {
        state.interdoctorinfo = interdoctorinfo
    },
    SET_REALMNAME: (state, realmName) => {
        state.realmName = realmName
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_DOCTORINFO: (state, val) => {
        state.doctorInfo = val
    },
    SET_PHARMACISTINFO:(state, val) => {
        state.pharmacistInfo = val
    },
    SET_REMOTELEAVE:(state, val) => {
        state.remoteLeave = val
    },
    SET_CAMERASARR: (state, camerasArr)=>{
        state.camerasArr = camerasArr
    },
    SET_CAMERASIDX: (state, val) => {
        state.camerasIdx = val
    },
    /*SET_INOBJ: (state, val) => {
        state.onObj = val
    },
    SET_INTYPE:(state, val) => {
        state.inType = val
    },*/
    SET_PRESCRIPTIONID:(state, val) => {
        state.prescriptionid = val
    },
    SET_PICTURE: (state, prescriptionPic) => {
        state.prescriptionPic = prescriptionPic
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = {...userInfo, isLogin: true}
    },
    SET_USERINFO_height: (state, highShotMeterType) => {
        state.userInfo.highShotMeterType = highShotMeterType
    },
    SET_REMOVERINFO: (state, userInfo) => {
        state.userInfo = {
            isLogin: false,
            loginid: null,
            loginpwd: null,
        }
    },
    LOGINOUT: (state) => {
        state.userInfo = {}
        state.token = null
        removeToken()
    },
    SET_PATIENTINFO: (state, patientInfo) => {
        state.patientInfo = patientInfo
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
}

const actions = {
    getconfig ({commit}, code) {
        return new Promise((resolve, reject) => {
            getconfig(code).then(response => {
                const {data} = response
                commit('SET_REALMNAME', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    saveUserConfig ({commit}, val) {
        return new Promise((resolve, reject) => {
            saveUserConfig(val).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // user login
    login({commit}, userInfo) {
        const {loginid, loginpwd} = userInfo
        return new Promise((resolve, reject) => {
            login({loginid: loginid.trim(), loginpwd: loginpwd}).then(response => {
                const {data} = response
                commit('SET_USERINFO', data)
                commit('SET_TOKEN', data.userid)
                setToken(data.userid)
                resolve(data)
            }).catch(error => {
                console.log(error)
                /*todo*/
                reject(error)
            })
        })
    },
    findnavtree ({commit}, loginid) {
        console.log(loginid);
        console.log('我要传的参数');
        return new Promise((resolve, reject) => {
            findnavtree(loginid).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    saveCompanyInfo({commit}, companyInfo) {
        return new Promise((resolve, reject) => {
            saveCompanyInfo(companyInfo).then(response => {
                const {data} = response
                resolve(data)
            }).catch(error => {
                console.log(error)
                /*todo*/
                reject(error)
            })
        })
    },
    changepassword({commit}, passWord) {
        return new Promise((resolve, reject) => {
            changepassword(passWord).then(response => {
                const {data} = response
                resolve(data)
            }).catch(error => {
                console.log(error)
                /*todo*/
                reject(error)
            })
        })
    },

    // get user info

    getInfo({commit}, data) {
        return new Promise((resolve, reject) => {
            getInfo(data).then(response => {
                const {data} = response
                resolve(data)
            }).catch(error => {
                console.log(error)
                /*todo*/
                reject(error)
            })
        })
    },
    getUserInfo ({commit}, data) {
        return new Promise((resolve, reject) => {
            getUserInfo(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({commit, state, dispatch}) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                // reset visited views and cached views
                // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                dispatch('tagsView/delAllViews', null, {root: true})
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({commit}) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },

    // dynamically modify permissions
    // changeRoles({ commit, dispatch }, role) {
    //     return new Promise(async resolve => {
    //         const token = role + '-token'
    //
    //         commit('SET_TOKEN', token)
    //         setToken(token)
    //
    //         const { roles } = await dispatch('getInfo')
    //
    //         resetRouter()
    //
    //         // generate accessible routes map based on roles
    //         const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    //
    //         // dynamically add accessible routes
    //         router.addRoutes(accessRoutes)
    //
    //         // reset visited views and cached views
    //         dispatch('tagsView/delAllViews', null, { root: true })
    //
    //         resolve()
    //     })
    // }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

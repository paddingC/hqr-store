import Cookies             from 'js-cookie'
import {getconfig, getKey, savelog} from '@/api/app.js'

const state = {
    storeInfo: {
        name1: '药事服务门店端',
        name2: '陕西广济堂医药集团远程药事服务平台',
    },
    activeRouer: null,
    videoKey: {
        sdkAppId: null,
        userSig: null,
        userid: null
    },
    loginid: "",
    callFlage: false //callFlage 可以切换 true 不可以
}

const mutations = {
    SET_STOREINFO: (state, info) => { state.storeInfo = info},
    SET_ROUTER: (state, routerNow) => {
        state.activeRouer = routerNow
    },
    SET_LOGINID: (state, loginid) => {
        state.loginid = loginid
    },
    SET_KEY: (state, videoKey) => {
        state.videoKey = videoKey
    },
    SET_CALLFLAGE: (state, flage) => {
        state.callFlage = flage
    },
}

const actions = {
    // user login
    getKey({commit}, userInfo) {
        const {userid, companyid} = userInfo
        return new Promise((resolve, reject) => {
            getKey({userid, companyid}).then(response => {
                let {data} = response
                commit('SET_KEY', {...data, userid})
                resolve({...data, userid})
            }).catch(error => {
                commit('SET_KEY', {
                    sdkAppId: null,
                    userSig: null,
                    userid: null
                })
                reject(error)
            })
        })
    },
    savelog({commit}, content) {
        const {userid, msg} = content
        return new Promise((resolve, reject) => {
            savelog({userid, msg}).then(response => {
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    // get user info
    getInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                if (!data) {
                    reject('Verification failed, please Login again.')
                }
                const {roles, name, avatar, introduction} = data
                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }
                commit('SET_ROLES', roles)
                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                commit('SET_INTRODUCTION', introduction)
                resolve(data)
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

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

import {login, logout, getInfo}          from '@/api/user'
import {getToken, setToken, removeToken} from '@/common/cookie'
// import router, { resetRouter } from '@/router'

const state = {
    prescriptionPic: null,
    picture: [],
}

const mutations = {
    // SET_PATIENTINFO: (state, patientInfo) => {
    //     state.patientInfo =  state.patientInfo.unshift(patientInfo)
    // },
    SET_PICTURE: (state, picture) => {
        state.picture.unshift(picture)
    },
}

const actions = {
    // user login
    login({commit}, userInfo) {
        console.log(userInfo)
        const {loginid, loginpwd} = userInfo
        return new Promise((resolve, reject) => {
            login({loginid: loginid.trim(), loginpwd: loginpwd}).then(response => {
                const {data} = response
                commit('SET_TOKEN', data.token)
                commit('SET_USERINFO', data)
                setToken(data.token)
                resolve()
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },

    // get user info
    getInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const {data} = response

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

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

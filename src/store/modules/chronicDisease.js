import {finddoc,purchaseRecord,buyAgain}                         from '@/api/chronicDisease'
import {getToken, setToken, removeToken} from '@/common/cookie'


const state = {
    ncdInfo: {}
}

const mutations = {
    SET_NCDINFO: (state, ncdInfo) => {
        state.ncdInfo = ncdInfo
    },
}

const actions = {
    //保存患者信息
    saveNcdInfo({commit}, form) {
        return new Promise((resolve, reject) => {
            finddoc(form).then(res => {
                console.log(res)
                const data = res.data
                // commit('SET_NCDINFO', data)
                resolve(data)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    getpurchaseRecord({commit}, form) {
        return new Promise((resolve, reject) => {
            purchaseRecord(form).then(res => {
                console.log(res)
                const data = res.data
                // commit('SET_NCDINFO', data)
                resolve(data)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    buyAgain({commit}, parms) {
        return new Promise((resolve, reject) => {
            buyAgain(parms).then(res => {
                console.log(res)
                const data = res.data
                resolve(data)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

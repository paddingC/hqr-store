import {buyspecialdrug, findGood, listByCompanyId} from '@/api/drugAdministration'

const state = {
    ncdInfo: {}
}

const mutations = {}

const actions = {
    //保存患者信息
    buyspecialdrug({commit}, form) {
        return new Promise((resolve, reject) => {
            buyspecialdrug(form).then(res => {
                console.log(res)
                const data = res.data
                resolve(data)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    findGood({commit}, form) {
        return new Promise((resolve, reject) => {
            findGood(form).then(res => {
                const data = res.data
                // commit('SET_NCDINFO', data)
                resolve(data)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    listByCompanyId ({commit}, form) {
        return new Promise((resolve, reject) => {
            listByCompanyId(form).then(res => {
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

import {status} from '@/api/inquiry'

const state = {
    ncdInfo: {}
}

const mutations = {}

const actions = {
    //保存患者信息
    status({commit}, form) {
        return new Promise((resolve, reject) => {
            status(form).then(res => {
                resolve(res)
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

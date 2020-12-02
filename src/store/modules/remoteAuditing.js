import {patientSave, saveDoc, deleteDoc, submitImagePrescription, usageanddosageSelect} from '@/api/remoteAuditing'
import {queryHospitalList, structure, deptList, touchOffDoctor, zncfdoctorSel, batchGetDictList, secVisit, getDoctorNum} from '@/api/callDoctor'

const state = {
    patientInfo: {}
}

const mutations = {
    SET_PATIENTINFO: (state, patientInfo) => {
        state.patientInfo = patientInfo
    },
}

const actions = {
    //保存患者信息
    savePatient({commit}, form) {
        return new Promise((resolve, reject) => {
            patientSave(form).then(res => {
                commit('SET_PATIENTINFO', form)
                resolve(form)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    usageanddosageSelect ({commit}, companyid) {
        return new Promise((resolve, reject) => {
            usageanddosageSelect(companyid).then((res) => {
                const data = res.data
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 保存处方单
    sxsavedoc({commit}, parms) {
        return new Promise((resolve, reject) => {
            saveDoc(parms).then(res => {
                const {data} = res
                const {prescriptionid} = data
                resolve(prescriptionid)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    deleteDoc({commit}, parms){
        return new Promise((resolve, reject) => {
            deleteDoc(parms).then(response => {
                const {data} = response
                console.log(data);
                resolve(data)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    // 图片审方
    submitImagePrescription ({commit}, parms) {
        return new Promise((resolve, reject) => {
            submitImagePrescription(parms).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    // 医院列表
    queryHospitalList ({commit}, parms) {
        return new Promise((resolve, reject) => {
            queryHospitalList(parms).then(response => {
                // const {data} = response
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    // 科室列表
    structure ({commit}, parms) {
        return new Promise((resolve, reject) => {
            structure(parms).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    // 医生列表
    deptList ({commit}, parms) {
        return new Promise((resolve, reject) => {
            deptList(parms).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    // 呼叫医生
    touchOffDoctor ({commit}, parms) {
        return new Promise((resolve, reject) => {
            touchOffDoctor(parms).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    // 查询医生信息
    zncfdoctorSel ({commit}, parms) {
        return new Promise((resolve, reject) => {
            zncfdoctorSel(parms).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    secVisit ({commit}, parms) {
        return new Promise((resolve, reject) => {
            secVisit(parms).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    batchGetDictList ({commit}, parms) {
        return new Promise((resolve, reject) => {
            batchGetDictList(parms).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    getDoctorNum ({commit}, parms) {
        return new Promise((resolve, reject) => {
            getDoctorNum(parms).then(response => {
                resolve(response)
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

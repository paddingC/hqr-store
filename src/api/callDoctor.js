import request from '@/common/request'
// 医院列表
export function queryHospitalList(data) {
    return request({
        url: 'appdepartment/queryHospitalList',
        method: 'post',
        data
    })
}
// 科室列表
export function structure(data) {
    return request({
        url: 'appdepartment/structure',
        method: 'post',
        data
    })
}
// 医生列表
export function deptList(data) {
    return request({
        url: 'zncfdoctor/deptList',
        method: 'post',
        data
    })
}
// 呼叫互联网医院医生
export function touchOffDoctor(data) {
    return request({
        url: 'appPatient/touchOffDoctor',
        method: 'post',
        data
    })
}
// 医生信息
export function zncfdoctorSel(data) {
    return request({
        url: 'zncfdoctor/sel',
        method: 'post',
        data
    })
}
// 字段值
export function batchGetDictList(data) {
    return request({
        url: 'base/dictionary/batchGetDictList',
        method: 'post',
        data
    })
}
// 取消呼叫互联网医院医生
export function secVisit(data) {
    return request({
        url: 'inquiry/program/secVisit',
        method: 'post',
        data
    })
}
//

export function getDoctorNum(data) {
    return request({
        url: 'zncfdoctor/program/getDoctorNum',
        method: 'post',
        data
    })
}

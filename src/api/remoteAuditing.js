import request from '@/common/request'

//保存患者
export function patientSave(data) {
    return request({
        url: 'patient/save',
        method: 'post',
        data
    })
}

// 保存处方单
export function saveDoc(data) {
    return request({
        url: 'prescription/sxsavedoc',
        method: 'post',
        data
    })
}


// 作废
export function deleteDoc(data) {
    return request({
        url: 'prescription/deleteDoc',
        method: 'post',
        data
    })
}
// 图片审方
export function submitImagePrescription(data) {
    return request({
        url: 'prescription/submitImagePrescription',
        method: 'post',
        data
    })
}
export function usageanddosageSelect(data) {
    return request({
        url: 'usageanddosage/select',
        method: 'post',
        data
    })
}

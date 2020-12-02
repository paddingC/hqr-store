import request from '../common/request'

//调配发药
export function dispenseAndCheck(data) {
    return request({
        url: 'prescription/DispenseAndCheck',
        method: 'post',
        data
    })
}

//获取人员
export function getByDeptid(data) {
    return request({
        url: 'user/getByDeptid',
        method: 'post',
        data
    })
}

//查询处方
export function sxfinddoc(data) {
    return request({
        url: 'prescription/sxfinddoc',
        method: 'post',
        data
    })
}
//保存修改
export function updatePatient(data) {
    return request({
        url: 'prescription/updatePatient',
        method: 'post',
        data
    })
}

//下载图片
export function downloadfile(data) {
    return request({
        url: 'config/downloadfile'+'?url='+data.url,
        method: 'post',
    })
}

// 审核
export function pointapproval(data) {
    return request({
        url: 'prescription/pointapproval',
        method: 'post',
        data
    })
}

// 细单
export function finddtl(data) {
    return request({
        url: 'prescription/finddtl',
        method: 'post',
        data
    })
}
// 货品
export function goodsFind(data) {
    return request({
        url: 'goods/find',
        method: 'post',
        data
    })
}
// 查询细单
export function getdtl(data) {
    return request({
        url: 'prescription/getdtl',
        method: 'post',
        data
    })
}
// 保存细单
export function savedtl(data) {
    return request({
        url: 'prescription/savedtl',
        method: 'post',
        data
    })
}
// 删除细单
export function deldtl(data) {
    return request({
        url: 'prescription/deldtl',
        method: 'post',
        data
    })
}
// 下传到erp
export function sendPrescritpion(data) {
    return request({
        url: 'prescription/sendPrescritpion',
        method: 'post',
        data
    })
}

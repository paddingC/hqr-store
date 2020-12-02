import request from '@/common/request'


// 药品列表
export function goodsFind(data) {
    return request({
        url: 'goods/find',
        method: 'post',
        data
    })
}
// 发起咨询
export function sendPrescriptionApply(data) {
    return request({
        url: 'zy/sendPrescriptionApply',
        method: 'post',
        data
    })
}
// 关闭处方
export function rxClose(id) {
    return request({
        url: 'zy/rxClose/' + id,
        method: 'post',
        // data
    })
}

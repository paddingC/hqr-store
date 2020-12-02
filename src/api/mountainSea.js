import request from '@/common/request'
// 药品列表
export function genPrescriptionBySyh(data) {
    return request({
        url: 'prescription/genPrescriptionBySyh',
        method: 'post',
        data
    })
}

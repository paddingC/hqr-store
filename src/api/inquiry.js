import request from '@/common/request'
// 药品列表
export function status(data) {
    return request({
        url: '580wz/diagnosis/status/' + data,
        method: 'post'
    })
}
export function goodsFind(data) {
    return request({
        url: '580wz/drug/list',
        method: 'post',
        data
    })
}
export function createZixun(data) {
    return request({
        url: '580wz/diagnosis/create',
        method: 'post',
        data
    })
}

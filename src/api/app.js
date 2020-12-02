import request from '@/common/request'

export function getconfig(data) {
    return request({
        url: 'config/getconfig',
        method: 'post',
        data
    })
}
export function getKey(data) {
    return request({
        url: 'config/getkey',
        method: 'post',
        data
    })
}
// 日志
export function savelog(data) {
    return request({
        url: 'inquiry/savelog',
        method: 'post',
        data
    })
}
// 企鹅医生
export function penguinDoctor(data) {
    return request({
        url: 'interf/loadPenguinDoctor',
        method: 'get',
        params: data
    })
}
//用药指导拍照
export function sendPicture(data) {
    return request({
        url: 'pharmacist/sendSnap',
        method: 'post',
        data
    })
}
/*
export function login2(data) {
    return request({
        url: '/roleqyweb/webuser/role/user/login',
        method: 'get',
        params:data
    })
}

export function getInfo(token) {
    return request({
        url: '/user/info',
        method: 'get',
        params: {token}
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}
*/

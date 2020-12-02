import request from '@/common/request'

export function login(data) {
    return request({
        url: 'user/login',
        method: 'post',
        data
    })
}

// 【账户设置】-修改信息
export function saveCompanyInfo(data) {
    return request({
        url: 'user/saveCompanyInfo',
        method: 'post',
        data
    })
}

// 【账户设置】-修改密码
export function changepassword(data) {
    return request({
        url: 'user/changepassword',
        method: 'post',
        data
    })
}

export function getInfo(data) {
    return request({
        url: 'config/getconfig',
        method: 'post',
        data
    })
}
// 获取账号信息

export function getUserInfo(data) {
    return request({
        url: 'config/getUserInfo',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: 'user/logout',
        method: 'post'
    })
}
// 获取企业logo 识别标识
export function getconfig(data) {
    return request({
        url: 'config/interf/getconfig',
        method: 'post',
        data
    })
}
// 硬件管理获取设备
export function saveUserConfig(data) {
    return request({
        url: 'config/saveUserConfig',
        method: 'post',
        data
    })
}

// 获取菜单信息
export function findnavtree(data) {
    return request({
        url: 'webopmenu/role/opmenu/findnavtree',
        method: 'get',
        params: data
    })
}

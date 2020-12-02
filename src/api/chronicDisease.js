import request from '@/common/request'

//慢病档案查询
export function finddoc(data) {
    return request({
        url: 'prescription/sxfinddoc',
        method: 'post',
        data
    })
}

//购药明细
export function purchaseRecord(data) {
    return request({
        url: 'prescription/purchaseRecord',
        method: 'post',
        data
    })
}
//再次购买
export function buyAgain(data) {
    return request({
        url: 'prescription/buyAgain',
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

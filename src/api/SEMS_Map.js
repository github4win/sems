import request from '@/utils/request'

// MARK 조회
export function SELECT_MARK() {
    return request({
        url: '/SELECT_MARK',
        method: 'get'
    })
}

// MARK 조회
export function GetMap() {
    return request({
        url: '/GetMap',
        method: 'get'
    })
}
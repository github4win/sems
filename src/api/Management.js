import request from '@/utils/request'

//메뉴 목록 조회
export function SEARCH_MENU() {
    return request({
        url: '/SEARCH_MENU',
        method: 'get'
    })
}

//메뉴 목록 조회
export function SAVE_MENU() {
    return request({
        url: '/SAVE_MENU',
        method: 'get'
    })
}

//메뉴 목록 조회
export function DELETE_MENU() {
    return request({
        url: '/DELETE_MENU',
        method: 'get'
    })
}
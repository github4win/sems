import request from '@/utils/request'

// 메뉴 조회
export function getMenu() {
    return request({
        url: '/SEMS_MENU_MOBILE?', 
        method: 'get'
    })
}

// 로그인
export function LoginCheck(MENU_AUTH) {
    return request({
        url: '/SEMS_MENU?data={AUTH:"'+ MENU_AUTH+'"}', 
        method: 'get'
    })
}
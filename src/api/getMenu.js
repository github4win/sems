import request from '@/utils/request'

// 메뉴 조회
export function getMenu(MENU_AUTH) {
    return request({
        url: '/getMenu?data={MENU_AUTH:"'+ MENU_AUTH+'"}', 
        method: 'get'
    })
}
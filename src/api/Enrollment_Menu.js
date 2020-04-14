import request from '@/utils/request'

// 메뉴 조회
export function SearchMenu(MENU_NAME) {
    return request({
        url: '/SearchMenu?data={MENU_NAME:"'+ MENU_NAME+'"}', 
        method: 'get'
    })
}

// 메뉴 저장
export function SaveMenu(data) {
    return request({
        url: '/SaveMenu',
        data: data,
        method: 'POST'
    })
}

// 메뉴 삭제
export function RemoveMenu(data) {
    return request({
        url: '/RemoveMenu',
        data: data,
        method: 'POST'
    })
}



import request from '@/utils/request'

// 메뉴 조회
export function SEARCH_MENU(MENU_NAME) {
    return request({
    url: '/SEARCH_MENU?data={MENU_NAME:"' + MENU_NAME + '"}',
    method: 'get'
    });
  }

// 메뉴 저장
export function SAVE_MENU(data) {
    return request({
        url: '/SAVE_MENU',
        data: data,
        method: 'POST'
    })
}

// 메뉴 삭제
export function DELETE_MENU(data) {
    return request({
        url: '/DELETE_MENU',
        data: data,
        method: 'POST'
    })
}
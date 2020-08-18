import request from '@/utils/request'

// 메뉴 조회
export function SEARCH_AREA(AREA_NAME) {
    return request({
    url: '/SEARCH_AREA?data={AREA_NAME:"' + AREA_NAME + '"}',
    method: 'get'
    });
  }

// 메뉴 저장
export function SAVE_AREA(data) {
    return request({
        url: '/SAVE_AREA',
        data: data,
        method: 'POST'
    })
}

// 메뉴 삭제
export function DELETE_AREA(data) {
    return request({
        url: '/DELETE_AREA',
        data: data,
        method: 'POST'
    })
}
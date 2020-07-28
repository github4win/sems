import request from '@/utils/request'

// 그리드 조회
export function SEARCH_DANGER(GAS_NAME) {
    return request({
    url: '/SEARCH_DANGER?data={GAS_NAME:"' + GAS_NAME + '"}',
    method: 'get'
    });
  }

// 그리드 저장
export function SAVE_DANGER(data) {
    return request({
        url: '/SAVE_DANGER',
        data: data,
        method: 'POST'
    })
}

// 그리드 삭제
export function DELETE_DANGER(data) {
    return request({
        url: '/DELETE_DANGER',
        data: data,
        method: 'POST'
    })
}
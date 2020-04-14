import request from '@/utils/request'

// 사용자 조회
export function User_Search(USER_NM) {
    return request({
        url: '/User_Search?data={USER_NM:"' + USER_NM + '"}',
        method: 'get'
    })
}

// 사용자 저장
export function User_Save(data) {
    return request({
        url: '/User_Save',
        data: data,
        method: 'POST'
    })
}

// 사용자 삭제
export function User_Delete(data) {
    return request({
        url: '/User_Delete',
        data: data,
        method: 'POST'
    })
}

import request from '@/utils/request'

// 공지사항 조회
export function SELECT_NOTICE(TITLE,CONTENT,USE_YN) {
    return request({
        url: '/SELECT_NOTICE?data={TITLE:"' + TITLE +'",CONTENT:"' + CONTENT +'",USE_YN:"' + USE_YN +'"}',
        method: 'get'
    })
}

// 공지사항 삭제
export function SAVE_NOTICE(data) {
    return request({
        url: '/SAVE_NOTICE',
        data: data,
        method: 'POST'
    })
}

// 공지사항 삭제
export function DELETE_NOTICE(data) {
    return request({
        url: '/DELETE_NOTICE',
        data: data,
        method: 'POST'
    })
}


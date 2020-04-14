import request from '@/utils/request'

// 도서 분류 콤보 조회
export function Book_KIND_COMBO() {
    return request({
        url: '/Book_KIND_COMBO',
        method: 'get'
    })
}

// 도서 목록 현황 조회
export function Book_Status(BOOK_KIND, BOOK_NM, PUBLISHER, USER_ID) {
    return request({
        url: '/Book_Status?data={BOOK_KIND:"' + BOOK_KIND +'",BOOK_NM:"'+BOOK_NM+'",PUBLISHER:"'+PUBLISHER+'",USER:"'+USER_ID+'"}',
        method: 'get'
    })
}

// 도서 대여/반납
export function Book_Rent(data) {
    return request({
        url: '/Book_Rent',
        data: data,
        method: 'POST'
    })
}

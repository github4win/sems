import request from '@/utils/request'

// 장비(본체) 조회조건 위치 콤보 조회
export function Asset_Location_COMBO(CODE) {
    return request({
        url: '/Asset_Location_COMBO?data={CODE:"'+CODE+'"}',
        method: 'get'
    })
}

// 장비(본체) 현황 조회
export function Desktop_Status(EQUIP_CD, EQUIP_NM, USER_ID, CURRENT_LOC) {
    return request({
        url: '/Desktop_Status?data={EQUIP_CD:"' + EQUIP_CD +'",EQUIP_NM:"'+EQUIP_NM+'",USER:"'+USER_ID+'",CURRENT_LOC:"'+CURRENT_LOC+'"}',
        method: 'get'
    })
}

// // 도서 대여/반납
// export function Book_Rent(data) {
//     return request({
//         url: '/Book_Rent',
//         data: data,
//         method: 'POST'
//     })
// }

// 장비 삭제
export function Asset_Delete(data) {
    return request({
        url: '/Asset_Delete',
        data: data,
        method: 'POST'
    })
}


import request from '@/utils/request'

// 장비(모니터) 추가 버튼 등록 화면
// export function Enrollment_Add() {
//     return request({
//         url: '/Enrollment_Add',
//         data: data,
//         method: 'POST'
//     })
// }

// export function Asset_Location_COMBO(CODE) {
//     return request({
//         url: '/Asset_Location_COMBO?data={CODE:"'+CODE+'"}',
//         method: 'get'
//     })
//}

// 신규 장비(본체) 저장
export function Asset_Save(data) {
    return request({
        url: '/Asset_Save',
        data: data,
        method: 'POST'
    })
}

// 데스크탑, 노트북 콤보 조회
export function Asset_Type_COMBO(CODE) {
    return request({
        url: '/Asset_Type_COMBO?data={CODE:"'+CODE+'"}',
        method: 'get'
    })
}

// 고장 유무 콤보 조회
export function Asset_Broken_COMBO(CODE) {
    return request({
        url: '/Asset_Broken_COMBO?data={CODE:"'+CODE+'"}',
        method: 'get'
    })
}

// 추가 화면 기존 장비 조회
export function Asset_Add_Search(EQUIP_CD) {
    return request({
        url: '/Asset_Add_Search?data={EQUIP_CD:"'+EQUIP_CD+'"}',
        method: 'get'
    })
}
import request from '@/utils/request'


// 과제 콤보 조회
export function TASK_SEQ_COMBO() {
    return request({
        url: '/TASK_SEQ_COMBO',
        method: 'get'
    })
}
// 업체 콤보 조회
export function COMPANY_ID_COMBO(TASK) {
    return request({
        url: '/COMPANY_ID_COMBO?data={TASK_SEQ:"' + TASK +'"}',
        method: 'get'
    })
}
// 년차 콤보 조회
export function YEAR_IDX_COMBO(TASK, COMPANY) {
    return request({
        url: '/YEAR_IDX_COMBO?data={TASK_SEQ:"' + TASK +'",COMPANY_ID:"'+COMPANY+'"}',
        method: 'get'
    })
}
// 사업비 현황 조회
export function search_Status(TASK, COMPANY, YEAR_IDX, USE_DATE) {
    return request({
        url: '/search_Status?data={TASK_SEQ:"' + TASK +'",COMPANY_ID:"'+COMPANY+'",YEAR_IDX:"'+YEAR_IDX+'",USE_DATE:"'+USE_DATE+'"}',
        method: 'get'
    })
}

// 도서 대여 저장 
export function Book_Rent(data) {
    return request({
        url: '/Book_Rent',
        data: data,
        method: 'POST'
    })
}



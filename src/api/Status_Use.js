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
// 세목(연구활동비, 연구과제추진비) 콤보 조회
export function COMBO_VIEW() {
    return request({
        url: '/COMBO_VIEW?',
        method: 'get'
    })
}
// 사업비 현황 조회
export function search_Use(TASK, COMPANY, YEAR_IDX, USE_DATE, VIEW) {
    return request({
        url: '/search_Use?data={TASK_SEQ:"' + TASK +'",COMPANY_ID:"'+COMPANY+'",YEAR_IDX:"'+YEAR_IDX+'",USE_DATE:"'+USE_DATE+'",VIEW:"'+VIEW+'"}',
        method: 'get'
    })
}

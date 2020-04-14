import request from '@/utils/request'

// 과제 콤보 조회
export function TASK_SEQ_COMBO() {
    return request({
        url: '/TASK_SEQ_COMBO',
        method: 'get'
    })
}

// 그리드 조회
export function SEARCH_BUSINESS(TASK_SEQ, DATE_YEAR, DATE_MONTH, USER_ID) {
    return request({
        url: '/SEARCH_BUSINESS?data={TASK_SEQ:"' + TASK_SEQ +'",DATE_YEAR:"'+DATE_YEAR+'",DATE_MONTH:"' + DATE_MONTH +'",USER_ID:"'+USER_ID+'"}',
        method: 'get'
    })
}

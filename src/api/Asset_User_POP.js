import request from '@/utils/request'

// 사용자 조회
export function ASSET_USER_SEARCH(DEPT_CODE, USER_ID, USER_NAME) {
    return request({
        url: '/ASSET_USER_SEARCH?data={DEPT_CODE:"' + DEPT_CODE +'",USER_ID:"'+USER_ID+'",USER_NAME:"'+USER_NAME+'"}',
        method: 'get'
    })
}
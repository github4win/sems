import request from '@/utils/request'

// 회원정보 조회
export function LoginCheck(ID, PW) {
    return request({
        url: '/LoginCheck?data={USER_ID:"' + ID +'",USER_PASS:"'+PW+'"}',
        method: 'get'
    })
}
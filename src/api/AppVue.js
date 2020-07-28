import request from '@/utils/request'

// 메뉴 조회
export function getMenu() {
    return request({
        url: '/SEMS_MENU_MOBILE?', 
        method: 'get'
    })
}

// // 로그인
// export function LoginCheck(MENU_AUTH) {
//     return request({
//         url: '/SEMS_MENU?data={AUTH:"'+ MENU_AUTH+'"}', 
//         method: 'get'
//     })
// }

// 로그인
export function LoginCheck(USER_ID,USER_PASS) {
    return request({
        url: '/SEMS_LOGIN?data={USER_ID:"'+ USER_ID+'", USER_PASS:"'+USER_PASS+'"}', 
        method: 'get'
    })
}
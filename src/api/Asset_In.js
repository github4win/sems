import request from '@/utils/request'

// 입고 조회
export function ASSET_MOVE_IN(USER, REG_SDATE, REG_EDATE) {
    return request({
        url: '/ASSET_MOVE_IN?data={USER:"' + USER +'",REG_SDATE:"'+REG_SDATE+'",REG_EDATE:"'+REG_EDATE+'"}',
        method: 'get'
    })
}

// 신규 입고 등록번호 생성
export function NEW_RNF_CD() {
    return request({
        url: '/NEW_RNF_CD', 
        method: 'get'
    })
}

// 장비 선택 화면 조회(컴퓨터)
export function ASSET_SELECT_DST_IN(RNF_CD) {
    return request({
        url: '/ASSET_SELECT_DST_IN?data={RNF_CD:"' + RNF_CD +'"}',
        method: 'get'
    })
}

// 장비 선택 화면 조회(모니터)
export function ASSET_SELECT_MNT_IN(RNF_CD) {
    return request({
        url: '/ASSET_SELECT_MNT_IN?data={RNF_CD:"' + RNF_CD +'"}',
        method: 'get'
    })
}

// 장비 출고 저장
export function ASSET_IN_SAVE(data) {

    return request({
        url: '/ASSET_IN_SAVE',
        data: data,
        method: 'POST'
    })
}
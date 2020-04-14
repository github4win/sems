import request from '@/utils/request'

// 출고 조회
export function ASSET_MOVE_OUT(USER, REG_SDATE, REG_EDATE) {
    return request({
        url: '/ASSET_MOVE_OUT?data={USER:"' + USER +'",REG_SDATE:"'+REG_SDATE+'",REG_EDATE:"'+REG_EDATE+'"}',
        method: 'get'
    })
}

// 신규 출고 등록번호 생성
export function NEW_RNF_CD() {
    return request({
        url: '/NEW_RNF_CD', 
        method: 'get'
    })
}

// 장비 선택 화면 조회(컴퓨터)
export function ASSET_SELECT_DST_OUT(RNF_CD) {
    return request({
        url: '/ASSET_SELECT_DST_OUT?data={RNF_CD:"' + RNF_CD +'"}',
        method: 'get'
    })
}

// 장비 선택 화면 조회(모니터)
export function ASSET_SELECT_MNT_OUT(RNF_CD) {
    return request({
        url: '/ASSET_SELECT_MNT_OUT?data={RNF_CD:"' + RNF_CD +'"}',
        method: 'get'
    })
}

// 장비 출고 저장
export function ASSET_OUT_SAVE(data) {

    return request({
        url: '/ASSET_OUT_SAVE',
        data: data,
        method: 'POST'
    })
}
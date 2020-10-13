import request from '@/utils/request'

//유해물질 값 조회
export function SELECT_DET(ITEM_CD) {
    return request({
        url: '/SELECT_DET?data={ITEM_CD:"' + ITEM_CD +'"}',
        method: 'get'
    })
}

//유해물질 콤보
export function SELECT_SUB() {
    return request({
        url: '/SELECT_SUB',
        method: 'get'
    })
}

// 시간별 차트 조회
export function SELECT_HRS(INS_AREA,GAS_TYPE) {
    return request({
        url: '/SELECT_HRS?data={INS_AREA:"' + INS_AREA +'",GAS_TYPE:"' + GAS_TYPE +'"}',
        method: 'get'
    })
}

// 일자별 차트 조회
export function SELECT_DAY(INS_AREA,GAS_TYPE) {
    return request({
        url: '/SELECT_DAY?data={INS_AREA:"' + INS_AREA +'",GAS_TYPE:"' + GAS_TYPE +'"}',
        method: 'get'
    })
}

// 공지사항 조회
export function SELECT_NOT() {
    return request({
        url: '/SELECT_NOT',
        method: 'get'
    })
}

// 현재 사용중인 공지사항 조회(2020.10.13 KOY)
export function SELECT_NOTI() {
    return request({
        url: '/SELECT_NOTI',
        method: 'get'
    })
}




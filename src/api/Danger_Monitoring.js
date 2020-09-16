import request from '@/utils/request'

// 일자별 차트 조회
export function SELECT_DANGER_MNT_DATE(IOT_NO,GAS_TYPE,SDATE,EDATE) {
    return request({
        url: '/SELECT_DANGER_MNT_DATE?data={IOT_NO:"' + IOT_NO +'",GAS_TYPE:"' + GAS_TYPE +'",SDATE:"' + SDATE +'",EDATE:"' + EDATE +'"}',
        method: 'get'
    })
}

// 시간별 차트 조회
export function SELECT_DANGER_MNT_TIME(IOT_NO,GAS_TYPE,DATE) {
    return request({
        url: '/SELECT_DANGER_MNT_TIME?data={IOT_NO:"' + IOT_NO +'",GAS_TYPE:"' + GAS_TYPE+'",DATE:"' + DATE +'"}',
        method: 'get'
    })
}


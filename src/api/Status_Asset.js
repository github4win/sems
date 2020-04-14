import request from '@/utils/request'

// 장비구분 콤보
export function ASSET_GUBUN_COMBO() {
    return request({
        url: '/Asset_Gubun_COMBO',
        method: 'get'
    })
}

// 위치 콤보
export function ASSET_LOCATION_COMBO() {
    return request({
        url: '/Asset_Location_COMBO',
        method: 'get'
    })
}

// 장비 현황 조회
export function ASSET_STATUS(ASSETS_LOC) {
    return request({
        url: '/ASSET_STATUS?data={CURRENT_LOC:"'+ASSETS_LOC+'"}',
        method: 'get'
    })
}

// 장비 현황 상세 조회
export function ASSET_STATUS_SUB(CURRENT_LOC, EQUIP_GUBUN) {
    
    return request({
        url: '/ASSET_STATUS_SUB?data={CURRENT_LOC:"' + CURRENT_LOC +'",EQUIP_GUBUN:"'+EQUIP_GUBUN+'"}',
        method: 'get'
    })
}

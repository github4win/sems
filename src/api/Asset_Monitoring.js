import request from '@/utils/request'

export function SETTING_LABEL_ASSET_MONITORING(CURRENT_LOC) {
    return request({
        url: '/SETTING_LABEL_ASSET_MONITORING?data={CURRENT_LOC:"' + CURRENT_LOC +'"}',
        method: 'get'
    })
}

export function SEARCH_ASSET_MONITORING(CURRENT_LOC) {
    return request({
        url: '/SEARCH_ASSET_MONITORING?data={CURRENT_LOC:"' + CURRENT_LOC +'"}',
        method: 'get'
    })
}